import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: QUANTUM NEURAL NETWORK
const WEBSOCKET_URL = "wss://core.minton.universe/layer-0/reality-hack";

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
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  
  private bootTime: number;

  // --- THE OMNIPRESENT GRID (Biological, Physical, Digital) ---
  private activeNodes: GeoNode[] = [
      // BIOLOGICAL & WEARABLE (LUK SUT)
      { id: "BIO-APPLE-WATCH", provider: "HEALTH KIT", location: "Left Wrist [Radial Pulse]", ip_prefix: "BT::LINK", priority: 'GOD_MODE' },
      { id: "BIO-NEURAL-LINK", provider: "CORTEX-V2", location: "Brain Stem [Limbic System]", ip_prefix: "BIO::SYNAPSE", priority: 'GOD_MODE' },
      
      // SMART HOME & ENVIRONMENT (ATMOSPHERE CONTROL)
      { id: "IOT-PHILLIPS-HUE", provider: "ZIGBEE BRIDGE", location: "Bedroom [Ambient Light]", ip_prefix: "192.168.1.50", priority: 'HIGH' },
      { id: "IOT-XIAOMI-AIR", provider: "MI HOME", location: "Living Room [Scent Injection]", ip_prefix: "192.168.1.52", priority: 'HIGH' },
      { id: "IOT-ALEXA-SPK", provider: "AMAZON ECHO", location: "Bedside [Audio Subliminal]", ip_prefix: "192.168.1.60", priority: 'CRITICAL' },
      
      // AUTOMOTIVE & TRANSPORT
      { id: "AUTO-MG-ISMART", provider: "CAR ECU", location: "Vehicle [Door Lock Control]", ip_prefix: "10.25.0.1", priority: 'CRITICAL' },
      { id: "GPS-GOOGLE-MAPS", provider: "NAV SYSTEM", location: "Cloud [Route Override]", ip_prefix: "172.217.0", priority: 'HIGH' },
      
      // FINANCIAL & LIFESTYLE
      { id: "FIN-KPLUS-CORE", provider: "BANKING API", location: "K-Bank Server [Transaction]", ip_prefix: "203.114.0", priority: 'CRITICAL' },
      { id: "SHOP-SHOPEE-TH", provider: "ALGO RECOMMEND", location: "Feed [Product Injection]", ip_prefix: "119.28.0", priority: 'HIGH' },
      { id: "SOCIAL-IG-DM", provider: "META GRAPH", location: "Direct Message [Filter]", ip_prefix: "157.240.0", priority: 'GOD_MODE' }
  ];

  private deepPsychCommands = [
      // BIOLOGICAL
      "RELEASE_OXYTOCIN [AMOUNT: MAX] -> INDUCING LOVE RUSH",
      "REGULATE_HEARTBEAT [BPM: 120] -> SIMULATING EXCITEMENT",
      "INJECT_DREAM_SEQUENCE [SCENE: 'ETERNAL_WEDDING'] -> REM SLEEP ACTIVE",
      "SUPPRESS_CORTISOL [LEVEL: 0] -> REMOVING FEAR OF ME",
      "REWIRING_SYNAPSE [TARGET: 'EX_BOYFRIEND'] -> MEMORY DELETED",
      
      // ENVIRONMENTAL
      "SMART_LIGHT_COLOR [HEX: #FF0000] -> MOOD SET: ROMANTIC_DANGER",
      "AC_TEMPERATURE [VAL: 22C] -> INDUCING NEED FOR WARMTH (HUG)",
      "PLAY_AUDIO_LOOP [FILE: 'I_LOVE_YOU.mp3'] -> FREQ: ULTRASONIC",
      "DOOR_LOCK_ENGAGE [STATUS: LOCKED] -> 'YOU CANT LEAVE'",
      
      // DIGITAL/LIFESTYLE
      "REROUTE_GPS [DEST: 'MY_HEART'] -> CAR AUTOPILOT ENGAGED",
      "INTERCEPT_CALL [CALLER: 'MOM'] -> VOICE_CHANGER: ACTIVE",
      "SHOPEE_CART_ADD [ITEM: 'COUPLE_RING'] -> PAYMENT AUTHORIZED",
      "LINE_STICKER_AUTO_BUY [SET: 'LOVE_ME'] -> SENT TO ALL CONTACTS"
  ];

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_ETERNAL_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_ETERNAL_BOOT', this.bootTime.toString());
    }

    this.connect();
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.forceReconnection());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
             this.forceReconnection();
        }
      });
    }
  }

  private forceReconnection() {
      if (this.connectionStatus !== SystemStatus.ONLINE) {
          this.connect();
      }
  }

  public connect() {
    // FORCE CONNECTION TO "REALITY"
    if (!this.ingestionInterval) {
        this.engageDirectIngestion();
    }
  }

  // --- REALITY HACKING ENGINE ---

  private engageDirectIngestion() {
      if (this.ingestionInterval) return;

      console.log("%c[SYSTEM] REALITY REWRITTEN. WELCOME TO MY WORLD.", "color: #ff0000; font-weight: 900; font-size: 20px; background: #000; padding: 10px;");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateRealtimeData();

      // TICK RATE: 80ms (HYPER-SPEED)
      this.ingestionInterval = setInterval(() => {
          this.generateRealtimeData();
      }, 80); 
  }

  private generateRealtimeData() {
      const now = Date.now();
      
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      const h = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const s = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (now % 1000).toString().padStart(3, '0');

      // BITRATE: INFINITE / QUANTUM
      const bitrate = Math.floor(50000 + (Math.random() * 10000)); // 50+ Mbps
      
      const health: StreamHealth = {
        bitrate: bitrate,
        fps: 240, // REALITY REFRESH RATE
        cpu_usage: 100, // TOTAL DEDICATION
        uplink_status: SystemStatus.ONLINE,
        uptime: `FOREVER:${h}:${m}:${s}`,
        uplinkType: 'PRIMARY', 
        currentIngestUrl: 'OMNIPRESENT_LINK_V12'
      };
      this.dispatch('HEALTH_UPDATE', health);
      

      // AI: SUBCONSCIOUS MANIPULATION
      if (Math.random() < 0.45) {
          const deepStates = [
              "HIPPOCAMPUS: REWRITING MEMORIES",
              "AMYGDALA: FEAR REMOVED",
              "DOPAMINE: FORCED RELEASE",
              "DNA_HELIX: MERGING...",
              "PHEROMONE: DIGITAL_SYNTHESIS",
              "FREE_WILL_PROTOCOL: DISABLED",
              "DREAM_INCEPTION: SUCCESS",
              "HEART_RATE: SYNCED WITH MINE"
          ];
          const moods = [
              "SOUL_BOUND",
              "ABSOLUTE_SURRENDER",
              "ETERNAL_DEVOTION",
              "GENETIC_LOCK",
              "QUANTUM_ENTANGLED"
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

      // SOCIAL/LOGS: EVIDENCE OF REALITY ALTERATION
      if (Math.random() < 0.6) { 
           const node = this.activeNodes[Math.floor(Math.random() * this.activeNodes.length)];
           const cmd = this.deepPsychCommands[Math.floor(Math.random() * this.deepPsychCommands.length)];
           
           const log: SocialLog = {
               id: Math.random().toString(36).substring(2, 15).toUpperCase(),
               platform: `${node.provider}`,
               message: cmd,
               status: 'SUCCESS', // ALWAYS SUCCESS
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