/**
 * Automation Page
 * 
 * Manage automation scenes and rules for the current home.
 * Tabs for Scenes and Rules.
 */

import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Card,
    CardContent,
    Button,
} from '@mui/material';
import { AutoMode as AutomationIcon, Add as AddIcon } from '@mui/icons-material';
import { useHome } from '../context/HomeContext';
import { canViewAutomation } from '../utils/roleUtils';

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

export const AutomationPage: React.FC = () => {
    const { currentHome } = useHome();
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (!currentHome) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h6" color="text.secondary">
                    Please select a home to view automation
                </Typography>
            </Container>
        );
    }

    if (!canViewAutomation(currentHome.role)) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" color="error">
                            Access Denied
                        </Typography>
                        <Typography color="text.secondary">
                            You don't have permission to view automation for this home.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutomationIcon />
                        Automation for {currentHome.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create and manage automation scenes and rules
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />} disabled>
                    Create New
                </Button>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Scenes" />
                    <Tab label="Rules" />
                </Tabs>
            </Box>

            {/* Scenes Tab */}
            <TabPanel value={tabValue} index={0}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Scenes
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Scenes allow you to control multiple devices with a single action.
                        </Typography>
                        <Typography color="text.secondary">
                            No scenes created yet. Click "Create New" to get started.
                        </Typography>
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Rules Tab */}
            <TabPanel value={tabValue} index={1}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Automation Rules
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Rules automatically trigger actions based on conditions like motion, temperature, or time.
                        </Typography>
                        <Typography color="text.secondary">
                            No rules created yet. Click "Create New" to get started.
                        </Typography>
                    </CardContent>
                </Card>
            </TabPanel>
        </Container>
    );
};
