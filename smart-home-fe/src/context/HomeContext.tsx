/**
 * Home Context
 * 
 * Global context for managing multiple homes, current home selection,
 * and home switching functionality.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';
import type { Home } from '../types';

interface HomeContextType {
    homes: Home[];
    currentHomeId: number | null;
    currentHome: Home | null;
    isLoading: boolean;
    switchHome: (homeId: number) => void;
    refreshHomes: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

const CURRENT_HOME_KEY = 'smart_home_current_home_id';

export const HomeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [homes, setHomes] = useState<Home[]>([]);
    const [currentHomeId, setCurrentHomeId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load homes on mount
    useEffect(() => {
        loadHomes();
    }, []);

    // Restore current home from localStorage
    useEffect(() => {
        if (homes.length > 0 && currentHomeId === null) {
            const savedHomeId = localStorage.getItem(CURRENT_HOME_KEY);
            if (savedHomeId) {
                const homeId = parseInt(savedHomeId, 10);
                const homeExists = homes.some(h => h.id === homeId);
                if (homeExists) {
                    setCurrentHomeId(homeId);
                } else {
                    // Saved home doesn't exist, default to first home
                    setCurrentHomeId(homes[0].id);
                    localStorage.setItem(CURRENT_HOME_KEY, homes[0].id.toString());
                }
            } else {
                // No saved home, default to first
                setCurrentHomeId(homes[0].id);
                localStorage.setItem(CURRENT_HOME_KEY, homes[0].id.toString());
            }
        }
    }, [homes, currentHomeId]);

    const loadHomes = async () => {
        try {
            setIsLoading(true);
            // TODO: Replace with actual API call
            // const data = await api.getHomes();

            // Mock data for now
            const mockHomes: Home[] = [
                {
                    id: 1,
                    name: 'Main House',
                    description: 'Primary residence',
                    address: '123 Main St, City',
                    owner_id: 1,
                    role: 'owner',
                    type: 'house',
                },
                {
                    id: 2,
                    name: 'Beach House',
                    description: 'Vacation home by the sea',
                    address: '456 Ocean Ave, Beach City',
                    owner_id: 1,
                    role: 'member',
                    type: 'vacation',
                },
                {
                    id: 3,
                    name: 'Office',
                    description: 'Work office',
                    address: '789 Business Blvd, Downtown',
                    owner_id: 2,
                    role: 'admin',
                    type: 'commercial',
                },
            ];

            setHomes(mockHomes);
        } catch (error) {
            console.error('Failed to load homes:', error);
            setHomes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const switchHome = (homeId: number) => {
        const homeExists = homes.some(h => h.id === homeId);
        if (homeExists) {
            setCurrentHomeId(homeId);
            localStorage.setItem(CURRENT_HOME_KEY, homeId.toString());

            // Trigger a custom event for other components to listen to
            window.dispatchEvent(new CustomEvent('homeChanged', { detail: { homeId } }));
        } else {
            console.error(`Home with id ${homeId} not found`);
        }
    };

    const refreshHomes = async () => {
        await loadHomes();
    };

    const currentHome = homes.find(h => h.id === currentHomeId) || null;

    const value: HomeContextType = {
        homes,
        currentHomeId,
        currentHome,
        isLoading,
        switchHome,
        refreshHomes,
    };

    return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = (): HomeContextType => {
    const context = useContext(HomeContext);
    if (context === undefined) {
        throw new Error('useHome must be used within a HomeProvider');
    }
    return context;
};
