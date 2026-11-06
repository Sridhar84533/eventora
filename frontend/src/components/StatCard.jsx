import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Stack } from '@mui/material';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  return (
    <Card
      sx={{
        p: 2.5,
        bgcolor: '#ffffff',
        border: '1px solid #f1f5f9',
        borderRadius: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        height: '100%'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Avatar
          sx={{
            width: 52,
            height: 52,
            bgcolor: `${color}.main`,
            color: '#ffffff',
            borderRadius: 3.5,
            boxShadow: `0 4px 14px rgba(79, 70, 229, 0.2)`
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </Card>
  );
};

export default StatCard;
