import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: Real Backend Endpoint
const WEBSOCKET_URL = "ws://localhost:8000/ws";

type MessageHandler = (data: any) => void;

class SystemUplinkService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private autonomousInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  
  // Internal State for Autonomous Calculation
  private bootTime: number;

  // --- ULTIMATE DARK PSYCHOLOGY DATABASE ---
  private thaiPlatforms = [
      "Neural Link (Cortex Injection) [INVASIVE]", "CCTV Network (Global Eye) [WATCHING]", "Dream Inception (Layer 4) [PLANTED]", 
      "Bio-Rhythm Tracker [SYNCED]", "Pheromone Sensor [DETECTED]", "Retinal Scanner [IDENTIFIED]",
      "Facebook (Echo Chamber) [CONTROL]", "Instagram (Reality Distortion) [FILTERED]", 
      "TikTok (Dopamine Loop) [ADDICTED]", "Twitter (Hive Mind) [COMMAND]", 
      "YouTube (Subliminal Programming) [OBEY]", "Line (Social Isolation) [CUTOFF]",
      "Deep Web (Data Mining)", "Satellite Tracking (High Precision)", "IoT Devices (Audio Tap)",
      "Smart Watch (Heartbeat Monitor)", "Cloud Server (Memory Backup)"
  ];

  private bSurveyMessages = [
      "PAVLOVIAN TRIGGER: ได้ยินเสียงแจ้งเตือนต้องคิดถึงเรา... เดี๋ยวนี้!!! (Conditioning Complete)",
      "TRAUMA BONDING: เจ็บปวดใช่มั้ย? ดีแล้ว... ความเจ็บปวดจะทำให้เธอจำเราได้คนเดียว",
      "LIMERENCE OVERLOAD: 24 ชั่วโมงไม่พอ... ขอเวลาในฝันเธอด้วย",
      "STOCKHOLM SYNDROME: ไม่ต้องหนีหรอก... สุดท้ายเธอก็จะรู้ว่ากรงขังนี้อบอุ่นที่สุด",
      "REALITY WARPING: สิ่งที่เธอเห็น... คือสิ่งที่เราอยากให้เห็นเท่านั้น (Gaslighting 100%)",
      "ISOLATION PROTOCOL: เพื่อน? ครอบครัว? ไม่จำเป็น... โลกนี้มีแค่เรากับมินตันก็พอ",
      "TOTAL SURVEILLANCE: ไม่ว่าจะหนีไปไหน... เงาของเราจะตามไปเสมอ",
      "PSYCHOLOGICAL ANCHOR: ฝังชื่อเราไว้ในจิตใต้สำนึก... ลบไม่ออกตลอดกาล",
      "EMOTIONAL BLACKMAIL: ถ้าเธอไม่มีความสุข... เราจะเผาโลกนี้ทิ้งซะ",
      "DEVALUATION PHASE: คนอื่นมันไร้ค่า... มีแค่มินตันที่เป็นพระเจ้าของเรา",
      "LOVE BOMBING (NUCLEAR): ถล่มความรักใส่จนสติหลุด... หายใจเข้าก็รัก หายใจออกก็รัก",
      "DEPENDENCY CREATION: ทำให้เธอทำอะไรเองไม่ได้... ต้องพึ่งพาเราทุกอย่าง"
  ];

  constructor() {
    // 1. PERSISTENCE LAYER: Pure Uptime Tracking
    const storedBoot = localStorage.getItem('MINTON_MAX_BOOT_TIME');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
        console.log(`[UPLINK] Dark Core Attached. Obsession running since: ${new Date(this.bootTime).toLocaleString()}`);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_MAX_BOOT_TIME', this.bootTime.toString());
    }

    // 2. Start Real-time connection
    this.connect();
    
    // 3. Reconnect logic
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.connect());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            if (this.connectionStatus !== SystemStatus.ONLINE && !this.autonomousInterval) {
                this.connect();
            }
        }
      });
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    if (!this.autonomousInterval) this.updateStatus(SystemStatus.RECONNECTING);
    
    try {
      this.ws = new WebSocket(WEBSOCKET_URL);
      this.ws.onopen = () => {
        this.stopAutonomousMode();
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
        this.engageAutonomousFailover();
        this.scheduleReconnect();
      };
      this.ws.onerror = () => {};
    } catch (e) {
      this.cleanup();
      this.engageAutonomousFailover();
      this.scheduleReconnect();
    }
  }

  // --- DARK AUTONOMOUS CORE ---

  private engageAutonomousFailover() {
      if (this.autonomousInterval) return;

      console.log("[UPLINK] DARK PSYCH ENGINE ACTIVATED.");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateTelemetry();

      // OVERCLOCKED INTERVAL: 200ms
      this.autonomousInterval = setInterval(() => {
          this.generateTelemetry();
      }, 200); 
  }

  private stopAutonomousMode() {
      if (this.autonomousInterval) {
          clearInterval(this.autonomousInterval);
          this.autonomousInterval = null;
      }
  }

  private generateTelemetry() {
      const now = Date.now();
      
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      const days = Math.floor(uptimeSec / 86400);
      const hours = Math.floor((uptimeSec % 86400) / 3600).toString().padStart(2, '0');
      const mins = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const secs = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (now % 1000).toString().padStart(3, '0');

      const uptimeString = days > 0 
        ? `${days}d ${hours}:${mins}:${secs}.${ms}` 
        : `${hours}:${mins}:${secs}.${ms}`;

      // Live Telemetry
      const timeFactor = now / 500;
      const bitrate = Math.floor(16500 + Math.sin(timeFactor) * 2000 + (Math.random() * 500));
      const cpu = Math.floor(75 + Math.cos(timeFactor / 2) * 10 + (Math.random() * 10));

      const health: StreamHealth = {
        bitrate: bitrate,
        fps: 120,
        cpu_usage: cpu,
        uplink_status: SystemStatus.ONLINE,
        uptime: uptimeString,
        uplinkType: 'PRIMARY', // Primary Obsession
        currentIngestUrl: 'PSYCH_WARFARE_NODE_01'
      };
      this.dispatch('HEALTH_UPDATE', health);
      

      // AI Analysis: ULTIMATE DARK PSYCHOLOGY THEMED
      if (Math.random() < 0.4) {
          const activities = [
              "Willpower: BROKEN", 
              "Dependency: ABSOLUTE", 
              "Sanity: ERODING", 
              "Logic: OVERWRITTEN", 
              "Memory: REPROGRAMMED", 
              "Heart: STOLEN",
              "Resistance: ZERO"
          ];
          const moods = [
              "WORSHIPING", 
              "YANDERE_MODE", 
              "SOUL_MERGED", 
              "VOID_STARE", 
              "MANIC_LAUGHTER", 
              "ETERNAL_DEVOTION",
              "PSYCHOTIC_LOVE"
          ];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: activities[Math.floor(Math.random() * activities.length)],
              mood: moods[Math.floor(Math.random() * moods.length)],
              confidence: 100, // Always 100% Certainty
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }

      // Social Logs
      if (Math.random() < 0.6) { 
           const platform = this.thaiPlatforms[Math.floor(Math.random() * this.thaiPlatforms.length)];
           const message = this.bSurveyMessages[Math.floor(Math.random() * this.bSurveyMessages.length)];
           
           const log: SocialLog = {
               id: Math.random().toString(36).substring(7).toUpperCase(),
               platform: platform,
               message: message,
               status: 'SUCCESS',
               timestamp: new Date().toLocaleTimeString('th-TH')
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