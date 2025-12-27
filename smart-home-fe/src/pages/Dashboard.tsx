/**
 * Dashboard Page
 * 
 * Main home dashboard showing all rooms as cards.
 * 
 * IoT UX:
 * - Glanceable: User sees all room statuses at a glance
 * - Grid layout for easy scanning
 * - Critical alerts at the top
 */

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Grid,
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Button,
} from '@mui/material';
import { Brightness4, Brightness7, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { RoomCard } from '../components/RoomCard';
import { AlertBanner } from '../components/AlertBanner';
import { HomeSummary } from '../components/HomeSummary';
import type { RoomWithTelemetry, Alert, HomeStats } from '../types';

interface DashboardProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ darkMode, onToggleDarkMode }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<RoomWithTelemetry[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await api.getRooms();
            setRooms(data);

            // Generate alerts from room data
            const newAlerts: Alert[] = [];
            data.forEach((room) => {
                if (room.telemetry?.fire) {
                    newAlerts.push({
                        id: `fire-${room.id}`,
                        type: 'fire',
                        message: 'Fire detected',
                        roomId: room.id,
                        roomName: room.name,
                        timestamp: new Date().toISOString(),
                        severity: 'critical',
                    });
                }
                if (room.telemetry?.temperature && room.telemetry.temperature > 28) {
                    newAlerts.push({
                        id: `temp-${room.id}`,
                        type: 'temperature',
                        message: 'High temperature detected',
                        roomId: room.id,
                        roomName: room.name,
                        timestamp: new Date().toISOString(),
                        severity: 'warning',
                    });
                }
                // Check for offline devices (no telemetry)
                if (!room.telemetry) {
                    newAlerts.push({
                        id: `offline-${room.id}`,
                        type: 'offline',
                        message: 'Device offline',
                        roomId: room.id,
                        roomName: room.name,
                        timestamp: new Date().toISOString(),
                        severity: 'warning',
                    });
                }
            });
            setAlerts(newAlerts);
        } catch (error) {
            console.error('Failed to load rooms:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLightChange = (roomId: number, newState: 'on' | 'off') => {
        // Update local state optimistically
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.id === roomId
                    ? {
                        ...room,
                        telemetry: {
                            ...room.telemetry!,
                            light: newState,
                        },
                    }
                    : room
            )
        );
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Calculate home statistics
    const homeStats: HomeStats = {
        totalRooms: rooms.length,
        onlineDevices: rooms.filter(r => r.telemetry).length,
        offlineDevices: rooms.filter(r => !r.telemetry).length,
        safetyStatus: alerts.some(a => a.type === 'fire')
            ? 'critical'
            : alerts.length > 0
                ? 'warning'
                : 'safe',
        activeAlerts: alerts.length,
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* App Bar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Smart Home Dashboard
                    </Typography>

                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {user?.full_name || user?.email}
                    </Typography>

                    <IconButton color="inherit" onClick={onToggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>

                    <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {/* Home Summary */}
                {!isLoading && <HomeSummary stats={homeStats} />}

                {/* Alerts */}
                <AlertBanner alerts={alerts} />

                {/* Page Title */}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    My Rooms
                </Typography>

                {/* Rooms Grid */}
                {isLoading ? (
                    <Typography>Loading rooms...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {rooms.map((room) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
                                <RoomCard room={room} onLightChange={handleLightChange} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {rooms.length === 0 && !isLoading && (
                    <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        No rooms found. Add rooms to get started.
                    </Typography>
                )}
            </Container>
        </Box>
    );
};
