/**
 * Profile Page
 * 
 * Container component for enterprise profile management.
 * Manages tabs and layout, delegates content to specific tab components.
 */

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    Tabs,
    Tab,
    Button,
} from '@mui/material';
import {
    Person as PersonIcon,
    Security as SecurityIcon,
    FactCheck as SessionsIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AccountTab } from '../components/profile/AccountTab';
import { SecurityTab } from '../components/profile/SecurityTab';
import { SessionsTab } from '../components/profile/SessionsTab';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: 3, px: 1 }}>{children}</Box>}
        </div>
    );
}

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [tabValue, setTabValue] = useState(0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    My Profile
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your account settings and preferences
                </Typography>
            </Box>

            {/* Content Tabs */}
            <Card sx={{ minHeight: 600 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <Tab icon={<PersonIcon />} iconPosition="start" label="Account" />
                        <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" />
                        <Tab icon={<SessionsIcon />} iconPosition="start" label="Sessions" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <AccountTab />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <SecurityTab />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                    <SessionsTab />
                </TabPanel>
            </Card>
        </Container>
    );
};
