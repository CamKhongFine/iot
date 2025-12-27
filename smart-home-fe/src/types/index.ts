/**
 * TypeScript type definitions for Smart Home application
 */

export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
}

export interface Home {
  id: number;
  name: string;
  description?: string;
  address?: string;
  owner_id: number;
  role: 'owner' | 'admin' | 'member' | 'guest';
  type: 'house' | 'apartment' | 'vacation' | 'commercial' | 'other';
}

export interface Room {
  id: number;
  name: string;
  description?: string;
  home_id: number;
}

export interface Device {
  id: number;
  name: string;
  device_id: string; // ThingsBoard UUID
  device_type: string;
  is_active: boolean;
  room_id: number;
}

export interface TelemetryData {
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  door?: 'open' | 'closed';
  light?: 'on' | 'off';
  fire?: boolean;
  lastMotionTime?: string;
  lastDoorOpenTime?: string;
}

export interface TelemetryHistory {
  timestamp: number;
  value: number;
}

export interface RoomWithTelemetry extends Room {
  device?: Device;
  telemetry?: TelemetryData;
}

export interface Alert {
  id: string;
  homeId: number;
  type: 'fire' | 'offline' | 'temperature' | 'motion' | 'door';
  message: string;
  roomId: number;
  roomName: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface HomeStats {
  totalRooms: number;
  onlineDevices: number;
  offlineDevices: number;
  safetyStatus: 'safe' | 'warning' | 'critical';
  activeAlerts: number;
}

export interface DeviceStatus {
  isOnline: boolean;
  lastSeen?: string;
}

// Automation types
export interface Scene {
  id: number;
  name: string;
  description?: string;
  homeId: number;
  actions: SceneAction[];
  isActive: boolean;
}

export interface SceneAction {
  deviceId: number;
  action: 'turn_on' | 'turn_off' | 'set_value';
  value?: any;
}

export interface AutomationRule {
  id: number;
  name: string;
  description?: string;
  homeId: number;
  trigger: RuleTrigger;
  conditions: RuleCondition[];
  actions: RuleAction[];
  isActive: boolean;
}

export interface RuleTrigger {
  type: 'motion' | 'door' | 'temperature' | 'fire' | 'time';
  deviceId?: number;
  value?: any;
  time?: string;
}

export interface RuleCondition {
  type: 'device_state' | 'time_range' | 'temperature_range';
  deviceId?: number;
  operator: 'equals' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface RuleAction {
  type: 'device_control' | 'notification';
  deviceId?: number;
  action: string;
  value?: any;
  message?: string;
}

// Home member types
export interface HomeMember {
  id: number;
  userId: number;
  homeId: number;
  role: 'owner' | 'admin' | 'member' | 'guest';
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
  };
  joinedAt: string;
}

// Navigation types
export interface NavItem {
  text: string;
  path: string;
  icon: string;
  requiresRole?: ('owner' | 'admin' | 'member' | 'guest')[];
}
