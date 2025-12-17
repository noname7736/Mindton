import React, { useEffect, useState } from 'react';
import { StreamHealth } from '../types';
import { Monitor, Smartphone, Tablet, Scan, Maximize, Lock, Wifi, Grid, Cast } from 'lucide-react';

interface StreamMonitorProps {
  health: StreamHealth;
}

const StreamMonitor: React.FC<StreamMonitorProps> = ({ health }) => {
  const [screenInfo, setScreenInfo] = useState({ w: 0, h: 0, availW: 0, availH: 0, type: 'UNKNOWN' });

  useEffect(() => {
    // Poll window properties for UI updates
    const update = () => {
        setScreenInfo({
            w: window.screen.width,
            h: window.screen.height,
            availW: window.screen.availWidth,
            availH: window.screen.availHeight,
            type: navigator.maxTouchPoints > 0 ? 'MOBILE/TABLET' : 'DESKTOP_WS'
        });
    };
    window.addEventListener('resize', update);
    update();
    return () => window.removeEventListener('resize', update);
  }, []);

  // Calculate Aspect Ratio for Visualization
  const aspectRatio = screenInfo.w / screenInfo.h;
  const vizWidth = 200;
  const vizHeight = vizWidth / aspectRatio;

  return (
    <div className="bg-black rounded-sm border-2 border-cyan-900 overflow-hidden flex flex-col h-full relative group shadow-[0_0_80px_rgba(6,182,212,0.15)]">
      
      {/* HEADER: TARGET ID */}
      <div className="bg-cyan-950/20 px-3 py-1 border-b border-cyan-800 flex justify-between items-center z-30 font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
            <Scan size={14} className="animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase">
                TARGET_SCREEN: {screenInfo.type}
            </span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></div>
            <span className="text-[9px] text-cyan-600 font-bold">CAPTURING</span>
        </div>
      </div>
      
      {/* MAIN VISUALIZATION: SCREEN MIRROR METAPHOR */}
      <div className="relative flex-grow bg-black flex items-center justify-center overflow-hidden p-8">
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* The "Captured Screen" Representation */}
        <div className="relative z-20 flex flex-col items-center justify-center gap-4">
            
            {/* Physical Device Frame */}
            <div 
                className="border-2 border-cyan-500 bg-cyan-950/30 relative flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] backdrop-blur-sm transition-all duration-500"
                style={{ 
                    width: `${vizWidth}px`, 
                    height: `${vizHeight}px`,
                    maxWidth: '100%'
                }}
            >
                {/* Diagonal Scanlines */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(6,182,212,0.1)_2px,rgba(6,182,212,0.1)_4px)]"></div>
                
                {/* Center Info */}
                <div className="text-center z-10">
                    <Maximize size={24} className="text-cyan-400 mx-auto mb-2 opacity-80" />
                    <div className="text-[10px] font-mono text-cyan-300 font-bold bg-black/50 px-2 py-0.5">
                        {screenInfo.w} x {screenInfo.h}
                    </div>
                </div>

                {/* Corners */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-cyan-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-cyan-400"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-cyan-400"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-cyan-400"></div>
            </div>

            {/* Connection Lines */}
            <div className="flex gap-8 mt-4 opacity-50">
                 <div className="flex flex-col items-center gap-1">
                     <div className="w-px h-8 bg-cyan-800"></div>
                     <span className="text-[8px] font-mono text-cyan-600">INPUT</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <div className="w-px h-8 bg-cyan-800"></div>
                     <span className="text-[8px] font-mono text-cyan-600">VIDEO</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                     <div className="w-px h-8 bg-cyan-800"></div>
                     <span className="text-[8px] font-mono text-cyan-600">AUDIO</span>
                 </div>
            </div>
        </div>
        
        {/* Stats Overlay */}
        <div className="absolute top-4 left-4 space-y-2 z-30">
             <div className="flex items-center gap-2 text-[9px] text-cyan-500 font-mono">
                 <Grid size={10} />
                 <span>PIXEL_DENSITY: {window.devicePixelRatio.toFixed(1)}x</span>
             </div>
             <div className="flex items-center gap-2 text-[9px] text-cyan-500 font-mono">
                 <Cast size={10} />
                 <span>MIRROR_LATENCY: 0ms</span>
             </div>
        </div>

        <div className="absolute bottom-4 right-4 text-right">
            <div className="text-[9px] font-mono text-cyan-700">DEVICE_FINGERPRINT</div>
            <div className="text-[8px] font-mono text-cyan-500 w-32 truncate">{navigator.userAgent}</div>
        </div>

      </div>
      
      {/* Footer Status */}
      <div className="bg-black px-3 py-1 border-t border-cyan-900/50 flex justify-between items-center text-[9px] font-mono text-cyan-600">
         <span>ACCESS_LEVEL: ROOT / PHYSICAL</span>
         <span className="flex items-center gap-1 text-cyan-400 animate-pulse"><Wifi size={10}/> SYNCED</span>
      </div>
    </div>
  );
};

export default StreamMonitor;