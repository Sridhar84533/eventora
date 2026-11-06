import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert
} from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const OrganizerStaff = () => {
  const [staff, setStaff] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const [formData, setFormData] = useState({
    event_id: '',
    staff_name: '',
    staff_role: 'Event Coordinator',
    phone: '',
    email: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffRes, evtRes] = await Promise.all([
        api.get('/organizer/staff'),
        api.get('/organizer/events')
      ]);
      if (staffRes.data.success) setStaff(staffRes.data.data);
      if (evtRes.data.success) setEvents(evtRes.data.data);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/organizer/staff', formData);
      if (res.data.success) {
        setMsg('Staff member assigned successfully!');
        setFormData({ event_id: '', staff_name: '', staff_role: 'Event Coordinator', phone: '', email: '' });
        fetchData();
      }
    } catch (err) {
      alert('Error assigning staff.');
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/organizer/staff/${id}`);
      fetchData();
    } catch (err) {
      alert('Error removing staff.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="organizer" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Event Staff Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Assign stage coordinators, technical leads, and guest relations staff.
        </Typography>

        {msg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{msg}</Alert>}

        {/* Add Staff Form */}
        <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Assign Staff Member to Event
          </Typography>
          <Box component="form" onSubmit={handleAddStaff}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Select Event"
                  required
                  fullWidth
                  size="small"
                  value={formData.event_id}
                  onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                >
                  {events.map((e) => (
                    <MenuItem key={e.event_id} value={e.event_id}>{e.event_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Staff Name"
                  required
                  fullWidth
                  size="small"
                  value={formData.staff_name}
                  onChange={(e) => setFormData({ ...formData, staff_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Staff Role"
                  required
                  fullWidth
                  size="small"
                  value={formData.staff_role}
                  onChange={(e) => setFormData({ ...formData, staff_role: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<AddCircleOutline />}
                  sx={{ height: 40, borderRadius: 2 }}
                >
                  Add Staff
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Staff Table */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Assigned Event</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone / Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.staff_id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{s.staff_name}</TableCell>
                      <TableCell>{s.staff_role}</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{s.event_name}</TableCell>
                      <TableCell>{s.phone || s.email || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => handleDeleteStaff(s.staff_id)} color="error" size="small">
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default OrganizerStaff;
