/**
 * Material UI Theme Configuration
 * 
 * IoT-specific color scheme:
 * - Green: OK, ON, Normal
 * - Yellow: Warning, Abnormal
 * - Red: Fire, Critical, Offline
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => ({
    palette: {
        mode,
        primary: {
            main: '#1976d2',
        },
        success: {
            main: '#4caf50', // Green - OK/ON
        },
        warning: {
            main: '#ff9800', // Yellow - Warning
        },
        error: {
            main: '#f44336', // Red - Fire/Critical
        },
        background: {
            default: mode === 'dark' ? '#121212' : '#f5f5f5',
            paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                root: {
                    // Make switch more prominent for primary action
                    '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                    },
                },
            },
        },
    },
});

export const createAppTheme = (mode: 'light' | 'dark') => {
    return createTheme(getDesignTokens(mode));
};
