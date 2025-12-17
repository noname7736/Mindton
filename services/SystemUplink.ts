import React from 'react';
import { EnterpriseState, ServerHardware, TerminalLine, ReconNode } from '../types';

type Listener = (state: EnterpriseState) => void;

// REAL C2 CONFIG
const REMOTE_WS_URL = 'ws://localhost:8080/v1/uplink'; 
const POLLING_RATE = 1000;

class SystemUplinkService {
  private listeners: Set<Listener> = new Set();
  private ws: WebSocket | null = null;
  private sysLoop: ReturnType<typeof setInterval> | null = null;
  private lastLoopTime: number = performance.now();
  
  // SINGLE SOURCE OF TRUTH
  private state: EnterpriseState = {
    isConnected: false,
    connectionMode: 'LOCAL_ENV',
    autonomousMode: true,
    activeTasks: 0,
    hardware: {
        model: 'WebEngine Core',
        serial: 'INIT...',
        cpuLoad: new Array(8).fill(0),
        ramUsage: 0,
        ramTotal: 0,
        raidStatus: 'MOUNTED',
        temp: 0,
        fans: 0,
        power: 0,
        uptime: 0
    },
    terminal: [],
    reconData: [],
    files: [
        {
            id: '1',
            name: 'local_recon.js',
            language: 'javascript',
            lastModified: Date.now(),
            content: `// REAL JavaScript Execution Context
// Click 'RUN' to execute this in your browser
console.log("[*] Starting Local Recon...");

const nav = navigator;
console.log("User Agent: " + nav.userAgent);
console.log("Language: " + nav.language);
console.log("Cores: " + nav.hardwareConcurrency);

if (nav.onLine) {
  console.log("[+] Uplink Status: ONLINE");
} else {
  console.error("[-] Uplink Status: OFFLINE");
}

return "Recon Complete";`
        },
        {
            id: '2',
            name: 'stress_test.js',
            language: 'javascript',
            lastModified: Date.now(),
            content: `// CPU Stress Test (Real)
console.log("Calculating Primes...");
let count = 0;
const start = performance.now();
for(let i=0; i<5000000; i++) {
   count += Math.sqrt(i);
}
const end = performance.now();
console.log("Done in " + (end-start).toFixed(2) + "ms");`
        }
    ],
    activeFileId: '1'
  };

  constructor() {
    this.bootKernel();
  }

  private bootKernel() {
    this.addLog('KERNEL', `Booting Integrated WebKernel...`);
    this.addLog('KERNEL', `Runtime: React ${React.version}`);
    
    // Initial Fingerprint
    this.performDeepRecon();

    // Start Loops
    this.sysLoop = setInterval(() => {
        this.monitorSystemResources();
        this.emit();
    }, POLLING_RATE);

    this.attemptUplink();
  }

  private attemptUplink() {
    try {
        this.ws = new WebSocket(REMOTE_WS_URL);
        this.ws.onopen = () => {
            this.state.isConnected = true;
            this.state.connectionMode = 'REMOTE_SOCKET';
            this.addLog('NET', 'C2 Uplink Established.');
            this.emit();
        };
        this.ws.onclose = () => {
            this.state.isConnected = false;
            this.state.connectionMode = 'LOCAL_ENV';
            this.emit();
        };
        this.ws.onerror = () => {};
    } catch (e) { this.state.isConnected = false; }
  }

  // --- INTEGRATED FEATURES ---

  // 1. REAL SCRIPT EXECUTION ENGINE
  public runActiveScript() {
      const file = this.state.files.find(f => f.id === this.state.activeFileId);
      if (!file) return;

      this.addLog('EXEC', `Executing ${file.name}...`);
      this.state.activeTasks++;
      this.emit();

      setTimeout(() => {
          try {
              // INTERCEPT CONSOLE LOGS
              const originalLog = console.log;
              const originalErr = console.error;
              
              console.log = (...args) => this.addLog('STDOUT', args.join(' '));
              console.error = (...args) => this.addLog('STDERR', args.join(' '));

              // DANGEROUS EVAL (Client Side Only - Intended Feature)
              // We wrap in a function to allow 'return' statements
              const func = new Function(file.content);
              const result = func();

              if (result !== undefined) {
                  this.addLog('SUCCESS', `Returned: ${result}`);
              }

              // RESTORE CONSOLE
              console.log = originalLog;
              console.error = originalErr;

          } catch (e: any) {
              this.addLog('STDERR', `Runtime Error: ${e.message}`);
          }

          this.state.activeTasks--;
          this.emit();
      }, 100);
  }

