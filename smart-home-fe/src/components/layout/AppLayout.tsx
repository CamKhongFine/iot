/**
 * App Layout Component
 * 
 * Main layout wrapper combining AppBar and Drawer.
 * Provides consistent layout for all authenticated pages.
 */

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AppBarComponent } from './AppBarComponent';
import { DrawerComponent } from './DrawerComponent';

interface AppLayoutProps {
    children: React.ReactNode;
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
    children,
    darkMode,
    onToggleDarkMode,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBarComponent
                darkMode={darkMode}
                onToggleDarkMode={onToggleDarkMode}
                onMenuClick={handleDrawerToggle}
            />

            {/* Drawer */}
            <DrawerComponent
                mobileOpen={mobileOpen}
                onDrawerToggle={handleDrawerToggle}
            />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - 260px)` },
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                {/* Toolbar spacer for fixed AppBar */}
                <Box sx={{ height: { xs: 120, sm: 64 } }} />

                {/* Page Content */}
                {children}
            </Box>
        </Box>
    );
};
