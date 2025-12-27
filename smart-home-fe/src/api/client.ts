/**
 * API Client with mock data for development
 * 
 * This client provides mock responses for all API endpoints.
 * Replace with actual API calls when backend is ready.
 */

import axios from 'axios';
import type {
    LoginCredentials,
    AuthResponse,
    Home,
    RoomWithTelemetry,
    TelemetryData,
    TelemetryHistory,
    User,
} from '../types';

interface RegisterData {
    email: string;
    username: string;
    password: string;
    full_name?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Mock data flag - set to false when using real backend
const USE_MOCK_DATA = false;

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Mock data
const mockRooms: RoomWithTelemetry[] = [
    {
        id: 1,
        name: 'Living Room',
        description: 'Main living area',
        home_id: 1,
        telemetry: {
            temperature: 23.5,
            humidity: 45,
            motion: false,
            door: 'closed',
            light: 'on',
            fire: false,
            lastMotionTime: new Date(Date.now() - 300000).toISOString(),
            lastDoorOpenTime: new Date(Date.now() - 7200000).toISOString(),
        },
    },
    {
        id: 2,
        name: 'Bedroom',
        description: 'Master bedroom',
        home_id: 1,
        telemetry: {
            temperature: 21.2,
            humidity: 50,
            motion: true,
            door: 'closed',
            light: 'off',
            fire: false,
            lastMotionTime: new Date(Date.now() - 60000).toISOString(),
            lastDoorOpenTime: new Date(Date.now() - 3600000).toISOString(),
        },
    },
    {
        id: 3,
        name: 'Kitchen',
        description: 'Cooking area',
        home_id: 1,
        telemetry: {
            temperature: 25.8,
            humidity: 55,
            motion: false,
            door: 'open',
            light: 'on',
            fire: false,
            lastMotionTime: new Date(Date.now() - 600000).toISOString(),
            lastDoorOpenTime: new Date(Date.now() - 120000).toISOString(),
        },
    },
    {
        id: 4,
        name: 'Bathroom',
        description: 'Main bathroom',
        home_id: 1,
        telemetry: {
            temperature: 22.0,
            humidity: 65,
            motion: false,
            door: 'closed',
            light: 'off',
            fire: false,
            lastMotionTime: new Date(Date.now() - 1800000).toISOString(),
            lastDoorOpenTime: new Date(Date.now() - 1800000).toISOString(),
        },
    },
];

// Generate mock telemetry history (last 24 hours)
const generateMockHistory = (baseValue: number, variance: number): TelemetryHistory[] => {
    const history: TelemetryHistory[] = [];
    const now = Date.now();
    const hoursAgo = 24;

    for (let i = hoursAgo; i >= 0; i--) {
        const timestamp = now - (i * 3600000); // 1 hour intervals
        const value = baseValue + (Math.random() - 0.5) * variance;
        history.push({ timestamp, value: Math.round(value * 10) / 10 });
    }

    return history;
};

export const api = {
    // Authentication
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        if (USE_MOCK_DATA) {
            // Mock login - accept any credentials
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
                access_token: 'mock_token_' + Date.now(),
                token_type: 'bearer',
            };
        }

        // FastAPI uses OAuth2PasswordRequestForm which expects form data
        const formData = new URLSearchParams();
        formData.append('username', credentials.email); // OAuth2 uses 'username' field
        formData.append('password', credentials.password);

        const response = await apiClient.post('/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    },

    // Get current user
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    // Register new user
    register: async (data: RegisterData): Promise<User> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    // Homes
    getHomes: async (): Promise<Home[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return [
                {
                    id: 1,
                    name: 'My Home',
                    description: 'Family house',
                    address: '123 Main St',
                    owner_id: 1,
                },
            ];
        }

        const response = await apiClient.get('/homes');
        return response.data;
    },

    // Rooms
    getRooms: async (): Promise<RoomWithTelemetry[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return mockRooms;
        }

        const response = await apiClient.get('/rooms');
        return response.data;
    },

    // Telemetry
    getCurrentTelemetry: async (roomId: number): Promise<TelemetryData> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            const room = mockRooms.find(r => r.id === roomId);
            return room?.telemetry || {};
        }

        const response = await apiClient.get(`/rooms/${roomId}/telemetry/current`);
        return response.data;
    },

    getTelemetryHistory: async (
        roomId: number,
        metric: 'temperature' | 'humidity'
    ): Promise<TelemetryHistory[]> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const room = mockRooms.find(r => r.id === roomId);
            const baseValue = metric === 'temperature'
                ? (room?.telemetry?.temperature || 22)
                : (room?.telemetry?.humidity || 50);
            const variance = metric === 'temperature' ? 3 : 10;

            return generateMockHistory(baseValue, variance);
        }

        const response = await apiClient.get(`/rooms/${roomId}/telemetry/history`, {
            params: { metric },
        });
        return response.data;
    },

    // Light control
    turnLightOn: async (roomId: number): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            // Update mock data
            const room = mockRooms.find(r => r.id === roomId);
            if (room && room.telemetry) {
                room.telemetry.light = 'on';
            }
            return;
        }

        await apiClient.post(`/rooms/${roomId}/light/on`);
    },

    turnLightOff: async (roomId: number): Promise<void> => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 200));
            // Update mock data
            const room = mockRooms.find(r => r.id === roomId);
            if (room && room.telemetry) {
                room.telemetry.light = 'off';
            }
            return;
        }

        await apiClient.post(`/rooms/${roomId}/light/off`);
    },
};
