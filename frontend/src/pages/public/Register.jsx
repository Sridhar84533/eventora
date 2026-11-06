import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  ConfirmationNumber,
  Person,
  CorporateFare,
  Email,
  Lock,
  Phone,
  Business
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await register({ ...formData, role });
      if (res.success) {
        if (role === 'organizer') navigate('/organizer/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
