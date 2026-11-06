import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Stack,
  IconButton,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
  Slide
} from '@mui/material';
import {
  Close,
  ConfirmationNumber,
  CheckCircle,
  CreditCard,
  AccountBalance,
  QrCode,
  Event as EventIcon,
  LocationOn,
  AccessTime,
  Person,
  LocalActivity
} from '@mui/icons-material';
import api from '../services/api';

// Slide transition for snackbar
const SlideTransition = (props) => <Slide {...props} direction="down" />;

const BookingModal = ({ open, onClose, event, onSuccess }) => {
  const [tickets, setTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  if (!event) return null;

  const ticketPrice = parseFloat(event.ticket_price) || 0;
  const totalAmount = (ticketPrice * tickets).toFixed(2);

  const paymentMethodLabel = {
    credit_card: 'Credit / Debit Card',
    upi: 'UPI / QR Code',
    net_banking: 'Net Banking',
  };

  const handleBook = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/bookings', {
        event_id: event.event_id,
        number_of_tickets: tickets,
        payment_method: paymentMethod
      });

      if (res.data.success) {
        setBookingSuccess(res.data.booking);
        // Show the success snackbar toast
        setSnackbarOpen(true);
        // DO NOT call onSuccess here – wait until user dismisses the modal
        // to avoid parent re-render blinking the modal
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDone = () => {
    // Refresh parent event data
    if (onSuccess) onSuccess();
    handleResetAndClose();
    // Navigate to bookings page so they can see their ticket
    navigate('/user/bookings');
  };

  const handleResetAndClose = () => {
    setTickets(1);
    setPaymentMethod('credit_card');
    setError('');
    setBookingSuccess(null);
    setSnackbarOpen(false);
    onClose();
  };

  // Format date nicely
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

  return (
    <>
      <Dialog
        open={open}
        onClose={bookingSuccess ? undefined : handleResetAndClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 0, overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            pt: 2.5,
            px: 3,
            background: bookingSuccess
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'white',
            color: bookingSuccess ? 'white' : 'inherit',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {bookingSuccess && <CheckCircle sx={{ fontSize: 28 }} />}
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {bookingSuccess ? 'Payment Successful!' : 'Book Event Tickets'}
            </Typography>
          </Box>
          {!bookingSuccess && (
            <IconButton onClick={handleResetAndClose} size="small">
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0, border: 'none' }}>
          {bookingSuccess ? (
            /* ─── DIGITAL TICKET VIEW ─── */
            <Box sx={{ bgcolor: '#f0fdf4', minHeight: 300 }}>

              {/* Sub-header congratulations message */}
              <Box sx={{ textAlign: 'center', px: 3, pt: 3, pb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Your booking is confirmed. Here is your digital ticket!
                </Typography>
              </Box>

              {/* ── TICKET CARD ── */}
              <Box sx={{ mx: 2.5, mb: 3 }}>
                {/* Top section with event info */}
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
                  {/* Background decoration */}
                  <Box sx={{
                    position: 'absolute', top: -30, right: -30,
                    width: 120, height: 120, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.06)'
                  }} />
                  <Box sx={{
                    position: 'absolute', bottom: -20, left: '30%',
                    width: 80, height: 80, borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.04)'
                  }} />

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        width: 56, height: 56, borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <LocalActivity sx={{ fontSize: 28, color: '#a5b4fc' }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                        Event Ticket
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, mt: 0.5 }}>
                        {bookingSuccess.event_name || event.event_name}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Event details row */}
                  <Box sx={{ display: 'flex', gap: 3, mt: 2.5, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <EventIcon sx={{ fontSize: 14, color: '#a5b4fc' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                        {formatDate(event.event_date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                      <AccessTime sx={{ fontSize: 14, color: '#a5b4fc' }} />
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                        {formatTime(event.start_time)}
                      </Typography>
                    </Box>
                    {(event.venue_name || event.venue_city) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                        <LocationOn sx={{ fontSize: 14, color: '#a5b4fc' }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>
                          {event.venue_name || event.venue_city}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Perforated divider */}
                <Box sx={{ position: 'relative', bgcolor: 'white', height: 24, overflow: 'hidden' }}>
                  {/* Left notch */}
                  <Box sx={{
                    position: 'absolute', left: -14, top: '50%', transform: 'translateY(-50%)',
                    width: 28, height: 28, borderRadius: '50%',
                    bgcolor: '#f0fdf4',
                    border: '2px solid #e2e8f0',
                  }} />
                  {/* Right notch */}
                  <Box sx={{
                    position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)',
                    width: 28, height: 28, borderRadius: '50%',
                    bgcolor: '#f0fdf4',
                    border: '2px solid #e2e8f0',
                  }} />
                  {/* Dashed line */}
                  <Box sx={{
                    position: 'absolute', top: '50%', left: 20, right: 20,
                    borderTop: '2px dashed #cbd5e1',
                  }} />
                </Box>

                {/* Bottom section with booking details */}
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '0 0 16px 16px',
                    border: '1px solid #e2e8f0',
                    borderTop: 'none',
                    p: 2.5,
                  }}
                >
                  {/* Booking Reference */}
                  <Box sx={{ textAlign: 'center', mb: 2.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                      Booking Reference
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#4338ca', letterSpacing: 2, fontFamily: 'monospace', mt: 0.5 }}>
                      {bookingSuccess.booking_reference}
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Ticket details grid */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Tickets
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        × {bookingSuccess.number_of_tickets}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Amount Paid
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#059669' }}>
                        ₹{parseFloat(bookingSuccess.total_amount).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Payment Method
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        {paymentMethodLabel[paymentMethod] || paymentMethod}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Status
                      </Typography>
                      <Chip
                        label="CONFIRMED"
                        size="small"
                        icon={<CheckCircle sx={{ fontSize: '14px !important' }} />}
                        sx={{
                          bgcolor: '#d1fae5',
                          color: '#065f46',
                          fontWeight: 800,
                          fontSize: '0.7rem',
                          height: 22,
                          '& .MuiChip-icon': { color: '#059669' }
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Footer note */}
                  <Box sx={{ mt: 2.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      🎉 Show this booking reference at the venue entrance
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            /* ─── BOOKING FORM VIEW ─── */
            <Box sx={{ p: 3 }}>
              {error && <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>}

              {/* Event Header */}
              <Box sx={{ bgcolor: '#f8fafc', p: 2, borderRadius: 3, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <Box
                  component="img"
                  src={event.banner_image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=300&q=80'}
                  alt={event.event_name}
                  sx={{ width: 80, height: 60, borderRadius: 2, objectFit: 'cover' }}
                />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {event.event_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {formatDate(event.event_date)} • {event.venue_name || 'Main Hall'}
                  </Typography>
                  <Chip
                    label={`${event.available_seats} seats remaining`}
                    size="small"
                    color="secondary"
                    sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }}
                  />
                </Box>
              </Box>

              {/* Select Ticket Quantity */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Select Number of Tickets
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setTickets(Math.max(1, tickets - 1))}
                  disabled={tickets <= 1}
                  sx={{ minWidth: 44, height: 44, borderRadius: 2, fontSize: '1.2rem', fontWeight: 700 }}
                >
                  -
                </Button>
                <Typography variant="h5" sx={{ fontWeight: 800, minWidth: 40, textAlign: 'center' }}>
                  {tickets}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setTickets(Math.min(event.available_seats, tickets + 1))}
                  disabled={tickets >= event.available_seats}
                  sx={{ minWidth: 44, height: 44, borderRadius: 2, fontSize: '1.2rem', fontWeight: 700 }}
                >
                  +
                </Button>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              {/* Payment Options */}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                Choose Payment Method
              </Typography>
              <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <CreditCard color="primary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Credit / Debit Card</Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="upi"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <QrCode color="secondary" fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Instant UPI / QR Code</Typography>
                    </Stack>
                  }
                />
                <FormControlLabel
                  value="net_banking"
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AccountBalance fontSize="small" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Net Banking</Typography>
                    </Stack>
                  }
                />
              </RadioGroup>

              <Divider sx={{ my: 2.5 }} />

              {/* Order Summary */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Total Amount:
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  ₹{parseFloat(totalAmount).toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, bgcolor: bookingSuccess ? '#f0fdf4' : 'white' }}>
          {bookingSuccess ? (
            <Button
              variant="contained"
              fullWidth
              onClick={handleDone}
              sx={{
                py: 1.4,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 2,
                '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
              }}
            >
              Done — View My Bookings
            </Button>
          ) : (
            <>
              <Button onClick={handleResetAndClose} color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBook}
                disabled={loading || event.available_seats === 0}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ConfirmationNumber />}
                sx={{ px: 4, py: 1.2, fontWeight: 700 }}
              >
                {loading ? 'Processing...' : 'Confirm & Pay'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* ─── SUCCESS SNACKBAR TOAST ─── */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          icon={<CheckCircle fontSize="inherit" />}
          severity="success"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          sx={{
            width: '100%',
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(16,185,129,0.35)',
          }}
        >
          🎉 Payment Successful! Your ticket is confirmed.
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingModal;
