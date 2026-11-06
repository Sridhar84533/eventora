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
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  ConfirmationNumber,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Person,
  CorporateFare,
  SupervisorAccount
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirect to appropriate dashboard based on role
        const role = res.user.role;
        if (role === 'admin') navigate('/admin/dashboard');
        else if (role === 'organizer') navigate('/organizer/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
          {/* Header Branding */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                mb: 1.5
              }}
            >
              <ConfirmationNumber sx={{ fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Welcome Back to EVENTORA
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to manage your tickets, events, or dashboard.
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}



          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Typography
                  component={RouterLink}
                  to="/forgot-password"
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: 700, textDecoration: 'none' }}
                >
                  Forgot Password?
                </Typography>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ py: 1.4, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem' }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            Don't have an account?{' '}
            <Typography
              component={RouterLink}
              to="/register"
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 700, textDecoration: 'none' }}
            >
              Create Account
            </Typography>
          </Typography>

        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default Login;
