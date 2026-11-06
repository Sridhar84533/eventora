import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import { Save, AddCircleOutline } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);

  const [formData, setFormData] = useState({
    event_name: '',
    description: '',
    event_date: '',
    start_time: '09:00',
    end_time: '17:00',
    ticket_price: '0.00',
    total_seats: '100',
    venue_id: '',
    category_ids: [],
    banner_image: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, venRes] = await Promise.all([
          api.get('/categories'),
          api.get('/venues')
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (venRes.data.success) setVenues(venRes.data.data);
      } catch (err) {
        console.error('Error loading form data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'category_ids') {
          formData.category_ids.forEach(id => data.append('category_ids[]', id));
        } else {
          data.append(key, formData[key]);
        }
      });
      if (file) {
        data.append('banner_image', file);
      }

      const res = await api.post('/organizer/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSuccessMsg('Event created successfully! Submitted for admin approval.');
        setTimeout(() => navigate('/organizer/events'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="organizer" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Create New Event
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Fill in the details below to list your upcoming concert or summit.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{successMsg}</Alert>}

        <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', maxWidth: 900 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              
              <Grid item xs={12}>
                <TextField
                  label="Event Title / Name"
                  required
                  fullWidth
                  value={formData.event_name}
                  onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Full Description"
                  multiline
                  rows={4}
                  required
                  fullWidth
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Event Date"
                  type="date"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="Start Time"
                  type="time"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  label="End Time"
                  type="time"
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ticket Price ($)"
                  type="number"
                  required
                  fullWidth
                  value={formData.ticket_price}
                  onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Total Seating Capacity"
                  type="number"
                  required
                  fullWidth
                  value={formData.total_seats}
                  onChange={(e) => setFormData({ ...formData, total_seats: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Select Venue / Auditorium"
                  fullWidth
                  value={formData.venue_id}
                  onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
                >
                  <MenuItem value="">Online / TBA</MenuItem>
                  {venues.map((v) => (
                    <MenuItem key={v.venue_id} value={v.venue_id}>{v.venue_name} ({v.city})</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  SelectProps={{ multiple: true }}
                  label="Event Categories"
                  fullWidth
                  value={formData.category_ids}
                  onChange={(e) => setFormData({ ...formData, category_ids: e.target.value })}
                >
                  {categories.map((c) => (
                    <MenuItem key={c.category_id} value={c.category_id}>{c.category_name}</MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Event Banner Image File Upload
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ marginBottom: '16px', display: 'block' }}
                />
                <TextField
                  label="OR Image URL fallback"
                  fullWidth
                  placeholder="https://images.unsplash.com/..."
                  value={formData.banner_image}
                  onChange={(e) => setFormData({ ...formData, banner_image: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  startIcon={<AddCircleOutline />}
                  sx={{ py: 1.4, px: 4, borderRadius: 3 }}
                >
                  {loading ? 'Submitting...' : 'Submit Event for Admin Review'}
                </Button>
              </Grid>

            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateEvent;
