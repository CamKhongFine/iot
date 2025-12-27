/**
 * Device Card Component
 * 
 * Reusable card component for displaying device information.
 * Shows device status, controls, and telemetry data.
 */

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    IconButton,
    LinearProgress,
} from '@mui/material';
import {
    PowerSettingsNew,
    Sensors as SensorsIcon,
    DeviceThermostat,
    WaterDrop,
    WarningAmber,
} from '@mui/icons-material';
import type { Device, TelemetryData } from '../../types';

interface DeviceCardProps {
    device: Device;
    telemetry?: TelemetryData;
    roomName?: string;
    onToggle?: (deviceId: number, currentState: 'on' | 'off') => void;
    onClick?: (deviceId: number) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
    device,
    telemetry,
    roomName,
    onToggle,
    onClick,
}) => {
    const handleCardClick = () => {
        if (onClick) {
            onClick(device.id);
        }
    };

    const handleToggleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onToggle && telemetry?.light) {
            onToggle(device.id, telemetry.light);
        }
    };

    const getDeviceIcon = () => {
        switch (device.device_type) {
            case 'sensor':
                return <SensorsIcon />;
            case 'light':
                return <PowerSettingsNew />;
            default:
                return <SensorsIcon />;
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                '&:hover': onClick ? {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                } : {},
            }}
            onClick={handleCardClick}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getDeviceIcon()}
                        <Box>
                            <Typography variant="h6" component="div">
                                {device.name}
                            </Typography>
                            {roomName && (
                                <Typography variant="caption" color="text.secondary">
                                    {roomName}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Chip
                        label={device.is_active ? 'Online' : 'Offline'}
                        color={device.is_active ? 'success' : 'default'}
                        size="small"
                    />
                </Box>

                {/* Device Type */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Type: {device.device_type}
                </Typography>

                {/* Telemetry Data */}
                {telemetry && (
                    <Box sx={{ mt: 2 }}>
                        {/* Temperature */}
                        {telemetry.temperature !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <DeviceThermostat fontSize="small" color="action" />
                                <Typography variant="body2">
                                    {telemetry.temperature}°C
                                </Typography>
                                {telemetry.temperature > 30 && (
                                    <WarningAmber fontSize="small" color="warning" />
                                )}
                            </Box>
                        )}

                        {/* Humidity */}
                        {telemetry.humidity !== undefined && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <WaterDrop fontSize="small" color="action" />
                                <Typography variant="body2">
                                    {telemetry.humidity}%
                                </Typography>
                            </Box>
                        )}

                        {/* Light Status */}
                        {telemetry.light && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Status: {telemetry.light === 'on' ? 'ON' : 'OFF'}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={telemetry.light === 'on' ? 100 : 0}
                                    sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                                />
                            </Box>
                        )}

                        {/* Motion */}
                        {telemetry.motion !== undefined && (
                            <Chip
                                label={telemetry.motion ? 'Motion Detected' : 'No Motion'}
                                size="small"
                                color={telemetry.motion ? 'warning' : 'default'}
                                sx={{ mt: 1 }}
                            />
                        )}

                        {/* Door */}
                        {telemetry.door && (
                            <Chip
                                label={telemetry.door === 'open' ? 'Door Open' : 'Door Closed'}
                                size="small"
                                color={telemetry.door === 'open' ? 'warning' : 'success'}
                                sx={{ mt: 1, ml: 1 }}
                            />
                        )}

                        {/* Fire Alert */}
                        {telemetry.fire && (
                            <Chip
                                label="FIRE ALERT"
                                size="small"
                                color="error"
                                sx={{ mt: 1, ml: 1, animation: 'pulse 1.5s infinite' }}
                            />
                        )}
                    </Box>
                )}
            </CardContent>

            {/* Actions */}
            {onToggle && telemetry?.light && (
                <CardActions>
                    <IconButton
                        onClick={handleToggleClick}
                        color={telemetry.light === 'on' ? 'primary' : 'default'}
                        sx={{ ml: 'auto' }}
                    >
                        <PowerSettingsNew />
                    </IconButton>
                </CardActions>
            )}
        </Card>
    );
};
