/**
 * Room Card Component
 * 
 * Displays room status with all sensors and light control.
 * 
 * IoT UX Hierarchy:
 * 1. Light control (PRIMARY - most prominent)
 * 2. Fire alert (CRITICAL - if active)
 * 3. Temperature & Humidity (CONTEXT)
 * 4. Motion & Door (SECONDARY CONTEXT)
 */

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Stack,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LightSwitch } from './LightSwitch';
import { SensorChip } from './SensorChip';
import type { RoomWithTelemetry } from '../types';

interface RoomCardProps {
    room: RoomWithTelemetry;
    onLightChange?: (roomId: number, newState: 'on' | 'off') => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onLightChange }) => {
    const navigate = useNavigate();
    const { telemetry } = room;

    const handleCardClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on the light switch
        if ((e.target as HTMLElement).closest('.light-switch-container')) {
            return;
        }
        navigate(`/room/${room.id}`);
    };

    return (
        <Card
            sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
            }}
            onClick={handleCardClick}
        >
            <CardContent>
                {/* Room Name */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {room.name}
                </Typography>

                {/* Fire Alert - CRITICAL */}
                {telemetry?.fire && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            🔥 FIRE DETECTED!
                        </Typography>
                    </Alert>
                )}

                {/* Light Control - PRIMARY ACTION */}
                <Box className="light-switch-container" sx={{ mb: 2 }}>
                    <LightSwitch
                        roomId={room.id}
                        initialState={telemetry?.light || 'off'}
                        onStateChange={(newState) => onLightChange?.(room.id, newState)}
                        size="large"
                    />
                </Box>

                {/* Temperature & Humidity - MAIN CONTEXT */}
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                    {telemetry?.temperature !== undefined && (
                        <SensorChip type="temperature" value={telemetry.temperature} size="medium" />
                    )}
                    {telemetry?.humidity !== undefined && (
                        <SensorChip type="humidity" value={telemetry.humidity} size="medium" />
                    )}
                </Stack>

                {/* Motion & Door - SECONDARY CONTEXT */}
                <Stack direction="row" spacing={1}>
                    {telemetry?.motion !== undefined && (
                        <SensorChip type="motion" value={telemetry.motion} />
                    )}
                    {telemetry?.door && (
                        <SensorChip type="door" value={telemetry.door} />
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};
