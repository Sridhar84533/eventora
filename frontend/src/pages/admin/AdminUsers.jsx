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

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus, role) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.put(`/admin/users/${userId}`, { status: nextStatus, role });
      fetchUsers();
    } catch (err) {
      alert('Error updating user status.');
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          User Account Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage all registered platform accounts and role permissions.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email Address</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Bookings</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.user_id} hover>
                      <TableCell>#{u.user_id}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{u.full_name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip label={u.role.toUpperCase()} size="small" color={u.role === 'admin' ? 'error' : u.role === 'organizer' ? 'secondary' : 'primary'} />
                      </TableCell>
                      <TableCell>{u.total_bookings || 0}</TableCell>
                      <TableCell>
                        <Chip label={u.status.toUpperCase()} size="small" color={u.status === 'active' ? 'success' : 'error'} />
                      </TableCell>
                      <TableCell align="right">
                        {u.role !== 'admin' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color={u.status === 'active' ? 'error' : 'success'}
                            onClick={() => handleToggleStatus(u.user_id, u.status, u.role)}
                          >
                            {u.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>
                        )}
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

export default AdminUsers;
