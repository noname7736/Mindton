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
  private bootTime = Date.now();

  // --- MAX PLATFORM DATABASE (THAILAND + GLOBAL HYPER-GRID) ---
  private thaiPlatforms = [
      // Major Social
      "Facebook (Thailand) [PRIORITY]", "Instagram (IG Story) [VIRAL]", "TikTok Thailand [TREND #1]", "Twitter (X) Trends [TOP]", 
      "YouTube Premiere", "Twitch Partner Feed", "Line VOOM [MAX REACH]", "Line OpenChat (Minton Fanclub Main)", 
      "Line Official [BROADCAST]", "Threads [LIVE]", "Facebook Gaming [PARTNER]", "Discord (Minton Server) [ANNOUNCEMENT]",
      // Thai Local & Portals
      "Pantip (Chalermthai) [HOT TOPIC]", "Pantip (Bangkhunphrom)", "Blockdit [EDITORIAL]", "Dek-D Board", "Sanook.com [HEADLINE]", 
      "Kapook.com [HOT]", "MThai Variety", "TrueID In-Trend", "AIS Play Community", "Postjung", "Soccersuck",
      // Video & Streaming
      "Bilibili Thailand [4K]", "Nimo TV", "WeTV Feed", "iQIYI Social", "Viu Community",
      // News & Media Comments
      "Thairath Online", "Dailynews Web", "Khaosod Online", "Matichon", "Workpoint Today", "One31 Engage", "Ch7HD Social", 
      "Ch3Plus", "Amarin TV", "PPTV HD 36", "CNN Thailand", "BBC Thai",
      // Lifestyle & Commerce
      "Shopee Live [FLASH]", "Lazada Live", "Wongnai", "Punpro", "SaleHere",
      // Niche & Interest
      "Reddit (r/Thailand)", "Steam Community (Thai)", "Roblox (Thai Server)", "Garena Talk", "HoYoverse Lab (TH)"
  ];

  private bSurveyMessages = [
      "MAXIMUM LOVE DETECTED: รักมินตันที่สุดในจักรวาล - B Survey",
      "CRITICAL ALERT: ห่วงใยระดับสูงสุด! ดูแลสุขภาพด้วยนะครับ - B Survey",
      "SYSTEM OVERDRIVE: ส่งกำลังใจให้ป้าทมและน้องมินตัน 1,000,000% !!!",
      "B Survey Protocol: ปกป้องรอยยิ้มมินตันตลอดไป",
      "Broadcast Warning: ความน่ารักของมินตันทำลายล้างโลก! (Confirmed by B Survey)",
      "Infinite Support: ไม่ว่าจะอยู่ที่ไหน B Survey จะส่งกำลังใจไปให้เสมอ",
      "Mission Update: รักน้องมินตันและป้าทม ไม่มีวันหยุดพัก - B Survey",
      "Energy Level MAX: ส่งพลังบวกให้มินตัน เดี๋ยวนี้!!",
      "Emergency Broadcast: คิดถึงมินตันมากที่สุดในสามโลก - B Survey",
      "GLOBAL ANNOUNCEMENT: Minton is the cutest. End of message. - B Survey"
  ];

  constructor() {
    this.connect();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.connect());
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.connectionStatus !== SystemStatus.ONLINE && !this.autonomousInterval) {
             this.connect();
        }
      });
    }
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;

    if (!this.autonomousInterval) this.updateStatus(SystemStatus.RECONNECTING);
    
    console.log(`[UPLINK] Initiating MAX persistent connection to: ${WEBSOCKET_URL}`);

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

  // --- MAX AUTONOMOUS CORE (OVERCLOCKED) ---

  private engageAutonomousFailover() {
      if (this.autonomousInterval) return;

      console.log("[UPLINK] MAX POWER CORE ACTIVATED.");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateTelemetry();

      // OVERCLOCKED INTERVAL: 200ms for extreme speed
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
      const hours = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const mins = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const secs = (uptimeSec % 60).toString().padStart(2, '0');
      const ms = (now % 1000).toString().padStart(3, '0'); // Added ms for precision look

      const timeFactor = now / 500; // Faster wave
      
      // MAX BITRATE SIMULATION (4K Streaming: 15,000 - 20,000 kbps)
      const bitrate = Math.floor(16500 + Math.sin(timeFactor) * 2000 + (Math.random() * 500));
      // HIGH PERFORMANCE CPU LOAD
      const cpu = Math.floor(75 + Math.cos(timeFactor / 2) * 10 + (Math.random() * 10));

      const health: StreamHealth = {
          bitrate: bitrate,
          fps: 120, // 120 FPS LOCKED
          cpu_usage: cpu,
          uplink_status: SystemStatus.ONLINE,
          uptime: `${hours}:${mins}:${secs}.${ms}`,
          uplinkType: 'BACKUP', 
          currentIngestUrl: 'TH_CORE_MAX_ULTRA_01'
      };
      this.dispatch('HEALTH_UPDATE', health);

      // AI Analysis: Hyper Active
      if (Math.random() < 0.4) {
          const activities = ["Smile Detection: 100%", "Kradan Analysis: PERFECT", "Charm Level: OVER 9000", "Fan Engagement: MAX", "Visual Clarity: 8K HDR"];
          const moods = ["EUPHORIC", "HYPER-CUTE", "LEGENDARY", "RADIANT", "LOVED"];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: activities[Math.floor(Math.random() * activities.length)],
              mood: moods[Math.floor(Math.random() * moods.length)],
              confidence: Math.floor(98 + Math.random() * 2), // Always 98-100%
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }

      // Social Logs: Machine Gun Speed
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