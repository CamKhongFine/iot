/**
 * Role-Based Utilities
 * 
 * Helper functions for role-based access control and UI rendering.
 */

type UserRole = 'owner' | 'admin' | 'member' | 'guest';

/**
 * Check if user has permission based on role
 */
export const hasPermission = (
    userRole: UserRole | undefined,
    requiredRoles: UserRole[]
): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
};

/**
 * Check if user can edit/manage home settings
 */
export const canManageHome = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner']);
};

/**
 * Check if user can manage devices
 */
export const canManageDevices = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner', 'admin', 'member']);
};

/**
 * Check if user can view automation
 */
export const canViewAutomation = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner', 'admin', 'member']);
};

/**
 * Check if user can create/edit automation
 */
export const canEditAutomation = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner', 'admin']);
};

/**
 * Check if user can manage members
 */
export const canManageMembers = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner', 'admin']);
};

/**
 * Check if user can delete home
 */
export const canDeleteHome = (userRole: UserRole | undefined): boolean => {
    return hasPermission(userRole, ['owner']);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
        owner: 'Owner',
        admin: 'Administrator',
        member: 'Member',
        guest: 'Guest',
    };
    return roleNames[role];
};

/**
 * Get role color for chips/badges
 */
export const getRoleColor = (role: UserRole): 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' => {
    const roleColors: Record<UserRole, 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
        owner: 'error',
        admin: 'primary',
        member: 'success',
        guest: 'secondary',
    };
    return roleColors[role];
};

/**
 * Get permissions summary for a role
 */
export const getRolePermissions = (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
        owner: [
            'Full access to all features',
            'Manage home settings',
            'Add/remove members',
            'Delete home',
            'Manage devices and automation',
        ],
        admin: [
            'Manage devices and automation',
            'Add/remove members',
            'View all data',
            'Cannot delete home',
        ],
        member: [
            'Control devices',
            'View automation',
            'View all data',
            'Cannot manage members',
        ],
        guest: [
            'View-only access',
            'Cannot control devices',
            'Cannot view automation',
            'Cannot manage anything',
        ],
    };
    return permissions[role];
};
