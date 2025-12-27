/**
 * Alert Banner Component
 * 
 * Displays critical alerts at the top of the dashboard.
 * Enhanced with timestamps, navigation, and visual hierarchy.
 */

import React from 'react';
import { Alert, AlertTitle, Stack, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Alert as AlertType } from '../types';

interface AlertBannerProps {
    alerts: AlertType[];
    maxDisplay?: number;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, maxDisplay = 5 }) => {
    const navigate = useNavigate();

    if (alerts.length === 0) return null;

    // Sort alerts by severity (critical first)
    const sortedAlerts = [...alerts].sort((a, b) => {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    // Limit displayed alerts
    const displayedAlerts = sortedAlerts.slice(0, maxDisplay);
    const hasMore = alerts.length > maxDisplay;

    // Format relative time
    const getRelativeTime = (timestamp: string): string => {
        const now = new Date();
        const alertTime = new Date(timestamp);
        const diffMs = now.getTime() - alertTime.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return alertTime.toLocaleDateString();
    };

    // Get alert icon
    const getAlertIcon = (type: string): string => {
        switch (type) {
            case 'fire':
                return '🔥';
            case 'temperature':
                return '🌡️';
            case 'offline':
                return '📡';
            default:
                return '⚠️';
        }
    };

    return (
        <Stack spacing={1.5} sx={{ mb: 3 }}>
            {displayedAlerts.map((alert) => (
                <Alert
                    key={alert.id}
                    severity={alert.severity === 'critical' ? 'error' : alert.severity}
                    sx={{
                        animation: alert.severity === 'critical' ? 'pulse 1.5s infinite' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'translateX(4px)',
                            boxShadow: 2,
                        },
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.85 },
                        },
                    }}
                    onClick={() => navigate(`/room/${alert.roomId}`)}
                >
                    <AlertTitle sx={{ fontWeight: 700, mb: 0.5 }}>
                        {getAlertIcon(alert.type)} {alert.type.toUpperCase()}
                    </AlertTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">
                            {alert.message} - <strong>{alert.roomName}</strong>
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 2, opacity: 0.7, whiteSpace: 'nowrap' }}>
                            {getRelativeTime(alert.timestamp)}
                        </Typography>
                    </Box>
                </Alert>
            ))}

            {hasMore && (
                <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        +{alerts.length - maxDisplay} more alert{alerts.length - maxDisplay > 1 ? 's' : ''}
                    </Typography>
                </Box>
            )}
        </Stack>
    );
};
