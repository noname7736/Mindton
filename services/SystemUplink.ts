import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog, NetworkStats, GeoStats, HardwareStats } from '../types';

// CONFIGURATION: FINALITY
const WEBSOCKET_URL = "wss://core.minton.universe/layer-final/omni-presence";

type MessageHandler = (data: any) => void;

interface MotionMetrics {
    accX: number | null;
    accY: number | null;
    accZ: number | null;
    rotAlpha: number | null;
    rotBeta: number | null;
    rotGamma: number | null;
}

class SystemUplinkService {
  private listeners: Map<string, MessageHandler[]> = new Map();
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private ingestionInterval: ReturnType<typeof setInterval> | null = null;
  private bootTime: number;

  // 100% REAL DATA CONTAINERS
  private motion: MotionMetrics = { accX: 0, accY: 0, accZ: 0, rotAlpha: 0, rotBeta: 0, rotGamma: 0 };
  private power: { level: number; charging: boolean } = { level: 100, charging: true };
  private network: NetworkStats = { downlink: 0, rtt: 0, effectiveType: 'UNKNOWN' };
  private geo: GeoStats = { lat: null, lng: null, accuracy: null };
  private hardware: HardwareStats = { cores: navigator.hardwareConcurrency || 1, memory: (navigator as any).deviceMemory || 0 };
  
  private knownDevices: Set<string> = new Set();

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_FINAL_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_FINAL_BOOT', this.bootTime.toString());
    }

    if (typeof window !== 'undefined') {
        this.initTotalSurveillance();
    }
    this.connect();
  }

  private async initTotalSurveillance() {
      // 1. MOTION SENSORS (Gyro/Accel)
      if (window.DeviceOrientationEvent) {
          window.addEventListener('deviceorientation', (e) => {
              this.motion.rotAlpha = e.alpha; this.motion.rotBeta = e.beta; this.motion.rotGamma = e.gamma;
          });
      }
      if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion', (e) => {
              this.motion.accX = e.acceleration?.x || 0;
              this.motion.accY = e.acceleration?.y || 0;
              this.motion.accZ = e.acceleration?.z || 0;
          });
      }

      // 2. POWER CORE (Battery)
      if ((navigator as any).getBattery) {
          try {
              const b = await (navigator as any).getBattery();
              const upB = () => { 
                  this.power.level = b.level * 100; 
                  this.power.charging = b.charging; 
                  this.dispatchLog(`POWER_GRID: ${this.power.level}% [${this.power.charging ? 'EXT' : 'INT'}]`, 'SYS_PWR');
              };
              b.addEventListener('levelchange', upB);
              b.addEventListener('chargingchange', upB);
              upB();
          } catch(e){}
      }

      // 3. NETWORK INTELLIGENCE (Connection API)
      const conn = (navigator as any).connection;
      if (conn) {
          const upN = () => {
              this.network = {
                  downlink: conn.downlink,
                  rtt: conn.rtt,
                  effectiveType: conn.effectiveType.toUpperCase()
              };
              this.dispatchLog(`NET_IO: ${this.network.effectiveType} // ${this.network.downlink}Mbps`, 'NET_OP');
          };
          conn.addEventListener('change', upN);
          upN();
      }

      // 4. GEOSPATIAL LOCK (Geolocation)
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
              (pos) => {
                  this.geo = {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                      accuracy: pos.coords.accuracy
                  };
                  this.dispatchLog(`GEO_LOCK: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`, 'SAT_LINK');
              },
              (err) => { /* Silently fail or log denial */ },
              { enableHighAccuracy: true }
          );
      }

      // 5. PERIPHERALS SCAN
      this.scanDevices();
  }

  private async scanDevices() {
      try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          devices.forEach(d => {
              const id = d.deviceId.substring(0,6);
              if(!this.knownDevices.has(id)) {
                  this.knownDevices.add(id);
                  this.dispatchLog(`HARDWARE_FOUND: ${d.kind.toUpperCase()} [${d.label || 'HIDDEN'}]`, 'HW_BUS');
              }
          });
      } catch(e){}
  }

  public connect() {
    if (!this.ingestionInterval) {
        console.log("%c[SYSTEM] FINALITY STATE. TOTAL OBSERVATION.", "color: #ff0000; background: #000; font-size: 20px; font-weight: bold; border: 4px double #ff0000;");
        this.connectionStatus = SystemStatus.ONLINE;
        this.ingestionInterval = setInterval(() => this.broadcast(), 50);
    }
  }

  private broadcast() {
      const now = Date.now();
      
      // Calculate Kinetic Intensity
      const movement = Math.abs(this.motion.accX||0) + Math.abs(this.motion.accY||0) + Math.abs(this.motion.accZ||0);
      
      // Calculate "System Pressure" (Bitrate simulation based on real Network + Cores)
      const baseLoad = (this.hardware.cores * 1000) + (this.network.downlink * 100);
      const pressure = baseLoad + (movement * 500);

      const health: StreamHealth = {
        bitrate: Math.floor(pressure),
        fps: 60, // UI Refresh target
        cpu_usage: this.power.level, // Battery
        uplink_status: SystemStatus.ONLINE,
        uptime: new Date(now).toISOString().split('T')[1].slice(0, -1),
        uplinkType: 'PRIMARY',
        currentIngestUrl: `OMNI://${this.hardware.cores}CORE/${this.hardware.memory}GB`,
        
        // Detailed Payloads
        network: this.network,
        geo: this.geo,
        hardware: this.hardware,
        motionIntensity: movement
      };

      this.dispatch('HEALTH_UPDATE', health);

      if (movement > 20) {
          this.dispatch('AI_ANALYSIS', {
              timestamp: new Date().toISOString(),
              activity: `KINETIC_SPIKE: ${movement.toFixed(1)}G`,
              mood: "DEVICE_AGITATION",
              confidence: 100,
              highlight_worthy: true
          });
      }
  }

  private dispatchLog(msg: string, platform: string) {
       this.dispatch('SOCIAL_LOG', {
           id: crypto.randomUUID().split('-')[0],
           platform, message: msg, status: 'SUCCESS',
           timestamp: new Date().toISOString().split('T')[1].slice(0, -1)
       });
  }

  // --- PUB/SUB ---
  public subscribe(type: string, handler: MessageHandler) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type)?.push(handler);
  }
  public unsubscribe(type: string, handler: MessageHandler) {
    const h = this.listeners.get(type);
    if (h) this.listeners.set(type, h.filter(x => x !== handler));
  }
  private dispatch(type: string, payload: any) {
    this.listeners.get(type)?.forEach(h => h(payload));
  }
  public onStatusChange(cb: (s: SystemStatus) => void) { cb(this.connectionStatus); }
}

export const SystemUplink = new SystemUplinkService();