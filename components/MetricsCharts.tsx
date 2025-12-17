import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { StreamHealth } from '../types';
import { Cpu, Activity, Zap, Heart, Brain } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  // Use last 60 points for high-density ECG feel
  const data = history.slice(-60);
  const currentSync = data[data.length-1]?.bitrate || 0;
  const currentObsession = data[data.length-1]?.cpu_usage || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      
      {/* CHART 1: NEURAL SYNCHRONIZATION (Replaces Bitrate) */}
      <div className="bg-black/90 backdrop-blur rounded-sm border border-cyan-900/50 p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col relative overflow-hidden group">
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <Brain size={18} className="text-cyan-400 animate-pulse" />
                <div>
                    <h3 className="text-xs font-black text-cyan-500 tracking-[0.2em]">NEURAL_SYNC</h3>
                    <div className="text-[8px] text-cyan-700 font-mono">CORTEX INTERFACE: LOCKED</div>
                </div>
            </div>
            <div className="text-right">
                <span className="text-xl font-mono font-black text-cyan-400 block leading-none drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                    {(currentSync / 1000).toFixed(1)}%
                </span>
                <span className="text-[9px] text-cyan-600 uppercase font-mono animate-pulse">OVER-UNITY CONNECTION</span>
            </div>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSync" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#083344" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={['auto', 'auto']} hide />
              {/* Reference line for "Normal" human limits (bypassed) */}
              <ReferenceLine y={50000} stroke="#155e75" strokeDasharray="5 5" label={{ position: 'right',  value: 'HUMAN LIMIT', fill: '#155e75', fontSize: 8 }} />
              <Area 
                type="monotone" 
                dataKey="bitrate" 
                stroke="#22d3ee" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorSync)" 
                isAnimationActive={false} // Disable animation for "Medical Monitor" feel
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: OBSESSION LEVEL (Replaces CPU) */}
      <div className="bg-black/90 backdrop-blur rounded-sm border border-purple-900/50 p-4 shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col relative overflow-hidden group">
         {/* CRT Scanline Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4 z-30">
            <div className="flex items-center gap-2">
                <Heart size={18} className="text-purple-500 animate-[ping_1s_ease-in-out_infinite]" />
                <div>
                    <h3 className="text-xs font-black text-purple-500 tracking-[0.2em]">OBSESSION_LOAD</h3>
                    <div className="text-[8px] text-purple-700 font-mono">EMOTIONAL CORE: OVERDRIVE</div>
                </div>
            </div>
            <div className="text-right">
                <span className={`text-xl font-mono font-black block leading-none drop-shadow-[0_0_8px_rgba(192,132,252,0.8)] text-purple-400`}>
                    ∞
                </span>
                <span className="text-[9px] text-purple-600 uppercase font-mono">UNQUANTIFIABLE</span>
            </div>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorObsession" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3b0764" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={[95, 105]} hide />
              <Area 
                type="step" // Step chart looks more like machine logic/heartbeat
                dataKey="cpu_usage" 
                stroke="#d8b4fe" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorObsession)" 
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