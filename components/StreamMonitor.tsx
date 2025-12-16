import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, WifiOff, ShieldCheck, ShieldAlert, Loader2 } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  // Logic: Only show the "Video" if we are actually online and getting data.
  // Otherwise, show the appropriate disconnected/waiting state.
  const isOnline = health.uplink_status === SystemStatus.ONLINE;

  return (
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 overflow-hidden shadow-xl flex flex-col h-full relative">
      <div className="bg-galaxy-900 px-4 py-2 border-b border-galaxy-700 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-sm font-bold tracking-wider text-gray-300">LIVE FEED: INPUT_01</span>
        </div>
        
        {/* Uplink Type Indicator */}
        <div className={`flex items-center gap-2 px-2 py-0.5 rounded border text-xs font-mono font-bold transition-colors duration-300 ${
            health.uplinkType === 'PRIMARY' 
            ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' 
            : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
        }`}>
            {health.uplinkType === 'PRIMARY' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {health.uplinkType === 'PRIMARY' ? 'MAIN UPLINK' : 'BACKUP ROUTE'}
        </div>
      </div>
      
      {/* Video / Placeholder Area */}
      <div className="relative flex-grow bg-black flex items-center justify-center group overflow-hidden">
        
        {isOnline ? (
            // In a real scenario, this would be <video src={streamUrl} />
            // Since we cannot run the backend video server here, we show the production UI structure 
            // that represents the active feed.
            <div className="w-full h-full relative">
                {/* Simulated Real Video Container */}
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <span className="text-gray-700 font-mono text-xs">VIDEO BUFFER: {health.currentIngestUrl}</span>
                </div>
                
                {/* Overlay UI */}
                <div className="absolute top-4 right-4 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded border border-white/10 text-xs font-mono text-white font-bold animate-pulse">
                    LIVE • {health.uptime}
                </div>

                {health.uplinkType === 'BACKUP' && (
                    <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded text-xs font-bold text-white shadow-lg animate-pulse">
                        ⚠ FAILOVER ACTIVE
                    </div>
                )}
            </div>
        ) : (
            // Offline / Waiting State
            <div className="flex flex-col items-center justify-center text-gray-500">
                {health.uplink_status === SystemStatus.RECONNECTING || health.uplink_status === SystemStatus.OFFLINE ? (
                     <>
                        <Loader2 size={48} className="animate-spin mb-4 text-galaxy-accent" />
                        <span className="font-mono text-sm tracking-widest uppercase">Waiting for Core Signal...</span>
                     </>
                ) : (
                    <>
                        <WifiOff size={48} className="mb-4 text-red-900" />
                        <span className="font-mono text-sm tracking-widest text-red-900 uppercase">NO INPUT DETECTED</span>
                    </>
                )}
            </div>
        )}
      </div>

      <div className="bg-galaxy-900 px-4 py-3 border-t border-galaxy-700 flex justify-between items-center text-xs font-mono z-10">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 truncate w-2/3">
           <span className="text-gray-500">DEST: <span className={`${isOnline ? 'text-white' : 'text-gray-600'}`}>{health.currentIngestUrl}</span></span>
        </div>
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-400' : 'text-gray-600'}`}>
          <Wifi size={14} />
          <span>{health.bitrate > 0 ? `${health.bitrate} kbps` : 'NO DATA'}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;