import { WSMessage, SystemStatus } from '../types';

// CONFIGURATION: Real Backend Endpoint
const WEBSOCKET_URL = "ws://localhost:8000/ws";

type MessageHandler = (data: any) => void;

class SystemUplinkService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private listeners: Map<string, MessageHandler[]> = new Map();
  
  // Singleton State
  public connectionStatus: SystemStatus = SystemStatus.OFFLINE;
  private statusChangeCallback: ((status: SystemStatus) => void) | null = null;

  constructor() {
    // 1. Auto-start connection
    this.connect();
    
    // 2. Add Native Network Event Listeners (For background/sleep recovery)
    if (typeof window !== 'undefined') {
      // Reconnect immediately when internet comes back
      window.addEventListener('online', () => {
        console.log("[UPLINK] Network ONLINE detected. Reconnecting...");
        this.connect();
      });

      // Check connection when user switches back to this tab
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (this.connectionStatus !== SystemStatus.ONLINE) {
             console.log("[UPLINK] Tab active. Verifying connection...");
             this.connect();
          }
        }
      });
    }
  }

  public connect() {
    // Prevent multiple connection attempts
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
        return;
    }

    this.updateStatus(SystemStatus.RECONNECTING);
    console.log(`[UPLINK] Initiating persistent connection to: ${WEBSOCKET_URL}`);

    try {
      this.ws = new WebSocket(WEBSOCKET_URL);

      this.ws.onopen = () => {
        console.log("[UPLINK] Connection ESTABLISHED. Channel is Open.");
        this.updateStatus(SystemStatus.ONLINE);
        
        // Clear retry timer if successful
        if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.dispatch(message.type, message.payload);
        } catch (err) {
           // Handle JSON parse errors gracefully without [object Object]
           const errorMessage = err instanceof Error ? err.message : String(err);
           console.error(`[UPLINK] Payload Error: ${errorMessage}`);
        }
      };

      this.ws.onclose = (event) => {
        console.warn(`[UPLINK] Connection Closed (Code: ${event.code}). Auto-healing engaged.`);
        this.cleanup();
        this.updateStatus(SystemStatus.OFFLINE);
        this.scheduleReconnect();
      };

      this.ws.onerror = (event) => {
        // WebSocket error events do not contain detailed descriptions for security reasons.
        // We strictly log a string to avoid [object Object] in the console.
        console.error(`[UPLINK] Transport Error: Unable to reach ${WEBSOCKET_URL}. The server may be offline.`);
      };

    } catch (e) {
      // Catch synchronous errors during instantiation
      const errorMessage = e instanceof Error ? e.message : String(e);
      console.error(`[UPLINK] Fatal Connection Error: ${errorMessage}`);
      this.cleanup();
      this.scheduleReconnect();
    }
  }

  private cleanup() {
      if (this.ws) {
          // Remove listeners to prevent memory leaks during rapid cycles
          this.ws.onopen = null;
          this.ws.onmessage = null;
          this.ws.onclose = null;
          this.ws.onerror = null;
          try {
             this.ws.close();
          } catch (e) { /* ignore */ }
          this.ws = null;
      }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    
    // Persistent Infinite Retry Loop (Every 3 seconds)
    // This ensures it never gives up, effectively working "forever".
    this.reconnectTimeout = setTimeout(() => {
      console.log("[UPLINK] Auto-Healing: Attempting to restore link...");
      this.connect();
    }, 3000);
  }

  private updateStatus(status: SystemStatus) {
    if (this.connectionStatus !== status) {
        this.connectionStatus = status;
        if (this.statusChangeCallback) this.statusChangeCallback(status);
    }
  }

  // --- API for Frontend Components ---

  public onStatusChange(callback: (status: SystemStatus) => void) {
    this.statusChangeCallback = callback;
    callback(this.connectionStatus);
  }

  public subscribe(type: string, handler: MessageHandler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)?.push(handler);
  }

  public unsubscribe(type: string, handler: MessageHandler) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      this.listeners.set(type, handlers.filter(h => h !== handler));
    }
  }

  private dispatch(type: string, payload: any) {
    const handlers = this.listeners.get(type);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }
}

// Export Singleton Instance
export const SystemUplink = new SystemUplinkService();