  // 2. DEEP BROWSER RECON (Real Data)
  public performDeepRecon() {
      this.state.reconData = [];
      const nav = navigator as any;

      const pushData = (label: string, value: any, cat: ReconNode['category'], status: ReconNode['status'] = 'SAFE') => {
          this.state.reconData.push({
              id: crypto.randomUUID(),
              label,
              value: String(value),
              category: cat,
              status
          });
      };

      // Hardware
      pushData('CPU Cores', nav.hardwareConcurrency || 'Unknown', 'HARDWARE');
      if (nav.deviceMemory) pushData('Device Memory', `~${nav.deviceMemory} GB`, 'HARDWARE');
      pushData('Platform', nav.platform, 'HARDWARE');
      
      // Network
      pushData('Online Status', nav.onLine ? 'Online' : 'Offline', 'NETWORK', nav.onLine ? 'SAFE' : 'CRITICAL');
      if (nav.connection) {
          pushData('Downlink', `${nav.connection.downlink} Mbps`, 'NETWORK');
          pushData('RTT', `${nav.connection.rtt} ms`, 'NETWORK');
          pushData('Effective Type', nav.connection.effectiveType.toUpperCase(), 'NETWORK');
      }

      // Software / Security
      pushData('Cookies Enabled', nav.cookieEnabled, 'SECURITY', nav.cookieEnabled ? 'WARN' : 'SAFE');
      pushData('User Agent', nav.userAgent.substring(0, 20) + '...', 'SOFTWARE');
      pushData('Language', nav.language, 'SOFTWARE');

      this.emit();
  }

  // 3. REAL RESOURCE METERING
  private monitorSystemResources() {
      const now = performance.now();
      const delta = now - this.lastLoopTime;
      this.lastLoopTime = now;
      
      this.state.hardware.uptime = Math.floor(now / 1000);

      // Event Loop Lag = CPU Load
      const lag = Math.max(0, delta - POLLING_RATE);
      const load = Math.min(100, Math.floor((lag / 200) * 100)); // More sensitive scale
      this.state.hardware.cpuLoad = [...this.state.hardware.cpuLoad.slice(1), load];

      // Memory
      const perf = performance as any;
      if (perf.memory) {
          this.state.hardware.ramUsage = Math.round(perf.memory.usedJSHeapSize / 1048576);
          this.state.hardware.ramTotal = Math.round(perf.memory.jsHeapSizeLimit / 1048576);
      }
  }

  // --- COMMAND HANDLING ---

  public executeCommand(cmd: string) {
      this.addLog('INPUT', cmd);
      const [command, ...args] = cmd.trim().split(' ');

      switch(command.toLowerCase()) {
          case 'run':
              this.runActiveScript();
              break;
          case 'recon':
              this.addLog('INFO', 'Refreshing Scope Analysis...');
              this.performDeepRecon();
              this.addLog('SUCCESS', 'Recon Data Updated.');
              break;
          case 'clear':
              this.state.terminal = [];
              break;
          case 'help':
              this.addLog('INFO', 'COMMANDS: run, recon, clear, status, mount');
              break;
          default:
               this.addLog('STDERR', `Command not found: ${command}`);
      }
      this.emit();
  }

  // Standard State Methods
  public subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }
  private emit() { this.listeners.forEach(l => l({ ...this.state })); }
  public toggleAutonomousMode() { 
      this.state.autonomousMode = !this.state.autonomousMode; 
      this.emit();
  }
  public setActiveFile(id: string) { this.state.activeFileId = id; this.emit(); }
  public updateFileContent(id: string, content: string) {
      const f = this.state.files.find(x => x.id === id);
      if(f) { f.content = content; f.isDirty = true; this.emit(); }
  }
  public addLog(type: TerminalLine['type'], content: string) {
      const line = { id: crypto.randomUUID(), timestamp: new Date().toLocaleTimeString(), type, content };
      if (this.state.terminal.length > 150) this.state.terminal.shift();
      this.state.terminal.push(line);
      this.emit();
  }
  public formatUptime(s: number) { 
      return new Date(s * 1000).toISOString().substr(11, 8); 
  }
}

export const SystemUplink = new SystemUplinkService();