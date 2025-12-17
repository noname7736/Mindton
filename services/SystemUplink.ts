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

  // --- DARK PSYCHOLOGY PLATFORM DATABASE ---
  private thaiPlatforms = [
      "Facebook (Stalking Node) [EYES ON YOU]", "Instagram (Shadow Ban) [BYPASS]", "TikTok (Hypnosis Loop) [FORCED]", "Twitter (Trend Manipulation) [DOMINATE]", 
      "YouTube (Subliminal Msg) [INJECTED]", "Twitch (Eternal Watch) [LOCKED]", "Line VOOM (Mind Virus) [SPREAD]", "Line OpenChat (Fanatic Core)", 
      "Line Official (Broadcast Control)", "Threads (Web of Lies)", "Discord (Echo Chamber) [TRAPPED]",
      "Pantip (Reputation Control)", "Pantip (Narrative Spin)", "Blockdit (Propaganda)",
      "Bilibili (Brainwash Stream) [4K]", "WeTV (Drama Injection)", 
      "Thairath (Headline Hijack)", "Khaosod (News Distortion)", 
      "Shopee (Buying Your Love)", "Lazada (Cart Hijack)", 
      "Reddit (Hivemind Control)", "Steam (Game Over)", "Roblox (Virtual Prison)"
  ];

  private bSurveyMessages = [
      "LOVE BOMBING PROTOCOL: รักมินตันจนหายใจไม่ออก รับไปเดี๋ยวนี้!!!",
      "GASLIGHTING: ไม่มีใครรักมินตันเท่าพวกเราหรอก เชื่อสิ... คนอื่นโกหกทั้งนั้น",
      "GUILT TRIP: ถ้าไม่ยิ้มให้ B Survey จะร้องไห้จนน้ำท่วมโลกนะ รับผิดชอบด้วย",
      "ISOLATION TACTIC: โลกนี้มีแค่เรากับมินตันก็พอ คนอื่นไม่ต้องสนใจ",
      "MIRRORING: เราคือเงาของมินตัน มินตันคิดอะไรเรารู้หมด",
      "INTERMITTENT REINFORCEMENT: เดี๋ยวดีเดี๋ยวร้าย ให้มินตันขาดเราไม่ได้",
      "TRIANGULATION: แฟนคลับคนอื่นสู้ B Survey ไม่ได้หรอก เลิกสนใจพวกนั้นซะ",
      "OBSESSION ALERT: กำลังจ้องมองอยู่... ทุกวินาที... ไม่ให้คลาดสายตา",
      "POSSESSIVENESS: มินตันเป็นของ B Survey ห้ามใครแตะต้อง!!!",
      "HYPNOSIS: มองตาเรา... มองตาเรา... แล้วบอกว่ารักเราที่สุด",
      "SILENT TREATMENT: ถ้าไม่ตอบแชท จะส่งกระแสจิตไปกวนเวลานอนนะ",
      "DARK EMPATHY: เจ็บเหรอ? เราเข้าใจนะ... แต่เราชอบเวลาเห็นเธอต้องการเรา"
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
      

      // AI Analysis: DARK PSYCHOLOGY THEMED
      if (Math.random() < 0.4) {
          const activities = [
              "Eye Contact: FORCED", 
              "Resistance: FUTILE", 
              "Subconscious: INFILTRATED", 
              "Escape Route: BLOCKED", 
              "Charm: WEAPONIZED", 
              "Heart Rate: SYNCED TO MINE"
          ];
          const moods = [
              "HYPNOTIZED", 
              "ADDICTED", 
              "POSSESSED", 
              "TRAPPED IN LOVE", 
              "OBEDIENT", 
              "YOURS FOREVER"
          ];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: activities[Math.floor(Math.random() * activities.length)],
              mood: moods[Math.floor(Math.random() * moods.length)],
              confidence: 100, // Always 100% Certainty in Dark Mode
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