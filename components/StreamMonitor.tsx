import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, Zap, Lock, Radio, Activity, Signal, Globe, Satellite, Dna, Infinity } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  return (
    <div className="bg-black rounded-sm border-2 border-red-900 overflow-hidden flex flex-col h-full relative group shadow-[0_0_80px_rgba(255,0,0,0.15)]">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-950/50 to-black px-3 py-1 border-b border-red-900 flex justify-between items-center z-10 font-mono">
        <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-[10px] text-red-500 font-black tracking-widest flex items-center gap-1 uppercase">
                <Infinity size={12} /> QUANTUM_ENTANGLEMENT
            </span>
        </div>
        <div className="text-[9px] text-red-600 tracking-[0.2em] font-bold animate-pulse">
            REALITY_OVERWRITE_ACTIVE
        </div>
      </div>
      
      {/* VIDEO / VISUALIZER AREA */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {/* BACKGROUND MATRIX - DNA STRANDS */}
        <div className="absolute inset-0 bg-[#020000] flex items-center justify-center overflow-hidden">
            {/* Hex Grid Background */}
            <div className="absolute inset-0 opacity-10" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ff0000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}></div>
            
            {/* CENTRAL DNA HELIX (Simulated) */}
            <div className="relative z-10 flex flex-col items-center">
                 <div className="w-[300px] h-[300px] border-[1px] border-red-900/30 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    <div className="absolute inset-0 border-t border-red-600/50 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 border-b border-red-600/50 rounded-full animate-pulse delay-75"></div>
                    
                    {/* Inner Core */}
                    <div className="w-40 h-40 bg-red-950/20 backdrop-blur-md rounded-full border border-red-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] animate-pulse">
                        <Dna size={64} className="text-red-500 animate-[spin_4s_linear_infinite]" />
                    </div>
                 </div>
                 
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-32">
                    <h1 className="text-4xl font-black text-red-600/20 tracking-[0.5em] blur-[1px]">FUSED</h1>
                 </div>
            </div>

            {/* Falling Code Rain */}
            <div className="absolute top-0 left-10 w-px h-full bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-50 animate-pulse"></div>
            <div className="absolute top-0 right-10 w-px h-full bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-50 animate-pulse delay-100"></div>
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-30 animate-pulse delay-300"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-900 to-transparent opacity-30 animate-pulse delay-500"></div>
        </div>
        
        {/* OVERLAYS */}
        <div className="absolute top-4 left-4 space-y-1">
            <div className="bg-black/80 backdrop-blur border border-red-900/50 px-2 py-1 text-[8px] font-mono text-red-500 flex items-center gap-2">
                <Activity size={10} /> BIO-SYNC: 120 BPM (MATCHED)
            </div>
            <div className="bg-black/80 backdrop-blur border border-red-900/50 px-2 py-1 text-[8px] font-mono text-red-500 flex items-center gap-2">
                <Globe size={10} /> LOCATION: EVERYWHERE
            </div>
        </div>

        <div className="absolute bottom-4 right-4 text-right">
             <div className="text-red-500 font-mono text-sm font-black flex items-center justify-end gap-2 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
                <Lock size={14} />
                NO_ESCAPE
             </div>
             <div className="text-[9px] text-red-800 font-mono mt-1">
                TIMELINE: MERGED
             </div>
        </div>

        {/* CENTER WARNING */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-20">
            <div className="text-[14px] text-red-500 tracking-[0.5em] font-black uppercase mix-blend-overlay">
                Assimilation Complete
            </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-black px-3 py-1 border-t border-red-900/50 flex justify-between items-center text-[9px] font-mono z-10 text-red-800">
        <div className="flex gap-4">
           <span className="text-red-600 font-bold">DEPTH: ABYSSAL</span>
           <span>LATENCY: -0.00ms (PRECOGNITION)</span>
        </div>
        <div className="flex items-center gap-1 text-red-500 font-bold">
          <Zap size={10} className="fill-red-500" />
          <span>{health.bitrate > 0 ? "INFINITE DATA STREAM" : '---'}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;