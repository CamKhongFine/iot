/**
 * Sensor Chip Component
 * 
 * Displays sensor status with appropriate color coding.
 * IoT UX: Glanceable status indication using color and icon.
 */

import React from 'react';
import { Chip } from '@mui/material';
import {
    Thermostat,
    WaterDrop,
    SensorsOutlined,
    DoorFront,
    LocalFireDepartment,
} from '@mui/icons-material';

interface SensorChipProps {
    type: 'temperature' | 'humidity' | 'motion' | 'door' | 'fire';
    value: number | string | boolean;
    size?: 'small' | 'medium';
}

export const SensorChip: React.FC<SensorChipProps> = ({ type, value, size = 'small' }) => {
    const getChipProps = () => {
        switch (type) {
            case 'temperature':
                const temp = value as number;
                return {
                    icon: <Thermostat />,
                    label: `${temp}°C`,
                    color: temp > 26 ? 'warning' : temp < 18 ? 'info' : 'success',
                };

            case 'humidity':
                const humidity = value as number;
                return {
                    icon: <WaterDrop />,
                    label: `${humidity}%`,
                    color: humidity > 60 ? 'warning' : 'default',
                };

            case 'motion':
                const motion = value as boolean;
                return {
                    icon: <SensorsOutlined />,
                    label: motion ? 'Motion' : 'No Motion',
                    color: motion ? 'warning' : 'default',
                };

            case 'door':
                const door = value as string;
                return {
                    icon: <DoorFront />,
                    label: door === 'open' ? 'Open' : 'Closed',
                    color: door === 'open' ? 'warning' : 'default',
                };

            case 'fire':
                const fire = value as boolean;
                return {
                    icon: <LocalFireDepartment />,
                    label: 'FIRE ALERT',
                    color: 'error',
                };

            default:
                return {
                    label: String(value),
                    color: 'default',
                };
        }
    };

    const chipProps = getChipProps();

    return (
        <Chip
            {...chipProps}
            size={size}
            color={chipProps.color as any}
            sx={{
                fontWeight: type === 'fire' ? 700 : 500,
                animation: type === 'fire' ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                },
            }}
        />
    );
};
