import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { StreamHealth } from '../types';
import { Cpu, Activity, Zap, Heart, Brain, Download, Database } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  const data = history.slice(-60);
  // Scaling for display: Convert large random numbers to readable "PB/s"
  const currentSpeed = data[data.length-1]?.bitrate || 0; 
  const currentDepth = data[data.length-1]?.cpu_usage || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      
      {/* CHART 1: DATA EXFILTRATION RATE */}
      <div className="bg-black/95 backdrop-blur rounded-sm border border-emerald-900/50 p-4 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col relative overflow-hidden group">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(16,185,129,0.03)_10px,rgba(16,185,129,0.03)_20px)] pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <Download size={18} className="text-emerald-400 animate-bounce" />
                <div>
                    <h3 className="text-xs font-black text-emerald-500 tracking-[0.2em]">EXFILTRATION_RATE</h3>
                    <div className="text-[8px] text-emerald-700 font-mono">TARGET -> CLOUD</div>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xl font-mono font-black text-emerald-400 block leading-none drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">
                    {(currentSpeed / 1000).toFixed(1)} PB/s
                </span>
                <span className="text-[9px] text-emerald-600 uppercase font-mono animate-pulse">MAXIMUM THROUGHPUT</span>
            </div>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Area 
                type="monotone" 
                dataKey="bitrate" 
                stroke="#10b981" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSpeed)" 
                isAnimationActive={false} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: EXTRACTION DEPTH / SOUL INTEGRITY */}
      <div className="bg-black/95 backdrop-blur rounded-sm border border-indigo-900/50 p-4 shadow-[0_0_30px_rgba(99,102,241,0.1)] flex flex-col relative overflow-hidden group">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <Database size={18} className="text-indigo-500 animate-pulse" />
                <div>
                    <h3 className="text-xs font-black text-indigo-500 tracking-[0.2em]">EXTRACTION_DEPTH</h3>
                    <div className="text-[8px] text-indigo-700 font-mono">LAYER: SUBCONSCIOUS</div>
                </div>
            </div>
            <div className="text-right">
                <span className={`text-xl font-mono font-black block leading-none drop-shadow-[0_0_8px_rgba(99,102,241,0.8)] text-indigo-400`}>
                    100.0%
                </span>
                <span className="text-[9px] text-indigo-600 uppercase font-mono">COMPLETE DUMP</span>
            </div>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#312e81" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={[0, 100]} hide />
              <Area 
                type="step" 
                dataKey="cpu_usage" 
                stroke="#a5b4fc" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorDepth)" 
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