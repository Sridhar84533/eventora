import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { LocationOn, Groups } from '@mui/icons-material';

const VenueCard = ({ venue }) => {
  return (
    <Card
      component={RouterLink}
      to={`/events?city=${encodeURIComponent(venue.city)}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        textDecoration: 'none',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0, 0, 0, 0.08)'
        }
      }}
    >
      <Box sx={{ position: 'relative', pt: '50%' }}>
        <CardMedia
          component="img"
          image={venue.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'}
          alt={venue.venue_name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <Chip
          icon={<Groups sx={{ fontSize: '0.9rem !important' }} />}
          label={`Cap. ${venue.capacity}`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            bgcolor: 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            backdropFilter: 'blur(4px)',
            fontWeight: 700
          }}
        />
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }} noWrap>
          {venue.venue_name}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: 'text.secondary', mb: 1 }}>
          <LocationOn fontSize="small" color="primary" />
          <Typography variant="body2" noWrap>
            {venue.address}, {venue.city}, {venue.state}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem' }}>
          {venue.description || 'Premium auditorium equipped with modern acoustic and lighting systems.'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
