import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Stack,
  Card
} from '@mui/material';
import {
  ConfirmationNumber,
  Event,
  CheckCircle,
  Cancel,
  AttachMoney,
  ArrowForward,
  ReceiptLong,
  Star
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { totalBookings: 0, totalSpent: 0, cancelledBookings: 0, upcomingEvents: 0, completedEvents: 0 },
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/user/dashboard-stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error loading user dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="user" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        
        {/* Welcome Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Welcome back, {user?.full_name || 'Attendee'}! 👋
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your event bookings, digital tickets, and saved experiences.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            color="primary"
            startIcon={<Event />}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Explore Events
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Dashboard Cards (5 required cards) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                  title="Total Bookings"
                  value={data.stats.totalBookings}
                  icon={<ConfirmationNumber />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                  title="Upcoming Events"
                  value={data.stats.upcomingEvents}
                  icon={<Event />}
                  color="secondary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                  title="Completed Events"
                  value={data.stats.completedEvents}
                  icon={<CheckCircle />}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                  title="Cancelled Bookings"
                  value={data.stats.cancelledBookings}
                  icon={<Cancel />}
                  color="error"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <StatCard
                  title="Total Amount Spent"
                  value={`$${data.stats.totalSpent.toFixed(2)}`}
                  icon={<AttachMoney />}
                  color="primary"
                />
              </Grid>
            </Grid>

            {/* Recent Bookings Table */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Recent Bookings
                </Typography>
                <Button component={RouterLink} to="/user/bookings" endIcon={<ArrowForward />}>
                  View All Bookings
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Booking Ref</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Event Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tickets</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          No recent bookings found. <RouterLink to="/events" style={{ color: '#4f46e5', fontWeight: 700 }}>Browse events</RouterLink> to book tickets.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recentBookings.map((row) => (
                        <TableRow key={row.booking_id} hover>
                          <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {row.booking_reference}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.event_name}</TableCell>
                          <TableCell>{row.event_date}</TableCell>
                          <TableCell>{row.number_of_tickets} Pass(es)</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>${row.total_amount}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.booking_status.toUpperCase()}
                              size="small"
                              color={row.booking_status === 'confirmed' ? 'success' : 'error'}
                              sx={{ fontWeight: 700 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              component={RouterLink}
                              to="/user/tickets"
                              size="small"
                              variant="outlined"
                              startIcon={<ReceiptLong />}
                            >
                              Ticket
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

          </>
        )}
      </Box>
    </Box>
  );
};

export default UserDashboard;
