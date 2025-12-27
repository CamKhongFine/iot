/**
 * Rooms Page
 * 
 * Display all rooms for the current home with room details.
 * Home-aware page that updates when home is switched.
 */

import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
} from '@mui/material';
import { MeetingRoom as RoomIcon } from '@mui/icons-material';
import { useHomeRooms } from '../hooks/useHomeData';
import { useHome } from '../context/HomeContext';
import { RoomCard } from '../components/RoomCard';

export const RoomsPage: React.FC = () => {
    const { currentHome } = useHome();
    const { rooms, isLoading } = useHomeRooms();

    const handleLightChange = async (roomId: number, newState: 'on' | 'off') => {
        // TODO: Implement light control
        console.log(`Toggle light for room ${roomId} to ${newState}`);
    };

    if (!currentHome) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Please select a home to view rooms
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <RoomIcon />
                    Rooms in {currentHome.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and control all rooms in your home
                </Typography>
            </Box>

            {isLoading ? (
                <Typography>Loading rooms...</Typography>
            ) : rooms.length === 0 ? (
                <Typography color="text.secondary">
                    No rooms found in this home
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {rooms.map((room) => (
                        <Grid item xs={12} sm={6} md={4} key={room.id}>
                            <RoomCard
                                room={room}
                                onLightChange={handleLightChange}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};
