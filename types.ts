export enum SystemStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING',
  RECONNECTING = 'RECONNECTING',
  SECURE = 'SECURE'
}

export interface AIAnalysisResult {
  timestamp: string;
  activity: string;
  mood: string;
  confidence: number;
  highlight_worthy: boolean;
  raw_response?: string;
}

export interface NetworkStats {
  downlink: number;
  rtt: number;
  effectiveType: string;
}

export interface GeoStats {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
}

export interface HardwareStats {
  cores: number;
  memory: number; // GB
}

export interface SecurityStats {
  shieldIntegrity: number; // 0-100%
  encryptionLayer: string; // e.g., "QUANTUM-256"
  threatsBlocked: number;
}

export interface StreamHealth {
  bitrate: number; // kbps
  fps: number;
  cpu_usage: number; // percentage
  uplink_status: SystemStatus;
  uptime: string;
  uplinkType: 'PRIMARY' | 'BACKUP';
  currentIngestUrl: string;
  
  // Detailed Metrics
  network?: NetworkStats;
  geo?: GeoStats;
  hardware?: HardwareStats;
  motionIntensity?: number;
  security?: SecurityStats; // NEW: Protection Data
}

export interface SocialLog {
  id: string;
  platform: string;
  message: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'SECURED';
  timestamp: string;
}

// Websocket Message Protocols
export type WSMessageType = 'HEALTH_UPDATE' | 'AI_ANALYSIS' | 'SOCIAL_LOG';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
}