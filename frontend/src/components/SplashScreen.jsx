import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, LinearProgress, Grid, Paper, Chip, Avatar, AvatarGroup } from '@mui/material';
import {
  ConfirmationNumber,
  EventNote,
  PeopleAlt,
  TrendingUp,
  MarkEmailRead,
  ArrowForward,
  PlayCircleOutline,
  CheckCircle,
  CalendarMonth,
  LocationOn
} from '@mui/icons-material';

const SplashScreen = ({ onFinish, duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Eventora Platform...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const intervalTime = 30;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const t1 = setTimeout(() => setStatusText('Loading Event Catalogs & Venues...'), duration * 0.35);
    const t2 = setTimeout(() => setStatusText('Preparing Real-Time Booking Engine...'), duration * 0.7);
    const t3 = setTimeout(() => setStatusText('Platform Ready!'), duration * 0.92);

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 400);

    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };

  const featureCards = [
    {
      icon: <EventNote sx={{ color: '#2563eb', fontSize: 28 }} />,
      title: 'Seamless Scheduling',
      desc: 'Drag-and-drop itinerary builders with conflict resolution and automated timeline adjustments.'
    },
    {
      icon: <PeopleAlt sx={{ color: '#2563eb', fontSize: 28 }} />,
      title: 'Attendee Management',
      desc: 'Comprehensive CRM tools tailored for events. Track RSVPs, tickets, and VIP status.'
    },
    {
      icon: <TrendingUp sx={{ color: '#2563eb', fontSize: 28 }} />,
      title: 'Real-Time Analytics',
      desc: 'Monitor ticket sales, check-ins, and engagement metrics through a live dashboard.'
    },
    {
      icon: <MarkEmailRead sx={{ color: '#2563eb', fontSize: 28 }} />,
      title: 'Integrated Communication',
      desc: 'Automated email workflows, push notifications, and dedicated attendee portals in one place.'
    }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f8fafc',
        backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        color: '#0f172a',
        overflowY: 'auto',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        opacity: fadeOut ? 0 : 1,
        transform: fadeOut ? 'scale(1.02)' : 'scale(1)',
        pointerEvents: fadeOut ? 'none' : 'all',
        userSelect: 'none',
      }}
    >
      {/* Top Header Bar */}
      <Box
        sx={{
          py: 2.5,
          px: { xs: 3, md: 6 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <ConfirmationNumber sx={{ fontSize: 22 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>
            EVENT<Box component="span" sx={{ color: '#2563eb' }}>ORA</Box>
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleEnter}
          endIcon={<ArrowForward />}
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1,
            fontWeight: 700,
            bgcolor: '#2563eb',
            '&:hover': { bgcolor: '#1d4ed8' },
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}
        >
          Explore Platform
        </Button>
      </Box>

      {/* Main Hero Container */}
      <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 }, pb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Hero Typography & Actions */}
          <Grid item xs={12} md={6}>
            <Chip
              label="ENGINEERED FOR EXCELLENCE"
              size="small"
              sx={{
                bgcolor: 'rgba(37, 99, 235, 0.1)',
                color: '#2563eb',
                fontWeight: 800,
                fontSize: '0.75rem',
                letterSpacing: 1,
                mb: 2.5,
                px: 1,
                py: 0.5
              }}
            />

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.5rem', sm: '3.6rem', md: '4.2rem' },
                lineHeight: 1.1,
                letterSpacing: '-1px',
                color: '#0f172a',
                mb: 2.5
              }}
            >
              Manage Events <br />
              <Box component="span" sx={{ color: '#2563eb' }}>
                Like a Pro
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#475569',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.6,
                mb: 4,
                maxWidth: 520
              }}
            >
              The all-in-one platform for planning, tracking, and executing flawless events.
              From corporate summits to music festivals, Eventora delivers a premium, robust experience for every detail.
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 5 }}>
              <Button
                variant="contained"
                onClick={handleEnter}
                size="large"
                sx={{
                  bgcolor: '#2563eb',
                  color: '#ffffff',
                  px: 4,
                  py: 1.6,
                  borderRadius: 3,
                  fontWeight: 800,
                  fontSize: '1rem',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)'
                }}
              >
                Start Planning
              </Button>

              <Button
                variant="outlined"
                onClick={handleEnter}
                size="large"
                startIcon={<PlayCircleOutline />}
                sx={{
                  borderColor: '#cbd5e1',
                  color: '#1e293b',
                  px: 3.5,
                  py: 1.6,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: '#ffffff',
                  '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' }
                }}
              >
                Watch Demo
              </Button>
            </Box>

            {/* Loading Progress Section */}
            <Box sx={{ maxWidth: 460 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                  {statusText}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563eb' }}>
                  {Math.round(progress)}%
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: '#2563eb'
                  }
                }}
              />
            </Box>
          </Grid>

          {/* Right Column: 3D Platform Dashboard Mockup Card */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 5,
                bgcolor: '#ffffff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Card Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #f1f5f9' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981' }} />
                </Box>
                <Chip label="APRIL 2026 SCHEDULE" size="small" sx={{ bgcolor: '#f1f5f9', fontWeight: 800, fontSize: '0.65rem' }} />
              </Box>

              {/* Sample Dashboard Graphic Elements */}
              <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: 4, border: '1px solid #e2e8f0', mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                      Featured Event
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>
                      Global Tech & AI Summit
                    </Typography>
                  </Box>
                  <Chip icon={<CheckCircle sx={{ fontSize: '14px !important' }} />} label="Confirmed" color="success" size="small" sx={{ fontWeight: 800 }} />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: '#ffffff', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" color="text.secondary">Attendees Registered</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#2563eb' }}>2,840 / 3,000</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ bgcolor: '#ffffff', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                      <Typography variant="caption" color="text.secondary">Total Revenue</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#10b981' }}>$849,160</Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 32, height: 32, fontSize: '0.8rem' } }}>
                    <Avatar alt="Alex" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" />
                    <Avatar alt="Sarah" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
                    <Avatar alt="John" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" />
                    <Avatar alt="Emma" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" />
                  </AvatarGroup>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                    +2,836 Attendees Joined
                  </Typography>
                </Box>
              </Box>

              {/* Schedule Timeline Preview */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1, bgcolor: '#eff6ff', p: 1.5, borderRadius: 2.5, border: '1px solid #bfdbfe' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#1d4ed8', display: 'block' }}>09:00 AM</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e3a8a' }}>Keynote Presentation</Typography>
                </Box>
                <Box sx={{ flex: 1, bgcolor: '#f0fdf4', p: 1.5, borderRadius: 2.5, border: '1px solid #bbf7d0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#15803d', display: 'block' }}>11:30 AM</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#14532d' }}>Tech Networking</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Feature Cards Section (Engineered for Excellence) */}
        <Box sx={{ mt: { xs: 6, md: 8 } }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#64748b', letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Engineered for Excellence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Powerful tools designed to reduce cognitive load and streamline complex logistics.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {featureCards.map((item, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px -6px rgba(0,0,0,0.06)',
                      borderColor: '#cbd5e1'
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, fontSize: '0.875rem' }}>
                    {item.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer Bar */}
      <Box
        sx={{
          py: 2,
          px: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          gap: 1
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a' }}>
          EVENT<Box component="span" sx={{ color: '#2563eb' }}>ORA</Box>
        </Typography>

        <Typography variant="caption" color="text.secondary">
          © 2026 Eventora Management Systems. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default SplashScreen;
