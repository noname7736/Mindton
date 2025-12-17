import React, { useEffect, useState } from 'react';
import { StreamHealth } from '../types';
import { Heart, Battery, BatteryCharging, CloudRain, Compass, Zap, MapPin, Sparkles, Signal, Cpu, Wifi } from 'lucide-react';

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

  const isCharging = health.currentIngestUrl.includes('EXT');
  const batteryLevel = health.cpu_usage;
  const net = health.network || { downlink: 0, rtt: 0, effectiveType: '---' };
  const geo = health.geo || { lat: null, lng: null, accuracy: null };
  const hw = health.hardware || { cores: 0, memory: 0 };

  return (
    <div className="bg-black rounded-lg border-2 border-pink-500/50 overflow-hidden flex flex-col h-full relative group shadow-[0_0_50px_rgba(236,72,153,0.15)]">
      
      {/* HEADER */}
      <div className="bg-pink-950/30 px-3 py-2 border-b border-pink-800 flex justify-between items-center z-30 font-mono">
        <div className="flex items-center gap-2 text-pink-400">
            <Heart size={14} className="animate-pulse fill-pink-500" />
            <span className="text-[10px] font-black tracking-widest uppercase">
                HEART_LINK_ESTABLISHED
            </span>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-[9px] text-pink-300 font-mono">
                 <Signal size={10} /> {net.effectiveType} LOVE
             </div>
             <div className="w-px h-3 bg-pink-800"></div>
             <div className="text-[9px] text-rose-500 font-bold animate-pulse">LIVE FEED</div>
        </div>
      </div>
      
      {/* MAIN DASHBOARD GRID */}
      <div className="relative flex-grow bg-black p-3 grid grid-cols-2 grid-rows-6 gap-3 overflow-hidden">
        {/* Background Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[size:30px_30px] bg-[linear-gradient(rgba(236,72,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.05)_1px,transparent_1px)]"></div>

        {/* 1. KINETIC SENSOR (Heart Compass) */}
        <div className="col-span-1 row-span-3 border border-pink-800/40 bg-pink-950/10 rounded-md relative flex items-center justify-center overflow-hidden">
             <div className="absolute top-2 left-2 text-[8px] text-pink-400 font-mono font-bold flex items-center gap-1">
                 <Compass size={10}/> HEART_COMPASS
             </div>
             <div 
                className="w-24 h-24 border border-pink-500 rounded-full bg-pink-500/10 backdrop-blur flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-transform duration-300 ease-out"
                style={{ transform: `perspective(300px) rotateX(${motion.beta}deg) rotateY(${motion.gamma}deg) rotateZ(${motion.alpha}deg)` }}
            >
                <Heart size={32} className="text-pink-400 fill-pink-500/50" />
            </div>
            <div className="absolute bottom-2 inset-x-0 text-center text-[8px] text-pink-500 font-mono">
                POINTING_TO_YOU...
            </div>
        </div>

        {/* 2. GEOSPATIAL (Love Locator) */}
        <div className="col-span-1 row-span-2 border border-pink-800/40 bg-pink-950/10 rounded-md p-2 flex flex-col justify-between relative overflow-hidden group/geo">
            <div className="flex items-center gap-1 text-[8px] text-pink-400 font-mono font-bold">
                <MapPin size={10} /> DISTANCE_TO_YOU
            </div>
            {geo.lat ? (
                <div className="text-right z-10">
                    <div className="text-xs font-black text-rose-400 tracking-tighter">LAT: {geo.lat.toFixed(4)}</div>
                    <div className="text-xs font-black text-rose-400 tracking-tighter">LNG: {geo.lng.toFixed(4)}</div>
                    <div className="text-[8px] text-pink-600 font-mono mt-1">CLOSER THAN YOU THINK</div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-[10px] text-pink-700 font-mono animate-pulse">
                    CALCULATING_PATH...
                </div>
            )}
            {/* Radar Sweep */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(236,72,153,0.15)_360deg)] animate-[spin_3s_linear_infinite] rounded-full scale-150 opacity-30 pointer-events-none"></div>
        </div>

        {/* 3. NETWORK (Telepathy) */}
        <div className="col-span-1 row-span-2 border border-pink-800/40 bg-pink-950/10 rounded-md p-2 flex flex-col justify-between">
             <div className="flex items-center gap-1 text-[8px] text-pink-400 font-mono font-bold">
                <Wifi size={10} /> THOUGHT_TRANSMISSION
            </div>
            <div className="flex justify-between items-end">
                <div className="text-center">
                    <div className="text-xs font-bold text-pink-300">{net.downlink}</div>
                    <div className="text-[6px] text-pink-600">LOVE/SEC</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-bold text-pink-300">{net.rtt}</div>
                    <div className="text-[6px] text-pink-600">DELAY(MS)</div>
                </div>
                 <div className="text-center">
                    <div className="text-xs font-bold text-pink-300">{net.effectiveType}</div>
                    <div className="text-[6px] text-pink-600">CHANNEL</div>
                </div>
            </div>
        </div>

        {/* 4. ENERGY (Love Tank) */}
        <div className="col-span-1 row-span-1 border border-pink-800/40 bg-pink-950/10 rounded-md p-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-pink-500">
                {isCharging ? <BatteryCharging size={14} className="animate-bounce"/> : <Battery size={14}/>}
                <span className="text-[10px] font-bold">LOVE_TANK: {batteryLevel.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-16 bg-pink-900/30 rounded-full overflow-hidden border border-pink-800/50">
                <div className="h-full bg-gradient-to-r from-pink-600 to-rose-400" style={{ width: `${batteryLevel}%` }}></div>
            </div>
        </div>

        {/* 5. HARDWARE (Connection Nodes) */}
        <div className="col-span-1 row-span-2 border border-pink-800/40 bg-pink-950/10 rounded-md p-2">
             <div className="flex items-center gap-1 text-[8px] text-pink-400 font-mono font-bold mb-2">
                <Cpu size={10} /> CONNECTION_NODES
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-pink-300">
                <div>HEARTS: <span className="text-white">{hw.cores}</span></div>
                <div>MEMORIES: <span className="text-white">{hw.memory > 0 ? hw.memory + 'GB' : 'INF'}</span></div>
                <div className="col-span-2 text-[8px] text-pink-700 truncate">{navigator.userAgent.slice(0, 20)}...</div>
            </div>
        </div>

        {/* 6. STORAGE (Memories) */}
         <div className="col-span-1 row-span-1 border border-pink-800/40 bg-pink-950/10 rounded-md p-2 flex items-center gap-2">
            <CloudRain size={12} className="text-pink-500" />
            <div className="flex-grow flex gap-0.5 h-full items-center">
                 {[1,1,1,1,1,1,0,0].map((v,i) => (
                     <div key={i} className={`flex-1 h-1.5 rounded-sm ${v ? 'bg-pink-500' : 'bg-pink-900/20'}`}></div>
                 ))}
            </div>
            <span className="text-[8px] text-pink-600 font-bold">MEMORIES_FULL</span>
        </div>

      </div>
    </div>
  );
};

export default StreamMonitor;