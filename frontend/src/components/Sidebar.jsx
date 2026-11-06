import React from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  Dashboard,
  Explore,
  ConfirmationNumber,
  Event,
  History,
  ReceiptLong,
  Favorite,
  Notifications,
  Person,
  Settings,
  ExitToApp,
  AddCircleOutline,
  Drafts,
  HourglassEmpty,
  CheckCircleOutline,
  CancelOutlined,
  People,
  Badge,
  Collections,
  AttachMoney,
  SupervisorAccount,
  CorporateFare,
  Category,
  LocationOn,
  Payment,
  Assessment,
  Timeline
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Sidebar = ({ role = 'user' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Define Distinct Sidebar Menus per Role
  const userMenuItems = [
    { label: 'Dashboard', path: '/user/dashboard', icon: <Dashboard /> },
    { label: 'Explore Events', path: '/events', icon: <Explore /> },
    { label: 'My Bookings', path: '/user/bookings', icon: <ConfirmationNumber /> },
    { label: 'Upcoming Events', path: '/user/upcoming', icon: <Event /> },
    { label: 'Past Events', path: '/user/past', icon: <History /> },
    { label: 'My Tickets', path: '/user/tickets', icon: <ReceiptLong /> },
    { label: 'Favourite Events', path: '/user/favourites', icon: <Favorite /> },
    { label: 'Notifications', path: '/user/notifications', icon: <Notifications /> },
    { label: 'Profile', path: '/user/profile', icon: <Person /> },
    { label: 'Settings', path: '/user/settings', icon: <Settings /> }
  ];

  const organizerMenuItems = [
    { label: 'Dashboard', path: '/organizer/dashboard', icon: <Dashboard /> },
    { label: 'My Events', path: '/organizer/events', icon: <Event /> },
    { label: 'Create Event', path: '/organizer/events/create', icon: <AddCircleOutline /> },
    { label: 'Pending Approval', path: '/organizer/events?status=pending', icon: <HourglassEmpty /> },
    { label: 'Published Events', path: '/organizer/events?status=published', icon: <CheckCircleOutline /> },
    { label: 'Bookings', path: '/organizer/bookings', icon: <ConfirmationNumber /> },
    { label: 'Attendees', path: '/organizer/attendees', icon: <People /> },
    { label: 'Event Staff', path: '/organizer/staff', icon: <Badge /> },
    { label: 'Revenue Analytics', path: '/organizer/revenue', icon: <AttachMoney /> },
    { label: 'Notifications', path: '/organizer/notifications', icon: <Notifications /> },
    { label: 'Profile', path: '/organizer/profile', icon: <Person /> },
    { label: 'Settings', path: '/organizer/settings', icon: <Settings /> }
  ];

  const adminMenuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <Dashboard /> },
    { label: 'User Management', path: '/admin/users', icon: <SupervisorAccount /> },
    { label: 'Organizers', path: '/admin/organizers', icon: <CorporateFare /> },
    { label: 'Event Management', path: '/admin/events', icon: <Event /> },
    { label: 'Pending Approvals', path: '/admin/events/pending', icon: <HourglassEmpty /> },
    { label: 'Categories', path: '/admin/categories', icon: <Category /> },
    { label: 'Venues', path: '/admin/venues', icon: <LocationOn /> },
    { label: 'Bookings', path: '/admin/bookings', icon: <ConfirmationNumber /> },
    { label: 'Payments', path: '/admin/payments', icon: <Payment /> },
    { label: 'Reports', path: '/admin/reports', icon: <Assessment /> },
    { label: 'Analytics', path: '/admin/analytics', icon: <Timeline /> },
    { label: 'Notifications', path: '/admin/notifications', icon: <Notifications /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings /> }
  ];

  const menuItems = role === 'admin' ? adminMenuItems : role === 'organizer' ? organizerMenuItems : userMenuItems;

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            bgcolor: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            color: '#0f172a'
          },
        }}
        open
      >
        {/* Brand Logo */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #4f46e5 0%, #0284c7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <ConfirmationNumber sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
            EVENT<Box component="span" sx={{ color: '#4f46e5' }}>ORA</Box>
          </Typography>
        </Box>

        {/* User Card */}
        {user && (
          <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 3, bgcolor: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar
              alt={user.full_name}
              src={
                user.profile_image
                  ? (user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:5000${user.profile_image}`)
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=4f46e5&color=fff`
              }
              sx={{ width: 42, height: 42 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle2" noWrap sx={{ fontWeight: 700 }}>
                {user.full_name}
              </Typography>
              <Chip
                label={role.toUpperCase()}
                size="small"
                color={role === 'admin' ? 'error' : role === 'organizer' ? 'secondary' : 'primary'}
                sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, mt: 0.2 }}
              />
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 1 }} />

        {/* Navigation List */}
        <List sx={{ px: 1.5, pb: 10 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && location.pathname + location.search === item.path);
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    borderRadius: 2.5,
                    py: 1.2,
                    px: 2,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? '#ffffff' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'rgba(79, 70, 229, 0.06)',
                      color: isActive ? '#ffffff' : 'primary.main'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#ffffff' : 'text.secondary', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 700 : 500
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Logout Sticky Button at Bottom */}
        <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: '#ffffff', position: 'sticky', bottom: 0 }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2.5,
              color: 'error.main',
              bgcolor: 'rgba(239, 68, 68, 0.08)',
              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.15)' }
            }}
          >
            <ListItemIcon sx={{ color: 'error.main', minWidth: 36 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
          </ListItemButton>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
