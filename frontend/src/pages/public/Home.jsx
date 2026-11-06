import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper
} from '@mui/material';
import {
  Search,
  LocationOn,
  Category as CategoryIcon,
  CalendarToday,
  ArrowForward,
  Star,
  CheckCircle,
  Security,
  Speed,
  SupportAgent,
  ConfirmationNumber
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EventCard from '../../components/EventCard';
import CategoryCard from '../../components/CategoryCard';
import VenueCard from '../../components/VenueCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    featured: [],
    upcoming: [],
    categories: [],
    venues: [],
    stats: { total_events: 50, total_users: 1200, total_organizers: 80, total_tickets_sold: 4500 }
  });
  const [loading, setLoading] = useState(true);

  // Search Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/events/home-overview');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.warn('Failed to load home overview:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('search', searchTerm);
    if (selectedCategory) queryParams.set('category', selectedCategory);
    if (selectedCity) queryParams.set('city', selectedCity);
    navigate(`/events?${queryParams.toString()}`);
  };

  return (
    <Box sx={{ minHeight: 100, display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
          pt: { xs: 8, md: 10 },
          pb: { xs: 10, md: 12 },
          borderBottom: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            
            {/* Left Copy */}
            <Grid item xs={12} md={7}>
              <Chip
                icon={<Star sx={{ color: '#f59e0b !important' }} />}
                label="The Next-Gen Event Ticketing Platform"
                sx={{
                  bgcolor: '#ffffff',
                  color: 'primary.main',
                  fontWeight: 700,
                  px: 1,
                  py: 2.2,
                  borderRadius: 3,
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.08)',
                  mb: 3
                }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, lineHeight: 1.15, mb: 2.5 }}>
                Discover & Book <Box component="span" sx={{ color: 'primary.main' }}>Extraordinary</Box> Live Events
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, mb: 4, maxWidth: 600, lineHeight: 1.6 }}>
                Explore thousands of premier tech conferences, symphony concerts, startup expos, and design masterclasses. Simple, instant, and secure ticketing.
              </Typography>

              {/* Search Bar Form Card */}
              <Paper
                component="form"
                onSubmit={handleSearchSubmit}
                elevation={3}
                sx={{
                  p: 1.5,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 1.5,
                  bgcolor: '#ffffff',
                  boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <TextField
                  placeholder="Event title or keyword..."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search color="primary" /></InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#f8fafc' }
                  }}
                />

                <TextField
                  select
                  size="small"
                  fullWidth
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  displayEmpty
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><CategoryIcon fontSize="small" /></InputAdornment>,
                    sx: { borderRadius: 3, bgcolor: '#f8fafc', minWidth: 160 }
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {data.categories.map((c) => (
                    <MenuItem key={c.category_id} value={c.category_name}>{c.category_name}</MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Search />}
                  sx={{ borderRadius: 3, px: 4, py: 1.2, whiteSpace: 'nowrap' }}
                >
                  Search
                </Button>
              </Paper>
            </Grid>

            {/* Right Media Graphic */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
                  alt="Live Concert Platform"
                  sx={{
                    width: '100%',
                    borderRadius: 6,
                    boxShadow: '0 25px 50px -12px rgba(79, 70, 229, 0.25)',
                    border: '4px solid #ffffff'
                  }}
                />
              </Box>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Featured Events Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 5 }}>
          <Box>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              FEATURED EXPERIENCES
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Handpicked Featured Events
            </Typography>
          </Box>
          <Button
            component={RouterLink}
            to="/events"
            endIcon={<ArrowForward />}
            sx={{ fontWeight: 700 }}
          >
            Explore All Events
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3.5}>
            {data.featured.map((evt) => (
              <Grid item xs={12} sm={6} md={4} key={evt.event_id}>
                <EventCard event={evt} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Popular Categories */}
      <Box sx={{ bgcolor: '#ffffff', py: 8, borderVertical: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            BROWSE BY CATEGORY
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>
            Explore Popular Genres & Fields
          </Typography>

          <Grid container spacing={3}>
            {data.categories.slice(0, 6).map((cat) => (
              <Grid item xs={12} sm={6} md={4} key={cat.category_id}>
                <CategoryCard category={cat} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Popular Venues */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
          PREMIER LOCATIONS
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 4 }}>
          Top Auditoriums & Venues
        </Typography>

        <Grid container spacing={3.5}>
          {data.venues.slice(0, 3).map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v.venue_id}>
              <VenueCard venue={v} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#ffffff', py: 9, borderTop: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 6 }}>
            <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
              SIMPLE & FAST
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1.5 }}>
              How EVENTORA Works
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Book your tickets in three simple steps without hassle or paper passes.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {[
              { step: '01', title: 'Find Your Favorite Event', desc: 'Browse through tech summits, live concerts, and business forums by category, location, or date.', icon: <Search fontSize="large" color="primary" /> },
              { step: '02', title: 'Select Seats & Checkout', desc: 'Pick your preferred number of tickets, view real-time seating availability, and pay securely.', icon: <ConfirmationNumber fontSize="large" color="primary" /> },
              { step: '03', title: 'Get Instant Digital Ticket', desc: 'Receive your unique reference ticket with QR code ready for instant entry at the venue door.', icon: <CheckCircle fontSize="large" color="primary" /> }
            ].map((item, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Card sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(79, 70, 229, 0.1)', color: 'primary.main', mx: 'auto', mb: 2.5 }}>
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.step}. {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Platform Statistics */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {[
            { label: 'Published Events', val: `${data.stats.total_events}+` },
            { label: 'Registered Attendees', val: `${data.stats.total_users}+` },
            { label: 'Verified Organizers', val: `${data.stats.total_organizers}+` },
            { label: 'Tickets Issued', val: `${data.stats.total_tickets_sold}+` }
          ].map((s, idx) => (
            <Grid item xs={6} md={3} key={idx}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #f1f5f9', bgcolor: '#ffffff' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 0.5 }}>
                  {s.val}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {s.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Organizer Call To Action Banner */}
      <Box sx={{ bgcolor: 'primary.main', color: '#ffffff', py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#ffffff', mb: 1.5 }}>
                Are You an Event Host or Organizer?
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 400, color: 'rgba(255, 255, 255, 0.9)', maxWidth: 650 }}>
                Publish your upcoming concerts, tech summits, or workshops on EVENTORA. Access powerful revenue analytics, ticket controls, and staff management tools.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#ffffff',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 800,
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                Become an Organizer
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default Home;
