/**
 * Alert Banner Component
 * 
 * Displays critical alerts at the top of the dashboard.
 */

import React from 'react';
import { Alert, AlertTitle, Stack } from '@mui/material';
import type { Alert as AlertType } from '../types';

interface AlertBannerProps {
    alerts: AlertType[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
    if (alerts.length === 0) return null;

    return (
        <Stack spacing={1} sx={{ mb: 3 }}>
            {alerts.map((alert) => (
                <Alert
                    key={alert.id}
                    severity={alert.severity}
                    sx={{
                        animation: alert.severity === 'critical' ? 'pulse 1s infinite' : 'none',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.8 },
                        },
                    }}
                >
                    <AlertTitle>{alert.type.toUpperCase()}</AlertTitle>
                    {alert.message} - {alert.roomName}
                </Alert>
            ))}
        </Stack>
    );
};
