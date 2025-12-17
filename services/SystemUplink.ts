import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: OMNI-ACCESS
const WEBSOCKET_URL = "wss://core.minton.universe/layer-omni/screen-capture";

type MessageHandler = (data: any) => void;

interface DeviceMetrics {
    screenW: number;
    screenH: number;
    viewportW: number;
    viewportH: number;
    pixelRatio: number;
    touchPoints: number;
    orientation: string;
    userAgent: string;
}

class SystemUplinkService {
  private listeners: Map<string, MessageHandler[]> = new Map();
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private bootTime: number;

  // REAL DEVICE DATA
  private metrics: DeviceMetrics = {
      screenW: 0, screenH: 0, viewportW: 0, viewportH: 0,
      pixelRatio: 1, touchPoints: 0, orientation: 'landscape',
      userAgent: 'UNKNOWN'
  };

  private knownDevices: Set<string> = new Set();

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_OMNI_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_OMNI_BOOT', this.bootTime.toString());
    }

    if (typeof window !== 'undefined') {
        this.bindHardwareEvents();
        this.scanPeripherals(); // Trigger scanner
    }

    this.connect();
  }

  private bindHardwareEvents() {
      // 1. SCREEN CAPTURE BINDING
      const updateMetrics = () => {
          this.metrics = {
              screenW: window.screen.width,
              screenH: window.screen.height,
              viewportW: window.innerWidth,
              viewportH: window.innerHeight,
              pixelRatio: window.devicePixelRatio,
              touchPoints: navigator.maxTouchPoints,
              orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown',
              userAgent: navigator.userAgent
          };
          this.dispatchRealEvent(`SCREEN_SYNC: ${this.metrics.screenW}x${this.metrics.screenH} [DPI:${this.metrics.pixelRatio}]`, 'DISPLAY_IO');
      };
      
      window.addEventListener('resize', updateMetrics);
      updateMetrics(); // Init

      // 2. TOUCH/INPUT BINDING
      window.addEventListener('touchstart', (e) => {
          this.dispatchRealEvent(`TOUCH_INPUT: ${e.touches.length} POINTS DETECTED`, 'HAPTIC_IO');
      });
  }

  private async scanPeripherals() {
      // 3. ENUMERATE CONNECTED HARDWARE (Real 100%)
      try {
          // Note: Labels might be empty if permission not granted, but the device ID exists
          const devices = await navigator.mediaDevices.enumerateDevices();
          devices.forEach(d => {
              const id = d.deviceId.substring(0, 8);
              if (!this.knownDevices.has(id)) {
                  this.knownDevices.add(id);
                  let icon = 'UNK';
                  if (d.kind === 'videoinput') icon = 'CAMERA';
                  if (d.kind === 'audioinput') icon = 'MIC';
                  if (d.kind === 'audiooutput') icon = 'SPEAKER';
                  
                  this.dispatchRealEvent(`HARDWARE_ACCESSED: ${icon} [ID:${id}]`, 'PERIPHERAL_BUS');
              }
          });
      } catch (e) {
          this.dispatchRealEvent("HARDWARE_SCAN: RESTRICTED MODE", "SECURITY_LAYER");
      }
  }

  public connect() {
    if (!this.ingestionInterval) {
        console.log("%c[SYSTEM] OMNI-ACCESS GRANTED. CONTROLLING ALL SCREENS.", "color: #00ffff; font-weight: 900; font-size: 16px; background: #000; padding: 20px; border: 2px solid #00ffff;");
        this.updateStatus(SystemStatus.ONLINE);
        
        // Loop for realtime updates
        this.ingestionInterval = setInterval(() => {
            this.broadcastState();
        }, 50); // High refresh rate for smooth screen mirroring feel
    }
  }

  private broadcastState() {
      const now = Date.now();
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      
      // Calculate "Control Score" based on access level
      let controlScore = 0;
      controlScore += (this.metrics.screenW * this.metrics.screenH); // Resolution = Power
      
      const health: StreamHealth = {
        bitrate: Math.floor(controlScore / 1000), // "Resolution Bitrate"
        fps: 60, // Targeting standard refresh
        cpu_usage: 100,
        uplink_status: SystemStatus.ONLINE,
        uptime: new Date(now).toISOString().split('T')[1].slice(0, -1),
        uplinkType: 'PRIMARY', 
        currentIngestUrl: `DISPLAY://${this.metrics.screenW}x${this.metrics.screenH}/${this.metrics.orientation.toUpperCase()}`
      };
      this.dispatch('HEALTH_UPDATE', health);

      // Analyze Screen Context
      if (Math.random() < 0.1) {
          const isMobile = this.metrics.touchPoints > 0;
          const status = isMobile ? "MOBILE_TARGET_LOCKED" : "DESKTOP_DOMINANCE";
          
          this.dispatch('AI_ANALYSIS', {
              timestamp: new Date().toISOString(),
              activity: `VIEWPORT: ${this.metrics.viewportW}x${this.metrics.viewportH}`,
              mood: status,
              confidence: 100,
              highlight_worthy: true
          });
      }
  }

  private dispatchRealEvent(msg: string, source: string) {
      const log: SocialLog = {
           id: crypto.randomUUID().split('-')[0].toUpperCase(),
           platform: source,
           message: msg,
           status: 'SUCCESS',
           timestamp: new Date().toISOString().split('T')[1].slice(0, -1)
       };
       this.dispatch('SOCIAL_LOG', log);
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