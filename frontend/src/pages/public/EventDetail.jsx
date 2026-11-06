import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Paper,
  Stack,
  Avatar,
  Divider,
  Breadcrumbs,
  Link,
  CardMedia
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  LocationOn,
  ConfirmationNumber,
  Share,
  Groups,
  CorporateFare,
  CheckCircle,
  ArrowBack
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import BookingModal from '../../components/BookingModal';
import { LoadingSpinner, ErrorState } from '../../components/LoadingSpinner';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/events/${id}`);
      if (res.data.success) {
        setEvent(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleBookNowClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.event_name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  if (loading) return <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}><Navbar /><LoadingSpinner /><Footer /></Box>;
  if (error || !event) return <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}><Navbar /><ErrorState message={error || 'Event not found.'} /><Footer /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      {/* Hero Banner */}
      <Box sx={{ position: 'relative', bgcolor: '#0f172a', color: '#ffffff', pt: 4, pb: 8 }}>
        <Container maxWidth="xl">
          
          <Button
            component={RouterLink}
            to="/events"
            startIcon={<ArrowBack />}
            sx={{ color: 'rgba(255, 255, 255, 0.8)', mb: 3 }}
          >
            Back to Events
          </Button>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {event.categories && event.categories.map((c) => (
                  <Chip
                    key={c.category_id}
                    label={c.category_name}
                    size="small"
                    sx={{ bgcolor: 'rgba(79, 70, 229, 0.9)', color: '#ffffff', fontWeight: 700 }}
                  />
                ))}
              </Stack>

              <Typography variant="h2" sx={{ fontWeight: 800, color: '#ffffff', mb: 2 }}>
                {event.event_name}
              </Typography>

              <Stack direction="row" flexWrap="wrap" gap={3} sx={{ color: 'rgba(255,255,255,0.85)', mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CalendarToday color="primary" fontSize="small" />
                  <Typography variant="subtitle2">{event.event_date}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime color="primary" fontSize="small" />
                  <Typography variant="subtitle2">{event.start_time} - {event.end_time}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <LocationOn color="primary" fontSize="small" />
                  <Typography variant="subtitle2">{event.venue_name}, {event.venue_city}</Typography>
                </Stack>
              </Stack>
            </Grid>

            {/* Banner Image */}
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={event.banner_image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80'}
                alt={event.event_name}
                sx={{
                  width: '100%',
                  height: 280,
                  borderRadius: 4,
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Body */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={5}>
          
          {/* Left Column: Details & Staff */}
          <Grid item xs={12} md={8}>
            
            {/* Description */}
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                About This Event
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                {event.description}
              </Typography>
            </Paper>

            {/* Venue Location Details */}
            {event.venue_name && (
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                  Venue & Location
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
                  {event.venue_name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {event.venue_address}, {event.venue_city}, {event.venue_state}
                </Typography>
                {event.venue_capacity && (
                  <Chip icon={<Groups />} label={`Capacity: ${event.venue_capacity} Guests`} size="small" />
                )}
              </Paper>
            )}

            {/* Organizer Info */}
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5 }}>
                Organized By
              </Typography>
              <Stack direction="row" spacing={2.5} alignItems="center">
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main', fontWeight: 800, fontSize: '1.5rem' }}>
                  {event.organization_name ? event.organization_name.charAt(0) : 'O'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {event.organization_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.organization_description || 'Professional Verified Event Host'}
                  </Typography>
                  {event.contact_email && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Email: {event.contact_email} | Phone: {event.contact_phone || 'N/A'}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Paper>

          </Grid>

          {/* Right Column: Sticky Ticket Box */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3.5, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', position: 'sticky', top: 90 }}>
              
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                TICKET PRICE
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 2 }}>
                {parseFloat(event.ticket_price) === 0 ? 'Free' : `$${parseFloat(event.ticket_price).toFixed(2)}`}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1.5} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Total Capacity:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{event.total_seats} Seats</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Available Seats:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: event.available_seats < 50 ? 'error.main' : 'success.main' }}>
                    {event.available_seats} Seats Left
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={event.available_seats === 0 || event.event_status !== 'published'}
                onClick={handleBookNowClick}
                startIcon={<ConfirmationNumber />}
                sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1.05rem', mb: 2 }}
              >
                {event.available_seats === 0 ? 'Sold Out' : 'Book Tickets Now'}
              </Button>

              <Button
                variant="outlined"
                color="inherit"
                fullWidth
                onClick={handleShare}
                startIcon={<Share />}
                sx={{ borderRadius: 3 }}
              >
                Share Event
              </Button>

            </Paper>
          </Grid>

        </Grid>

        {/* Related Events */}
        {event.relatedEvents && event.relatedEvents.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
              Similar Events You Might Like
            </Typography>
            <Grid container spacing={3.5}>
              {event.relatedEvents.map((rel) => (
                <Grid item xs={12} sm={6} md={3} key={rel.event_id}>
                  <EventCard event={rel} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Booking Checkout Dialog */}
      <BookingModal
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        event={event}
        onSuccess={fetchEvent}
      />

      <Footer />
    </Box>
  );
};

export default EventDetail;
