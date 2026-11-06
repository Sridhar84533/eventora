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
  Button
} from '@mui/material';
import { Download } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import api from '../../services/api';

const AdminReports = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get('/admin/analytics-report');
        if (res.data.success) {
          setReport(res.data.data.revenueByEvent);
        }
      } catch (err) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Event Title,Organizer,Tickets Sold,Total Revenue\n';
    report.forEach(row => {
      csvContent += `"${row.event_name}","${row.organization_name}",${row.tickets_sold},${row.total_revenue}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'EVENTORA_Revenue_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="admin" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Platform Analytical Reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Revenue breakdowns by event and host organization.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Download />}
            onClick={handleExportCSV}
            sx={{ borderRadius: 2.5 }}
          >
            Export Report CSV
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Host Organization</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tickets Sold</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Revenue</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.map((row) => (
                    <TableRow key={row.event_id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{row.event_name}</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>{row.organization_name}</TableCell>
                      <TableCell>{row.tickets_sold} Passes</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'success.main' }}>${parseFloat(row.total_revenue).toFixed(2)}</TableCell>
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

export default AdminReports;
