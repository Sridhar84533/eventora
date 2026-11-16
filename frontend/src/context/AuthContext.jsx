import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// ─── Inactivity timeout: 5 minutes (300 000 ms) ──────────────────────────────
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;
const LAST_ACTIVE_KEY = 'eventora_last_active';
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eventora_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('eventora_token') || null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  // ── Core logout (also used by inactivity) ──────────────────────────────────
  const logout = useCallback((reason = '') => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eventora_token');
    localStorage.removeItem('eventora_user');
    localStorage.removeItem(LAST_ACTIVE_KEY);
    // Signal all other open tabs to log out too
    if (reason === 'timeout') {
      localStorage.setItem('eventora_logout_event', Date.now().toString());
    }
  }, []);

  // ── Reset the inactivity countdown ────────────────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    // Record last-active timestamp so other tabs can read it
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());

    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    inactivityTimerRef.current = setTimeout(() => {
      // Only fire timeout if user is still logged in
      if (localStorage.getItem('eventora_token')) {
        logout('timeout');
        // Navigate to login with a reason flag.
        // We use window.location so it works even outside Router context.
        window.location.href = '/login?reason=timeout';
      }
    }, INACTIVITY_TIMEOUT_MS);
  }, [logout]);

  // ── Start/stop inactivity tracking based on auth state ───────────────────
  useEffect(() => {
    if (!token) {
      // Logged out — clear timer and listeners
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
      return;
    }

    // Attach activity listeners and start the timer
    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, resetInactivityTimer, { passive: true })
    );
    resetInactivityTimer(); // start the first countdown

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, resetInactivityTimer));
    };
  }, [token, resetInactivityTimer]);

  // ── Cross-tab logout sync via localStorage storage event ─────────────────
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'eventora_logout_event') {
        // Another tab triggered a timeout logout — mirror it here
        setUser(null);
        setToken(null);
        localStorage.removeItem('eventora_token');
        localStorage.removeItem('eventora_user');
        localStorage.removeItem(LAST_ACTIVE_KEY);
        window.location.href = '/login?reason=timeout';
      }
      if (e.key === 'eventora_token' && !e.newValue) {
        // Token was removed in another tab (manual logout)
        setUser(null);
        setToken(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // ── On mount: check if inactivity already expired (e.g. page refresh) ────
  useEffect(() => {
    if (!token) return;
    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      const elapsed = Date.now() - parseInt(lastActive, 10);
      if (elapsed >= INACTIVITY_TIMEOUT_MS) {
        logout('timeout');
        window.location.href = '/login?reason=timeout';
        return;
      }
    }
  }, []); // runs once on mount

  // ── Verify token on app startup ───────────────────────────────────────────
  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('eventora_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Failed to verify token on app startup:', err.message);
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('eventora_token', res.data.token);
      localStorage.setItem('eventora_user', JSON.stringify(res.data.user));
      // Stamp activity so the timeout starts fresh after login
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
      // Clear any stale cross-tab logout signal
      localStorage.removeItem('eventora_logout_event');
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    // Registration does NOT log the user in — no token/session is stored here.
    // The user must navigate to Login and authenticate manually.
    return res.data;
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('eventora_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
