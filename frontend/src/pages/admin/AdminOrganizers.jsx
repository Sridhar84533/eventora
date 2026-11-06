import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button
} from '@mui/material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrganizers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/organizers');
      if (res.data.success) {
        setOrganizers(res.data.data);
      }
    } catch (err) {
      console.error('Error loading organizers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const handleToggleVerification = async (orgId, currentStatus) => {
    const nextStatus = currentStatus === 'verified' ? 'rejected' : 'verified';
    try {
      await api.put(`/admin/organizers/${orgId}`, { verification_status: nextStatus });
      fetchOrganizers();
    } catch (err) {
      alert('Error updating organizer status.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Event Organizer Verification & Control
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage event host accounts and verification badges.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Organization Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Primary Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email / Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Website</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Events</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Verification</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {organizers.map((o) => (
                    <TableRow key={o.organizer_id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{o.organization_name}</TableCell>
                      <TableCell>{o.full_name}</TableCell>
                      <TableCell>{o.contact_email || o.email}</TableCell>
                      <TableCell>{o.website || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{o.total_events} Events</TableCell>
                      <TableCell>
                        <Chip label={o.verification_status.toUpperCase()} size="small" color={o.verification_status === 'verified' ? 'success' : 'warning'} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          color={o.verification_status === 'verified' ? 'error' : 'success'}
                          onClick={() => handleToggleVerification(o.organizer_id, o.verification_status)}
                        >
                          {o.verification_status === 'verified' ? 'Revoke Verification' : 'Verify Host'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AdminOrganizers;
