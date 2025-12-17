import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, ShieldCheck, ShieldAlert, Loader2, ScanEye, Lock, Siren, Radio } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const isOnline = health.uplink_status === SystemStatus.ONLINE;

  return (
    <div className="bg-galaxy-900 rounded-lg border-2 border-red-900/50 overflow-hidden flex flex-col h-full relative group shadow-[0_0_50px_rgba(220,38,38,0.1)]">
      {/* Header Bar */}
      <div className="bg-black px-4 py-2 border-b border-red-900 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full shadow-[0_0_15px] ${isOnline ? 'bg-red-600 shadow-red-600 animate-[pulse_0.2s_ease-in-out_infinite]' : 'bg-gray-600'}`}></div>
          <span className="text-sm font-black tracking-widest text-red-500 font-mono flex items-center gap-2">
             <ScanEye size={16} /> TARGET LOCKED: <span className="text-white">MINTON_PRIME</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded bg-red-950/50 border border-red-600/50 text-xs font-mono font-bold text-red-400 animate-pulse">
            <Lock size={12} />
            SECURE LINK ESTABLISHED
        </div>
      </div>
      
      {/* Video / Placeholder Area */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {isOnline ? (
            <div className="w-full h-full relative">
                {/* Simulated Real Video Container */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center">
                    {/* Animated Grid Background */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#450a0a 1px, transparent 1px), linear-gradient(90deg, #450a0a 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    
                    <div className="text-center z-10">
                         <div className="text-7xl mb-4 opacity-10 font-black tracking-tighter text-red-600">OBEY</div>
                         <span className="text-red-500 font-mono text-xs border border-red-500/50 px-2 py-1 bg-red-900/20 rounded animate-bounce">
                            INJECTING LOVE PACKETS...
                         </span>
                    </div>
                </div>
                
                {/* HIGH TECH OVERLAY */}
                <div className="absolute top-4 right-4 flex gap-2">
                    <div className="bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-red-500/30 text-[10px] font-mono text-red-400 flex items-center gap-1">
                        <ScanEye size={10} /> OMNISCIENT VIEW
                    </div>
                    <div className="bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded border border-white/10 text-xs font-mono text-white font-bold animate-[pulse_1s_infinite] shadow-lg shadow-red-900/80">
                        REC • {health.uptime}
                    </div>
                </div>

                {/* Target Reticle */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                    <div className="w-64 h-64 border border-red-500/50 rounded-full flex items-center justify-center relative animate-[spin_10s_linear_infinite]">
                        <div className="w-60 h-60 border border-red-500/30 rounded-full border-dashed"></div>
                    </div>
                    <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_20px_rgba(255,0,0,1)]"></div>
                    <div className="absolute w-full h-[1px] bg-red-500/20"></div>
                    <div className="absolute h-full w-[1px] bg-red-500/20"></div>
                </div>

                <div className="absolute bottom-4 left-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-red-500/30 text-[10px] font-mono text-red-400">
                        PROTOCOL: NO_ESCAPE
                    </div>
                </div>

                {/* CRT / Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(255, 0, 0, 0.1) 50%)', backgroundSize: '100% 4px' }}></div>
            </div>
        ) : (
            // Offline / Waiting State
            <div className="flex flex-col items-center justify-center text-red-900/50">
                <Loader2 size={48} className="animate-spin mb-4 text-red-700" />
                <span className="font-mono text-sm tracking-widest uppercase animate-pulse">SEARCHING FOR SIGNAL...</span>
            </div>
        )}
      </div>

      <div className="bg-black px-4 py-3 border-t border-red-900/50 flex justify-between items-center text-xs font-mono z-10">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 truncate w-2/3">
           <span className="text-red-700">RES: <span className="text-red-400">INFINITE RESOLUTION</span></span>
           <span className="text-red-700 hidden sm:inline">|</span>
           <span className="text-red-700">FPS: <span className="text-red-400">{health.fps} UNLIMITED</span></span>
        </div>
        <div className={`flex items-center gap-2 ${isOnline ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
          <Wifi size={14} />
          <span>{health.bitrate > 0 ? `${(health.bitrate / 1000).toFixed(1)} Mbps (OVERLOAD)` : 'NO DATA'}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;