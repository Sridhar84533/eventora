import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  Avatar,
  Stack,
  MenuItem,
  IconButton,
  Badge,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Save, PhotoCamera, Delete, CloudUpload } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profile_image: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || 'Male',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        profile_image: user.profile_image || ''
      });
    }
  }, [user]);

  // Handle Photo File Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMsg({ type: 'error', text: 'Please select a valid image file (JPG, PNG, WEBP, GIF).' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Image file size must be less than 5MB.' });
      return;
    }

    setUploadingImage(true);
    setMsg({ type: '', text: '' });

    const uploadData = new FormData();
    uploadData.append('avatar', file);

    try {
      const res = await api.post('/user/upload-avatar', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        const newImageUrl = res.data.url;
        const updatedFormData = { ...formData, profile_image: newImageUrl };
        setFormData(updatedFormData);

        // Auto save to database
        await api.post('/user/profile', updatedFormData);
        updateUserProfile({ ...user, ...updatedFormData });
        setMsg({ type: 'success', text: 'Profile picture updated successfully!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload profile picture.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Remove Photo
  const handleRemovePhoto = async () => {
    const updatedFormData = { ...formData, profile_image: '' };
    setFormData(updatedFormData);
    try {
      await api.post('/user/profile', updatedFormData);
      updateUserProfile({ ...user, ...updatedFormData });
      setMsg({ type: 'success', text: 'Profile photo removed.' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to remove photo.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    try {
      const res = await api.post('/user/profile', formData);
      if (res.data.success) {
        setMsg({ type: 'success', text: 'Profile details saved successfully!' });
        updateUserProfile({ ...user, ...formData });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error updating profile.' });
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = formData.profile_image
    ? (formData.profile_image.startsWith('http') ? formData.profile_image : `http://localhost:5000${formData.profile_image}`)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=4f46e5&color=fff&size=200`;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role={user?.role || 'user'} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Manage Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Update your personal details, contact info, and profile picture.
        </Typography>

        {msg.text && (
          <Alert severity={msg.type === 'error' ? 'error' : 'success'} sx={{ mb: 3, borderRadius: 2 }}>
            {msg.text}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Column: Avatar & Photo Upload Controls */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', textAlign: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary', mb: 3 }}>
                PROFILE PHOTO
              </Typography>

              {/* Avatar with Camera Icon Overlay */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title="Upload Photo">
                      <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        sx={{
                          bgcolor: 'primary.main',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                          '&:hover': { bgcolor: 'primary.dark' },
                          width: 38,
                          height: 38
                        }}
                      >
                        {uploadingImage ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera sx={{ fontSize: 20 }} />}
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Avatar
                    src={avatarSrc}
                    alt={user?.full_name}
                    sx={{
                      width: 120,
                      height: 120,
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                      border: '4px solid #ffffff',
                      cursor: 'pointer'
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Badge>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  style={{ display: 'none' }}
                />
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 800 }}>{user?.full_name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{user?.email}</Typography>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<CloudUpload />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  sx={{ borderRadius: 2.5, fontWeight: 700 }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                </Button>

                {formData.profile_image && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Delete />}
                    onClick={handleRemovePhoto}
                    disabled={uploadingImage}
                    sx={{ borderRadius: 2.5, fontWeight: 700 }}
                  >
                    Remove
                  </Button>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Personal Information Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Full Name"
                      fullWidth
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Phone Number"
                      fullWidth
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Date of Birth"
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      label="Gender"
                      fullWidth
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Street Address"
                      fullWidth
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="City"
                      fullWidth
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="State"
                      fullWidth
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Pincode"
                      fullWidth
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      startIcon={<Save />}
                      sx={{ borderRadius: 3, px: 4, py: 1.2, fontWeight: 700 }}
                    >
                      {loading ? 'Saving...' : 'Save Profile Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UserProfile;
