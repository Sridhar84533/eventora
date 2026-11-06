import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Stack, Card, CardContent } from '@mui/material';
import { CheckCircle, ConfirmationNumber, Security, Speed, Groups, SupportAgent } from '@mui/icons-material';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f8fafc' }}>
      <Navbar />

      {/* Header Banner */}
      <Box sx={{ bgcolor: '#ffffff', py: 8, borderBottom: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="overline" color="primary.main" sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
            ABOUT EVENTORA
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Empowering Live Experiences Worldwide
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 750, fontWeight: 400, lineHeight: 1.6 }}>
            EVENTORA is built to revolutionize how organizers list, market, and manage live events while offering attendees a seamless, transparent ticketing experience.
          </Typography>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                To connect people through unforgettable real-world experiences. We empower event creators with state-of-the-art tools, real-time revenue analytics, and automated attendee workflows, enabling them to bring their visions to life effortlessly.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, height: '100%', borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'secondary.main' }}>
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                To be the world’s most trusted, accessible, and user-centric event ticketing platform. We envision a future where discovering and attending tech summits, concerts, and workshops is as effortless as a single tap.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ bgcolor: '#ffffff', py: 8, borderVertical: '1px solid #e2e8f0' }}>
        <Container maxWidth="xl">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 5, textAlign: 'center' }}>
            Why Choose EVENTORA?
          </Typography>

          <Grid container spacing={4}>
            {[
              { title: 'Verified Organizers & Venues', desc: 'Every organizer and auditorium is thoroughly vetted for authenticity, ensuring a safe booking experience.', icon: <Security fontSize="large" color="primary" /> },
              { title: 'Instant Digital Ticketing', desc: 'Receive instant digital reference passes directly to your dashboard with QR code entry capability.', icon: <Speed fontSize="large" color="primary" /> },
              { title: 'Transparent Pricing & Zero Hidden Fees', desc: 'What you see is what you pay. Full fee breakdown prior to final checkout with no last-second markups.', icon: <CheckCircle fontSize="large" color="primary" /> },
              { title: '24/7 Priority Support', desc: 'Our dedicated customer success team is available around the clock to handle inquiries and ticketing assistance.', icon: <SupportAgent fontSize="large" color="primary" /> }
            ].map((f, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ p: 3, height: '100%', borderRadius: 4, border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'rgba(79, 70, 229, 0.1)', color: 'primary.main', mx: 'auto', mb: 2 }}>
                    {f.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{f.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Leadership Team */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
          Meet Our Team
        </Typography>

        <Grid container spacing={4}>
          {[
            { name: 'Alex Rivera', role: 'Chief Executive Officer', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
            { name: 'Sophia Chen', role: 'Head of Event Operations', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
            { name: 'Marcus Vance', role: 'Chief Technology Officer', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' }
          ].map((t, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: '#ffffff' }}>
                <Avatar src={t.img} alt={t.name} sx={{ width: 90, height: 90, mx: 'auto', mb: 2, border: '3px solid #4f46e5' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{t.name}</Typography>
                <Typography variant="body2" color="text.secondary">{t.role}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default About;
