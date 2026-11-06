import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  ConfirmationNumber,
  Person,
  Dashboard,
  ExitToApp,
  Menu as MenuIcon,
  Event,
  Category,
  LocationOn,
  Info,
  ContactSupport,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/user/dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Events', path: '/events' },
    { label: 'Categories', path: '/categories' },
    { label: 'Venues', path: '/venues' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: '1px solid #e2e8f0', color: 'text.primary' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 72, justifyContent: 'space-between' }}>
          
          {/* Logo & Brand */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <ConfirmationNumber sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px', color: '#0f172a' }}>
              EVENT<Box component="span" sx={{ color: '#4f46e5' }}>ORA</Box>
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Button
                  key={link.label}
                  component={RouterLink}
                  to={link.path}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    fontWeight: isActive ? 700 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(79, 70, 229, 0.05)', color: 'primary.main' }
                  }}
                >
                  {link.label}
                </Button>
              );
            })}
          </Box>

          {/* User Auth Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Dashboard />}
                  component={RouterLink}
                  to={getDashboardRoute()}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: 2.5, px: 2.5 }}
                >
                  Dashboard
                </Button>

                <IconButton onClick={handleMenuOpen} sx={{ p: 0.5, border: '2px solid #e2e8f0' }}>
                  <Avatar
                    alt={user.full_name}
                    src={
                      user.profile_image
                        ? (user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:5000${user.profile_image}`)
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4f46e5&color=fff`
                    }
                    sx={{ width: 38, height: 38 }}
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: { minWidth: 220, borderRadius: 3, mt: 1.5, p: 0.5 }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {user.full_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {user.email}
                    </Typography>
                    <Chip
                      label={user.role.toUpperCase()}
                      size="small"
                      color={user.role === 'admin' ? 'error' : user.role === 'organizer' ? 'secondary' : 'primary'}
                      sx={{ mt: 1, height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />

                  <MenuItem component={RouterLink} to={getDashboardRoute()} onClick={handleMenuClose}>
                    <ListItemIcon><Dashboard fontSize="small" color="primary" /></ListItemIcon>
                    Dashboard
                  </MenuItem>

                  {user.role === 'user' && (
                    <MenuItem component={RouterLink} to="/user/favourites" onClick={handleMenuClose}>
                      <ListItemIcon><Favorite fontSize="small" color="error" /></ListItemIcon>
                      Favourites
                    </MenuItem>
                  )}

                  <MenuItem component={RouterLink} to={`/${user.role}/profile`} onClick={handleMenuClose}>
                    <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                    My Profile
                  </MenuItem>

                  <Divider sx={{ my: 1 }} />
                  <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon><ExitToApp fontSize="small" color="error" /></ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button component={RouterLink} to="/login" variant="text" color="primary" sx={{ fontWeight: 600 }}>
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2.5, px: 3 }}
                >
                  Register
                </Button>
              </Box>
            )}

            {/* Mobile Menu Icon */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
            EVENT<Box component="span" sx={{ color: '#4f46e5' }}>ORA</Box>
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.label} button component={RouterLink} to={link.path} onClick={() => setMobileOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
