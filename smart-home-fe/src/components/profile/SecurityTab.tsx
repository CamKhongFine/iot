/**
 * Security Management Tab
 * 
 * Handles password changes, 2FA settings, and session revocation.
 */

import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Typography,
    Alert,
    CircularProgress,
    Card,
    CardContent,
    Switch,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    LinearProgress,
} from '@mui/material';
import {
    Security as SecurityIcon,
    Key as KeyIcon,
    LockReset as LockResetIcon,
    PhonelinkLock as TwoFactorIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { ProfileService } from '../../services/ProfileService';

export const SecurityTab: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Password Form State
    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    // 2FA State
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handlePasswordChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const submitPasswordChange = async () => {
        if (passwordForm.new !== passwordForm.confirm) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        try {
            setIsLoading(true);
            setMessage(null);
            await ProfileService.changePassword(passwordForm.current, passwordForm.new);
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswordForm({ current: '', new: '', confirm: '' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to change password' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTwoFactor = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const newState = event.target.checked;
            await ProfileService.toggleTwoFactor(newState);
            setTwoFactorEnabled(newState);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update 2FA settings' });
        }
    };

    const handleRevokeAllSessions = async () => {
        try {
            setIsLoading(true);
            await ProfileService.revokeAllOtherSessions();
            setLogoutDialogOpen(false);
            setMessage({ type: 'success', text: 'All other sessions have been logged out' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to revoke sessions' });
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate password strength (simple mock)
    const getPasswordStrength = (pwd: string) => {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length > 8) score += 25;
        if (/[A-Z]/.test(pwd)) score += 25;
        if (/[0-9]/.test(pwd)) score += 25;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 25;
        return score;
    };

    const passwordStrength = getPasswordStrength(passwordForm.new);

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Login & Security
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Change Password */}
                <Grid item xs={12} md={7}>
                    <Card variant="outlined">
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <KeyIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Change Password</Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Current Password"
                                        value={passwordForm.current}
                                        onChange={handlePasswordChange('current')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="New Password"
                                        value={passwordForm.new}
                                        onChange={handlePasswordChange('new')}
                                    />
                                    {passwordForm.new && (
                                        <Box sx={{ mt: 1 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={passwordStrength}
                                                color={passwordStrength > 50 ? 'success' : passwordStrength > 25 ? 'warning' : 'error'}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                Password Strength: {passwordStrength}%
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirm New Password"
                                        value={passwordForm.confirm}
                                        onChange={handlePasswordChange('confirm')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="outlined"
                                        startIcon={isLoading ? <CircularProgress size={20} /> : <LockResetIcon />}
                                        onClick={submitPasswordChange}
                                        disabled={isLoading || !passwordForm.current || !passwordForm.new}
                                    >
                                        Update Password
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2FA & Sessions */}
                <Grid item xs={12} md={5}>
                    <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TwoFactorIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Two-Factor Auth</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Add an extra layer of security to your account by enabling 2FA.
                            </Typography>
                            <FormControlLabel
                                control={<Switch checked={twoFactorEnabled} onChange={toggleTwoFactor} />}
                                label={twoFactorEnabled ? "Enabled" : "Disabled"}
                            />
                        </CardContent>
                    </Card>

                    <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SecurityIcon color="error" sx={{ mr: 1 }} />
                                <Typography variant="h6" color="error">Session Control</Typography>
                            </Box>
                            <Typography variant="body2" paragraph>
                                If you suspect unauthorized access, you can log out all other sessions.
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                fullWidth
                                startIcon={<LogoutIcon />}
                                onClick={() => setLogoutDialogOpen(true)}
                            >
                                Logout All Other Sessions
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogTitle>Revoke all sessions?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will log you out of all other devices and browsers. You will need to log in again on those devices.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRevokeAllSessions} color="error" autoFocus>
                        Revoke All
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
