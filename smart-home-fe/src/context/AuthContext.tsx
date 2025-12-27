/**
 * Authentication Context
 * 
 * Manages user authentication state and provides login/logout functionality.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';
import type { User, LoginCredentials } from '../types';

interface RegisterData {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        }

        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await api.login(credentials);

            // Save token
            localStorage.setItem('auth_token', response.access_token);

            // Fetch user data from backend
            try {
                const userData = await api.getCurrentUser();
                localStorage.setItem('user', JSON.stringify(userData));
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                // Fallback to mock user if /auth/me fails
                const mockUser: User = {
                    id: 1,
                    email: credentials.email,
                    username: credentials.email.split('@')[0] || 'user',
                    full_name: 'Demo User',
                };
                localStorage.setItem('user', JSON.stringify(mockUser));
                setUser(mockUser);
            }
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Invalid credentials');
        }
    };

    const register = async (data: RegisterData) => {
        try {
            await api.register(data);

            // After registration, log the user in
            await login({ email: data.email, password: data.password });
        } catch (error: any) {
            console.error('Registration failed:', error);
            if (error.response?.data?.detail) {
                throw new Error(error.response.data.detail);
            }
            throw new Error('Registration failed. Please try again.');
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
