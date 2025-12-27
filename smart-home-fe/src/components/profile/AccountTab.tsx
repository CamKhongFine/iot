/**
 * Account Management Tab
 * 
 * Handles user identity: Avatar, Name, Email, Phone.
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    Avatar,
    Typography,
    Alert,
    CircularProgress,
    Badge,
    InputAdornment,
    Snackbar,
} from '@mui/material';
import {
    PhotoCamera as CameraIcon,
    Save as SaveIcon,
    Verified as VerifiedIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Person as PersonIcon,
    Badge as BadgeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { ProfileService } from '../../services/ProfileService';
import { UserProfile } from '../../types/profile';

export const AccountTab: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        phone: '',
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            setIsLoading(true);
            const data = await ProfileService.getProfile(user);
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                username: data.username || '',
                phone: data.phone || '',
            });
            setHasChanges(false);
        } catch (err) {
            setError('Failed to load profile data');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setFormData(prev => {
            const updated = { ...prev, [field]: newValue };
            // Check for changes (simplified)
            setHasChanges(true);
            return updated;
        });
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);

            await ProfileService.updateProfile(formData);

            setSuccessMessage('Profile updated successfully');
            setHasChanges(false);

            // Reload to ensure sync
            await loadProfile();
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box component="form" noValidate autoComplete="off">
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Personal Information
            </Typography>

            <Grid container spacing={4}>
                {/* Avatar Section */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <Button
                                variant="contained"
                                component="label"
                                size="small"
                                sx={{
                                    minWidth: 'auto',
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    p: 0
                                }}
                            >
                                <CameraIcon fontSize="small" />
                                <input hidden accept="image/*" type="file" />
                            </Button>
                        }
                    >
                        <Avatar
                            sx={{ width: 128, height: 128, fontSize: '3rem', bgcolor: 'primary.main' }}
                            src={profile?.avatarUrl}
                        >
                            {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                        </Avatar>
                    </Badge>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br />
                        Max size of 3.1 MB
                    </Typography>
                </Grid>

                {/* Form Section */}
                <Grid item xs={12} md={8}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={formData.full_name}
                                onChange={handleChange('full_name')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Username"
                                value={formData.username}
                                onChange={handleChange('username')}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BadgeIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                value={profile?.email}
                                disabled // Email is typically immutable or requires distinct flow
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: profile?.isEmailVerified && (
                                        <InputAdornment position="end">
                                            <VerifiedIcon color="success" fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                helperText={profile?.isEmailVerified ? "Email verified" : "Email not verified"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                value={formData.phone}
                                onChange={handleChange('phone')}
                                placeholder="+1 (555) 000-0000"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PhoneIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            onClick={handleSave}
                            disabled={!hasChanges || isSaving}
                        >
                            Save Changes
                        </Button>
                        {hasChanges && (
                            <Button variant="text" onClick={loadProfile} disabled={isSaving}>
                                Cancel
                            </Button>
                        )}
                        {profile?.lastUpdated && (
                            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
                            </Typography>
                        )}
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Grid>
            </Grid>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};
