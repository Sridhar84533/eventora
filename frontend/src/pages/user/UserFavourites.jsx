import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Sidebar from '../../components/Sidebar';
import EventCard from '../../components/EventCard';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const UserFavourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = async () => {
    try {
      const res = await api.get('/user/favourites');
      if (res.data.success) {
        setFavourites(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching favourites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavourites();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="user" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Favourite Events
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Quick access to your bookmarked events.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : favourites.length === 0 ? (
          <EmptyState title="No Favourites Saved" description="Click the heart icon on any event card to bookmark it here." />
        ) : (
          <Grid container spacing={3.5}>
            {favourites.map((evt) => (
              <Grid item xs={12} sm={6} md={4} key={evt.event_id}>
                <EventCard event={{ ...evt, is_favourite: true }} onFavToggle={fetchFavourites} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default UserFavourites;
