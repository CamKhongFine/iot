/**
 * Sidebar Component
 * 
 * Responsive navigation sidebar for the Smart Home Dashboard.
 * Uses centralized navigation config with role-based filtering.
 */

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Box,
    Typography,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHome } from '../context/HomeContext';
import { getFilteredNavItems, ICON_MAP } from '../config/navigation';

const drawerWidth = 260;

interface SidebarProps {
    mobileOpen: boolean;
    onDrawerToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    mobileOpen,
    onDrawerToggle,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentHome } = useHome();

    const handleNavigation = (path: string) => {
        navigate(path);
        // Close mobile drawer after navigation
        if (mobileOpen) {
            onDrawerToggle();
        }
    };

    // Filter nav items based on user's role in current home
    const navItems = getFilteredNavItems(currentHome?.role);

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo/Brand */}
            <Toolbar sx={{ px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <HomeIcon color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
                        Smart Home
                    </Typography>
                </Box>
            </Toolbar>

            <Divider />

            {/* Navigation Items */}
            <List sx={{ flexGrow: 1, px: 1, py: 2 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                    const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];

                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: 1,
                                    '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: 'primary.contrastText',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: isActive ? 'inherit' : 'text.secondary',
                                        minWidth: 40,
                                    }}
                                >
                                    {IconComponent && <IconComponent />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Footer Info */}
            {currentHome && (
                <>
                    <Divider />
                    <Box sx={{ px: 2, py: 1.5, bgcolor: 'action.hover' }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Current Home
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {currentHome.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Role: {currentHome.role.charAt(0).toUpperCase() + currentHome.role.slice(1)}
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better mobile performance
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};
