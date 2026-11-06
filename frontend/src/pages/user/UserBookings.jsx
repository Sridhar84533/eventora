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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Alert,
  Snackbar,
  Slide,
  Divider,
  IconButton
} from '@mui/material';
import {
  ReceiptLong,
  Cancel,
  CheckCircle,
  Close,
  Event as EventIcon,
  LocationOn,
  AccessTime,
  LocalActivity,
  Person,
  Print
} from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const SlideTransition = (props) => <Slide {...props} direction="down" />;

// ─── Helpers ───────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
};

// ─── Premium Digital Ticket Card ──────────────────────
const DigitalTicket = ({ ticket }) => {
  if (!ticket) return null;
  return (
    <Box sx={{ mx: 1, mb: 1 }}>
      {/* Top: dark gradient header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          borderRadius: '16px 16px 0 0',
          p: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BG decoration */}
        <Box sx={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', bottom: -20, left: '30%', width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 1 }}>
          <Box sx={{ width: 52, height: 52, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }}>
            <LocalActivity sx={{ fontSize: 26, color: '#a5b4fc' }} />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Official Event Pass
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}>
              {ticket.event_name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mt: 2.5, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <EventIcon sx={{ fontSize: 14, color: '#a5b4fc' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              {formatDate(ticket.event_date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <AccessTime sx={{ fontSize: 14, color: '#a5b4fc' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
              {formatTime(ticket.start_time)}
            </Typography>
          </Box>
          {ticket.venue_name && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <LocationOn sx={{ fontSize: 14, color: '#a5b4fc' }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                {ticket.venue_name}{ticket.venue_city ? `, ${ticket.venue_city}` : ''}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Perforated separator */}
      <Box sx={{ position: 'relative', bgcolor: '#f8fafc', height: 24, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', bgcolor: 'white', border: '2px solid #e2e8f0' }} />
        <Box sx={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', width: 28, height: 28, borderRadius: '50%', bgcolor: 'white', border: '2px solid #e2e8f0' }} />
        <Box sx={{ position: 'absolute', top: '50%', left: 20, right: 20, borderTop: '2px dashed #cbd5e1' }} />
      </Box>

      {/* Bottom: details */}
      <Box sx={{ bgcolor: 'white', borderRadius: '0 0 16px 16px', border: '1px solid #e2e8f0', borderTop: 'none', p: 2.5 }}>
        {/* Booking Reference */}
        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
            Booking Reference
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#4338ca', letterSpacing: 2, fontFamily: 'monospace', mt: 0.5 }}>
            {ticket.booking_reference}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Details grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Attendee</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>{ticket.user_name}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Tickets</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>× {ticket.number_of_tickets}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Amount Paid</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
              ₹{parseFloat(ticket.total_amount).toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Payment</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
              {ticket.payment_method?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Status</Typography>
            <Chip
              label={ticket.booking_status?.toUpperCase()}
              size="small"
              icon={ticket.booking_status === 'confirmed' ? <CheckCircle sx={{ fontSize: '14px !important' }} /> : undefined}
              sx={{
                bgcolor: ticket.booking_status === 'confirmed' ? '#d1fae5' : '#fee2e2',
                color: ticket.booking_status === 'confirmed' ? '#065f46' : '#991b1b',
                fontWeight: 800, fontSize: '0.7rem', height: 22,
                '& .MuiChip-icon': { color: '#059669' }
              }}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Transaction ID</Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontFamily: 'monospace', display: 'block' }}>
              {ticket.transaction_id || 'N/A'}
            </Typography>
          </Box>
        </Box>

        {/* QR Code */}
        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Box
            component="img"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=EVENTORA-${ticket.booking_reference}`}
            alt="QR Code"
            sx={{ mx: 'auto', display: 'block' }}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, fontWeight: 500 }}>
            🎟️ Show this QR code at the venue entrance
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// ─── Main Component ────────────────────────────────────
const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [cancelSnackbar, setCancelSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleViewTicket = async (bookingId) => {
    try {
      const res = await api.get(`/bookings/ticket/${bookingId}`);
      if (res.data.success) {
        setSelectedTicket(res.data.data);
        setTicketModalOpen(true);
      }
    } catch (err) {
      setErrorSnackbar('Unable to load ticket details.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Refund will be initiated.')) return;
    try {
      const res = await api.post(`/bookings/cancel/${bookingId}`);
      if (res.data.success) {
        setCancelSnackbar(true);
        fetchBookings();
      }
    } catch (err) {
      setErrorSnackbar(err.response?.data?.message || 'Error cancelling booking.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="user" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>My Bookings</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          View your confirmed ticket orders, download passes, or cancel bookings.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <EmptyState title="No Bookings Yet" description="You have not booked any event tickets yet." />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Booking Ref</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Event Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Venue</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tickets</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Paid</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.booking_id} hover>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontFamily: 'monospace' }}>
                        {b.booking_reference}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{b.event_name}</TableCell>
                      <TableCell>{formatDate(b.event_date)} · {formatTime(b.start_time)}</TableCell>
                      <TableCell>{b.venue_name || 'Online'}</TableCell>
                      <TableCell>× {b.number_of_tickets}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#059669' }}>
                        ₹{parseFloat(b.total_amount).toLocaleString('en-IN')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={b.booking_status.toUpperCase()}
                          size="small"
                          color={b.booking_status === 'confirmed' ? 'success' : 'error'}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            startIcon={<ReceiptLong />}
                            onClick={() => handleViewTicket(b.booking_id)}
                          >
                            View Ticket
                          </Button>
                          {b.booking_status === 'confirmed' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleCancelBooking(b.booking_id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* ─── Premium Digital Ticket Modal ─── */}
        <Dialog
          open={ticketModalOpen}
          onClose={() => setTicketModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', p: 0 } }}
        >
          <DialogTitle
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white', px: 3, py: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CheckCircle sx={{ fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>Your Digital Ticket</Typography>
            </Box>
            <IconButton onClick={() => setTicketModalOpen(false)} size="small" sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ bgcolor: '#f0fdf4', p: 2.5 }}>
            <DigitalTicket ticket={selectedTicket} />
          </DialogContent>

          <DialogActions sx={{ p: 2, bgcolor: '#f0fdf4', gap: 1 }}>
            <Button
              onClick={() => window.print()}
              variant="outlined"
              startIcon={<Print />}
              sx={{ fontWeight: 700, borderRadius: 2 }}
            >
              Print
            </Button>
            <Button
              onClick={() => setTicketModalOpen(false)}
              variant="contained"
              sx={{
                fontWeight: 700, borderRadius: 2,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* ─── Snackbars ─── */}
      <Snackbar
        open={cancelSnackbar}
        autoHideDuration={4000}
        onClose={() => setCancelSnackbar(false)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setCancelSnackbar(false)}
          sx={{ fontWeight: 700, borderRadius: 3, boxShadow: '0 8px 32px rgba(16,185,129,0.3)' }}>
          Booking cancelled successfully. Refund will be initiated.
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!errorSnackbar}
        autoHideDuration={4000}
        onClose={() => setErrorSnackbar('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" variant="filled" onClose={() => setErrorSnackbar('')}
          sx={{ fontWeight: 700, borderRadius: 3 }}>
          {errorSnackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserBookings;
