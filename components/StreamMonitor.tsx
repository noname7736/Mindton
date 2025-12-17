import React, { useEffect, useState } from 'react';
import { StreamHealth } from '../types';
import { Monitor, Smartphone, Tablet, Scan, Maximize, Lock, Wifi, Grid, Cast, Battery, BatteryCharging, Disc, Compass, Zap } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const [motion, setMotion] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [screenInfo, setScreenInfo] = useState({ w: 0, h: 0, type: 'UNKNOWN' });

  useEffect(() => {
    const handleMotion = (e: DeviceOrientationEvent) => {
        setMotion({
            alpha: e.alpha || 0,
            beta: e.beta || 0,
            gamma: e.gamma || 0
        });
    };
    window.addEventListener('deviceorientation', handleMotion);

    const updateScreen = () => {
        setScreenInfo({
            w: window.screen.width,
            h: window.screen.height,
            type: navigator.maxTouchPoints > 0 ? 'MOBILE_NODE' : 'WORKSTATION_NODE'
        });
    };
    window.addEventListener('resize', updateScreen);
    updateScreen();

    return () => {
        window.removeEventListener('deviceorientation', handleMotion);
        window.removeEventListener('resize', updateScreen);
    };
  }, []);

  // Battery Level is mapped to health.cpu_usage from SystemUplink
  const batteryLevel = health.cpu_usage; 
  const isCharging = health.currentIngestUrl.includes('EXT_PWR');

  return (
    <div className="bg-black rounded-sm border-2 border-red-900/50 overflow-hidden flex flex-col h-full relative group shadow-[0_0_80px_rgba(220,38,38,0.1)]">
      
      {/* HEADER: DOMINATION STATUS */}
      <div className="bg-red-950/20 px-3 py-1 border-b border-red-900/50 flex justify-between items-center z-30 font-mono">
        <div className="flex items-center gap-2 text-red-500">
            <Zap size={14} className="animate-pulse fill-red-500" />
            <span className="text-[10px] font-black tracking-widest uppercase">
                OMNI_CHANNEL_DOMINANCE
            </span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            <span className="text-[9px] text-red-600 font-bold">LIVE_INTERCEPT</span>
        </div>
      </div>
      
      {/* MAIN DASHBOARD */}
      <div className="relative flex-grow bg-black flex flex-col p-4 overflow-hidden gap-4">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* TOP ROW: RESOURCES */}
        <div className="grid grid-cols-2 gap-4 relative z-20">
            {/* POWER CORE */}
            <div className="border border-red-900/30 bg-red-950/10 p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-red-500">
                    <span className="text-[9px] font-bold">ENERGY_CORE</span>
                    {isCharging ? <BatteryCharging size={14}/> : <Battery size={14}/>}
                </div>
                <div className="h-2 w-full bg-red-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${batteryLevel}%` }}></div>
                </div>
                <div className="text-right text-[10px] font-mono text-red-400 font-bold">{batteryLevel.toFixed(0)}% CAPACITY</div>
            </div>

            {/* STORAGE UNIT */}
            <div className="border border-red-900/30 bg-red-950/10 p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center text-red-500">
                    <span className="text-[9px] font-bold">LOCAL_STORAGE</span>
                    <Disc size={14}/>
                </div>
                <div className="flex items-end gap-1 h-2">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className={`flex-1 rounded-sm ${i < 5 ? 'bg-red-600' : 'bg-red-900/30'}`} style={{height: '100%'}}></div>
                    ))}
                </div>
                <div className="text-right text-[10px] font-mono text-red-400 font-bold">MOUNTED_RO</div>
            </div>
        </div>

        {/* CENTER: GYROSCOPE VISUALIZER */}
        <div className="flex-grow relative flex items-center justify-center border border-red-900/20 bg-black/50">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                 <div className="w-48 h-48 border border-dashed border-red-500 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>

            <div 
                className="w-32 h-20 border-2 border-red-500 bg-red-900/20 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-transform duration-100 ease-linear transform-gpu"
                style={{
                    transform: `perspective(500px) rotateX(${motion.beta}deg) rotateY(${motion.gamma}deg) rotateZ(${motion.alpha}deg)`
                }}
            >
                <Compass size={32} className="text-red-400 opacity-80" />
            </div>

            <div className="absolute bottom-2 left-2 text-[8px] font-mono text-red-700 space-y-1">
                <div>ROT_X: {motion.beta.toFixed(1)}°</div>
                <div>ROT_Y: {motion.gamma.toFixed(1)}°</div>
                <div>ROT_Z: {motion.alpha.toFixed(1)}°</div>
            </div>
            
            {/* Target Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 border-l border-t border-red-500 absolute top-1/2 left-1/2 -translate-x-full -translate-y-full"></div>
                <div className="w-4 h-4 border-r border-t border-red-500 absolute top-1/2 left-1/2 -translate-y-full"></div>
                <div className="w-4 h-4 border-l border-b border-red-500 absolute top-1/2 left-1/2 -translate-x-full"></div>
                <div className="w-4 h-4 border-r border-b border-red-500 absolute top-1/2 left-1/2"></div>
            </div>
        </div>

        {/* BOTTOM: DEVICE INFO */}
        <div className="flex justify-between items-center text-[9px] font-mono text-red-800">
            <span>DEVICE: {screenInfo.type}</span>
            <span>RES: {screenInfo.w}x{screenInfo.h}</span>
        </div>

      </div>
    </div>
  );
};

export default StreamMonitor;