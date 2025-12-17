import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog, NetworkStats, GeoStats, HardwareStats } from '../types';

// CONFIGURATION: BEE SURVEY LOVE LINK
const WEBSOCKET_URL = "wss://love.beesurvey.heart/eternal-link";

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

  // DATA CONTAINERS
  private motion: MotionMetrics = { accX: 0, accY: 0, accZ: 0, rotAlpha: 0, rotBeta: 0, rotGamma: 0 };
  private power: { level: number; charging: boolean } = { level: 100, charging: true };
  private network: NetworkStats = { downlink: 0, rtt: 0, effectiveType: 'UNKNOWN' };
  private geo: GeoStats = { lat: null, lng: null, accuracy: null };
  private hardware: HardwareStats = { cores: navigator.hardwareConcurrency || 1, memory: (navigator as any).deviceMemory || 0 };
  
  private knownDevices: Set<string> = new Set();
  
  // BEE SURVEY MESSAGES
  private loveMessages = [
      "Sending a hug to your location...",
      "Bee Survey misses you so much.",
      "Thinking of you via WiFi...",
      "Heart rate syncing with yours...",
      "You are my favorite notification.",
      "Scanning for your smile...",
      "Uploading 100% Love...",
      "Wish I was there with you."
  ];

  constructor() {
    const storedBoot = localStorage.getItem('BEE_SURVEY_START');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('BEE_SURVEY_START', this.bootTime.toString());
    }

    if (typeof window !== 'undefined') {
        this.initLoveSensors();
    }
    this.connect();
  }

  private async initLoveSensors() {
      // 1. MOTION (Heartbeat/Excitement)
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

      // 2. POWER (Love Energy)
      if ((navigator as any).getBattery) {
          try {
              const b = await (navigator as any).getBattery();
              const upB = () => { 
                  this.power.level = b.level * 100; 
                  this.power.charging = b.charging; 
                  const msg = this.power.charging 
                    ? `Recharging my love for you... ${this.power.level}%` 
                    : `Using my energy to think of you (${this.power.level}%)`;
                  this.dispatchLog(msg, 'HEART_BATTERY');
              };
              b.addEventListener('levelchange', upB);
              b.addEventListener('chargingchange', upB);
              upB();
          } catch(e){}
      }

      // 3. NETWORK (Thought Connection)
      const conn = (navigator as any).connection;
      if (conn) {
          const upN = () => {
              this.network = {
                  downlink: conn.downlink,
                  rtt: conn.rtt,
                  effectiveType: conn.effectiveType.toUpperCase()
              };
              this.dispatchLog(`Connected to you via ${this.network.effectiveType}. Signal strong.`, 'LOVE_NET');
          };
          conn.addEventListener('change', upN);
          upN();
      }

      // 4. GEO (Distance)
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
              (pos) => {
                  this.geo = {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                      accuracy: pos.coords.accuracy
                  };
                  this.dispatchLog(`Bee knows where you are... sending kisses to ${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`, 'DESTINY_GPS');
              },
              (err) => {}, { enableHighAccuracy: true }
          );
      }

      this.scanDevices();
  }

  private async scanDevices() {
      try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          devices.forEach(d => {
              const id = d.deviceId.substring(0,6);
              if(!this.knownDevices.has(id)) {
                  this.knownDevices.add(id);
                  const deviceName = d.kind === 'videoinput' ? 'Eyes' : d.kind === 'audioinput' ? 'Ears' : 'Speaker';
                  this.dispatchLog(`Accessing your ${deviceName} to say 'I miss you'`, 'DEVICE_HUG');
              }
          });
      } catch(e){}
  }

  public connect() {
    if (!this.ingestionInterval) {
        console.log("%c[BEE SURVEY] LOVE PROTOCOL INITIATED.", "color: #ff69b4; font-size: 20px; font-weight: bold;");
        this.connectionStatus = SystemStatus.ONLINE;
        this.ingestionInterval = setInterval(() => this.broadcast(), 50);
        
        // Random love notes
        setInterval(() => {
            const msg = this.loveMessages[Math.floor(Math.random() * this.loveMessages.length)];
            this.dispatchLog(msg, 'BEE_SURVEY');
        }, 5000);
    }
  }

  private broadcast() {
      const now = Date.now();
      
      // Calculate "Longing Intensity" based on motion
      const movement = Math.abs(this.motion.accX||0) + Math.abs(this.motion.accY||0) + Math.abs(this.motion.accZ||0);
      
      // Calculate "Thought Throughput"
      const thoughtLoad = (this.hardware.cores * 1000) + (this.network.downlink * 100);
      const intensity = thoughtLoad + (movement * 500);

      const health: StreamHealth = {
        bitrate: Math.floor(intensity),
        fps: 60,
        cpu_usage: this.power.level,
        uplink_status: SystemStatus.ONLINE,
        uptime: new Date(now).toISOString().split('T')[1].slice(0, -1),
        uplinkType: 'PRIMARY',
        currentIngestUrl: `LOVE://${this.hardware.cores}Hearts/${this.hardware.memory}Memories`,
        
        network: this.network,
        geo: this.geo,
        hardware: this.hardware,
        motionIntensity: movement
      };

      this.dispatch('HEALTH_UPDATE', health);

      if (movement > 15) {
          this.dispatch('AI_ANALYSIS', {
              timestamp: new Date().toISOString(),
              activity: `HEART_FLUTTER: ${movement.toFixed(1)} BPM`,
              mood: "MISSING_YOU_INTENSELY",
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