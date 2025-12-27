/**
 * Navigation Configuration
 * 
 * Defines navigation menu items with role-based access control.
 */

import {
    Dashboard as DashboardIcon,
    Home as HomeIcon,
    MeetingRoom as RoomIcon,
    Devices as DevicesIcon,
    AutoMode as AutomationIcon,
    Notifications as AlertsIcon,
} from '@mui/icons-material';
import { ROUTES } from './routes';
import type { NavItem } from '../types';

export const NAV_ITEMS: NavItem[] = [
    {
        text: 'Dashboard',
        path: ROUTES.DASHBOARD,
        icon: 'Dashboard',
    },
    {
        text: 'Homes',
        path: ROUTES.HOMES,
        icon: 'Home',
    },
    {
        text: 'Rooms',
        path: ROUTES.ROOMS,
        icon: 'MeetingRoom',
    },
    {
        text: 'Devices',
        path: ROUTES.DEVICES,
        icon: 'Devices',
    },
    {
        text: 'Automation',
        path: ROUTES.AUTOMATION,
        icon: 'AutoMode',
        requiresRole: ['owner', 'admin', 'member'], // Hidden for guests
    },
    {
        text: 'Alerts',
        path: ROUTES.ALERTS,
        icon: 'Notifications',
    },
];

// Icon mapping for dynamic rendering
export const ICON_MAP = {
    Dashboard: DashboardIcon,
    Home: HomeIcon,
    MeetingRoom: RoomIcon,
    Devices: DevicesIcon,
    AutoMode: AutomationIcon,
    Notifications: AlertsIcon,
};

// Helper function to filter nav items based on user role
export const getFilteredNavItems = (userRole?: 'owner' | 'admin' | 'member' | 'guest'): NavItem[] => {
    if (!userRole) return NAV_ITEMS;

    return NAV_ITEMS.filter(item => {
        if (!item.requiresRole) return true;
        return item.requiresRole.includes(userRole);
    });
};
