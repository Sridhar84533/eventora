import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Container, Paper, Typography, TextField, Button, Alert, Stack } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import api from '../../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error processing request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />
      <Container maxWidth="xs" sx={{ py: 8, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Forgot Password?
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your account email address below to receive password reset instructions.
          </Typography>

          {msg && <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>{msg}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.2, borderRadius: 2.5 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <RouterLink to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
              Back to Login
            </RouterLink>
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { email, newPassword });
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />
      <Container maxWidth="xs" sx={{ py: 8, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ p: 4, width: '100%', borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Reset Your Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and new password below.
          </Typography>

          {msg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{msg}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                required
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                required
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ py: 1.2, borderRadius: 2.5 }}>
                {loading ? 'Updating...' : 'Set New Password'}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            <RouterLink to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
              Proceed to Login
            </RouterLink>
          </Typography>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};
