import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  ConfirmationNumber,
  Person,
  CorporateFare,
  Email,
  Lock,
  Phone,
  Business,
  CheckCircle,
  Login as LoginIcon
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

// ─── Success Screen ───────────────────────────────────────────────────────────
const RegistrationSuccess = ({ onGoToLogin }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onGoToLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onGoToLogin]);

  // Progress bar fills from 0 → 100 over 3 seconds
  const progress = ((3 - countdown) / 3) * 100;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />
      <Container maxWidth="sm" sx={{ py: 8, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 5,
            width: '100%',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)',
            textAlign: 'center'
          }}
        >
          {/* Success Icon */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              mb: 3,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)'
            }}
          >
            <CheckCircle sx={{ fontSize: 44 }} />
          </Box>

          {/* Heading */}
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
            Registration Successful!
          </Typography>

          {/* Sub-message */}
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            Your account has been created successfully.
            <br />
            Please log in using your registered email and password.
          </Typography>

          {/* Redirect countdown notice */}
          <Alert
            severity="info"
            icon={false}
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              fontWeight: 600
            }}
          >
            Redirecting to Login page in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}…
          </Alert>

          {/* Animated progress bar */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mb: 4,
              borderRadius: 4,
              height: 6,
              bgcolor: '#e0e7ff',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #4f46e5 0%, #0284c7 100%)',
                borderRadius: 4
              }
            }}
          />

          {/* Go to Login button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<LoginIcon />}
            onClick={onGoToLogin}
            sx={{ py: 1.4, px: 5, borderRadius: 3, fontWeight: 800, fontSize: '1rem' }}
          >
            Go to Login
          </Button>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

// ─── Register Form ────────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: '',
    organization_name: '',
    organization_description: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register({ ...formData, role });
      if (res.success) {
        // Show success screen — do NOT navigate to dashboard
        setRegistered(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If registration succeeded, show the success screen
  if (registered) {
    return <RegistrationSuccess onGoToLogin={() => navigate('/login')} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      <Container maxWidth="sm" sx={{ py: 8, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Create Your EVENTORA Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select your account type to get started.
            </Typography>
          </Box>

          {/* Role Selection Toggle */}
          <Box sx={{ mb: 3 }}>
            <ToggleButtonGroup
              value={role}
              exclusive
              onChange={(e, val) => val && setRole(val)}
              fullWidth
              color="primary"
            >
              <ToggleButton value="user" sx={{ py: 1.2, fontWeight: 700, borderRadius: '12px 0 0 12px' }}>
                <Person sx={{ mr: 1 }} /> Attendee Account
              </ToggleButton>
              <ToggleButton value="organizer" sx={{ py: 1.2, fontWeight: 700, borderRadius: '0 12px 12px 0' }}>
                <CorporateFare sx={{ mr: 1 }} /> Event Organizer
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Full Name"
                required
                fullWidth
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment> }}
              />

              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
              />

              <TextField
                label="Password"
                type="password"
                required
                fullWidth
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment> }}
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start"><Phone color="action" /></InputAdornment> }}
              />

              {/* Extra Organizer Fields */}
              {role === 'organizer' && (
                <>
                  <TextField
                    label="Organization Name"
                    required
                    fullWidth
                    value={formData.organization_name}
                    onChange={(e) => setFormData({ ...formData, organization_name: e.target.value })}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Business color="action" /></InputAdornment> }}
                  />
                  <TextField
                    label="Organization Description"
                    multiline
                    rows={2}
                    fullWidth
                    value={formData.organization_description}
                    onChange={(e) => setFormData({ ...formData, organization_description: e.target.value })}
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.4, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', mt: 1 }}
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{' '}
            <Typography
              component={RouterLink}
              to="/login"
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 700, textDecoration: 'none' }}
            >
              Sign In
            </Typography>
          </Typography>

        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default Register;
