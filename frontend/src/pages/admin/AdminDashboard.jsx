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
  People,
  CorporateFare,
  Event,
  HourglassEmpty,
  CheckCircle,
  ConfirmationNumber,
  AttachMoney,
  LocationOn,
  TrendingUp,
  PieChart as PieChartIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const [data, setData] = useState({
    stats: {
      total_users: 0,
      total_organizers: 0,
      total_events: 0,
      pending_events: 0,
      approved_events: 0,
      total_bookings: 0,
      total_revenue: 0,
      total_venues: 0
    },
    charts: {
      userRegistrations: [],
      revenue: [],
      popularCategories: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard-stats');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              System Administrator Control Center 👑
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Platform-wide governance, approvals, revenue reporting, and analytics.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/admin/events/pending"
            variant="contained"
            color="warning"
            startIcon={<HourglassEmpty />}
            sx={{ borderRadius: 3, px: 3, py: 1.2 }}
          >
            Review Pending Approvals ({data.stats.pending_events})
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* 8 Required Dashboard Metric Cards */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Users" value={data.stats.total_users} icon={<People />} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Organizers" value={data.stats.total_organizers} icon={<CorporateFare />} color="secondary" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Events" value={data.stats.total_events} icon={<Event />} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Pending Review" value={data.stats.pending_events} icon={<HourglassEmpty />} color="warning" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Approved Events" value={data.stats.approved_events} icon={<CheckCircle />} color="success" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Bookings" value={data.stats.total_bookings} icon={<ConfirmationNumber />} color="secondary" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Revenue" value={`$${parseFloat(data.stats.total_revenue).toFixed(2)}`} icon={<AttachMoney />} color="primary" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard title="Total Venues" value={data.stats.total_venues} icon={<LocationOn />} color="secondary" />
              </Grid>
            </Grid>

            {/* Analytics Charts */}
            <Grid container spacing={3.5} sx={{ mb: 4 }}>
              
              {/* Revenue & Booking Analytics */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp color="primary" /> Platform Revenue & Booking Growth
                  </Typography>
                  <Box sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.charts.revenue.length > 0 ? data.charts.revenue : [{ month: 'Aug 2026', revenue: 1172 }]}>
                        <defs>
                          <linearGradient id="adminRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#adminRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Popular Categories Pie Chart */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PieChartIcon color="secondary" /> Popular Event Categories
                  </Typography>
                  <Box sx={{ width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.charts.popularCategories}
                          dataKey="event_count"
                          nameKey="category_name"
                          cx="50%"
                          cy="50%"
                          outerRadius={95}
                          label
                        >
                          {data.charts.popularCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
