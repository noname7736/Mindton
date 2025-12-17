export type ServerStatus = 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'MAINTENANCE';

export interface ServerHardware {
  model: string; // User Agent / Browser Engine
  serial: string; // Session ID
  cpuLoad: number[]; // Real Event Loop Lag calculation
  ramUsage: number; // Real JS Heap Size (MB)
  ramTotal: number; // Real JS Heap Limit (MB)
  raidStatus: string; // Local Storage Status
  temp: number; // Simulated based on thread activity (Approximation as sensors aren't available in web)
  fans: number; // N/A for Web
  power: number; // N/A for Web
  uptime: number; // Real Performance.now()
}

export interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'STDOUT' | 'STDERR' | 'INFO' | 'SUCCESS' | 'INPUT' | 'DAEMON' | 'KERNEL' | 'NET';
  content: string;
}

export interface ScriptFile {
  id: string;
  name: string;
  language: 'python' | 'bash' | 'perl' | 'json';
  content: string;
  isDirty?: boolean;
  lastModified: number;
}

export interface NetworkHost {
  ip: string;
  hostname: string;
  os: string;
  ports: number[];
  status: 'UP' | 'DOWN';
  vulnerabilityScore: number;
  lastScanned?: number;
}

export interface EnterpriseState {
  isConnected: boolean;
  connectionMode: 'REMOTE_SOCKET' | 'LOCAL_ENV';
  autonomousMode: boolean;
  hardware: ServerHardware;
  terminal: TerminalLine[];
  files: ScriptFile[];
  activeFileId: string;
  hosts: NetworkHost[];
  activeTasks: number;
}