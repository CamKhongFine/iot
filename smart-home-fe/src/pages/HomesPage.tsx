/**
 * Homes Page
 * 
 * Manage all homes with tabs for Overview, Rooms, Members, and Settings.
 * Allows switching to different homes and viewing home details.
 */

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    CardActions,
    Button,
    Grid,
    Chip,
    Tabs,
    Tab,
} from '@mui/material';
import { Home as HomeIcon, People, Settings, MeetingRoom } from '@mui/icons-material';
import { useHome } from '../context/HomeContext';
import { useNavigate } from 'react-router-dom';
import { getRoleColor, canManageHome } from '../utils/roleUtils';

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

export const HomesPage: React.FC = () => {
    const { homes, currentHomeId, switchHome } = useHome();
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSwitchHome = (homeId: number) => {
        switchHome(homeId);
    };

    const getHomeTypeIcon = (type: string) => {
        return <HomeIcon />;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon />
                    My Homes
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your homes and switch between them
                </Typography>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Overview" />
                    <Tab label="Rooms" />
                    <Tab label="Members" />
                    <Tab label="Settings" />
                </Tabs>
            </Box>

            {/* Overview Tab */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                    {homes.map((home) => (
                        <Grid item xs={12} sm={6} md={4} key={home.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: currentHomeId === home.id ? 2 : 0,
                                    borderColor: 'primary.main',
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {getHomeTypeIcon(home.type)}
                                            <Typography variant="h6">
                                                {home.name}
                                            </Typography>
                                        </Box>
                                        {currentHomeId === home.id && (
                                            <Chip label="Active" color="primary" size="small" />
                                        )}
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {home.description || 'No description'}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Type: {home.type}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Address: {home.address || 'Not set'}
                                        </Typography>
                                        <Chip
                                            label={home.role}
                                            color={getRoleColor(home.role)}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    {currentHomeId !== home.id && (
                                        <Button size="small" onClick={() => handleSwitchHome(home.id)}>
                                            Switch to this home
                                        </Button>
                                    )}
                                    {canManageHome(home.role) && (
                                        <Button size="small" color="error" disabled>
                                            Delete
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </TabPanel>

            {/* Rooms Tab */}
            <TabPanel value={tabValue} index={1}>
                <Typography variant="body1" color="text.secondary">
                    Room management coming soon...
                </Typography>
            </TabPanel>

            {/* Members Tab */}
            <TabPanel value={tabValue} index={2}>
                <Typography variant="body1" color="text.secondary">
                    Member management coming soon...
                </Typography>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={3}>
                <Typography variant="body1" color="text.secondary">
                    Home settings coming soon...
                </Typography>
            </TabPanel>
        </Container>
    );
};
