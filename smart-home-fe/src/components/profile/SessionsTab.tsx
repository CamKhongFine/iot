/**
 * Active Sessions Tab
 * 
 * Displays list of active sessions with audit information.
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Computer as ComputerIcon,
    PhoneIphone as PhoneIcon,
    Language as WebIcon,
} from '@mui/icons-material';
import { ProfileService } from '../../services/ProfileService';
import { SessionInfo } from '../../types/profile';

export const SessionsTab: React.FC = () => {
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            setIsLoading(true);
            const data = await ProfileService.getSessions();
            setSessions(data);
        } catch (err) {
            setError('Failed to load active sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRevoke = async (id: string) => {
        try {
            await ProfileService.revokeSession(id);
            setSessions(prev => prev.filter(s => s.id !== id));
        } catch (err) {
            setError('Failed to revoke session');
        }
    };

    const getDeviceIcon = (device: string) => {
        const lower = device.toLowerCase();
        if (lower.includes('phone') || lower.includes('mobile')) return <PhoneIcon />;
        if (lower.includes('pc') || lower.includes('mac') || lower.includes('desktop')) return <ComputerIcon />;
        return <WebIcon />;
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Active Sessions
            </Typography>

            <Typography variant="body2" color="text.secondary" paragraph>
                Manage your active sessions across different devices and browsers.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Last Active</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ color: 'action.active' }}>
                                            {getDeviceIcon(session.device)}
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {session.device}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {session.browser} • {session.ipAddress}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {session.location || 'Unknown'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {new Date(session.lastActive).toLocaleString()}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {session.isCurrent ? (
                                        <Chip label="Current Session" color="success" size="small" variant="outlined" />
                                    ) : (
                                        <Chip label="Active" size="small" variant="outlined" />
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {!session.isCurrent && (
                                        <Tooltip title="Revoke Session">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRevoke(session.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {sessions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No active sessions found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
