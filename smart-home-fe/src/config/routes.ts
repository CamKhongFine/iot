/**
 * Centralized Route Configuration
 * 
 * Defines all application routes in one place for easy maintenance.
 */

export const ROUTES = {
    // Public routes
    LANDING: '/',
    LOGIN: '/login',
    AUTH: '/auth',

    // Protected routes
    DASHBOARD: '/dashboard',
    HOMES: '/homes',
    HOME_DETAIL: '/homes/:homeId',
    ROOMS: '/rooms',
    ROOM_DETAIL: '/rooms/:roomId',
    DEVICES: '/devices',
    DEVICE_DETAIL: '/devices/:deviceId',
    AUTOMATION: '/automation',
    ALERTS: '/alerts',
    PROFILE: '/profile',
    SETTINGS: '/settings',
} as const;

// Helper function to generate route with params
export const generateRoute = {
    homeDetail: (homeId: number) => `/homes/${homeId}`,
    roomDetail: (roomId: number) => `/rooms/${roomId}`,
    deviceDetail: (deviceId: number) => `/devices/${deviceId}`,
};
