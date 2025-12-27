/**
 * Device Detail Page
 * 
 * Detailed view of a single device with tabs for Overview, Control, History, and Automation.
 * Validates that device belongs to current home.
 */

import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Tabs,
    Tab,
    Chip,
    Button,
    LinearProgress,
} from '@mui/material';
import { Devices as DevicesIcon, PowerSettingsNew } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useHome } from '../context/HomeContext';
import { useHomeDevices } from '../hooks/useHomeData';
import type { Device, TelemetryData } from '../types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

export const DeviceDetailPage: React.FC = () => {
    const { deviceId } = useParams<{ deviceId: string }>();
    const navigate = useNavigate();
    const { currentHome } = useHome();
    const { devices, isLoading } = useHomeDevices();
    const [tabValue, setTabValue] = useState(0);
    const [device, setDevice] = useState<Device | null>(null);
    const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);

    useEffect(() => {
        if (!isLoading && deviceId) {
            const foundDevice = devices.find(d => d.id === parseInt(deviceId));
            if (foundDevice) {
                setDevice(foundDevice);
                // TODO: Fetch telemetry for this device
                setTelemetry({
                    temperature: 22,
                    humidity: 45,
                    light: 'on',
                });
            } else {
                setDevice(null);
            }
        }
    }, [devices, deviceId, isLoading]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleToggleLight = () => {
        if (telemetry) {
            setTelemetry({
                ...telemetry,
                light: telemetry.light === 'on' ? 'off' : 'on',
            });
        }
    };

    if (!currentHome) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Please select a home to view device details
                </Typography>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography>Loading device...</Typography>
            </Container>
        );
    }

    if (!device) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="error">
                            Device Not Found
                        </Typography>
                        <Typography color="text.secondary" paragraph>
                            This device does not exist or does not belong to the current home.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/devices')}>
                            Back to Devices
                        </Button>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DevicesIcon fontSize="large" />
                            {device.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {device.device_type} in {currentHome.name}
                        </Typography>
                    </Box>
                    <Chip
                        label={device.is_active ? 'Online' : 'Offline'}
                        color={device.is_active ? 'success' : 'default'}
                    />
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Control" />
                    <Tab label="History" />
                    <Tab label="Automation" />
                </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Device Information
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Device ID: {device.device_id}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Type: {device.device_type}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Status: {device.is_active ? 'Active' : 'Inactive'}
                            </Typography>
                        </Box>

                        {telemetry && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Current Telemetry
                                </Typography>
                                {telemetry.temperature !== undefined && (
                                    <Typography variant="body2">
                                        Temperature: {telemetry.temperature}°C
                                    </Typography>
                                )}
                                {telemetry.humidity !== undefined && (
                                    <Typography variant="body2">
                                        Humidity: {telemetry.humidity}%
                                    </Typography>
                                )}
                                {telemetry.light && (
                                    <Typography variant="body2">
                                        Light: {telemetry.light.toUpperCase()}
                                    </Typography>
                                )}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Control Tab */}
            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Device Control
                        </Typography>
                        {telemetry?.light ? (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" gutterBottom>
                                    Light Control
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<PowerSettingsNew />}
                                        onClick={handleToggleLight}
                                        color={telemetry.light === 'on' ? 'primary' : 'inherit'}
                                    >
                                        {telemetry.light === 'on' ? 'Turn Off' : 'Turn On'}
                                    </Button>
                                    <Chip
                                        label={telemetry.light === 'on' ? 'ON' : 'OFF'}
                                        color={telemetry.light === 'on' ? 'success' : 'default'}
                                    />
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={telemetry.light === 'on' ? 100 : 0}
                                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        ) : (
                            <Typography color="text.secondary">
                                No controls available for this device
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={2}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Device History
                        </Typography>
                        <Typography color="text.secondary">
                            Historical data coming soon...
                        </Typography>
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Automation Tab */}
            <TabPanel value={tabValue} index={3}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Device Automation
                        </Typography>
                        <Typography color="text.secondary">
                            Automation rules for this device coming soon...
                        </Typography>
                    </CardContent>
                </Card>
            </TabPanel>
        </Container>
    );
};
