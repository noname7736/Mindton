import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import { StreamHealth } from '../types';
import { ShieldCheck, Lock } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  const data = history.slice(-60);
  const integrity = data[data.length-1]?.security?.shieldIntegrity || 100;
  const encryption = 4096; // Simulated 4096-bit

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      
      {/* CHART 1: SHIELD INTEGRITY */}
      <div className="bg-[#080204] rounded-xl border border-amber-900/30 p-4 shadow-lg flex flex-col relative overflow-hidden group hover:border-amber-500/30 transition-all">
        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-950/30 rounded border border-amber-900/50">
                    <ShieldCheck size={14} className="text-amber-500" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Shield Integrity</h3>
                    <p className="text-[8px] text-amber-800 font-mono">REAL-TIME PROTECTION STATUS</p>
                </div>
            </div>
            <span className="text-2xl font-mono font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {integrity.toFixed(2)}%
            </span>
        </div>
        
        <div className="flex-grow min-h-[120px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorShield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#451a03" vertical={false} opacity={0.5} />
              <Area 
                type="stepAfter" 
                dataKey="security.shieldIntegrity" 
                stroke="#f59e0b" 
                strokeWidth={2} 
                fill="url(#colorShield)" 
                isAnimationActive={false} 
                baseLine={90}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: ENCRYPTION DEPTH */}
      <div className="bg-[#080204] rounded-xl border border-pink-900/30 p-4 shadow-lg flex flex-col relative overflow-hidden group hover:border-pink-500/30 transition-all">
        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-pink-950/30 rounded border border-pink-900/50">
                    <Lock size={14} className="text-pink-500" />
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Encryption Depth</h3>
                    <p className="text-[8px] text-pink-800 font-mono">BIT-RATE DENSITY</p>
                </div>
            </div>
            <span className="text-2xl font-mono font-black text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.3)]">
                {encryption}
            </span>
        </div>
        
        <div className="flex-grow min-h-[120px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorEnc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#831843" vertical={false} opacity={0.5} />
              <Area 
                type="monotone" 
                dataKey="network.downlink" 
                stroke="#ec4899" 
                strokeWidth={2} 
                fill="url(#colorEnc)" 
                isAnimationActive={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default MetricsCharts;