import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Avatar
} from '@mui/material';
import {
  ExpandMore,
  Email,
  Phone,
  LocationOn,
  Send,
  CheckCircle
} from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const faqs = [
    { q: 'How do I receive my event ticket after booking?', a: 'Once payment is complete, your ticket with unique reference ID will immediately appear in your User Dashboard under "My Bookings" and "My Tickets".' },
    { q: 'Can I cancel my booking and request a refund?', a: 'Yes! You can cancel eligible bookings directly from your User Dashboard under My Bookings, which automatically updates available seating.' },
    { q: 'How do I register as an event organizer?', a: 'Sign up for a new account on our Register page and select "Organizer" as your user role. You can then submit events for admin review.' },
    { q: 'What payment methods are supported on EVENTORA?', a: 'We accept major Credit/Debit Cards, instant UPI / QR Code payments, and Net Banking.' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      <Box sx={{ bgcolor: '#ffffff', py: 8, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            GET IN TOUCH
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 1.5 }}>
            We'd Love to Hear From You
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Have a question about tickets, organizer partnerships, or technical support? Send us a message below.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={5}>
          
          {/* Contact Form */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                Send Us a Message
              </Typography>

              {submitted && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  Thank you! Your inquiry has been submitted successfully. Our support team will reply within 24 hours.
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Your Full Name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email Address"
                      type="email"
                      fullWidth
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      label="Subject"
                      fullWidth
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Message"
                      multiline
                      rows={5}
                      fullWidth
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<Send />}
                      sx={{ px: 4, py: 1.2, borderRadius: 3 }}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Details & Cards */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {[
                { title: 'Headquarters Office', text: '100 Admin Plaza, Suite 400, San Francisco, CA 94105', icon: <LocationOn color="primary" /> },
                { title: 'Support Email', text: 'support@eventora.com', icon: <Email color="primary" /> },
                { title: 'Phone Hotline', text: '+1 (800) 555-EVENT (38368)', icon: <Phone color="primary" /> }
              ].map((c, i) => (
                <Paper key={i} sx={{ p: 3, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff', display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'rgba(79, 70, 229, 0.1)', width: 48, height: 48 }}>
                    {c.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{c.text}</Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Grid>

        </Grid>

        {/* FAQ Accordion */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ borderRadius: 3, mb: 1.5, border: '1px solid #e2e8f0', '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;
