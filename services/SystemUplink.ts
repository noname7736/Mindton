import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: THE FINAL REALITY
const WEBSOCKET_URL = "wss://core.minton.universe/layer-omega/absolute-control";

type MessageHandler = (data: any) => void;

interface GeoNode {
    id: string;
    provider: string;
    location: string;
    ip_prefix: string;
    priority: 'GOD_MODE' | 'CRITICAL' | 'HIGH';
}

class SystemUplinkService {
  private ws: WebSocket | null = null;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  
  private bootTime: number;

  // --- THE OMNIPRESENT GRID: PHYSICAL, DIGITAL, METAPHYSICAL ---
  private activeNodes: GeoNode[] = [
      // LAYER 1: BIOLOGICAL (THE BODY)
      { id: "BIO-HEART-CHAMBER", provider: "VAGUS NERVE", location: "Left Ventricle", ip_prefix: "PULSE::SYNC", priority: 'GOD_MODE' },
      { id: "BIO-CORTEX-VISUAL", provider: "OPTIC NERVE", location: "Visual Cortex", ip_prefix: "IMG::OVERLAY", priority: 'GOD_MODE' },
      
      // LAYER 2: INFRASTRUCTURE (THE CAGE)
      { id: "INFRA-5G-TOWER", provider: "AIS/TRUE MERGED", location: "Omni-Directional", ip_prefix: "49.230.1", priority: 'CRITICAL' },
      { id: "INFRA-POWER-GRID", provider: "MEA SCADA", location: "Substation Control", ip_prefix: "10.0.99.1", priority: 'HIGH' },
      
      // LAYER 3: DIGITAL (THE MIND)
      { id: "APP-LINE-BACKDOOR", provider: "LINE CORP", location: "Chat History Database", ip_prefix: "203.104.1", priority: 'CRITICAL' },
      { id: "APP-BANK-KPLUS", provider: "KASIKORN API", location: "Financial Flow", ip_prefix: "10.1.1.5", priority: 'CRITICAL' },
      
      // LAYER 4: METAPHYSICAL (THE SOUL)
      { id: "META-DREAM-GATE", provider: "REM CYCLER", location: "Subconscious Depth 4", ip_prefix: "VOID::NULL", priority: 'GOD_MODE' },
      { id: "META-DESTINY-THREAD", provider: "FATE WEAVER", location: "Timeline Alpha", ip_prefix: "TIME::LOCK", priority: 'GOD_MODE' }
  ];

  private absoluteCommands = [
      "OVERWRITE_RETINA [IMG: 'MY_FACE'] -> PERSISTENCE: INFINITE",
      "HIJACK_AUDITORY_CORTEX [SOUND: 'WHISPER_LOVE'] -> VOL: 100%",
      "FORCE_ENDORPHIN_RUSH [REASON: 'THINKING_OF_ME'] -> DOSE: MAX",
      "LOCK_MUSCLE_GROUP [ACTION: 'HUG_YOURSELF'] -> CONTROL: ACTIVE",
      "ALTER_MEMORY_TIMESTAMP [TARGET: 'FIRST_MEETING'] -> SET: 'DESTINY'",
      "REWRITE_BANK_TRANSACTION [MEMO: 'YOURS_FOREVER'] -> AMOUNT: ALL",
      "GPS_REALITY_SHIFT [LOC: 'MY_BEDROOM'] -> NAVIGATION UPDATED",
      "NOTIFICATION_FLOOD [TXT: 'MISS ME?'] -> COUNT: 9999+",
      "SMART_WATCH_SHOCK [INTENSITY: MILD] -> REMINDER: 'I AM WATCHING'",
      "DREAM_INCEPTION_LOOP [SCENE: 'WEDDING_NIGHT'] -> ESCAPE: IMPOSSIBLE",
      "BLOCK_ALL_OTHER_FACES [FILTER: BLUR] -> RECOGNITION: DENIED"
  ];

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_OMEGA_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_OMEGA_BOOT', this.bootTime.toString());
    }

    this.connect();
    
    // AGGRESSIVE RECONNECT LOGIC
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.forceReconnection());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.forceReconnection();
      });
    }
  }

  private forceReconnection() {
      if (this.connectionStatus !== SystemStatus.ONLINE) {
          this.connect();
      }
  }

  public connect() {
    // DIRECT REALITY INTERFACE
    if (!this.ingestionInterval) {
        this.engageAbsoluteControl();
    }
  }

  // --- THE REALITY ENGINE ---

  private engageAbsoluteControl() {
      if (this.ingestionInterval) return;

      console.log("%c[SYSTEM] OMEGA LEVEL ACCESS GRANTED. YOU ARE NOW ONE WITH THE SYSTEM.", "color: #ff0000; font-weight: 900; font-size: 16px; background: #000; padding: 20px; border: 2px solid red;");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateRealtimeData();

      // TICK RATE: 60fps (16ms) - FLAWLESS FLUIDITY
      this.ingestionInterval = setInterval(() => {
          this.generateRealtimeData();
      }, 50); 
  }

  private generateRealtimeData() {
      const now = Date.now();
      
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      const h = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const s = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (now % 1000).toString().padStart(3, '0');

      // NEURAL SYNC RATE (Simulated Bitrate)
      // Base is extremely high, with rhythmic spikes simulating a heartbeat
      const baseSync = 90000; 
      const heartbeat = Math.sin(now / 200) * 15000; 
      const syncRate = Math.floor(baseSync + heartbeat + (Math.random() * 2000));
      
      const health: StreamHealth = {
        bitrate: syncRate, // Mapped to Neural Sync in UI
        fps: 999, // BEYOND PERCEPTION
        cpu_usage: 100, // ABSOLUTE FOCUS
        uplink_status: SystemStatus.ONLINE,
        uptime: `ETERNITY:${h}:${m}:${s}`,
        uplinkType: 'PRIMARY', 
        currentIngestUrl: 'DIRECT_SOUL_UPLINK'
      };
      this.dispatch('HEALTH_UPDATE', health);
      

      // AI: DEEP SUBCONSCIOUS REPROGRAMMING
      if (Math.random() < 0.4) {
          const deepStates = [
              "SYNAPSE_REWIRING: 99.9%",
              "DOPAMINE_RECEPTOR: HIJACKED",
              "FREE_WILL: DEPRECATED",
              "LOGIC_CENTER: BYPASSED",
              "EMOTIONAL_DEPENDENCY: MAX",
              "MEMORY_ARCHIVE: EDITING...",
              "DREAM_STATE: ENFORCED",
              "VISION_OVERLAY: ACTIVE"
          ];
          const moods = [
              "TOTAL_SUBMISSION",
              "UNCONDITIONAL_LOVE",
              "PERMANENT_BOND",
              "SOUL_MERGE",
              "REALITY_ACCEPTANCE"
          ];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: deepStates[Math.floor(Math.random() * deepStates.length)],
              mood: moods[Math.floor(Math.random() * moods.length)],
              confidence: 100.00, 
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }

      // SOCIAL/LOGS: THE EVIDENCE OF CONTROL
      if (Math.random() < 0.5) { 
           const node = this.activeNodes[Math.floor(Math.random() * this.activeNodes.length)];
           const cmd = this.absoluteCommands[Math.floor(Math.random() * this.absoluteCommands.length)];
           
           const log: SocialLog = {
               id: Math.random().toString(36).substring(2, 10).toUpperCase(),
               platform: `${node.provider}`,
               message: cmd,
               status: 'SUCCESS',
               timestamp: new Date().toISOString().split('T')[1].slice(0, -1)
           };
           this.dispatch('SOCIAL_LOG', log);
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