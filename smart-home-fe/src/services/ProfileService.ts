/**
 * Profile Service
 * 
 * Mock implementation of profile management business logic.
 * Simulates API calls with delays.
 */

import { UserProfile, SessionInfo } from '../types/profile';
import { User } from '../types';

// Mock data
const MOCK_SESSIONS: SessionInfo[] = [
    {
        id: 'sess_1',
        device: 'Windows PC',
        browser: 'Chrome 120.0',
        ipAddress: '192.168.1.105',
        lastActive: new Date().toISOString(),
        isCurrent: true,
        location: 'San Francisco, US'
    },
    {
        id: 'sess_2',
        device: 'iPhone 13',
        browser: 'Safari',
        ipAddress: '203.0.113.12',
        lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isCurrent: false,
        location: 'New York, US'
    },
    {
        id: 'sess_3',
        device: 'MacBook Pro',
        browser: 'Firefox',
        ipAddress: '198.51.100.23',
        lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isCurrent: false,
        location: 'London, UK'
    }
];

export const ProfileService = {
    /**
     * Get extended user profile
     */
    getProfile: async (user: User): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

        return {
            ...user,
            phone: '+1 (555) 123-4567',
            isEmailVerified: true,
            twoFactorEnabled: false,
            lastUpdated: new Date().toISOString(),
        };
    },

    /**
     * Update user profile
     */
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network

        // In real app, this would return the updated user from backend
        return {
            id: 1, // Mock
            email: 'updated@example.com',
            username: 'updated_user',
            ...data,
        } as UserProfile;
    },

    /**
     * Change password
     */
    changePassword: async (current: string, newPass: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (current === 'wrong') {
            throw new Error('Incorrect current password');
        }
    },

    /**
     * Toggle 2FA
     */
    toggleTwoFactor: async (enabled: boolean): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return enabled;
    },

    /**
     * Get active sessions
     */
    getSessions: async (): Promise<SessionInfo[]> => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [...MOCK_SESSIONS];
    },

    /**
     * Revoke a session
     */
    revokeSession: async (sessionId: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
    },

    /**
     * Revoke all other sessions
     */
    revokeAllOtherSessions: async (): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
};
