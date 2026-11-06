import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import { AddCircleOutline, Delete } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminCategoriesVenues = () => {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [venueName, setVenueName] = useState('');
  const [venueAddr, setVenueAddr] = useState('');
  const [venueCity, setVenueCity] = useState('');
  const [venueState, setVenueState] = useState('');
  const [venueCap, setVenueCap] = useState(1000);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, venRes] = await Promise.all([
        api.get('/categories'),
        api.get('/venues')
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (venRes.data.success) setVenues(venRes.data.data);
    } catch (err) {
      console.error('Error fetching categories/venues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { category_name: catName, description: catDesc });
      setCatName('');
      setCatDesc('');
      fetchData();
    } catch (err) {
      alert('Error creating category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting category.');
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      await api.post('/venues', {
        venue_name: venueName,
        address: venueAddr,
        city: venueCity,
        state: venueState,
        capacity: venueCap
      });
      setVenueName(''); setVenueAddr(''); setVenueCity(''); setVenueState('');
      fetchData();
    } catch (err) {
      alert('Error creating venue.');
    }
  };

  const handleDeleteVenue = async (id) => {
    try {
      await api.delete(`/venues/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting venue.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Categories & Venues Manager
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure system categories and event auditoriums.
        </Typography>

        <Tabs value={tab} onChange={(e, val) => setTab(val)} sx={{ mb: 3 }}>
          <Tab label="Categories Manager" sx={{ fontWeight: 700 }} />
          <Tab label="Venues & Auditoriums Manager" sx={{ fontWeight: 700 }} />
        </Tabs>

        {loading ? (
          <LoadingSpinner />
        ) : tab === 0 ? (
          <>
            {/* Category Form */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Add New Event Category</Typography>
              <Box component="form" onSubmit={handleAddCategory}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField label="Category Name" required fullWidth size="small" value={catName} onChange={(e) => setCatName(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Description" fullWidth size="small" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button type="submit" variant="contained" fullWidth startIcon={<AddCircleOutline />} sx={{ height: 40, borderRadius: 2 }}>Add</Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Category Table */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((c) => (
                      <TableRow key={c.category_id} hover>
                        <TableCell>#{c.category_id}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{c.category_name}</TableCell>
                        <TableCell>{c.description || 'N/A'}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDeleteCategory(c.category_id)} color="error" size="small"><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        ) : (
          <>
            {/* Venue Form */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Add New Auditorium / Venue</Typography>
              <Box component="form" onSubmit={handleAddVenue}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <TextField label="Venue Name" required fullWidth size="small" value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField label="Street Address" required fullWidth size="small" value={venueAddr} onChange={(e) => setVenueAddr(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField label="City" required fullWidth size="small" value={venueCity} onChange={(e) => setVenueCity(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField label="State" required fullWidth size="small" value={venueState} onChange={(e) => setVenueState(e.target.value)} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button type="submit" variant="contained" fullWidth startIcon={<AddCircleOutline />} sx={{ height: 40, borderRadius: 2 }}>Add</Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Venue Table */}
            <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Venue Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>City & State</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Capacity</TableCell>
                      <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venues.map((v) => (
                      <TableRow key={v.venue_id} hover>
                        <TableCell sx={{ fontWeight: 700 }}>{v.venue_name}</TableCell>
                        <TableCell>{v.address}</TableCell>
                        <TableCell>{v.city}, {v.state}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>{v.capacity} Guests</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleDeleteVenue(v.venue_id)} color="error" size="small"><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminCategoriesVenues;
