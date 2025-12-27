/**
 * Home Summary Component
 * 
 * Displays global home statistics at a glance.
 * Shows total rooms, device status, safety status, and active alerts.
 */

import React from 'react';
import { Box, Card, CardContent, Typography, Stack, Grid } from '@mui/material';
import {
    Home as HomeIcon,
    Devices as DevicesIcon,
    Shield as ShieldIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import type { HomeStats } from '../types';

interface HomeSummaryProps {
    stats: HomeStats;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: string;
    bgColor?: string;
    pulse?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, bgColor, pulse }) => {
    return (
        <Card
            sx={{
                height: '100%',
                background: bgColor || 'background.paper',
                animation: pulse ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                    '50%': { opacity: 0.9, transform: 'scale(1.02)' },
                },
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            color: color || 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {label}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: color || 'text.primary',
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export const HomeSummary: React.FC<HomeSummaryProps> = ({ stats }) => {
    // Determine safety status display
    const getSafetyDisplay = () => {
        switch (stats.safetyStatus) {
            case 'critical':
                return {
                    label: '🔥 FIRE ALERT',
                    color: '#fff',
                    bgColor: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)',
                    pulse: true,
                };
            case 'warning':
                return {
                    label: '⚠️ WARNING',
                    color: '#fff',
                    bgColor: 'linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)',
                    pulse: false,
                };
            default:
                return {
                    label: '✓ SAFE',
                    color: '#fff',
                    bgColor: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
                    pulse: false,
                };
        }
    };

    const safetyDisplay = getSafetyDisplay();

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Home Overview
            </Typography>

            <Grid container spacing={2}>
                {/* Total Rooms */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<HomeIcon sx={{ fontSize: 40 }} />}
                        label="Total Rooms"
                        value={stats.totalRooms}
                        color="primary.main"
                    />
                </Grid>

                {/* Devices Status */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<DevicesIcon sx={{ fontSize: 40 }} />}
                        label="Devices Online"
                        value={`${stats.onlineDevices}/${stats.onlineDevices + stats.offlineDevices}`}
                        color={stats.offlineDevices > 0 ? 'warning.main' : 'success.main'}
                    />
                </Grid>

                {/* Safety Status */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card
                        sx={{
                            height: '100%',
                            background: safetyDisplay.bgColor,
                            animation: safetyDisplay.pulse ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                                '50%': { opacity: 0.9, transform: 'scale(1.02)' },
                            },
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ color: safetyDisplay.color, display: 'flex' }}>
                                    <ShieldIcon sx={{ fontSize: 40 }} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: safetyDisplay.color, opacity: 0.9 }}
                                        gutterBottom
                                    >
                                        Safety Status
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            color: safetyDisplay.color,
                                        }}
                                    >
                                        {safetyDisplay.label}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Active Alerts */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                        icon={<WarningIcon sx={{ fontSize: 40 }} />}
                        label="Active Alerts"
                        value={stats.activeAlerts}
                        color={stats.activeAlerts > 0 ? 'error.main' : 'text.secondary'}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
