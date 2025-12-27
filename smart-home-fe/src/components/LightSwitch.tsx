/**
 * Light Switch Component
 * 
 * PRIMARY INTERACTION for IoT control.
 * 
 * UX Decisions:
 * - Large, prominent switch for easy interaction
 * - Optimistic UI: Updates immediately before API call
 * - Green when ON (success color)
 * - Clear visual feedback
 */

import React, { useState } from 'react';
import { Switch, FormControlLabel, Box, Typography, CircularProgress } from '@mui/material';
import { LightbulbOutlined } from '@mui/icons-material';
import { api } from '../api/client';

interface LightSwitchProps {
    roomId: number;
    initialState: 'on' | 'off';
    onStateChange?: (newState: 'on' | 'off') => void;
    size?: 'small' | 'medium' | 'large';
}

export const LightSwitch: React.FC<LightSwitchProps> = ({
    roomId,
    initialState,
    onStateChange,
    size = 'medium',
}) => {
    const [lightState, setLightState] = useState<'on' | 'off'>(initialState);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        // Optimistic UI update
        const newState: 'on' | 'off' = lightState === 'on' ? 'off' : 'on';
        setLightState(newState);
        setIsLoading(true);

        try {
            // API call
            if (newState === 'on') {
                await api.turnLightOn(roomId);
            } else {
                await api.turnLightOff(roomId);
            }

            // Notify parent component
            onStateChange?.(newState);
        } catch (error) {
            console.error('Failed to toggle light:', error);
            // Revert on error
            setLightState(lightState);
        } finally {
            setIsLoading(false);
        }
    };

    const isOn = lightState === 'on';

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: size === 'large' ? 2 : 1,
                borderRadius: 2,
                bgcolor: isOn ? 'success.light' : 'action.hover',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
            }}
        >
            <LightbulbOutlined
                sx={{
                    color: isOn ? 'success.dark' : 'text.secondary',
                    fontSize: size === 'large' ? 32 : 24,
                }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={isOn}
                        onChange={handleToggle}
                        disabled={isLoading}
                        size={size === 'large' ? 'medium' : 'small'}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: 'success.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: 'success.main',
                            },
                        }}
                    />
                }
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                            variant={size === 'large' ? 'h6' : 'body2'}
                            sx={{ fontWeight: 600, color: isOn ? 'success.dark' : 'text.secondary' }}
                        >
                            {isOn ? 'ON' : 'OFF'}
                        </Typography>
                        {isLoading && <CircularProgress size={16} />}
                    </Box>
                }
            />
        </Box>
    );
};
