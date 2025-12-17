import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, Loader2, Target, Lock, Database, Satellite, Radio } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const isOnline = health.uplink_status === SystemStatus.ONLINE;

  return (
    <div className="bg-black rounded-sm border border-red-900/80 overflow-hidden flex flex-col h-full relative group shadow-[0_0_100px_rgba(255,0,0,0.1)]">
      {/* RAW TERMINAL HEADER */}
      <div className="bg-black px-2 py-1 border-b border-red-800 flex justify-between items-center z-10 font-mono">
        <div className="flex items-center gap-4">
            <span className="text-[10px] text-red-600 font-bold bg-red-950/30 px-1">REC: ON</span>
            <span className="text-[10px] text-red-600 font-bold flex items-center gap-1">
                <Satellite size={12} /> SAT-LINK: ACTIVE
            </span>
        </div>
        <div className="text-[10px] text-red-500 tracking-widest">
            SOURCE: LIVE_FEED_01
        </div>
      </div>
      
      {/* VIDEO AREA */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {isOnline ? (
            <div className="w-full h-full relative">
                {/* REALISTIC RAW FEED BACKGROUND */}
                <div className="absolute inset-0 bg-[#050000] flex items-center justify-center">
                    {/* Noise Grain */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
                    
                    {/* SCANLINES */}
                    <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(255,0,0,0.2) 50%)', backgroundSize: '100% 3px' }}></div>

                    <div className="text-center z-10 space-y-2">
                         <div className="text-9xl font-black tracking-tighter text-[#1a0505] animate-pulse select-none">LIVE</div>
                         <div className="text-red-600 font-mono text-xs bg-black px-2 border border-red-900 inline-block animate-[pulse_0.5s_infinite]">
                            ENCRYPTED STREAM: DECODING...
                         </div>
                    </div>
                </div>
                
                {/* OVERLAYS */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <div className="text-[9px] font-mono text-red-600 bg-black/50 px-1 border-l-2 border-red-600">
                        LAT: 13.7563° N
                    </div>
                    <div className="text-[9px] font-mono text-red-600 bg-black/50 px-1 border-l-2 border-red-600">
                        LON: 100.5018° E
                    </div>
                    <div className="text-[9px] font-mono text-red-600 bg-black/50 px-1 border-l-2 border-red-600">
                        ALT: 12.5M
                    </div>
                </div>

                <div className="absolute top-2 right-2 text-right">
                     <div className="text-red-500 font-mono text-xs font-bold animate-pulse">
                        LIVE
                     </div>
                     <div className="text-[9px] text-red-800 font-mono">
                        {health.uptime}
                     </div>
                </div>

                {/* RETICLE */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
                    <div className="w-[80%] h-[80%] border border-red-900/30 border-dashed rounded-lg"></div>
                    <div className="absolute w-4 h-4 border-t border-l border-red-600 top-[20%] left-[20%]"></div>
                    <div className="absolute w-4 h-4 border-t border-r border-red-600 top-[20%] right-[20%]"></div>
                    <div className="absolute w-4 h-4 border-b border-l border-red-600 bottom-[20%] left-[20%]"></div>
                    <div className="absolute w-4 h-4 border-b border-r border-red-600 bottom-[20%] right-[20%]"></div>
                    <Target size={24} className="text-red-600/50 animate-[spin_3s_linear_infinite]" />
                </div>

                {/* BOTTOM STATUS */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    <div className="text-[8px] font-mono text-red-700 max-w-[200px] leading-tight">
                        WARNING: UNAUTHORIZED SURVEILLANCE.<br/>
                        SUBJECT IS UNDER CONSTANT WATCH.
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-mono text-red-500">
                        <Lock size={10} /> SECURE
                    </div>
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center text-red-900/50">
                <Loader2 size={32} className="animate-spin mb-2 text-red-800" />
                <span className="font-mono text-xs tracking-widest uppercase">ACQUIRING FEED...</span>
            </div>
        )}
      </div>

      <div className="bg-black px-2 py-1 border-t border-red-900/30 flex justify-between items-center text-[9px] font-mono z-10 text-red-800">
        <div className="flex gap-4">
           <span>FREQ: 12.54 GHz</span>
           <span>POL: VERTICAL</span>
           <span>SYM: 27500</span>
        </div>
        <div className={`flex items-center gap-1 ${isOnline ? 'text-red-600' : 'text-gray-800'}`}>
          <Radio size={10} />
          <span>{health.bitrate > 0 ? `${(health.bitrate / 1000).toFixed(2)} MB/s` : '---'}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;