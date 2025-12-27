/**
 * Unified Auth Page
 * 
 * Combined login and signup interface with toggle switch.
 * Features attractive gradient background and smooth transitions.
 */

import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Tabs,
    Tab,
    Stack,
} from '@mui/material';
import { LightbulbOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
};

export const AuthPage: React.FC = () => {
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get initial tab from URL parameter (mode=signup or mode=signin)
    const initialTab = searchParams.get('mode') === 'signup' ? 1 : 0;
    const [tabValue, setTabValue] = useState(initialTab);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update tab when URL changes
    useEffect(() => {
        const mode = searchParams.get('mode');
        setTabValue(mode === 'signup' ? 1 : 0);
    }, [searchParams]);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    });

    // Signup form state
    const [signupData, setSignupData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        fullName: '',
    });

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setError('');
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(loginData);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const validateSignup = (): boolean => {
        if (!signupData.email || !signupData.username || !signupData.password) {
            setError('Please fill in all required fields');
            return false;
        }

        if (signupData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return false;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (signupData.username.length < 3) {
            setError('Username must be at least 3 characters');
            return false;
        }

        return true;
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateSignup()) {
            return;
        }

        setIsLoading(true);

        try {
            await register({
                email: signupData.email,
                username: signupData.username,
                password: signupData.password,
                full_name: signupData.fullName || undefined,
            });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }}
                >
                    {/* Logo/Title */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <LightbulbOutlined sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                            Smart Home
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {tabValue === 0 ? 'Sign in to your account' : 'Create a new account'}
                        </Typography>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            mb: 2,
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                fontSize: '1rem',
                            },
                        }}
                    >
                        <Tab label="Sign In" />
                        <Tab label="Sign Up" />
                    </Tabs>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Login Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <form onSubmit={handleLoginSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    required
                                    autoFocus
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    required
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{ mt: 2, py: 1.5 }}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </Button>
                            </Stack>
                        </form>
                    </TabPanel>

                    {/* Signup Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <form onSubmit={handleSignupSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={signupData.email}
                                    onChange={handleSignupChange}
                                    required
                                />

                                <TextField
                                    fullWidth
                                    label="Username"
                                    name="username"
                                    value={signupData.username}
                                    onChange={handleSignupChange}
                                    required
                                    helperText="At least 6 characters"
                                />

                                <TextField
                                    fullWidth
                                    label="Full Name (Optional)"
                                    name="fullName"
                                    value={signupData.fullName}
                                    onChange={handleSignupChange}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    required
                                    helperText="At least 8 characters"
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={signupData.confirmPassword}
                                    onChange={handleSignupChange}
                                    required
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={isLoading}
                                    sx={{ mt: 2, py: 1.5 }}
                                >
                                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                                </Button>
                            </Stack>
                        </form>
                    </TabPanel>
                </Paper>
            </Container>
        </Box>
    );
};
