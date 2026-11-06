import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ReceiptLong, CalendarToday, LocationOn, ConfirmationNumber, Print } from '@mui/icons-material';
import Sidebar from '../../components/Sidebar';
import { LoadingSpinner, EmptyState } from '../../components/LoadingSpinner';
import api from '../../services/api';

const UserTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/bookings/my-bookings');
        if (res.data.success) {
          // Filter active confirmed bookings
          setTickets(res.data.data.filter(b => b.booking_status === 'confirmed'));
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar role="user" />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2.5, md: 4 }, width: { md: `calc(100% - 260px)` } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          My Digital Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Access your active digital entry passes anytime.
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : tickets.length === 0 ? (
          <EmptyState title="No Active Tickets" description="You have no active confirmed event tickets." />
        ) : (
          <Grid container spacing={3}>
            {tickets.map((t) => (
              <Grid item xs={12} sm={6} md={4} key={t.booking_id}>
                <Card sx={{ p: 2.5, borderRadius: 4, border: '1px dashed #4f46e5', bgcolor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Chip label={t.booking_reference} color="primary" size="small" sx={{ fontWeight: 800 }} />
                    <Chip label={`${t.number_of_tickets} Pass`} color="secondary" size="small" />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {t.event_name}
                  </Typography>

                  <Stack spacing={0.8} sx={{ color: 'text.secondary', mb: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarToday fontSize="small" color="primary" />
                      <Typography variant="body2">{t.event_date} ({t.start_time?.slice(0,5)})</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationOn fontSize="small" color="primary" />
                      <Typography variant="body2">{t.venue_name || 'Online'}</Typography>
                    </Stack>
                  </Stack>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<ReceiptLong />}
                    onClick={() => setSelectedTicket(t)}
                    sx={{ mt: 'auto', borderRadius: 2.5 }}
                  >
                    View / Print Pass
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* View Pass Dialog */}
        <Dialog open={Boolean(selectedTicket)} onClose={() => setSelectedTicket(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
          <DialogTitle sx={{ fontWeight: 800, textAlign: 'center' }}>Official Event Entry Ticket</DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Box sx={{ p: 3, border: '2px dashed #4f46e5', borderRadius: 3, bgcolor: '#f8fafc' }}>
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
                  {selectedTicket.event_name}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}><strong>Ref:</strong> {selectedTicket.booking_reference}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}><strong>Date:</strong> {selectedTicket.event_date}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}><strong>Venue:</strong> {selectedTicket.venue_name || 'TBA'}, {selectedTicket.venue_city || ''}</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}><strong>Passes:</strong> {selectedTicket.number_of_tickets} Person(s)</Typography>
                <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff', borderRadius: 2 }}>
                  <Box component="img" src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=EVENTORA_PASS" alt="QR Code" />
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button startIcon={<Print />} onClick={() => window.print()}>Print Pass</Button>
            <Button onClick={() => setSelectedTicket(null)} variant="contained">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default UserTickets;
