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
  type: 'fire' | 'offline' | 'temperature';
  message: string;
  roomId: number;
  roomName: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
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
