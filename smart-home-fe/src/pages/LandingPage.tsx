/**
 * Landing Page
 * 
 * Professional landing page for Smart Home application.
 * Features hero section, benefits, and call-to-action.
 */

import React from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    AppBar,
    Toolbar,
    Stack,
} from '@mui/material';
import {
    LightbulbOutlined,
    DeviceThermostatOutlined,
    SecurityOutlined,
    SpeedOutlined,
    SensorsOutlined,
    MobileFriendlyOutlined,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <LightbulbOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Smart Lighting',
            description: 'Control your lights from anywhere with instant on/off switching and scheduling.',
        },
        {
            icon: <DeviceThermostatOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Climate Control',
            description: 'Monitor temperature and humidity in real-time with historical data tracking.',
        },
        {
            icon: <SecurityOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Security Monitoring',
            description: 'Motion and door sensors keep your home secure with instant alerts.',
        },
        {
            icon: <SpeedOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Real-time Updates',
            description: 'Get instant notifications and live sensor data from all your devices.',
        },
        {
            icon: <SensorsOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'IoT Integration',
            description: 'Seamlessly integrates with ThingsBoard for powerful IoT management.',
        },
        {
            icon: <MobileFriendlyOutlined sx={{ fontSize: 48, color: 'primary.main' }} />,
            title: 'Mobile Friendly',
            description: 'Access your smart home from any device - desktop, tablet, or mobile.',
        },
    ];

    return (
        <Box>
            {/* Header */}
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <LightbulbOutlined sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Smart Home
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 12,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
                        Control Your Home
                        <br />
                        From Anywhere
                    </Typography>
                    <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                        Monitor sensors, control devices, and manage your smart home with ease
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'grey.100' },
                                px: 4,
                                py: 1.5,
                            }}
                            onClick={() => navigate('/auth?mode=signup')}
                        >
                            Get Started Free
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                                px: 4,
                                py: 1.5,
                            }}
                            onClick={() => navigate('/auth?mode=signin')}
                        >
                            Sign In
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Everything You Need
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
                    Powerful features to make your home smarter
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                        Ready to Get Started?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join thousands of users managing their smart homes with our platform
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            '&:hover': { bgcolor: 'grey.100' },
                            px: 6,
                            py: 2,
                            fontSize: '1.1rem',
                        }}
                        onClick={() => navigate('/auth?mode=signup')}
                    >
                        Create Your Account
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider', py: 4 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LightbulbOutlined sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Smart Home
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                The complete IoT platform for managing your smart home devices.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                                Quick Links
                            </Typography>

                            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Button
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                    onClick={() => navigate('/auth?mode=signin')}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    size="small"
                                    sx={{ textTransform: 'none' }}
                                    onClick={() => navigate('/auth?mode=signup')}
                                >
                                    Sign Up
                                </Button>
                            </Stack>
                        </Grid>

                    </Grid>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                        © 2025 Smart Home. All rights reserved.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};