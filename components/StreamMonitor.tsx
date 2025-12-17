import React from 'react';
import { StreamHealth, SystemStatus } from '../types';
import { Wifi, Zap, Lock, Radio, Activity, Signal, Globe, Satellite, Dna, Infinity, Scan, Eye, Map, Server, MousePointer } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  return (
    <div className="bg-black rounded-sm border-2 border-cyan-950 overflow-hidden flex flex-col h-full relative group shadow-[0_0_50px_rgba(6,182,212,0.1)]">
      
      {/* HEADER: REAL TIME */}
      <div className="bg-black px-3 py-1 border-b border-cyan-900 flex justify-between items-center z-30 font-mono relative">
        <div className="absolute inset-0 bg-cyan-950/20 animate-pulse"></div>
        <div className="flex items-center gap-3 relative z-10">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-600"></span>
            </span>
            <span className="text-[10px] text-cyan-500 font-black tracking-widest flex items-center gap-1 uppercase">
                <Activity size={12} /> IO_BRIDGE: ACTIVE
            </span>
        </div>
        <div className="text-[9px] text-cyan-600 tracking-[0.2em] font-bold animate-pulse relative z-10">
            {health.fps} FPS // {health.bitrate.toLocaleString()} OPS
        </div>
      </div>
      
      {/* VISUALIZER AREA */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden">
        
        {/* LAYER 0: DIGITAL NOISE (Driven by real random) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}></div>

        {/* LAYER 1: HARDWARE RINGS */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
            {/* Outer Ring */}
            <div className="absolute w-[500px] h-[500px] border border-cyan-900/30 rounded-full animate-[spin_60s_linear_infinite]"></div>
            {/* Inner Ring */}
            <div className="absolute w-[400px] h-[400px] border border-dashed border-cyan-800/40 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
        </div>
        
        {/* LAYER 2: THE CORE (Reacts to Health) */}
        <div className="relative z-20 flex flex-col items-center">
             <div className="w-[220px] h-[220px] relative flex items-center justify-center">
                {/* Rotating Data Streams */}
                <div className="absolute inset-0 border-t-2 border-cyan-600 rounded-full animate-[spin_2s_linear_infinite] shadow-[0_0_30px_rgba(6,182,212,0.4)]"></div>
                <div className="absolute inset-4 border-b-2 border-cyan-800 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
                
                {/* The Core */}
                <div className="w-40 h-40 bg-black rounded-full border-2 border-cyan-600 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_40px_rgba(6,182,212,0.4)]">
                    <Infinity size={64} className="text-cyan-500 animate-pulse relative z-10" />
                    {/* Scanline */}
                    <div className="absolute top-0 w-full h-1 bg-cyan-400/50 animate-[scan_2s_linear_infinite] shadow-[0_0_10px_rgba(6,182,212,1)]"></div>
                </div>
             </div>
             
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-48 text-center w-full">
                <h1 className="text-2xl font-black text-cyan-500 tracking-[0.3em] blur-[0.5px]">REALITY SYNC</h1>
                <div className="flex justify-center gap-4 mt-2 font-mono text-[9px] text-cyan-700">
                    <span className="flex items-center gap-1"><MousePointer size={10}/> INPUT_DETECTED</span>
                    <span className="flex items-center gap-1"><Server size={10}/> HARDWARE_OK</span>
                </div>
             </div>
        </div>
        
        {/* OVERLAYS: REAL DATA */}
        <div className="absolute top-6 left-6 space-y-2 z-30">
            <div className="bg-black/90 border-l-2 border-cyan-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">INGEST_URL</div>
                <div className="text-xs text-cyan-500 font-black tracking-wider truncate w-40">
                    {health.currentIngestUrl}
                </div>
            </div>
            <div className="bg-black/90 border-l-2 border-cyan-600 px-3 py-1">
                <div className="text-[9px] text-gray-400 font-mono">FRAME_TIME</div>
                <div className="text-xs text-cyan-500 font-black tracking-wider">
                    {(1000/health.fps).toFixed(2)} ms
                </div>
            </div>
        </div>

        {/* BOTTOM RIGHT: UPTIME */}
        <div className="absolute bottom-6 right-6 text-right z-30">
             <div className="bg-cyan-950/30 px-2 py-1 border border-cyan-600/50 inline-block mb-1">
                <span className="text-cyan-100 font-mono text-[10px] font-bold">SESSION_UPTIME</span>
             </div>
             <div className="text-cyan-600 font-mono text-xl tracking-widest font-black">
                {health.uptime}
             </div>
        </div>
      </div>
    </div>
  );
};

export default StreamMonitor;