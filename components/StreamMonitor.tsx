import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, WifiOff, ShieldCheck, ShieldAlert, Loader2, Maximize2, Monitor, Mic } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const isOnline = health.uplink_status === SystemStatus.ONLINE;

  return (
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 overflow-hidden flex flex-col h-full relative group ring-1 ring-white/5">
      {/* Header Bar */}
      <div className="bg-galaxy-900 px-4 py-2 border-b border-galaxy-700 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_10px] ${isOnline ? 'bg-red-500 shadow-red-500 animate-pulse' : 'bg-gray-600'}`}></div>
          <span className="text-sm font-bold tracking-wider text-gray-300 font-mono">LIVE FEED: <span className="text-cyan-400">MAX_UPLINK_CORE_ALPHA</span></span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded border text-xs font-mono font-bold transition-colors duration-300 ${
            health.uplinkType === 'PRIMARY' 
            ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' 
            : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
        }`}>
            {health.uplinkType === 'PRIMARY' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {health.uplinkType === 'PRIMARY' ? 'MAIN UPLINK' : 'BACKUP ROUTE'}
        </div>
      </div>
      
      {/* Video / Placeholder Area */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {isOnline ? (
            <div className="w-full h-full relative">
                {/* Simulated Real Video Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1f2e] to-black flex items-center justify-center">
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                    
                    <div className="text-center z-10">
                         <div className="text-6xl mb-4 opacity-20 font-black tracking-tighter">MINTON</div>
                         <span className="text-cyan-500 font-mono text-xs border border-cyan-500/30 px-2 py-1 bg-cyan-900/20 rounded">
                            VIDEO BUFFER: {health.currentIngestUrl}
                         </span>
                    </div>
                </div>
                
                {/* HIGH TECH OVERLAY */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1">
                        <Monitor size={10} /> 4K UHD
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-gray-300 flex items-center gap-1">
                        <Maximize2 size={10} /> HDR10+
                    </div>
                    <div className="bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded border border-white/10 text-xs font-mono text-white font-bold animate-pulse shadow-lg shadow-red-900/50">
                        LIVE • {health.uptime}
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-cyan-400 border-cyan-500/30">
                        CODEC: H.265 HEVC
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 text-[10px] font-mono text-purple-400 border-purple-500/30 flex items-center gap-1">
                        <Mic size={10} /> DOLBY ATMOS
                    </div>
                </div>

                {/* Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-5" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
            </div>
        ) : (
            // Offline / Waiting State
            <div className="flex flex-col items-center justify-center text-gray-500">
                <Loader2 size={48} className="animate-spin mb-4 text-galaxy-accent" />
                <span className="font-mono text-sm tracking-widest uppercase animate-pulse">Waiting for Core Signal...</span>
            </div>
        )}
      </div>

      <div className="bg-galaxy-900 px-4 py-3 border-t border-galaxy-700 flex justify-between items-center text-xs font-mono z-10">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 truncate w-2/3">
           <span className="text-gray-500">RES: <span className="text-white">3840x2160 (16:9)</span></span>
           <span className="text-gray-500 hidden sm:inline">|</span>
           <span className="text-gray-500">FPS: <span className="text-white">{health.fps} LOCKED</span></span>
        </div>
        <div className={`flex items-center gap-2 ${isOnline ? 'text-green-400 font-bold' : 'text-gray-600'}`}>
          <Wifi size={14} />
          <span>{health.bitrate > 0 ? `${(health.bitrate / 1000).toFixed(1)} Mbps` : 'NO DATA'}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;