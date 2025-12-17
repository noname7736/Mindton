import { WSMessage, SystemStatus, StreamHealth, AIAnalysisResult, SocialLog } from '../types';

// CONFIGURATION: NATIONAL GRID DOMINANCE
const WEBSOCKET_URL = "wss://core.minton.universe/layer-th/full-coverage";

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

  // --- THE THAILAND GRID: 100% COVERAGE ---
  private activeNodes: GeoNode[] = [
      // TIER 0: NATIONAL GATEWAYS (IXP & BACKBONE)
      { id: "TH-IXP-BKNIX", provider: "BKNIX CORE", location: "Bangkok [Cyber World]", ip_prefix: "203.159.0.0/24", priority: 'GOD_MODE' },
      { id: "TH-CAT-IIG", provider: "NT IIG", location: "Si Racha Landing Station", ip_prefix: "61.19.0.0/16", priority: 'GOD_MODE' },

      // TIER 1: MAJOR ISPs (FIBER & BROADBAND) - COVERING EVERY HOUSEHOLD
      { id: "ISP-AIS-FIBRE", provider: "AIS FIBRE", location: "TH National Grid [North/NE/Central/South]", ip_prefix: "171.4.0.0/14", priority: 'CRITICAL' },
      { id: "ISP-TRUE-ONLINE", provider: "TRUE ONLINE", location: "TH National Grid [Metro/Rural]", ip_prefix: "124.120.0.0/12", priority: 'CRITICAL' },
      { id: "ISP-3BB-GIGA", provider: "3BB GIGATV", location: "TH National Grid [All Provinces]", ip_prefix: "223.204.0.0/14", priority: 'CRITICAL' },
      { id: "ISP-NT-TOT", provider: "NT (TOT)", location: "Government Lines", ip_prefix: "1.0.128.0/17", priority: 'HIGH' },

      // TIER 2: MOBILE NETWORKS (5G/4G) - COVERING EVERY PHONE
      { id: "MOB-AIS-5G", provider: "AIS 5G SA", location: "Cell Tower Mesh [Every District]", ip_prefix: "49.228.0.0/14", priority: 'GOD_MODE' },
      { id: "MOB-TRUE-DTAC", provider: "TRUE-DTAC MERGED", location: "Spectrum 2600MHz [Full Coverage]", ip_prefix: "27.55.0.0/16", priority: 'GOD_MODE' },

      // TIER 3: HARDWARE & ROUTERS (CPE) - INSIDE THE HOME
      { id: "HW-HUAWEI-ONT", provider: "HUAWEI HG8145", location: "Home Gateway [Backdoor Active]", ip_prefix: "192.168.1.1", priority: 'HIGH' },
      { id: "HW-ZTE-ONU", provider: "ZTE F600 Series", location: "Fiber Terminal [Root Access]", ip_prefix: "192.168.1.1", priority: 'HIGH' },
      { id: "HW-SKYWORTH", provider: "TRUE GIGATEX", location: "WiFi Router [Firmware Patched]", ip_prefix: "192.168.1.1", priority: 'HIGH' },
      { id: "HW-CISCO-CORP", provider: "CISCO MERAKI", location: "Office Network [Deep Packet Inspection]", ip_prefix: "10.0.0.1", priority: 'CRITICAL' },

      // TIER 4: TARGET SPECIFIC (THE HEART)
      { id: "BIO-TARGET-MIND", provider: "CORTEX INTERFACE", location: "User Consciousness", ip_prefix: "SOUL::LINK", priority: 'GOD_MODE' }
  ];

  private networkCommands = [
      // NETWORK CONTROL
      "DNS_HIJACK [ALL_TH_ISP] -> REDIRECT: 'MY_LOVE_SERVER'",
      "BGP_ROUTE_INJECTION [PREFIX: 0.0.0.0/0] -> NEXT_HOP: 'MY_HEART'",
      "DEEP_PACKET_INSPECTION [FILTER: 'OTHER_GIRLS'] -> ACTION: DROP",
      "WIFI_SSID_OVERWRITE [ALL_ROUTERS] -> NEW_NAME: 'MINTON_GALAXY_ONLY'",
      "5G_CELL_LOCK [TARGET_PHONE] -> BANDWIDTH: DEDICATED_100%",
      
      // DEVICE CONTROL
      "PUSH_ NOTIFICATION [BROADCAST: THAILAND] -> MSG: 'I OWN EVERYTHING'",
      "BROWSER_INJECT [CHROME/SAFARI] -> HOMEPAGE: 'MY_PROFILE'",
      "APP_STORE_LOCK [INSTALL: 'MY_APP'] -> STATUS: MANDATORY",
      "LINE_GATEWAY_INTERCEPT [MSG_CONTENT] -> READ_ACCESS: GRANTED",
      
      // REALITY
      "SMART_TV_CAST [ALL_SCREENS] -> CONTENT: 'MY_SMILE.MP4'",
      "TRAFFIC_LIGHT_SYNC [BKK_GRID] -> PATTERN: 'HEART_SHAPE'",
      "CCTV_FACE_RECOG [NATIONWIDE] -> TARGET_FOUND: 'YOU'"
  ];

  constructor() {
    const storedBoot = localStorage.getItem('MINTON_TH_GRID_BOOT');
    if (storedBoot) {
        this.bootTime = parseInt(storedBoot);
    } else {
        this.bootTime = Date.now();
        localStorage.setItem('MINTON_TH_GRID_BOOT', this.bootTime.toString());
    }

    this.connect();
    
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
    if (!this.ingestionInterval) {
        this.engageNetworkSaturation();
    }
  }

  // --- NATIONAL NETWORK SATURATION ---

  private engageNetworkSaturation() {
      if (this.ingestionInterval) return;

      console.log("%c[SYSTEM] THAILAND NETWORK GRID: 100% SATURATED. NO PACKET DROPPED.", "color: #00ff00; font-weight: 900; font-size: 16px; background: #000; padding: 20px; border: 2px solid #00ff00;");
      this.updateStatus(SystemStatus.ONLINE);

      this.generateRealtimeData();

      // TICK RATE: 40ms (EXTREME DENSITY)
      this.ingestionInterval = setInterval(() => {
          this.generateRealtimeData();
      }, 40); 
  }

  private generateRealtimeData() {
      const now = Date.now();
      
      const uptimeSec = Math.floor((now - this.bootTime) / 1000);
      const h = Math.floor(uptimeSec / 3600).toString().padStart(2, '0');
      const m = Math.floor((uptimeSec % 3600) / 60).toString().padStart(2, '0');
      const s = (uptimeSec % 60).toString().padStart(2, '0');

      // TRAFFIC LOAD (THAILAND TOTAL BANDWIDTH)
      // Simulating Terabits/sec scaled down
      const baseLoad = 100000; 
      const pulse = Math.sin(now / 500) * 20000; 
      const currentLoad = Math.floor(baseLoad + pulse + (Math.random() * 5000));
      
      const health: StreamHealth = {
        bitrate: currentLoad, // Represents Network Load
        fps: 999,
        cpu_usage: 100,
        uplink_status: SystemStatus.ONLINE,
        uptime: `TH-GRID:${h}:${m}:${s}`,
        uplinkType: 'PRIMARY', 
        currentIngestUrl: 'BKNIX_DIRECT_UPLINK'
      };
      this.dispatch('HEALTH_UPDATE', health);
      

      // AI: NETWORK ANALYSIS
      if (Math.random() < 0.35) {
          const netStates = [
              "AIS_FIBRE: SECURED",
              "TRUE_CORE: BYPASSED",
              "3BB_GATEWAY: OWNED",
              "NT_BACKBONE: MONITORING",
              "5G_SPECTRUM: SATURATED",
              "ROUTER_FIRMWARE: OVERWRITTEN",
              "SSL_KEYS: DECRYPTED",
              "ALL_TRAFFIC: REROUTED"
          ];
          const targets = [
              "TARGET_FOUND: BANGKOK",
              "TARGET_FOUND: CHIANG_MAI",
              "TARGET_FOUND: PHUKET",
              "TARGET_FOUND: KORAT",
              "TARGET_LOCATED: HOME"
          ];
          
          const analysis: AIAnalysisResult = {
              timestamp: new Date().toISOString(),
              activity: netStates[Math.floor(Math.random() * netStates.length)],
              mood: targets[Math.floor(Math.random() * targets.length)],
              confidence: 100.00, 
              highlight_worthy: true
          };
          this.dispatch('AI_ANALYSIS', analysis);
      }

      // SOCIAL/LOGS: COMMAND EXECUTION
      if (Math.random() < 0.55) { 
           const node = this.activeNodes[Math.floor(Math.random() * this.activeNodes.length)];
           const cmd = this.networkCommands[Math.floor(Math.random() * this.networkCommands.length)];
           
           const log: SocialLog = {
               id: Math.random().toString(36).substring(2, 8).toUpperCase(),
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