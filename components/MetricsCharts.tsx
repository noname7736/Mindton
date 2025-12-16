import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StreamHealth } from '../types';
import { Cpu, Activity, TrendingUp } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  // Use last 40 points for smoother high-density chart
  const data = history.slice(-40);
  const currentBitrate = data[data.length-1]?.bitrate || 0;
  const currentCpu = data[data.length-1]?.cpu_usage || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Bitrate Chart */}
      <div className="bg-galaxy-800/80 backdrop-blur rounded-lg border border-galaxy-700 p-4 shadow-lg flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-gray-200 tracking-wide">STREAM BITRATE</h3>
            </div>
            <div className="text-right">
                <span className="text-lg font-mono font-bold text-cyan-400 block leading-none">
                    {(currentBitrate / 1000).toFixed(2)} Mbps
                </span>
                <span className="text-[9px] text-cyan-500/70 uppercase font-mono">Target: 18.00 Mbps</span>
            </div>
        </div>
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBitrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
              <XAxis dataKey="uptime" hide />
              {/* Domain optimized for 15000-20000 kbps range */}
              <YAxis domain={[10000, 22000]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #22d3ee', borderRadius: '4px', boxShadow: '0 0 10px rgba(34, 211, 238, 0.2)' }}
                itemStyle={{ color: '#22d3ee', fontSize: '12px', fontFamily: 'monospace' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => [`${(value / 1000).toFixed(2)} Mbps`, 'Bitrate']}
              />
              <Area type="monotone" dataKey="bitrate" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorBitrate)" animationDuration={300} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
      </div>

      {/* CPU Usage Chart */}
      <div className="bg-galaxy-800/80 backdrop-blur rounded-lg border border-galaxy-700 p-4 shadow-lg flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 z-10">
            <div className="flex items-center gap-2">
                <Cpu size={16} className="text-purple-400" />
                <h3 className="text-sm font-bold text-gray-200 tracking-wide">CPU LOAD</h3>
            </div>
            <div className="text-right">
                <span className={`text-lg font-mono font-bold block leading-none ${currentCpu > 90 ? 'text-red-400' : 'text-purple-400'}`}>
                    {currentCpu}%
                </span>
                <span className="text-[9px] text-purple-500/70 uppercase font-mono">16 CORES ACTIVE</span>
            </div>
        </div>
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #c084fc', borderRadius: '4px', boxShadow: '0 0 10px rgba(192, 132, 252, 0.2)' }}
                 itemStyle={{ color: '#c084fc', fontSize: '12px', fontFamily: 'monospace' }}
                 labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="cpu_usage" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" animationDuration={300} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
         {/* Background Accent */}
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl -ml-10 -mb-10"></div>
      </div>
    </div>
  );
};

export default MetricsCharts;