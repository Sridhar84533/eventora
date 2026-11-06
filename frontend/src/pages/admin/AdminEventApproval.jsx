import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Stack,
  Alert
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminEventApproval = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/events', { params: { status: 'pending' } });
      if (res.data.success) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching pending events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      const res = await api.put(`/admin/events/${eventId}/status`, { event_status: newStatus });
      if (res.data.success) {
        setMsg(`Event has been successfully ${newStatus}.`);
        fetchPendingEvents();
      }
    } catch (err) {
      alert('Error updating event status.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Pending Event Approvals
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Review event submissions from organizers prior to publishing on the public marketplace.
        </Typography>

        {msg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{msg}</Alert>}

        {loading ? (
          <LoadingSpinner />
        ) : events.length === 0 ? (
          <EmptyState title="No Pending Events" description="All organizer event submissions have been reviewed." />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Organizer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Venue</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Decision Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={e.event_id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{e.event_name}</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{e.organization_name}</TableCell>
                      <TableCell>{e.event_date} ({e.start_time?.slice(0,5)})</TableCell>
                      <TableCell>{e.venue_name || 'Online'}</TableCell>
                      <TableCell>${parseFloat(e.ticket_price).toFixed(2)}</TableCell>
                      <TableCell>{e.total_seats} Seats</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircle />}
                            onClick={() => handleUpdateStatus(e.event_id, 'published')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<Cancel />}
                            onClick={() => handleUpdateStatus(e.event_id, 'rejected')}
                          >
                            Reject
                          </Button>
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

export default AdminEventApproval;
