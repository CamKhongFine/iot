/**
 * Profile Types
 * 
 * Type definitions for user profile management.
 */

import { User } from './index';

export interface UserProfile extends User {
    phone?: string;
    isEmailVerified: boolean;
    lastUpdated?: string;
    avatarUrl?: string; // Add avatar URL support
    twoFactorEnabled: boolean;
}

export interface SessionInfo {
    id: string;
    device: string;
    browser: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
    location?: string;
}

export interface SecurityStatus {
    passwordLastChanged?: string;
    twoFactorEnabled: boolean;
    activeSessions: number;
}
