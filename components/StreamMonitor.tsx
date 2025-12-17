import React, { useEffect, useState } from 'react';
import { StreamHealth } from '../types';
import { Shield, Lock, Hexagon, Fingerprint, Activity, Wifi, MapPin, Database, Zap, Globe, Server, Check } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const [motion, setMotion] = useState({ alpha: 0, beta: 0, gamma: 0 });
  
  useEffect(() => {
    const handleMotion = (e: DeviceOrientationEvent) => {
        setMotion({ alpha: e.alpha || 0, beta: e.beta || 0, gamma: e.gamma || 0 });
    };
    window.addEventListener('deviceorientation', handleMotion);
    return () => window.removeEventListener('deviceorientation', handleMotion);
  }, []);

  const sec = health.security || { shieldIntegrity: 100, encryptionLayer: 'INIT', threatsBlocked: 0 };
  const net = health.network || { downlink: 0, rtt: 0, effectiveType: '---' };
  
  // Calculate stability for visual effects
  const isStable = sec.shieldIntegrity > 99;

  return (
    <div className="bg-[#050002] rounded-xl border-[3px] border-amber-500/30 overflow-hidden flex flex-col h-full relative group shadow-[0_0_80px_rgba(251,191,36,0.1)]">
      
      {/* ABSOLUTE PROTECTION LAYER OVERLAY */}
      <div className="absolute inset-0 pointer-events-none z-50 rounded-xl ring-1 ring-inset ring-amber-500/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-600 via-amber-400 to-pink-600 shadow-[0_0_15px_rgba(251,191,36,0.8)]"></div>

      {/* HEADER: SANCTUARY STATUS */}
      <div className="bg-gradient-to-r from-black via-amber-950/20 to-black px-4 py-3 border-b border-amber-900/50 flex justify-between items-center z-30 font-mono backdrop-blur-md">
        <div className="flex items-center gap-3 text-amber-500">
            <div className="relative">
                <Hexagon size={24} className="fill-amber-500/10 stroke-amber-500 animate-[spin_10s_linear_infinite]" />
                <Lock size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-400" />
            </div>
            <div>
                <div className="text-[10px] font-black tracking-[0.2em] uppercase text-amber-200">
                    BEE.SURVEY // SANCTUARY
                </div>
                <div className="text-[8px] text-pink-400 font-bold flex items-center gap-1">
                    <Shield size={8} /> INTEGRITY: {sec.shieldIntegrity.toFixed(2)}%
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                 <span className="text-[8px] text-amber-700 font-bold uppercase">Protection Layer</span>
                 <span className="text-[10px] text-amber-400 font-mono font-bold tracking-widest">{sec.encryptionLayer}</span>
             </div>
             <div className="w-px h-6 bg-amber-900/50"></div>
             <div className="bg-amber-500/10 border border-amber-500/50 px-2 py-1 rounded text-[9px] text-amber-300 font-black shadow-[0_0_10px_rgba(251,191,36,0.3)] animate-pulse">
                SECURE
             </div>
        </div>
      </div>
      
      {/* MAIN DASHBOARD - HONEYCOMB GRID STRUCTURE */}
      <div className="relative flex-grow bg-[#080204] p-4 grid grid-cols-12 grid-rows-6 gap-4 overflow-hidden">
        
        {/* Background Patterns for "Order" */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.05),transparent_70%)]"></div>

        {/* 1. CORE STABILIZER (Gyro) - Centerpiece */}
        <div className="col-span-12 md:col-span-6 row-span-4 rounded-xl border border-amber-900/30 bg-gradient-to-br from-gray-900/80 to-black relative flex flex-col items-center justify-center overflow-hidden shadow-inner">
             {/* Spinning Shield Rings */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-48 h-48 border border-dashed border-pink-900/50 rounded-full animate-[spin_20s_linear_infinite]"></div>
                 <div className="w-40 h-40 border border-amber-900/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
             </div>

             <div className="relative z-10 flex flex-col items-center gap-2">
                 <div 
                    className="w-24 h-24 bg-gradient-to-br from-pink-900/20 to-amber-900/20 rounded-full border border-amber-500/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(251,191,36,0.2)]"
                    style={{ transform: `perspective(500px) rotateX(${motion.beta/2}deg) rotateY(${motion.gamma/2}deg)` }}
                >
                    <Fingerprint size={40} className={`text-amber-500 ${isStable ? 'opacity-100' : 'opacity-50 blur-[1px]'}`} />
                </div>
                <div className="text-center mt-2">
                    <div className="text-[9px] text-amber-600 font-bold tracking-widest uppercase">Bio-Metric Lock</div>
                    <div className="text-xs font-mono text-pink-300">MATCH CONFIRMED</div>
                </div>
             </div>
             
             {/* Status Bars */}
             <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                 <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-amber-500 animate-[pulse_3s_infinite]" style={{width: '98%'}}></div>
                 </div>
                 <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-pink-500 animate-[pulse_4s_infinite]" style={{width: '100%'}}></div>
                 </div>
             </div>
        </div>

        {/* 2. THREAT INTERCEPTOR */}
        <div className="col-span-6 md:col-span-3 row-span-2 rounded-xl border border-pink-900/30 bg-pink-950/5 p-3 flex flex-col justify-between group hover:border-pink-500/50 transition-colors">
            <div className="flex items-center gap-2 text-[9px] text-pink-500 font-bold uppercase">
                <Shield size={12} /> Threats Blocked
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-white tracking-tighter">{sec.threatsBlocked}</div>
                <div className="text-[8px] text-pink-700 font-mono">NEUTRALIZED INSTANTLY</div>
            </div>
        </div>

        {/* 3. SECURE TUNNEL (Network) */}
        <div className="col-span-6 md:col-span-3 row-span-2 rounded-xl border border-amber-900/30 bg-amber-950/5 p-3 flex flex-col justify-between group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center gap-2 text-[9px] text-amber-500 font-bold uppercase">
                <Server size={12} /> Tunnel Speed
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-white tracking-tighter">{net.downlink}</div>
                <div className="text-[8px] text-amber-700 font-mono">MBPS ENCRYPTED</div>
            </div>
        </div>

        {/* 4. GEO-CLOAKING */}
        <div className="col-span-6 md:col-span-3 row-span-2 rounded-xl border border-purple-900/30 bg-purple-950/5 p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></div>
            </div>
            <div className="flex items-center gap-2 text-[9px] text-purple-400 font-bold uppercase">
                <Globe size={12} /> Geo-Cloak
            </div>
            <div className="flex items-center justify-center flex-grow">
                <div className="text-xs font-mono text-purple-200 bg-purple-900/40 px-2 py-1 rounded border border-purple-500/30">
                    HIDDEN
                </div>
            </div>
            <div className="text-[8px] text-purple-600 font-mono text-center">Only Bee knows where you are</div>
        </div>

        {/* 5. SYSTEM UPTIME & INTEGRITY */}
        <div className="col-span-6 md:col-span-3 row-span-2 rounded-xl border border-emerald-900/30 bg-emerald-950/5 p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-[9px] text-emerald-400 font-bold uppercase">
                <Activity size={12} /> Core Uptime
            </div>
             <div className="text-right">
                <div className="text-sm font-black text-white font-mono">{health.uptime}</div>
                <div className="text-[8px] text-emerald-700 font-mono flex items-center justify-end gap-1">
                    <Check size={8}/> 100% STABLE
                </div>
            </div>
        </div>

        {/* 6. STORAGE VAULT (Bottom Strip) */}
        <div className="col-span-12 row-span-2 rounded-xl border border-gray-800 bg-gray-900/50 p-3 flex items-center gap-4">
             <div className="p-2 bg-gray-800 rounded-lg">
                 <Database size={16} className="text-gray-400" />
             </div>
             <div className="flex-grow flex flex-col gap-1">
                 <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                     <span>Memory Vault</span>
                     <span>Capacity: Infinite</span>
                 </div>
                 <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
                     <div className="w-[40%] bg-pink-600"></div>
                     <div className="w-[20%] bg-amber-500"></div>
                     <div className="w-[10%] bg-purple-500"></div>
                 </div>
                 <div className="flex gap-4 text-[8px] text-gray-600 font-mono">
                     <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-pink-600"></div> PHOTOS</span>
                     <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-amber-500"></div> VOICE</span>
                     <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-purple-500"></div> TEXT</span>
                 </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default StreamMonitor;