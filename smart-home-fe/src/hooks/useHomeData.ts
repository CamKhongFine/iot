/**
 * Home-Aware Data Fetching Hooks
 * 
 * Custom hooks for fetching data filtered by current home.
 * Automatically refetch when home changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { useHome } from '../context/HomeContext';
import { api } from '../api/client';
import type { RoomWithTelemetry, Alert, Device } from '../types';

/**
 * Hook to fetch rooms for current home
 */
export const useHomeRooms = () => {
    const { currentHomeId } = useHome();
    const [rooms, setRooms] = useState<RoomWithTelemetry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchRooms = useCallback(async () => {
        if (!currentHomeId) {
            setRooms([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            // TODO: Replace with actual API call filtered by homeId
            // const data = await api.getHomeRooms(currentHomeId);
            const data = await api.getRooms();
            setRooms(data);
        } catch (err) {
            setError(err as Error);
            console.error('Failed to fetch rooms:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentHomeId]);

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // Listen for home change events
    useEffect(() => {
        const handleHomeChange = () => {
            fetchRooms();
        };

        window.addEventListener('homeChanged', handleHomeChange);
        return () => window.removeEventListener('homeChanged', handleHomeChange);
    }, [fetchRooms]);

    return { rooms, isLoading, error, refetch: fetchRooms };
};

/**
 * Hook to fetch alerts for current home
 */
export const useHomeAlerts = () => {
    const { currentHomeId } = useHome();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchAlerts = useCallback(async () => {
        if (!currentHomeId) {
            setAlerts([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            // TODO: Replace with actual API call
            // const data = await api.getHomeAlerts(currentHomeId);

            // Mock alerts for now
            const mockAlerts: Alert[] = [
                {
                    id: '1',
                    homeId: currentHomeId,
                    type: 'fire',
                    severity: 'critical',
                    message: 'Fire detected in Kitchen',
                    roomId: 1,
                    roomName: 'Kitchen',
                    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
                    isActive: true,
                },
                {
                    id: '2',
                    homeId: currentHomeId,
                    type: 'temperature',
                    severity: 'warning',
                    message: 'High temperature in Living Room',
                    roomId: 2,
                    roomName: 'Living Room',
                    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
                    isActive: true,
                },
            ];

            setAlerts(mockAlerts.filter(a => a.homeId === currentHomeId));
        } catch (err) {
            setError(err as Error);
            console.error('Failed to fetch alerts:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentHomeId]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);

    // Listen for home change events
    useEffect(() => {
        const handleHomeChange = () => {
            fetchAlerts();
        };

        window.addEventListener('homeChanged', handleHomeChange);
        return () => window.removeEventListener('homeChanged', handleHomeChange);
    }, [fetchAlerts]);

    return { alerts, isLoading, error, refetch: fetchAlerts };
};

/**
 * Hook to fetch devices for current home
 */
export const useHomeDevices = () => {
    const { currentHomeId } = useHome();
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDevices = useCallback(async () => {
        if (!currentHomeId) {
            setDevices([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            // TODO: Replace with actual API call
            // const data = await api.getHomeDevices(currentHomeId);

            // For now, get devices from rooms
            const rooms = await api.getRooms();
            const deviceList = rooms
                .filter(room => room.device)
                .map(room => room.device!);

            setDevices(deviceList);
        } catch (err) {
            setError(err as Error);
            console.error('Failed to fetch devices:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentHomeId]);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    // Listen for home change events
    useEffect(() => {
        const handleHomeChange = () => {
            fetchDevices();
        };

        window.addEventListener('homeChanged', handleHomeChange);
        return () => window.removeEventListener('homeChanged', handleHomeChange);
    }, [fetchDevices]);

    return { devices, isLoading, error, refetch: fetchDevices };
};

/**
 * Generic hook for home-aware data fetching
 */
export const useHomeData = <T,>(
    fetchFn: (homeId: number) => Promise<T>,
    defaultValue: T
) => {
    const { currentHomeId } = useHome();
    const [data, setData] = useState<T>(defaultValue);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        if (!currentHomeId) {
            setData(defaultValue);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const result = await fetchFn(currentHomeId);
            setData(result);
        } catch (err) {
            setError(err as Error);
            console.error('Failed to fetch data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentHomeId, fetchFn, defaultValue]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Listen for home change events
    useEffect(() => {
        const handleHomeChange = () => {
            fetchData();
        };

        window.addEventListener('homeChanged', handleHomeChange);
        return () => window.removeEventListener('homeChanged', handleHomeChange);
    }, [fetchData]);

    return { data, isLoading, error, refetch: fetchData };
};
