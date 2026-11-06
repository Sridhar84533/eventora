import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  Event,
  CheckCircle,
  HourglassEmpty,
  ConfirmationNumber,
  AttachMoney,
  AddCircleOutline,
  TrendingUp,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: {
      totalEvents: 0,
      publishedEvents: 0,
      pendingEvents: 0,
      totalBookings: 0,
      totalRevenue: 0,
      upcomingEvents: 0
    },
    revenueChart: [],
    popularEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/organizer/dashboard-stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching organizer stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="organizer" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Organizer Portal 🎯
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time analytics for your concerts, conferences, and revenue.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/organizer/events/create"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            sx={{ borderRadius: 3, px: 3, py: 1.2 }}
          >
            Create New Event
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Dashboard Cards (6 required cards) */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Total Events" value={data.stats.totalEvents} icon={<Event />} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Published" value={data.stats.publishedEvents} icon={<CheckCircle />} color="success" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Pending" value={data.stats.pendingEvents} icon={<HourglassEmpty />} color="warning" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Total Bookings" value={data.stats.totalBookings} icon={<ConfirmationNumber />} color="secondary" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Total Revenue" value={`$${data.stats.totalRevenue.toFixed(2)}`} icon={<AttachMoney />} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Upcoming" value={data.stats.upcomingEvents} icon={<Event />} color="secondary" />
              </Grid>
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={3.5} sx={{ mb: 4 }}>
              {/* Revenue Over Time Chart */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" /> Revenue Over Time
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueChart.length > 0 ? data.revenueChart : [{ month: 'Aug 2026', revenue: 1172 }]}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Bookings Over Time Chart */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon color="secondary" /> Ticket Sales Volume
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.revenueChart.length > 0 ? data.revenueChart : [{ month: 'Aug 2026', bookings: 8 }]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="bookings" fill="#0284c7" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Popular Events Table */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2.5 }}>
                Top Performing Events
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ticket Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tickets Sold</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Generated Revenue</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.popularEvents.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center">No performance data available yet.</TableCell></TableRow>
                    ) : (
                      data.popularEvents.map((row) => (
                        <TableRow key={row.event_id} hover>
                          <TableCell sx={{ fontWeight: 700 }}>{row.event_name}</TableCell>
                          <TableCell>${parseFloat(row.ticket_price).toFixed(2)}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{row.total_bookings} Passes</TableCell>
                          <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>${parseFloat(row.revenue).toFixed(2)}</TableCell>
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

export default OrganizerDashboard;
