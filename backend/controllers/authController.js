const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register user or organizer
exports.register = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { 
      full_name, 
      email, 
      password, 
      phone, 
      role = 'user',
      organization_name,
      organization_description,
      contact_email,
      contact_phone,
      website
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    }

    // Check if user already exists
    const [existing] = await connection.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [userResult] = await connection.query(
      'INSERT INTO users (full_name, email, password_hash, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, password_hash, phone || null, role, 'active']
    );

    const user_id = userResult.insertId;

    // Create profile
    await connection.query(
      'INSERT INTO user_profiles (user_id) VALUES (?)',
      [user_id]
    );

    // If role is organizer, insert into organizers table
    let organizer_id = null;
    if (role === 'organizer') {
      const [orgResult] = await connection.query(
        `INSERT INTO organizers 
         (user_id, organization_name, organization_description, contact_email, contact_phone, website, verification_status) 
         VALUES (?, ?, ?, ?, ?, ?, 'verified')`,
        [
          user_id,
          organization_name || `${full_name}'s Events`,
          organization_description || 'Professional event organizer.',
          contact_email || email,
          contact_phone || phone || null,
          website || null
        ]
      );
      organizer_id = orgResult.insertId;
    }

    await connection.commit();

    // Generate JWT
    const token = jwt.sign(
      { user_id, email, role },
      process.env.JWT_SECRET || 'eventora_jwt_secret_key_2026_super_secure',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        user_id,
        full_name,
        email,
        phone,
        role,
        organizer_id
      }
    });
  } catch (error) {
    await connection.rollback();
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  } finally {
    connection.release();
  }
};

// Login user, organizer, or admin
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Account is currently inactive or suspended.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Get organizer_id if user is an organizer
    let organizer_id = null;
    if (user.role === 'organizer') {
      const [orgs] = await db.query('SELECT organizer_id FROM organizers WHERE user_id = ?', [user.user_id]);
      if (orgs.length > 0) {
        organizer_id = orgs[0].organizer_id;
      }
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role, organizer_id },
      process.env.JWT_SECRET || 'eventora_jwt_secret_key_2026_super_secure',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        organizer_id
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// Get current user details (/me)
exports.getMe = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const [users] = await db.query(
      `SELECT u.user_id, u.full_name, u.email, u.phone, u.role, u.status, u.created_at,
              p.profile_id, p.date_of_birth, p.gender, p.address, p.city, p.state, p.pincode, p.profile_image
       FROM users u
       LEFT JOIN user_profiles p ON u.user_id = p.user_id
       WHERE u.user_id = ?`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userData = users[0];

    // If organizer, attach organization details
    if (userData.role === 'organizer') {
      const [orgs] = await db.query('SELECT * FROM organizers WHERE user_id = ?', [user_id]);
      if (orgs.length > 0) {
        userData.organizer = orgs[0];
      }
    }

    res.json({
      success: true,
      user: userData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user details.', error: error.message });
  }
};

// Forgot password placeholder / simulation
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' });

  const [users] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    return res.status(404).json({ success: false, message: 'No account associated with this email.' });
  }

  res.json({
    success: true,
    message: 'Password reset link has been sent to your email address (simulated).'
  });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Email and new password are required.' });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  await db.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, email]);

  res.json({
    success: true,
    message: 'Password reset successfully. You can now login with your new password.'
  });
};
