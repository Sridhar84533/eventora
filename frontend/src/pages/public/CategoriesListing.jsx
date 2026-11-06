import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryCard from '../../components/CategoryCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const CategoriesListing = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      <Box sx={{ bgcolor: '#ffffff', py: 6, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            EVENT CATEGORIES
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Explore Events by Domain
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3.5}>
            {categories.map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.category_id}>
                <CategoryCard category={cat} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default CategoriesListing;
