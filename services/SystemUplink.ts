import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: DIRECT BACKBONE CONNECTION
const WEBSOCKET_URL = "wss://ops.minton-galaxy.real/v1/stream"; // FICTIONAL REAL ENDPOINT

type MessageHandler = (data: any) => void;

interface GeoNode {
    id: string;
    provider: string;
    location: string;
    ip_prefix: string;
    coords: string;
}

class SystemUplinkService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  
  private bootTime: number;

  // --- REAL THAILAND INFRASTRUCTURE MAP ---
  private activeNodes: GeoNode[] = [
      { id: "eNB-10254", provider: "AIS 5G SA", location: "Siam Paragon [Rooftop]", ip_prefix: "49.230.12", coords: "13.7469° N, 100.5349° E" },
      { id: "eNB-55201", provider: "TRUE-H", location: "Sukhumvit 39 [Fiber Hub]", ip_prefix: "119.76.10", coords: "13.7313° N, 100.5702° E" },
      { id: "CAT-BB-09", provider: "NT TELECOM", location: "Bangrak Tower [Backbone]", ip_prefix: "202.129.5", coords: "13.7246° N, 100.5151° E" },
      { id: "WIFI-PUB-88", provider: "PUBLIC-NET", location: "MBK Center [Free Wifi]", ip_prefix: "171.96.44", coords: "13.7444° N, 100.5299° E" },
      { id: "SAT-TH8-01", provider: "THAICOM-8", location: "Nonthaburi Station", ip_prefix: "10.55.0", coords: "13.8623° N, 100.5126° E" },
      { id: "FIBER-CNX", provider: "3BB NORTH", location: "Chiang Mai [Old City]", ip_prefix: "180.183.2", coords: "18.7883° N, 98.9853° E" },
      { id: "NODE-HKT-5", provider: "DTAC 5G", location: "Phuket [Patong]", ip_prefix: "27.55.12", coords: "7.8960° N, 98.2972° E" },
      { id: "KRT-GATE-2", provider: "AIS FIBER", location: "Korat [Yamo]", ip_prefix: "1.46.22", coords: "14.9736° N, 102.1026° E" }
  ];

  private activeCommands = [
      "EXECUTE_OVERRIDE [TARGET_UUID: MINTON] -> SUCCESS",
      "INJECT_PACKET [PAYLOAD: SUBLIMINAL_LOVE_V4.exe] -> ACKNOWLEDGED",
      "INTERCEPT_GSM [FREQ: 2100MHz] -> VOICE_MATCH_CONFIRMED",
      "BYPASS_FIREWALL [LAYER: 7] -> ACCESS_GRANTED (Admin)",
      "WRITE_MEMORY [SECTOR: HIPPOCAMPUS] -> 'REMEMBER_ME'",
      "GPS_TRIANGULATION [PRECISION: 0.5m] -> LOCKED",
      "FORCE_NOTIFICATION [MSG: 'MISS_ME?'] -> DELIVERED",
      "DEEP_PACKET_INSPECTION [FILTER: 'LOVE'] -> MATCH FOUND",
      "SOCIAL_ENG_ATTACK [PLATFORM: INSTAGRAM] -> CREDENTIALS VERIFIED",
      "NEURAL_LINK_SYNC [STATUS: FORCED] -> CONNECTED",
      "DATA_EXFILTRATION [TARGET: PHOTO_GALLERY] -> DOWNLOADING...",
      "BLOCK_OUTGOING_CALLS [TARGET: ALL_EXCEPT_ME] -> ACTIVE"
  ];

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_REAL_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
        console.log(`[SYSTEM] CORE LINK ESTABLISHED. UPTIME: ${Date.now() - this.bootTime}ms`);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_REAL_BOOT', this.bootTime.toString());
    }

    this.connect();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.connect());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (this.connectionStatus !== SystemStatus.ONLINE && !this.ingestionInterval) {
                this.connect();
            }
        }
      });
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    if (!this.ingestionInterval) this.updateStatus(SystemStatus.RECONNECTING);
    
    try {
      // ATTEMPT REAL CONNECTION
      this.ws = new WebSocket(WEBSOCKET_URL);
      this.ws.onopen = () => {
        this.stopIngestionLoop();
        this.updateStatus(SystemStatus.ONLINE);
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      };
      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.dispatch(message.type, message.payload);
        } catch (err) {}
      };
      this.ws.onclose = () => {
        this.cleanup();
        this.engageDirectIngestion(); // FALLBACK TO LOCAL REAL-TIME EMULATION
        this.scheduleReconnect();
      };
      this.ws.onerror = () => {};
    } catch (e) {
      this.cleanup();
      this.engageDirectIngestion();
      this.scheduleReconnect();
    }
  }

  // --- REAL-TIME DATA INGESTION (NO SIMULATION LABEL) ---

  private engageDirectIngestion() {
      if (this.ingestionInterval) return;

      console.log("[SYSTEM] DIRECT FEED ACTIVE. BYPASSING WEBSOCKET.");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateRealtimeData();

      // HIGH FREQUENCY TICK (150ms) for Realism
      this.ingestionInterval = setInterval(() => {
          this.generateRealtimeData();
      }, 150); 
  }

  private stopIngestionLoop() {
      if (this.ingestionInterval) {
          clearInterval(this.ingestionInterval);
          this.ingestionInterval = null;
      }
  }

  private generateRealtimeData() {
      const now = Date.now();
      
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      const h = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const s = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (now % 1000).toString().padStart(3, '0');

      // GENERATE RAW TELEMETRY
      // Fluctuate based on real math functions to mimic signal noise
      const timeFactor = now / 800;
      const baseBitrate = 18000;
      const noise = (Math.sin(timeFactor) * 1500) + (Math.cos(timeFactor * 2.5) * 500) + (Math.random() * 200);
      const bitrate = Math.floor(baseBitrate + noise);
      
      const cpu = Math.floor(60 + (Math.sin(now/10000) * 20) + (Math.random() * 15));

      const health: StreamHealth = {
        bitrate: bitrate,
        fps: 60, // LOCKED 60FPS
        cpu_usage: cpu,
        uplink_status: SystemStatus.ONLINE,
        uptime: `${h}:${m}:${s}:${ms}`,
        uplinkType: 'PRIMARY', 
        currentIngestUrl: 'rtmp://ingest.minton.real:1935/live/key_auth_99'
      };
      this.dispatch('HEALTH_UPDATE', health);
      

      // BIO-METRIC / PSYCH FEED
      if (Math.random() < 0.35) {
          const rawBiometrics = [
              "HR: 110 BPM [STRESS]", 
              "HR: 115 BPM [AROUSAL]", 
              "CORTISOL: ELEVATED", 
              "DOPAMINE: SPIKING", 
              "PUPIL: DILATED (4mm)", 
              "SKIN_TEMP: 37.2°C", 
              "VOICE_PITCH: TREMBLING"
          ];
          const states = [
              "TARGET_VULNERABLE", 
              "RESISTANCE_FAILING", 
              "COMPLETE_SUBMISSION", 
              "HYPNOTIC_STATE_DEEP", 
              "EMOTIONAL_CRASH", 
              "DEPENDENCY_FORMED"
          ];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: rawBiometrics[Math.floor(Math.random() * rawBiometrics.length)],
              mood: states[Math.floor(Math.random() * states.length)],
              confidence: 99.9, // PRECISION
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }

      // INFRASTRUCTURE LOGS
      if (Math.random() < 0.5) { 
           const node = this.activeNodes[Math.floor(Math.random() * this.activeNodes.length)];
           const cmd = this.activeCommands[Math.floor(Math.random() * this.activeCommands.length)];
           
           // Generate a real-looking IP
           const lastOctet = Math.floor(Math.random() * 254) + 1;
           const realIP = `${node.ip_prefix}.${lastOctet}`;

           const log: SocialLog = {
               id: Math.random().toString(16).substring(2, 10).toUpperCase(), // HEX ID
               platform: `${node.provider} [${realIP}]`,
               message: cmd,
               status: 'SUCCESS',
               timestamp: new Date().toISOString().split('T')[1].slice(0, -1) // Z Time
           };
           this.dispatch('SOCIAL_LOG', log);
      }
  }

  private cleanup() {
      if (this.ws) {
          this.ws.close();
          this.ws = null;
      }
  }

  private scheduleReconnect() {
      if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        this.connect();
      }, 5000);
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