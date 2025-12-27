/**
 * Main App Component
 * 
 * Sets up routing, theme, authentication, and home context.
 */

import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomeProvider } from './context/HomeContext';
import { createAppTheme } from './theme/theme';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { RoomDetail } from './pages/RoomDetail';
import { ProfilePage } from './pages/ProfilePage';
import { HomesPage } from './pages/HomesPage';
import { RoomsPage } from './pages/RoomsPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { AutomationPage } from './pages/AutomationPage';
import { AlertsPage } from './pages/AlertsPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ROUTES } from './config/routes';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// App Content (needs to be inside AuthProvider and HomeProvider)
const AppContent: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const theme = useMemo(() => createAppTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.AUTH} replace />} />
          <Route path="/signup" element={<Navigate to={ROUTES.AUTH} replace />} />

          {/* Protected Routes with Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.HOMES} element={<HomesPage />} />
            <Route path={ROUTES.ROOMS} element={<RoomsPage />} />
            <Route path={ROUTES.ROOM_DETAIL} element={<RoomDetail />} />
            <Route path={ROUTES.DEVICES} element={<DevicesPage />} />
            <Route path={ROUTES.DEVICE_DETAIL} element={<DeviceDetailPage />} />
            <Route path={ROUTES.AUTOMATION} element={<AutomationPage />} />
            <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <HomeProvider>
        <AppContent />
      </HomeProvider>
    </AuthProvider>
  );
}

export default App;
