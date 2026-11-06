import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  InputAdornment,
  Pagination,
  Slider,
  Stack,
  Drawer,
  IconButton
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  LocationOn,
  Category as CategoryIcon,
  AttachMoney
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const EventsListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('event_date');
  const [order, setOrder] = useState('ASC');
  const [page, setPage] = useState(1);

  const fetchCategoriesAndVenues = async () => {
    try {
      const [catRes, venRes] = await Promise.all([
        api.get('/categories'),
        api.get('/venues')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (venRes.data.success) setVenues(venRes.data.data);
    } catch (err) {
      console.warn('Failed to load categories/venues:', err.message);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category,
        city,
        min_price: priceRange[0],
        max_price: priceRange[1],
        sort_by: sortBy,
        order,
        page,
        limit: 9
      };
      const res = await api.get('/events', { params });
      if (res.data.success) {
        setEvents(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesAndVenues();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [search, category, city, priceRange, sortBy, order, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setCity('');
    setPriceRange([0, 1000]);
    setSortBy('event_date');
    setOrder('ASC');
    setPage(1);
    navigate('/events');
  };

  // Get list of unique cities from venues
  const cities = Array.from(new Set(venues.map(v => v.city))).filter(Boolean);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      <Box sx={{ bgcolor: '#ffffff', py: 6, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            ALL EVENTS
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Browse & Discover Live Events
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          
          {/* Left Filter Sidebar */}
          <Grid item xs={12} md={3.5} lg={3}>
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FilterList color="primary" /> Filters
                </Typography>
                <Button size="small" onClick={handleResetFilters} startIcon={<Clear />}>
                  Reset
                </Button>
              </Box>

              <Stack spacing={2.5}>
                {/* Search Text */}
                <TextField
                  label="Search Title / Keyword"
                  size="small"
                  fullWidth
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                  }}
                />

                {/* Category Select */}
                <TextField
                  select
                  label="Category"
                  size="small"
                  fullWidth
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c.category_id} value={c.category_name}>{c.category_name}</MenuItem>
                  ))}
                </TextField>

                {/* City Select */}
                <TextField
                  select
                  label="City / Location"
                  size="small"
                  fullWidth
                  value={city}
                  onChange={(e) => { setCity(e.target.value); setPage(1); }}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {cities.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>

                {/* Price Range Slider */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    Price Range (${priceRange[0]} - ${priceRange[1]})
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, val) => setPriceRange(val)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={1000}
                    step={10}
                    color="primary"
                  />
                </Box>

                {/* Sort By */}
                <TextField
                  select
                  label="Sort By"
                  size="small"
                  fullWidth
                  value={`${sortBy}-${order}`}
                  onChange={(e) => {
                    const [col, ord] = e.target.value.split('-');
                    setSortBy(col);
                    setOrder(ord);
                  }}
                >
                  <MenuItem value="event_date-ASC">Date (Upcoming First)</MenuItem>
                  <MenuItem value="ticket_price-ASC">Price (Low to High)</MenuItem>
                  <MenuItem value="ticket_price-DESC">Price (High to Low)</MenuItem>
                  <MenuItem value="created_at-DESC">Recently Added</MenuItem>
                </TextField>

              </Stack>
            </Paper>
          </Grid>

          {/* Right Events Grid */}
          <Grid item xs={12} md={8.5} lg={9}>
            
            {/* Header info bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>
                Showing <Box component="span" sx={{ color: '#0f172a', fontWeight: 800 }}>{pagination.total}</Box> published events
              </Typography>
            </Box>

            {loading ? (
              <LoadingSpinner />
            ) : events.length === 0 ? (
              <EmptyState
                title="No Events Found"
                description="Try relaxing your search terms or filter settings to find more events."
                action={<Button variant="contained" onClick={handleResetFilters}>Reset All Filters</Button>}
              />
            ) : (
              <>
                <Grid container spacing={3}>
                  {events.map((evt) => (
                    <Grid item xs={12} sm={6} lg={4} key={evt.event_id}>
                      <EventCard event={evt} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={pagination.totalPages}
                      page={page}
                      onChange={(e, val) => setPage(val)}
                      color="primary"
                      size="large"
                    />
                  </Box>
                )}
              </>
            )}

          </Grid>

        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default EventsListing;
