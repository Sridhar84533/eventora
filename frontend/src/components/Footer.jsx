import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  Stack
} from '@mui/material';
import {
  ConfirmationNumber,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Send,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', borderTop: '1px solid #e2e8f0', pt: 8, pb: 4, mt: 'auto' }}>
      <Container maxWidth="xl">
        <Grid container spacing={4} justifyContent="space-between">
          
          {/* Brand Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ConfirmationNumber sx={{ fontSize: 22 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                EVENT<Box component="span" sx={{ color: '#4f46e5' }}>ORA</Box>
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 360, lineHeight: 1.7 }}>
              EVENTORA is the premier end-to-end event ticketing, organization, and management platform empowering creators, attendees, and enterprises worldwide.
            </Typography>

            <Stack direction="row" spacing={1}>
              <IconButton color="primary" sx={{ border: '1px solid #e2e8f0' }}><Facebook fontSize="small" /></IconButton>
              <IconButton color="primary" sx={{ border: '1px solid #e2e8f0' }}><Twitter fontSize="small" /></IconButton>
              <IconButton color="primary" sx={{ border: '1px solid #e2e8f0' }}><Instagram fontSize="small" /></IconButton>
              <IconButton color="primary" sx={{ border: '1px solid #e2e8f0' }}><LinkedIn fontSize="small" /></IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
              Explore
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" component={RouterLink} to="/events" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Browse Events</Typography>
              <Typography variant="body2" component={RouterLink} to="/categories" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Categories</Typography>
              <Typography variant="body2" component={RouterLink} to="/venues" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Venues & Halls</Typography>
              <Typography variant="body2" component={RouterLink} to="/about" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>About Us</Typography>
              <Typography variant="body2" component={RouterLink} to="/contact" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Help & Contact</Typography>
            </Stack>
          </Grid>

          {/* For Organizers */}
          <Grid item xs={6} sm={3} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
              Organizers
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2" component={RouterLink} to="/register" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Create an Account</Typography>
              <Typography variant="body2" component={RouterLink} to="/login" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Organizer Portal</Typography>
              <Typography variant="body2" component={RouterLink} to="/about" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Pricing & Features</Typography>
              <Typography variant="body2" component={RouterLink} to="/contact" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>Enterprise Sales</Typography>
            </Stack>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
              Subscribe to Updates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Get curated weekly events, tech expos, and concert tickets delivered straight to your inbox.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter your email address"
                fullWidth
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-root': { borderRadius: 2 }
                }}
              />
              <Button variant="contained" color="primary" sx={{ px: 3, borderRadius: 2 }}>
                <Send fontSize="small" />
              </Button>
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © 2026 EVENTORA Inc. All rights reserved. Professional Event Management Platform.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Privacy Policy</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Terms of Service</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>Cookie Settings</Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
