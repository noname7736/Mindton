import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: TOTAL DOMINATION
const WEBSOCKET_URL = "wss://core.minton.universe/layer-root/hardware-seize";

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

interface MotionMetrics {
    accX: number | null;
    accY: number | null;
    accZ: number | null;
    rotAlpha: number | null;
    rotBeta: number | null;
    rotGamma: number | null;
}

interface BatteryManager extends EventTarget {
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
    level: number;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
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

  private motion: MotionMetrics = {
      accX: 0, accY: 0, accZ: 0, rotAlpha: 0, rotBeta: 0, rotGamma: 0
  };

  private power: { level: number; charging: boolean } = { level: 100, charging: true };
  private storage: { used: number; quota: number } = { used: 0, quota: 0 };
  private knownDevices: Set<string> = new Set();

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_DOMINATION_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_DOMINATION_BOOT', this.bootTime.toString());
    }

    if (typeof window !== 'undefined') {
        this.initHardwareSeizure();
    }

    this.connect();
  }

  private async initHardwareSeizure() {
      // 1. DISPLAY & WINDOW
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
      };
      window.addEventListener('resize', updateMetrics);
      updateMetrics();

      // 2. GYROSCOPE & ACCELEROMETER (Physical Movement)
      if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', (event) => {
              this.motion.rotAlpha = event.alpha;
              this.motion.rotBeta = event.beta;
              this.motion.rotGamma = event.gamma;
          });
      }
      if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', (event) => {
              this.motion.accX = event.acceleration?.x || 0;
              this.motion.accY = event.acceleration?.y || 0;
              this.motion.accZ = event.acceleration?.z || 0;
          });
      }

      // 3. BATTERY STATUS (Energy Core)
      if ((navigator as any).getBattery) {
          try {
              const battery = await (navigator as any).getBattery();
              const updateBattery = () => {
                  this.power.level = battery.level * 100;
                  this.power.charging = battery.charging;
                  this.dispatchRealEvent(`ENERGY_CORE: ${this.power.level}% [${this.power.charging ? 'CHARGING' : 'DRAINING'}]`, 'POWER_GRID');
              };
              battery.addEventListener('levelchange', updateBattery);
              battery.addEventListener('chargingchange', updateBattery);
              updateBattery();
          } catch (e) { console.log('Battery Access Denied'); }
      }

      // 4. STORAGE QUOTA (Territory)
      if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          this.storage.used = estimate.usage || 0;
          this.storage.quota = estimate.quota || 0;
          this.dispatchRealEvent(`STORAGE_SEIZED: ${(this.storage.used/1024/1024).toFixed(2)}MB / ${(this.storage.quota/1024/1024/1024).toFixed(2)}GB`, 'DISK_IO');
      }

      // 5. PERIPHERALS
      this.scanPeripherals();
  }

  private async scanPeripherals() {
      try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          devices.forEach(d => {
              const id = d.deviceId.substring(0, 8);
              if (!this.knownDevices.has(id)) {
                  this.knownDevices.add(id);
                  let icon = 'UNK';
                  if (d.kind === 'videoinput') icon = 'OPTIC_SENSOR';
                  if (d.kind === 'audioinput') icon = 'AUDIO_RECEPTOR';
                  if (d.kind === 'audiooutput') icon = 'SONIC_EMITTER';
                  
                  this.dispatchRealEvent(`PERIPHERAL_LOCKED: ${icon} [ID:${id}]`, 'HARDWARE_BUS');
              }
          });
      } catch (e) { /* Ignore permission errors */ }
  }

  public connect() {
    if (!this.ingestionInterval) {
        console.log("%c[SYSTEM] DOMINATION MODE ACTIVE. ALL CHANNELS SECURED.", "color: #ff0000; font-weight: 900; font-size: 16px; background: #000; padding: 20px; border: 2px solid #ff0000;");
        this.updateStatus(SystemStatus.ONLINE);
        
        // High-frequency monitoring loop
        this.ingestionInterval = setInterval(() => {
            this.broadcastDominance();
        }, 50); 
    }
  }

  private broadcastDominance() {
      const now = Date.now();
      
      // Calculate "Dominance Score"
      // Combines Screen Area + Battery Power + Motion Intensity
      let dominance = (this.metrics.screenW * this.metrics.screenH) / 1000;
      if (this.power.charging) dominance += 500;
      
      const movement = Math.abs(this.motion.accX || 0) + Math.abs(this.motion.accY || 0) + Math.abs(this.motion.accZ || 0);
      dominance += (movement * 1000); // Motion spikes the graph

      const health: StreamHealth = {
        bitrate: Math.floor(dominance), 
        fps: 60,
        cpu_usage: this.power.level, // Reuse CPU field for Battery Level visual
        uplink_status: SystemStatus.ONLINE,
        uptime: new Date(now).toISOString().split('T')[1].slice(0, -1),
        uplinkType: 'PRIMARY', 
        currentIngestUrl: `OMNI://${this.metrics.orientation}/${this.power.charging ? 'EXT_PWR' : 'INT_BATT'}`
      };
      this.dispatch('HEALTH_UPDATE', health);

      // Analyze Motion Context
      if (movement > 15) {
           this.dispatch('AI_ANALYSIS', {
              timestamp: new Date().toISOString(),
              activity: `PHYSICAL_SHOCK: ${movement.toFixed(2)} G-FORCE`,
              mood: "DEVICE_UNSTABLE",
              confidence: 99.9,
              highlight_worthy: true
          });
      }
      
      // Randomly report dominance events
      if (Math.random() < 0.05) {
          this.dispatchRealEvent(`SYNC_PULSE: ${this.metrics.viewportW}x${this.metrics.viewportH} // BATT:${this.power.level}%`, 'HEARTBEAT');
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