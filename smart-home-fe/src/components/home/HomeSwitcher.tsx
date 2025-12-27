/**
 * Home Switcher Component
 * 
 * Dropdown selector for switching between multiple homes.
 * Displays home name and type, persists selection to localStorage.
 */

import React from 'react';
import { Select, MenuItem, FormControl, Box, Typography, Chip } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useHome } from '../../context/HomeContext';

export const HomeSwitcher: React.FC = () => {
    const { homes, currentHomeId, switchHome, isLoading } = useHome();

    const handleChange = (event: any) => {
        const homeId = event.target.value as number;
        switchHome(homeId);
    };

    if (isLoading || homes.length === 0) {
        return null;
    }

    const getHomeTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            house: 'House',
            apartment: 'Apartment',
            vacation: 'Vacation',
            commercial: 'Office',
            other: 'Other',
        };
        return labels[type] || type;
    };

    const getHomeTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'info' => {
        const colors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
            house: 'primary',
            apartment: 'info',
            vacation: 'success',
            commercial: 'warning',
            other: 'secondary',
        };
        return colors[type] || 'secondary';
    };

    return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
                value={currentHomeId || ''}
                onChange={handleChange}
                displayEmpty
                sx={{
                    bgcolor: 'background.paper',
                    '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    },
                }}
            >
                {homes.map((home) => (
                    <MenuItem key={home.id} value={home.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                            <HomeIcon fontSize="small" color="action" />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {home.name}
                                </Typography>
                            </Box>
                            <Chip
                                label={getHomeTypeLabel(home.type)}
                                size="small"
                                color={getHomeTypeColor(home.type)}
                                sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
