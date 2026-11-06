import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import VenueCard from '../../components/VenueCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const VenuesListing = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await api.get('/venues');
        if (res.data.success) {
          setVenues(res.data.data);
        }
      } catch (err) {
        console.error('Error loading venues:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      <Box sx={{ bgcolor: '#ffffff', py: 6, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            EVENT VENUES & HALLS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            World-Class Auditoriums & Arenas
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3.5}>
            {venues.map((v) => (
              <Grid item xs={12} sm={6} md={4} key={v.venue_id}>
                <VenueCard venue={v} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default VenuesListing;
