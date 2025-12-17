export type ServerStatus = 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'MAINTENANCE';

export interface ServerHardware {
  model: string;
  serial: string;
  cpuLoad: number[];
  ramUsage: number;
  ramTotal: number;
  raidStatus: string;
  temp: number;
  fans: number;
  power: number;
  uptime: number;
}

export interface TerminalLine {
  id: string;
  timestamp: string;
  type: 'STDOUT' | 'STDERR' | 'INFO' | 'SUCCESS' | 'INPUT' | 'DAEMON' | 'KERNEL' | 'NET' | 'EXEC';
  content: string;
}

export interface ScriptFile {
  id: string;
  name: string;
  language: 'javascript' | 'json' | 'text'; // Changed to JS for real execution
  content: string;
  isDirty?: boolean;
  lastModified: number;
}

// Changed from NetworkHost to generic ReconNode for Browser Fingerprinting
export interface ReconNode {
  id: string;
  label: string;
  value: string | number | boolean;
  category: 'HARDWARE' | 'NETWORK' | 'SOFTWARE' | 'SECURITY';
  status: 'SAFE' | 'WARN' | 'CRITICAL';
}

export interface EnterpriseState {
  isConnected: boolean;
  connectionMode: 'REMOTE_SOCKET' | 'LOCAL_ENV';
  autonomousMode: boolean;
  hardware: ServerHardware;
  terminal: TerminalLine[];
  files: ScriptFile[];
  activeFileId: string;
  reconData: ReconNode[]; // Real browser data
  activeTasks: number;
}