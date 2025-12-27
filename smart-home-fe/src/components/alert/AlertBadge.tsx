/**
 * Alert Badge Component
 * 
 * Displays notification icon with badge count for active alerts.
 * Filters alerts by current home.
 */

import React, { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography, Box, Divider, ListItemIcon } from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useHome } from '../../context/HomeContext';
import type { Alert } from '../../types';
import { ROUTES } from '../../config/routes';

export const AlertBadge: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isLightMode = theme.palette.mode === 'light';
    const { currentHomeId } = useHome();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        if (currentHomeId) {
            loadAlerts();
        }
    }, [currentHomeId]);

    const loadAlerts = () => {
        // TODO: Replace with actual API call
        // const data = await api.getAlerts(currentHomeId);

        // Mock alerts for current home
        const mockAlerts: Alert[] = [
            {
                id: '1',
                homeId: currentHomeId || 1,
                type: 'fire',
                severity: 'critical',
                message: 'Fire detected in Kitchen',
                roomId: 1,
                roomName: 'Kitchen',
                timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
                isActive: true,
            },
            {
                id: '2',
                homeId: currentHomeId || 1,
                type: 'temperature',
                severity: 'warning',
                message: 'High temperature in Living Room',
                roomId: 2,
                roomName: 'Living Room',
                timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                isActive: true,
            },
            {
                id: '3',
                homeId: currentHomeId || 1,
                type: 'motion',
                severity: 'info',
                message: 'Motion detected in Garage',
                roomId: 3,
                roomName: 'Garage',
                timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
                isActive: true,
            },
        ];

        setAlerts(mockAlerts.filter(a => a.homeId === currentHomeId && a.isActive));
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAlertClick = (alert: Alert) => {
        handleClose();
        navigate(ROUTES.ALERTS);
    };

    const handleViewAll = () => {
        handleClose();
        navigate(ROUTES.ALERTS);
    };

    const getAlertIcon = (type: string, severity: string) => {
        if (type === 'fire') return <FireIcon fontSize="small" color="error" />;
        if (severity === 'critical') return <WarningIcon fontSize="small" color="error" />;
        if (severity === 'warning') return <WarningIcon fontSize="small" color="warning" />;
        return <InfoIcon fontSize="small" color="info" />;
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    const criticalCount = alerts.filter(a => a.severity === 'critical').length;

    return (
        <>
            <IconButton
                onClick={handleClick}
                sx={{
                    color: isLightMode ? '#000' : 'inherit'
                }}
            >
                <Badge badgeContent={alerts.length} color={criticalCount > 0 ? 'error' : 'primary'}>
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400 },
                }}
            >
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {alerts.length} active alert{alerts.length !== 1 ? 's' : ''}
                    </Typography>
                </Box>
                <Divider />
                {alerts.length === 0 ? (
                    <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No active alerts
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {alerts.slice(0, 5).map((alert) => (
                            <MenuItem
                                key={alert.id}
                                onClick={() => handleAlertClick(alert)}
                                sx={{
                                    py: 1.5,
                                    borderLeft: 3,
                                    borderColor: alert.severity === 'critical' ? 'error.main' : alert.severity === 'warning' ? 'warning.main' : 'info.main',
                                }}
                            >
                                <ListItemIcon>
                                    {getAlertIcon(alert.type, alert.severity)}
                                </ListItemIcon>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {alert.message}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {alert.roomName} • {getTimeAgo(alert.timestamp)}
                                    </Typography>
                                </Box>
                            </MenuItem>
                        ))}
                        {alerts.length > 5 && (
                            <>
                                <Divider />
                                <MenuItem onClick={handleViewAll} sx={{ justifyContent: 'center' }}>
                                    <Typography variant="body2" color="primary">
                                        View all {alerts.length} alerts
                                    </Typography>
                                </MenuItem>
                            </>
                        )}
                    </>
                )}
            </Menu>
        </>
    );
};
