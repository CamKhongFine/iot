/**
 * Room Detail Page
 * 
 * Detailed view of a single room with:
 * - Telemetry charts (temperature, humidity)
 * - Sensor status
 * - Light control
 */

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Button,
    Card,
    CardContent,
    Stack,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/client';
import { LightSwitch } from '../components/LightSwitch';
import { SensorChip } from '../components/SensorChip';
import type { RoomWithTelemetry, TelemetryHistory } from '../types';

export const RoomDetail: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const [room, setRoom] = useState<RoomWithTelemetry | null>(null);
    const [temperatureHistory, setTemperatureHistory] = useState<TelemetryHistory[]>([]);
    const [humidityHistory, setHumidityHistory] = useState<TelemetryHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (roomId) {
            loadRoomData(parseInt(roomId));
        }
    }, [roomId]);

    const loadRoomData = async (id: number) => {
        try {
            // Load room data
            const rooms = await api.getRooms();
            const foundRoom = rooms.find((r) => r.id === id);
            setRoom(foundRoom || null);

            // Load telemetry history
            const tempHistory = await api.getTelemetryHistory(id, 'temperature');
            const humHistory = await api.getTelemetryHistory(id, 'humidity');

            setTemperatureHistory(tempHistory);
            setHumidityHistory(humHistory);
        } catch (error) {
            console.error('Failed to load room data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatChartData = (history: TelemetryHistory[]) => {
        return history.map((item) => ({
            time: new Date(item.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            value: item.value,
        }));
    };

    const formatTime = (timestamp?: string) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return date.toLocaleString();
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (!room) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Room not found</Typography>
                <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate('/dashboard')}
                    sx={{ mb: 2 }}
                >
                    Back to Dashboard
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {room.name}
                </Typography>
                {room.description && (
                    <Typography variant="body1" color="text.secondary">
                        {room.description}
                    </Typography>
                )}
            </Box>

            <Grid container spacing={3}>
                {/* Light Control */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Light Control
                        </Typography>
                        <LightSwitch
                            roomId={room.id}
                            initialState={room.telemetry?.light || 'off'}
                            size="large"
                        />
                    </Paper>
                </Grid>

                {/* Current Sensors */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Current Status
                        </Typography>
                        <Stack spacing={2}>
                            {room.telemetry?.temperature !== undefined && (
                                <Box>
                                    <SensorChip type="temperature" value={room.telemetry.temperature} size="medium" />
                                </Box>
                            )}
                            {room.telemetry?.humidity !== undefined && (
                                <Box>
                                    <SensorChip type="humidity" value={room.telemetry.humidity} size="medium" />
                                </Box>
                            )}
                            {room.telemetry?.motion !== undefined && (
                                <Box>
                                    <SensorChip type="motion" value={room.telemetry.motion} size="medium" />
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        Last: {formatTime(room.telemetry.lastMotionTime)}
                                    </Typography>
                                </Box>
                            )}
                            {room.telemetry?.door && (
                                <Box>
                                    <SensorChip type="door" value={room.telemetry.door} size="medium" />
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        Last opened: {formatTime(room.telemetry.lastDoorOpenTime)}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </Paper>
                </Grid>

                {/* Temperature Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Temperature (Last 24h)
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={formatChartData(temperatureHistory)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#4caf50" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Humidity Chart */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Humidity (Last 24h)
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={formatChartData(humidityHistory)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#2196f3" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
