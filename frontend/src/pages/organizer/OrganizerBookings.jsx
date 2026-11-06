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
  Chip
} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const OrganizerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/organizer/bookings');
        if (res.data.success) {
          setBookings(res.data.data);
        }
      } catch (err) {
        console.error('Error loading attendee bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="organizer" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Event Attendees & Bookings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          View attendee ticket details and revenue records for your events.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <EmptyState title="No Attendees Yet" description="Ticket orders for your events will appear here." />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Booking Ref</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Attendee Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Contact Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tickets</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.booking_id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{b.booking_reference}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{b.event_name}</TableCell>
                      <TableCell>{b.attendee_name}</TableCell>
                      <TableCell>{b.attendee_email}</TableCell>
                      <TableCell>{b.number_of_tickets} Pass(es)</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>${b.total_amount}</TableCell>
                      <TableCell>
                        <Chip
                          label={b.booking_status.toUpperCase()}
                          size="small"
                          color={b.booking_status === 'confirmed' ? 'success' : 'error'}
                          sx={{ fontWeight: 700 }}
                        />
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

export default OrganizerBookings;
