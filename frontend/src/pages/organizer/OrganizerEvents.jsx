import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Stack,
  Alert
} from '@mui/material';
import { AddCircleOutline, Edit, Delete, Visibility } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const OrganizerEvents = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const statusFilter = searchParams.get('status');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/organizer/events', { params: { status: statusFilter } });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching organizer events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      const res = await api.delete(`/organizer/events/${id}`);
      if (res.data.success) {
        setMsg('Event deleted successfully.');
        fetchEvents();
      }
    } catch (err) {
      alert('Error deleting event.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="organizer" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {statusFilter ? `${statusFilter.toUpperCase()} Events` : 'My Events Management'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and control your submitted events.
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/organizer/events/create"
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutline />}
            sx={{ borderRadius: 3, px: 3 }}
          >
            Create New Event
          </Button>
        </Box>

        {msg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{msg}</Alert>}

        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState title="No Events Found" description="Click 'Create New Event' to post your upcoming concert or workshop." />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Venue</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Available Seats</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((row) => (
                    <TableRow key={row.event_id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{row.event_name}</TableCell>
                      <TableCell>{row.event_date} ({row.start_time?.slice(0,5)})</TableCell>
                      <TableCell>{row.venue_name || 'Online'}</TableCell>
                      <TableCell>${parseFloat(row.ticket_price).toFixed(2)}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{row.available_seats} / {row.total_seats}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.event_status.toUpperCase()}
                          size="small"
                          color={row.event_status === 'published' ? 'success' : row.event_status === 'pending' ? 'warning' : 'default'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton component={RouterLink} to={`/events/${row.event_id}`} color="primary" size="small">
                            <Visibility fontSize="small" />
                          </IconButton>
                          <IconButton component={RouterLink} to={`/organizer/events/${row.event_id}/edit`} color="secondary" size="small">
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(row.event_id)} color="error" size="small">
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
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

export default OrganizerEvents;
