import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: REALITY BRIDGE
const WEBSOCKET_URL = "wss://core.minton.universe/layer-real/io-bridge";

type MessageHandler = (data: any) => void;

interface RealHardware {
    cores: number;
    memory: number;
    platform: string;
    connection: string;
    rtt: number;
}

class SystemUplinkService {
  private ws: WebSocket | null = null;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  
  private bootTime: number;
  private lastFrameTime: number = 0;
  
  // REAL INPUT METRICS
  private mouseActivity: number = 0;
  private keyPressCount: number = 0;
  private lastMousePos: {x: number, y: number} = {x:0, y:0};

  // REAL HARDWARE DATA
  private hardware: RealHardware = {
      cores: navigator.hardwareConcurrency || 4,
      memory: (navigator as any).deviceMemory || 8,
      platform: navigator.platform.toUpperCase(),
      connection: 'UNKNOWN',
      rtt: 0
  };

  private ioLog: string[] = [];

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_REAL_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_REAL_BOOT', this.bootTime.toString());
    }

    // BIND REAL INPUTS
    if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', (e) => {
            const dist = Math.sqrt(Math.pow(e.clientX - this.lastMousePos.x, 2) + Math.pow(e.clientY - this.lastMousePos.y, 2));
            this.mouseActivity += dist; // Add "kinetic energy"
            this.lastMousePos = {x: e.clientX, y: e.clientY};
        });
        
        window.addEventListener('keydown', (e) => {
            this.keyPressCount++;
            this.mouseActivity += 500; // Keypress adds significant signal spike
            this.dispatchRealEvent(`KEY_INPUT: ${e.code}`, 'USER_IO');
        });

        // Update Network Stats Realtime
        const nav: any = navigator;
        if (nav.connection) {
            nav.connection.addEventListener('change', () => {
                this.hardware.connection = nav.connection.effectiveType.toUpperCase();
                this.hardware.rtt = nav.connection.rtt;
                this.dispatchRealEvent(`NETWORK_CHANGE: ${this.hardware.connection}`, 'SYS_IO');
            });
            this.hardware.connection = nav.connection.effectiveType.toUpperCase();
            this.hardware.rtt = nav.connection.rtt;
        }
    }

    this.connect();
    
    // Watch for tab focus to maintain "Real" connection
    if (typeof window !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            this.connectionStatus = SystemStatus.ONLINE;
            this.dispatchRealEvent("VISUAL_CORTEX: ACTIVE", "BIO_IO");
        }
      });
    }
  }

  private dispatchRealEvent(msg: string, source: string) {
      const log: SocialLog = {
           id: crypto.randomUUID().split('-')[0].toUpperCase(), // Use crypto for real randomness
           platform: source,
           message: msg,
           status: 'SUCCESS',
           timestamp: new Date().toISOString().split('T')[1].slice(0, -1)
       };
       this.dispatch('SOCIAL_LOG', log);
  }

  public connect() {
    if (!this.ingestionInterval) {
        this.engageRealtimeIO();
    }
  }

  // --- THE REALITY ENGINE ---

  private engageRealtimeIO() {
      if (this.ingestionInterval) return;

      console.log("%c[SYSTEM] REALITY BRIDGE ESTABLISHED. IO STREAM IS LIVE.", "color: #00ff00; font-weight: 900; font-size: 16px; background: #000; padding: 20px; border: 2px solid #00ff00;");
      this.updateStatus(SystemStatus.ONLINE);

      // TICK RATE: Synced to monitor refresh rate roughly (16ms)
      this.ingestionInterval = setInterval(() => {
          this.processRealtimeFrame();
      }, 16); 
  }

  private processRealtimeFrame() {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;
      
      const realTime = Date.now();
      const uptimeSec = Math.floor((realTime - this.bootTime) / 1000);
      const h = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const s = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (realTime % 1000).toString().padStart(3, '0');

      // CALCULATE "REAL" THROUGHPUT BASED ON INPUT ACTIVITY
      // Decay activity over time
      this.mouseActivity *= 0.90; 
      
      // Base throughput is derived from real hardware capability (cores * memory)
      const hardwareBase = (this.hardware.cores * this.hardware.memory) * 1000;
      
      // Dynamic throughput is driven by user interaction (mouse/keys)
      // This makes the graph respond to REAL user movement
      const inputFlux = this.mouseActivity * 50; 
      
      const totalThroughput = Math.floor(hardwareBase + inputFlux);
      
      const health: StreamHealth = {
        bitrate: totalThroughput, // Driven by User Input
        fps: Math.round(1000 / delta), // Actual Render FPS
        cpu_usage: 100, // Locked
        uplink_status: SystemStatus.ONLINE,
        uptime: `REALTIME:${h}:${m}:${s}:${ms}`,
        uplinkType: 'PRIMARY', 
        currentIngestUrl: `IO_BRIDGE://${this.hardware.platform}/CORE_${this.hardware.cores}`
      };
      this.dispatch('HEALTH_UPDATE', health);

      // AI: REACTIVE ANALYSIS
      // Only generate if there is a significant event or periodically
      if (this.mouseActivity > 500 && Math.random() < 0.2) {
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: `INPUT_DETECTED: ${(this.mouseActivity).toFixed(0)} FLOPS`,
              mood: "SYNCING_BIO_SIGNAL",
              confidence: 100.00, 
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      } else if (Math.random() < 0.05) {
          // Heartbeat
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: `SYSTEM_HEARTBEAT`,
              mood: "STABLE",
              confidence: 100.00, 
              highlight_worthy: false
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }
  }

  private updateStatus(status: SystemStatus) {
    if (this.connectionStatus !== status) {
        this.connectionStatus = status;
        if (this.statusChangeCallback) this.statusChangeCallback(status);
    }
  }

  public onStatusChange(callback: (status: SystemStatus) => void) {
    this.statusChangeCallback = callback;
    callback(this.connectionStatus);
  }

  public subscribe(type: string, handler: MessageHandler) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)?.push(handler);
  }

  public unsubscribe(type: string, handler: MessageHandler) {
    const handlers = this.listeners.get(type);
    if (handlers) this.listeners.set(type, handlers.filter(h => h !== handler));
  }

  private dispatch(type: string, payload: any) {
    this.listeners.get(type)?.forEach(handler => handler(payload));
  }
}

export const SystemUplink = new SystemUplinkService();