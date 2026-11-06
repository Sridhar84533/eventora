const db = require('../config/db');

// Categories
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT 
        c.*,
        COUNT(DISTINCT ec.event_id) AS event_count
      FROM categories c
      LEFT JOIN event_categories ec ON c.category_id = ec.category_id
      LEFT JOIN events e ON ec.event_id = e.event_id AND e.event_status = 'published'
      WHERE c.status = 'active'
      GROUP BY c.category_id
      ORDER BY c.category_name ASC
    `);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving categories.', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category_name, description } = req.body;
    if (!category_name) return res.status(400).json({ success: false, message: 'Category name is required.' });

    await db.query('INSERT INTO categories (category_name, description, status) VALUES (?, ?, "active")', [category_name, description || '']);
    res.status(201).json({ success: true, message: 'Category created successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating category.', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, description, status } = req.body;
    await db.query('UPDATE categories SET category_name = ?, description = ?, status = ? WHERE category_id = ?', [category_name, description, status || 'active', id]);
    res.json({ success: true, message: 'Category updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating category.', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE category_id = ?', [id]);
    res.json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting category.', error: error.message });
  }
};

// Venues
exports.getAllVenues = async (req, res) => {
  try {
    const [venues] = await db.query('SELECT * FROM venues ORDER BY venue_name ASC');
    res.json({ success: true, data: venues });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving venues.', error: error.message });
  }
};

exports.createVenue = async (req, res) => {
  try {
    const { venue_name, address, city, state, pincode, capacity, description, image_url } = req.body;
    if (!venue_name || !address || !city || !state || !capacity) {
      return res.status(400).json({ success: false, message: 'Name, address, city, state, and capacity are required.' });
    }

    const img = req.file ? `/uploads/banners/${req.file.filename}` : (image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80');

    await db.query(
      `INSERT INTO venues (venue_name, address, city, state, pincode, capacity, description, image_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [venue_name, address, city, state, pincode || null, capacity, description || '', img]
    );

    res.status(201).json({ success: true, message: 'Venue added successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating venue.', error: error.message });
  }
};

exports.updateVenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { venue_name, address, city, state, pincode, capacity, description, status, image_url } = req.body;
    const img = req.file ? `/uploads/banners/${req.file.filename}` : image_url;

    let query = `UPDATE venues SET venue_name = ?, address = ?, city = ?, state = ?, pincode = ?, capacity = ?, description = ?, status = ?`;
    const params = [venue_name, address, city, state, pincode, capacity, description, status || 'active'];

    if (img) {
      query += `, image_url = ?`;
      params.push(img);
    }

    query += ` WHERE venue_id = ?`;
    params.push(id);

    await db.query(query, params);
    res.json({ success: true, message: 'Venue updated successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating venue.', error: error.message });
  }
};

exports.deleteVenue = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM venues WHERE venue_id = ?', [id]);
    res.json({ success: true, message: 'Venue deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting venue.', error: error.message });
  }
};
