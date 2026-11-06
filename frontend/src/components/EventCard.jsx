import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Favorite,
  FavoriteBorder,
  ConfirmationNumber
} from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onFavToggle }) => {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(event.is_favourite || false);

  const handleFavouriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;

    try {
      const res = await api.post('/user/favourite', { event_id: event.event_id });
      if (res.data.success) {
        setIsFav(res.data.is_favourite);
        if (onFavToggle) onFavToggle(event.event_id, res.data.is_favourite);
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      {/* Banner Image & Overlay Badges */}
      <Box sx={{ position: 'relative', pt: '56.25%' }}>
        <CardMedia
          component="img"
          image={event.banner_image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80'}
          alt={event.event_name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Category Chip */}
        <Chip
          label={event.category_names ? event.category_names.split(',')[0] : 'Event'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            color: 'primary.main',
            fontWeight: 700,
            fontSize: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        />

        {/* Bookmark/Favourite Button */}
        {user && user.role === 'user' && (
          <IconButton
            onClick={handleFavouriteClick}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              '&:hover': { bgcolor: '#ffffff' }
            }}
          >
            {isFav ? <Favorite color="error" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Date & Time */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ color: 'primary.main', mb: 1 }}>
          <CalendarToday sx={{ fontSize: 16 }} />
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
            {formatDate(event.event_date)} {event.start_time ? `• ${event.start_time.slice(0, 5)}` : ''}
          </Typography>
        </Stack>

        {/* Title */}
        <Typography
          variant="h6"
          component={RouterLink}
          to={`/events/${event.event_id}`}
          sx={{
            fontWeight: 700,
            fontSize: '1.05rem',
            lineHeight: 1.3,
            color: '#0f172a',
            textDecoration: 'none',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {event.event_name}
        </Typography>

        {/* Venue & Location */}
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ color: 'text.secondary', mb: 2 }}>
          <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
          <Typography variant="body2" noWrap sx={{ fontSize: '0.85rem' }}>
            {event.venue_name ? `${event.venue_name}, ${event.venue_city || ''}` : (event.venue_city || 'Online / Venue TBA')}
          </Typography>
        </Stack>

        <Box sx={{ mt: 'auto', pt: 1.5, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block">
              Ticket Price
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {parseFloat(event.ticket_price) === 0 ? 'Free' : `$${parseFloat(event.ticket_price).toFixed(2)}`}
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to={`/events/${event.event_id}`}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ConfirmationNumber sx={{ fontSize: '1rem !important' }} />}
            sx={{ borderRadius: 2.5, px: 2 }}
          >
            Get Tickets
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default EventCard;
