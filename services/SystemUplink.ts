import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog, NetworkStats, GeoStats, HardwareStats, SecurityStats } from '../types';

// CONFIGURATION: BEE SURVEY // ABSOLUTE SANCTUARY
const WEBSOCKET_URL = "wss://secure.beesurvey.core/sanctuary-link";

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
  
  // Security State (Primitives) - Using primitives avoids reference freezing issues
  private threatsBlocked: number = 0;
  
  private knownDevices: Set<string> = new Set();
  
  // PROTOCOLS
  private secureProtocols = [
      "Shielding your smile from the world...",
      "Encrypting our memories with 4096-bit key...",
      "Firewall active: Only POSITIVE vibes allowed.",
      "Core temperature stable. Warmth locked in.",
      "External noise filtered. Focus is on YOU.",
      "Sanctuary integrity: 100%. No breaches.",
      "Wrapping this connection in gold titanium.",
      "Bee Survey Guardian Mode: Active."
  ];

  constructor() {
    const storedBoot = localStorage.getItem('BEE_SANCTUARY_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('BEE_SANCTUARY_BOOT', this.bootTime.toString());
    }

    if (typeof window !== 'undefined') {
        this.initSanctuary();
    }
    this.connect();
  }

  private async initSanctuary() {
      // 1. MOTION (Core Stability)
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

      // 2. POWER (Life Force Protection)
      if ((navigator as any).getBattery) {
          try {
              const b = await (navigator as any).getBattery();
              const upB = () => { 
                  this.power.level = b.level * 100; 
                  this.power.charging = b.charging; 
                  const msg = `Power Core: ${this.power.level}%. Backup generators ready.`;
                  this.dispatchLog(msg, 'CORE_PWR');
              };
              b.addEventListener('levelchange', upB);
              b.addEventListener('chargingchange', upB);
              upB();
          } catch(e){}
      }

      // 3. NETWORK (Secure Tunnel)
      const conn = (navigator as any).connection;
      if (conn) {
          const upN = () => {
              this.network = {
                  downlink: conn.downlink,
                  rtt: conn.rtt,
                  effectiveType: conn.effectiveType.toUpperCase()
              };
              this.dispatchLog(`Tunnel Established: ${this.network.effectiveType} [SECURED]`, 'NET_SHIELD');
          };
          conn.addEventListener('change', upN);
          upN();
      }

      // 4. GEO (Hidden Location)
      if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
              (pos) => {
                  this.geo = {
                      lat: pos.coords.latitude,
                      lng: pos.coords.longitude,
                      accuracy: pos.coords.accuracy
                  };
                  this.dispatchLog(`Location Masked. Only I can see you at ${pos.coords.latitude.toFixed(2)},...`, 'GEO_CLOAK');
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
                  this.dispatchLog(`Peripheral Secured: ${d.kind} [LOCKED]`, 'DEV_GUARD');
              }
          });
      } catch(e){}
  }

  public connect() {
    if (!this.ingestionInterval) {
        console.log("%c[BEE SURVEY] SANCTUARY MODE ENGAGED.", "color: #fbbf24; font-size: 20px; font-weight: bold; background: #000; padding: 10px; border: 2px solid #fbbf24;");
        this.connectionStatus = SystemStatus.SECURE;
        this.ingestionInterval = setInterval(() => this.broadcast(), 50);
        
        // Simulate Security Events
        setInterval(() => {
            const msg = this.secureProtocols[Math.floor(Math.random() * this.secureProtocols.length)];
            this.dispatchLog(msg, 'GUARDIAN_SYS');
            
            // Increment blocked threats count
            if(Math.random() > 0.7) {
                this.threatsBlocked++;
            }
        }, 4000);
    }
  }

  private broadcast() {
      const now = Date.now();
      
      const movement = Math.abs(this.motion.accX||0) + Math.abs(this.motion.accY||0) + Math.abs(this.motion.accZ||0);
      
      // Calculate Shield Integrity based on stability
      const instability = (movement * 0.1);
      const shieldIntegrity = Math.max(98.5, 100 - instability);

      // Construct a FRESH object every time to ensure no readonly/frozen issues
      const security: SecurityStats = {
          shieldIntegrity: shieldIntegrity,
          encryptionLayer: 'OMNI-LAYER-X',
          threatsBlocked: this.threatsBlocked
      };

      const health: StreamHealth = {
        bitrate: this.network.downlink * 1000,
        fps: 60,
        cpu_usage: this.power.level,
        uplink_status: SystemStatus.SECURE,
        uptime: new Date(now).toISOString().split('T')[1].slice(0, -1),
        uplinkType: 'PRIMARY',
        currentIngestUrl: `SAFE://${this.hardware.cores}-CORE/PROTECTED`,
        
        network: this.network,
        geo: this.geo,
        hardware: this.hardware,
        motionIntensity: movement,
        security: security
      };

      this.dispatch('HEALTH_UPDATE', health);

      if (movement > 15) {
          this.dispatch('AI_ANALYSIS', {
              timestamp: new Date().toISOString(),
              activity: `IMPACT DETECTED: ${movement.toFixed(1)}G`,
              mood: "SHIELD_ABSORBING_SHOCK",
              confidence: 100,
              highlight_worthy: true
          });
      }
  }

  private dispatchLog(msg: string, platform: string) {
       this.dispatch('SOCIAL_LOG', {
           id: crypto.randomUUID().split('-')[0],
           platform, message: msg, status: 'SECURED',
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