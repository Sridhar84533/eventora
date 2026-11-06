import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#4f46e5', // Deep Indigo
      light: '#6366f1',
      dark: '#4338ca',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0284c7', // Sky Blue
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: ['Inter', 'Outfit', 'sans-serif'].join(','),
    h1: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 800,
      color: '#0f172a',
    },
    h2: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 700,
      color: '#0f172a',
    },
    h3: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 700,
      color: '#0f172a',
    },
    h4: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 700,
      color: '#0f172a',
    },
    h5: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 600,
      color: '#0f172a',
    },
    h6: {
      fontFamily: 'Outfit, sans-serif',
      fontWeight: 600,
      color: '#0f172a',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338ca 0%, #2563eb 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
          border: '1px solid #f1f5f9',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
