/**
 * Profile Page
 * 
 * User profile page with account information, settings, and logout.
 * This page is NOT affected by home switching.
 */

import React from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Avatar,
} from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getUserInitial = () => {
        if (user?.full_name) return user.full_name.charAt(0).toUpperCase();
        if (user?.username) return user.username.charAt(0).toUpperCase();
        return 'U';
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="large" />
                    Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings and preferences
                </Typography>
            </Box>

            {/* Profile Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <Avatar
                            sx={{
                                width: 80,
                                height: 80,
                                bgcolor: 'primary.main',
                                fontSize: '2rem',
                            }}
                        >
                            {getUserInitial()}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {user?.full_name || user?.username || 'User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Account Information
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Username"
                                secondary={user?.username || 'N/A'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Email"
                                secondary={user?.email || 'N/A'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Full Name"
                                secondary={user?.full_name || 'Not set'}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="User ID"
                                secondary={user?.id || 'N/A'}
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            {/* Settings Card */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Manage your preferences and account settings
                    </Typography>
                    <Button variant="outlined" fullWidth disabled>
                        Edit Profile (Coming Soon)
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }} disabled>
                        Change Password (Coming Soon)
                    </Button>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }} disabled>
                        Notification Settings (Coming Soon)
                    </Button>
                </CardContent>
            </Card>

            {/* Logout Card */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Account Actions
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};
