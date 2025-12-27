import React, { useState } from 'react';
import {
    AppBar as MuiAppBar,
    Toolbar,
    IconButton,
    Typography,
    Avatar,
    Box,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4,
    Brightness7,
    Person as PersonIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HomeSwitcher } from '../home/HomeSwitcher';
import { AlertBadge } from '../alert/AlertBadge';
import { ROUTES } from '../../config/routes';

interface AppBarComponentProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    onMenuClick: () => void;
}

export const AppBarComponent: React.FC<AppBarComponentProps> = ({
    darkMode,
    onToggleDarkMode,
    onMenuClick,
}) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
        <MuiAppBar
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
                    onClick={onMenuClick}
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
        </MuiAppBar>
    );
};
