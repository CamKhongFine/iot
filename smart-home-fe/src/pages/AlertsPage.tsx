/**
 * Alerts Page
 * 
 * View and manage alerts for the current home.
 * Tabs for Active, History, and Settings.
 */

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    Card,
    CardContent,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    LocalFireDepartment as FireIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
} from '@mui/icons-material';
import { useHomeAlerts } from '../hooks/useHomeData';
import { useHome } from '../context/HomeContext';

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

export const AlertsPage: React.FC = () => {
    const { currentHome } = useHome();
    const { alerts, isLoading } = useHomeAlerts();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const getAlertIcon = (type: string, severity: string) => {
        if (type === 'fire') return <FireIcon color="error" />;
        if (severity === 'critical') return <WarningIcon color="error" />;
        if (severity === 'warning') return <WarningIcon color="warning" />;
        return <InfoIcon color="info" />;
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diffMs = now.getTime() - then.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    if (!currentHome) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Please select a home to view alerts
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon />
                    Alerts for {currentHome.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Monitor and manage your home alerts
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={`Active (${alerts.length})`} />
                    <Tab label="History" />
                    <Tab label="Settings" />
                </Tabs>
            </Box>

            {/* Active Alerts Tab */}
            <TabPanel value={tabValue} index={0}>
                {isLoading ? (
                    <Typography>Loading alerts...</Typography>
                ) : alerts.length === 0 ? (
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" align="center">
                                No active alerts
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <List>
                        {alerts.map((alert) => (
                            <Card key={alert.id} sx={{ mb: 2 }}>
                                <ListItem
                                    sx={{
                                        borderLeft: 4,
                                        borderColor: alert.severity === 'critical' ? 'error.main' : alert.severity === 'warning' ? 'warning.main' : 'info.main',
                                    }}
                                >
                                    <ListItemIcon>
                                        {getAlertIcon(alert.type, alert.severity)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={alert.message}
                                        secondary={`${alert.roomName} • ${getTimeAgo(alert.timestamp)}`}
                                    />
                                    <Chip
                                        label={alert.severity}
                                        color={alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'}
                                        size="small"
                                    />
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                )}
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={tabValue} index={1}>
                <Typography variant="body1" color="text.secondary">
                    Alert history coming soon...
                </Typography>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={2}>
                <Typography variant="body1" color="text.secondary">
                    Alert settings coming soon...
                </Typography>
            </TabPanel>
        </Container>
    );
};
