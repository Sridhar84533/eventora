import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner = ({ message = 'Loading contents...' }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
    <CircularProgress size={48} thickness={4} color="primary" sx={{ mb: 2 }} />
    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
      {message}
    </Typography>
  </Box>
);

export const EmptyState = ({ title = 'No Data Found', description = 'There are no items to display at this moment.', icon, action }) => (
  <Box sx={{ textAlign: 'center', py: 8, px: 2, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid #f1f5f9' }}>
    <Box sx={{ fontSize: 64, color: 'text.disabled', mb: 1.5 }}>
      {icon || '📭'}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto', mb: 3 }}>
      {description}
    </Typography>
    {action}
  </Box>
);

export const ErrorState = ({ message = 'An unexpected error occurred.', onRetry }) => (
  <Box sx={{ textAlign: 'center', py: 6, px: 2, bgcolor: '#fff1f2', borderRadius: 4, border: '1px solid #fecdd3' }}>
    <Typography variant="h6" color="error" sx={{ fontWeight: 700, mb: 1 }}>
      Oops! Something went wrong
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      {message}
    </Typography>
    {onRetry && (
      <button onClick={onRetry} style={{ padding: '8px 16px', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
        Try Again
      </button>
    )}
  </Box>
);
