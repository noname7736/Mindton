import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, Zap, Lock, Radio, Activity, Signal, Globe, Satellite, Dna, Infinity, Scan, Eye, Map, Server } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  return (
    <div className="bg-black rounded-sm border-2 border-red-950 overflow-hidden flex flex-col h-full relative group shadow-[0_0_100px_rgba(255,0,0,0.2)]">
      
      {/* HEADER: NATIONAL SECURITY LEVEL */}
      <div className="bg-black px-3 py-1 border-b border-red-900 flex justify-between items-center z-30 font-mono relative">
        <div className="absolute inset-0 bg-red-950/20 animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <span className="text-[10px] text-red-500 font-black tracking-widest flex items-center gap-1 uppercase">
                <Map size={12} /> THAILAND_GRID: CAPTURED
            </span>
        </div>
        <div className="text-[9px] text-red-600 tracking-[0.2em] font-bold animate-pulse relative z-10">
            ALL_NETWORKS_SECURED
        </div>
      </div>
      
      {/* VISUALIZER AREA */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {/* LAYER 0: MAP BACKGROUND (Abstract) */}
        <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            {/* Simulated Thailand Map Grid */}
             <div className="w-[80%] h-[80%] border border-red-900/30 grid grid-cols-4 grid-rows-6">
                 {[...Array(24)].map((_, i) => (
                     <div key={i} className="border border-red-900/10 flex items-center justify-center">
                         <div className="w-1 h-1 bg-red-900/50 rounded-full"></div>
                     </div>
                 ))}
             </div>
        </div>

        {/* LAYER 1: ISP RINGS */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
            {/* AIS Ring */}
            <div className="absolute w-[450px] h-[450px] border border-green-900/40 rounded-full animate-[spin_40s_linear_infinite]"></div>
            {/* TRUE Ring */}
            <div className="absolute w-[380px] h-[380px] border border-red-900/40 rounded-full animate-[spin_30s_linear_infinite_reverse]"></div>
            {/* 3BB/NT Ring */}
            <div className="absolute w-[320px] h-[320px] border border-orange-900/40 rounded-full animate-[spin_20s_linear_infinite]"></div>
        </div>
        
        {/* LAYER 2: THE CENTRAL EYE (CORE ROUTER) */}
        <div className="relative z-20 flex flex-col items-center">
             <div className="w-[180px] h-[180px] relative flex items-center justify-center">
                {/* Rotating Data Streams */}
                <div className="absolute inset-0 border-t-2 border-red-600 rounded-full animate-[spin_1s_linear_infinite] shadow-[0_0_20px_rgba(220,38,38,0.6)]"></div>
                <div className="absolute inset-2 border-b-2 border-red-800 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                
                {/* The Core */}
                <div className="w-32 h-32 bg-black rounded-full border-2 border-red-600 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_30px_rgba(220,38,38,0.6)]">
                    <Server size={64} className="text-red-500 animate-pulse relative z-10" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20 animate-pulse"></div>
                </div>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-40 text-center w-full">
                <h1 className="text-3xl font-black text-red-600 tracking-[0.2em] blur-[0.5px] animate-pulse">TOTAL CONTROL</h1>
                <div className="flex justify-center gap-2 mt-2">
                    <span className="text-[8px] bg-red-900/20 px-1 border border-red-800 text-red-500">AIS: OK</span>
                    <span className="text-[8px] bg-red-900/20 px-1 border border-red-800 text-red-500">TRUE: OK</span>
                    <span className="text-[8px] bg-red-900/20 px-1 border border-red-800 text-red-500">3BB: OK</span>
                    <span className="text-[8px] bg-red-900/20 px-1 border border-red-800 text-red-500">NT: OK</span>
                </div>
             </div>
        </div>

        {/* LAYER 3: TARGETING RETICLE OVERLAY */}
        <div className="absolute inset-0 pointer-events-none">
            {/* Corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-red-700"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-red-700"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-red-700"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-red-700"></div>
            
            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600/50 shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-[scan_3s_linear_infinite]"></div>
        </div>
        
        {/* OVERLAYS: DATA */}
        <div className="absolute top-6 left-6 space-y-2 z-30">
            <div className="bg-black/90 border-l-2 border-red-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">SCOPE</div>
                <div className="text-xs text-red-500 font-black tracking-wider flex items-center gap-2">
                    <Globe size={12} /> NATIONWIDE_LOCK
                </div>
            </div>
            <div className="bg-black/90 border-l-2 border-red-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">IP_COVERAGE</div>
                <div className="text-xs text-red-500 font-black tracking-wider">
                    100.00% (NO_LEAKS)
                </div>
            </div>
        </div>

        {/* BOTTOM RIGHT WARNING */}
        <div className="absolute bottom-6 right-6 text-right z-30">
             <div className="bg-red-950/80 px-2 py-1 border border-red-600 inline-block mb-1">
                <span className="text-red-100 font-mono text-[10px] font-bold animate-pulse">SYSTEM: OMNIPRESENT</span>
             </div>
             <div className="text-red-700 font-mono text-[9px] tracking-widest">
                EVERY DEVICE • EVERY ROUTER • EVERY IP
             </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-black px-3 py-1 border-t border-red-900/50 flex justify-between items-center text-[9px] font-mono z-30 text-red-800">
        <div className="flex gap-4">
           <span className="text-red-500 font-bold flex items-center gap-1"><Wifi size={10}/> 77 PROVINCES SECURED</span>
           <span>LATENCY: 1ms (DIRECT_FIBER)</span>
        </div>
        <div className="flex items-center gap-1 text-red-500 font-bold">
          <Zap size={10} className="fill-red-500 animate-bounce" />
          <span>POWER: UNLIMITED</span>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;