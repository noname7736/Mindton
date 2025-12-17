import React, { useEffect, useState } from 'react';
import { StreamHealth } from '../types';
import { Monitor, Battery, BatteryCharging, Disc, Compass, Zap, MapPin, Globe, Signal, Cpu, Wifi } from 'lucide-react';

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
    <div className="bg-black rounded-sm border-2 border-red-900/60 overflow-hidden flex flex-col h-full relative group shadow-[0_0_80px_rgba(220,38,38,0.2)]">
      
      {/* HEADER: FINALITY STATUS */}
      <div className="bg-red-950/30 px-3 py-1 border-b border-red-900 flex justify-between items-center z-30 font-mono">
        <div className="flex items-center gap-2 text-red-500">
            <Globe size={14} className="animate-spin-slow fill-red-900" />
            <span className="text-[10px] font-black tracking-widest uppercase">
                OMNI_PRESENCE_ESTABLISHED
            </span>
        </div>
        <div className="flex items-center gap-3">
             <div className="flex items-center gap-1 text-[9px] text-red-400 font-mono">
                 <Signal size={10} /> {net.effectiveType}
             </div>
             <div className="w-px h-3 bg-red-900"></div>
             <div className="text-[9px] text-red-600 font-bold animate-pulse">LIVE</div>
        </div>
      </div>
      
      {/* MAIN DASHBOARD GRID */}
      <div className="relative flex-grow bg-black p-3 grid grid-cols-2 grid-rows-6 gap-3 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        {/* 1. KINETIC SENSOR (Gyro) - Span 2 Rows */}
        <div className="col-span-1 row-span-3 border border-red-900/30 bg-red-950/5 relative flex items-center justify-center overflow-hidden">
             <div className="absolute top-1 left-1 text-[8px] text-red-700 font-mono font-bold">GYRO_STABILIZER</div>
             <div 
                className="w-24 h-16 border border-red-500 bg-red-500/10 backdrop-blur flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-transform duration-75 ease-linear"
                style={{ transform: `perspective(300px) rotateX(${motion.beta}deg) rotateY(${motion.gamma}deg) rotateZ(${motion.alpha}deg)` }}
            >
                <Compass size={24} className="text-red-400" />
            </div>
            <div className="absolute bottom-1 right-1 text-[8px] text-red-500 font-mono text-right">
                {motion.alpha.toFixed(0)}° / {motion.beta.toFixed(0)}°
            </div>
        </div>

        {/* 2. GEOSPATIAL DATA - Span 2 Rows */}
        <div className="col-span-1 row-span-2 border border-red-900/30 bg-red-950/5 p-2 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center gap-1 text-[8px] text-red-700 font-mono font-bold">
                <MapPin size={10} /> GEO_COORDINATES
            </div>
            {geo.lat ? (
                <div className="text-right">
                    <div className="text-sm font-black text-red-500 tracking-tighter">{geo.lat.toFixed(5)}</div>
                    <div className="text-sm font-black text-red-500 tracking-tighter">{geo.lng.toFixed(5)}</div>
                    <div className="text-[8px] text-red-800 font-mono mt-1">ACCURACY: {geo.accuracy?.toFixed(1)}m</div>
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center text-[10px] text-red-900 font-mono animate-pulse">
                    TRIANGULATING...
                </div>
            )}
            {/* Radar Sweep Effect */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(220,38,38,0.1)_360deg)] animate-[spin_4s_linear_infinite] rounded-full scale-150 opacity-20 pointer-events-none"></div>
        </div>

        {/* 3. NETWORK STATS */}
        <div className="col-span-1 row-span-2 border border-red-900/30 bg-red-950/5 p-2 flex flex-col justify-between">
             <div className="flex items-center gap-1 text-[8px] text-red-700 font-mono font-bold">
                <Wifi size={10} /> NETWORK_IO
            </div>
            <div className="flex justify-between items-end">
                <div className="text-center">
                    <div className="text-xs font-bold text-red-400">{net.downlink}</div>
                    <div className="text-[6px] text-red-800">MBPS</div>
                </div>
                <div className="text-center">
                    <div className="text-xs font-bold text-red-400">{net.rtt}</div>
                    <div className="text-[6px] text-red-800">MS (PING)</div>
                </div>
                 <div className="text-center">
                    <div className="text-xs font-bold text-red-400">{net.effectiveType}</div>
                    <div className="text-[6px] text-red-800">TYPE</div>
                </div>
            </div>
        </div>

        {/* 4. ENERGY CORE */}
        <div className="col-span-1 row-span-1 border border-red-900/30 bg-red-950/5 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-500">
                {isCharging ? <BatteryCharging size={14}/> : <Battery size={14}/>}
                <span className="text-[10px] font-bold">{batteryLevel.toFixed(0)}%</span>
            </div>
            <div className="h-1.5 w-16 bg-red-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: `${batteryLevel}%` }}></div>
            </div>
        </div>

        {/* 5. HARDWARE SPECS */}
        <div className="col-span-1 row-span-2 border border-red-900/30 bg-red-950/5 p-2">
             <div className="flex items-center gap-1 text-[8px] text-red-700 font-mono font-bold mb-2">
                <Cpu size={10} /> DEVICE_SILICON
            </div>
            <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-red-400">
                <div>CORES: <span className="text-red-200">{hw.cores}</span></div>
                <div>MEM: <span className="text-red-200">{hw.memory > 0 ? hw.memory + 'GB' : 'N/A'}</span></div>
                <div className="col-span-2 text-[8px] text-red-800 truncate">{navigator.platform}</div>
            </div>
        </div>

        {/* 6. STORAGE */}
         <div className="col-span-1 row-span-1 border border-red-900/30 bg-red-950/5 p-2 flex items-center gap-2">
            <Disc size={12} className="text-red-600" />
            <div className="flex-grow flex gap-0.5 h-full items-center">
                 {[1,1,1,1,0,0,0,0].map((v,i) => (
                     <div key={i} className={`flex-1 h-1.5 rounded-sm ${v ? 'bg-red-500' : 'bg-red-900/20'}`}></div>
                 ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default StreamMonitor;