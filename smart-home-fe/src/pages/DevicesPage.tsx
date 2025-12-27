/**
 * Devices Page
 * 
 * Displays all devices across all homes and rooms.
 */

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Grid,
    Chip,
    IconButton,
} from '@mui/material';
import { Devices as DevicesIcon, PowerSettingsNew } from '@mui/icons-material';
import { api } from '../api/client';
import type { RoomWithTelemetry } from '../types';

export const DevicesPage: React.FC = () => {
    const [rooms, setRooms] = useState<RoomWithTelemetry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);
        } catch (error) {
            console.error('Failed to load devices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLightToggle = async (roomId: number, currentState: 'on' | 'off') => {
        const newState = currentState === 'on' ? 'off' : 'on';
        // Optimistic update
        setRooms(prevRooms =>
            prevRooms.map(room =>
                room.id === roomId && room.telemetry
                    ? {
                        ...room,
                        telemetry: {
                            ...room.telemetry,
                            light: newState,
                        },
                    }
                    : room
            )
        );
        // API call would go here
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DevicesIcon />
                    All Devices
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage all your smart home devices in one place
                </Typography>
            </Box>

            {isLoading ? (
                <Typography>Loading devices...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {rooms.map((room) => (
                        room.device && (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Box>
                                                <Typography variant="h6" gutterBottom>
                                                    {room.device.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {room.name}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={room.device.is_active ? 'Active' : 'Inactive'}
                                                color={room.device.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Type: {room.device.device_type}
                                            </Typography>
                                            {room.telemetry && (
                                                <IconButton
                                                    onClick={() => handleLightToggle(room.id, room.telemetry?.light || 'off')}
                                                    color={room.telemetry.light === 'on' ? 'primary' : 'default'}
                                                >
                                                    <PowerSettingsNew />
                                                </IconButton>
                                            )}
                                        </Box>

                                        {room.telemetry && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                                                <Typography variant="caption" color="text.secondary" display="block">
                                                    Status: {room.telemetry.light === 'on' ? 'ON' : 'OFF'}
                                                </Typography>
                                                {room.telemetry.temperature && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        Temperature: {room.telemetry.temperature}°C
                                                    </Typography>
                                                )}
                                                {room.telemetry.humidity && (
                                                    <Typography variant="caption" color="text.secondary" display="block">
                                                        Humidity: {room.telemetry.humidity}%
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    ))}
                </Grid>
            )}

            {rooms.length === 0 && !isLoading && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    No devices found. Add devices to get started.
                </Typography>
            )}
        </Container>
    );
};
