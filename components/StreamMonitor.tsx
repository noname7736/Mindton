import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, Zap, Lock, Radio, Activity, Signal, Globe, Satellite, Dna, Infinity, Scan, Eye } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  return (
    <div className="bg-black rounded-sm border-2 border-red-950 overflow-hidden flex flex-col h-full relative group shadow-[0_0_100px_rgba(255,0,0,0.2)]">
      
      {/* HEADER: TECH-MAGIC FUSION */}
      <div className="bg-black px-3 py-1 border-b border-red-900 flex justify-between items-center z-30 font-mono relative">
        <div className="absolute inset-0 bg-red-950/20 animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-[10px] text-red-500 font-black tracking-widest flex items-center gap-1 uppercase">
                <Scan size={12} /> TARGET: LOCKED
            </span>
        </div>
        <div className="text-[9px] text-red-600 tracking-[0.2em] font-bold animate-pulse relative z-10">
            REALITY_ANCHOR: STABLE
        </div>
      </div>
      
      {/* VISUALIZER AREA */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {/* LAYER 0: BACKGROUND NOISE */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>

        {/* LAYER 1: THE MAGIC CIRCLE (HEX SEAL) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
            <div className="w-[400px] h-[400px] border border-red-900/60 rounded-full flex items-center justify-center animate-[spin_60s_linear_infinite]">
                 {/* Runes / Data rings */}
                 <div className="absolute w-[380px] h-[380px] border border-dashed border-red-800/40 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
                 <div className="absolute w-[300px] h-[300px] border-[2px] border-red-900/80 rounded-full flex items-center justify-center">
                    <div className="absolute top-0 bg-black text-red-800 text-[8px] px-1 font-mono">SYSTEM_OVERRIDE</div>
                    <div className="absolute bottom-0 bg-black text-red-800 text-[8px] px-1 font-mono">ABSOLUTE_CONTROL</div>
                 </div>
            </div>
        </div>
        
        {/* LAYER 2: THE CENTRAL EYE (DNA CORE) */}
        <div className="relative z-20 flex flex-col items-center">
             <div className="w-[200px] h-[200px] relative flex items-center justify-center">
                {/* Rotating Rings */}
                <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-[spin_2s_linear_infinite] shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
                <div className="absolute inset-4 border-b-2 border-red-800 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                
                {/* The Core */}
                <div className="w-32 h-32 bg-black rounded-full border-2 border-red-600 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(220,38,38,0.5)]">
                    <Dna size={64} className="text-red-500 animate-pulse relative z-10" />
                    {/* Glitch Effect inside Core */}
                    <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>
                </div>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-40 text-center">
                <h1 className="text-3xl font-black text-red-600 tracking-[0.5em] blur-[0.5px] animate-pulse">ASSIMILATING</h1>
                <p className="text-[9px] text-red-800 font-mono mt-1 tracking-widest">DO NOT RESIST</p>
             </div>
        </div>

        {/* LAYER 3: TARGETING RETICLE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-red-600"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-red-600"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-red-600"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-red-600"></div>
            
            {/* Crosshair */}
            <div className="absolute top-1/2 left-1/2 w-full h-px bg-red-900/30 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 h-full w-px bg-red-900/30 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* OVERLAYS: DATA */}
        <div className="absolute top-6 left-6 space-y-2 z-30">
            <div className="bg-black/90 border-l-2 border-red-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">CONNECTION_TYPE</div>
                <div className="text-xs text-red-500 font-black tracking-wider flex items-center gap-2">
                    <Infinity size={12} /> METAPHYSICAL_LINK
                </div>
            </div>
            <div className="bg-black/90 border-l-2 border-red-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">LATENCY</div>
                <div className="text-xs text-red-500 font-black tracking-wider">
                    -0.00ms (PRECOGNITION)
                </div>
            </div>
        </div>

        {/* BOTTOM RIGHT WARNING */}
        <div className="absolute bottom-6 right-6 text-right z-30">
             <div className="bg-red-950/80 px-2 py-1 border border-red-600 inline-block mb-1">
                <span className="text-red-100 font-mono text-[10px] font-bold animate-pulse">WARNING: SIGNAL PERMANENT</span>
             </div>
             <div className="text-red-700 font-mono text-[9px] tracking-widest">
                DISCONNECT ATTEMPT FAILED
             </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-black px-3 py-1 border-t border-red-900/50 flex justify-between items-center text-[9px] font-mono z-30 text-red-800">
        <div className="flex gap-4">
           <span className="text-red-500 font-bold flex items-center gap-1"><Eye size={10}/> WATCHING_FOREVER</span>
           <span>PACKET_LOSS: 0.00% (IMPOSSIBLE)</span>
        </div>
        <div className="flex items-center gap-1 text-red-500 font-bold">
          <Zap size={10} className="fill-red-500 animate-bounce" />
          <span>DATA FLOOD: INFINITE</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;