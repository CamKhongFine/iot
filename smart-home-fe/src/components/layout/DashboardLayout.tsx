/**
 * Dashboard Layout
 * 
 * Persistent layout wrapper for all authenticated pages.
 * Keeps header and sidebar visible during navigation.
 */

import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon, Avatar, Divider } from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4,
    Brightness7,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../Sidebar';
import { HomeSwitcher } from '../home/HomeSwitcher';
import { AlertBadge } from '../alert/AlertBadge';
import { ROUTES } from '../../config/routes';

interface DashboardLayoutProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ darkMode, onToggleDarkMode }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate(ROUTES.PROFILE);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        navigate('/');
    };

    const getUserInitial = () => {
        if (user?.full_name) return user.full_name.charAt(0).toUpperCase();
        if (user?.username) return user.username.charAt(0).toUpperCase();
        return 'U';
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    {/* Mobile Menu Toggle */}
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* App Title (Mobile) */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: { xs: 1, sm: 0 },
                            mr: { sm: 3 },
                            color: 'text.primary',
                            display: { xs: 'block', sm: 'none' },
                        }}
                    >
                        Smart Home
                    </Typography>

                    {/* Home Switcher (Desktop) */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, mr: 2 }}>
                        <HomeSwitcher />
                    </Box>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Alert Badge */}
                    <AlertBadge />

                    {/* Theme Toggle - Black in light mode */}
                    <IconButton
                        onClick={onToggleDarkMode}
                        sx={{
                            ml: 1,
                            color: darkMode ? 'inherit' : '#000',
                        }}
                    >
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    {/* Profile Avatar with Dropdown */}
                    <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {getUserInitial()}
                        </Avatar>
                    </IconButton>

                    {/* User Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: { minWidth: 200 },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user?.full_name || user?.username || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={handleProfile}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Profile
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>

                {/* Home Switcher (Mobile - Below AppBar) */}
                <Box
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        px: 2,
                        pb: 1,
                        bgcolor: 'background.paper',
                    }}
                >
                    <HomeSwitcher />
                </Box>
            </AppBar>

            {/* Sidebar */}
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - 260px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                {/* Toolbar spacer for fixed AppBar */}
                <Box sx={{ height: { xs: 120, sm: 64 } }} />

                {/* Page Content - Rendered by React Router */}
                <Outlet />
            </Box>
        </Box>
    );
};
