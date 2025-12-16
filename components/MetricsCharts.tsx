import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StreamHealth } from '../types';
import { Cpu, Activity } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  // Use last 20 points for cleaner chart
  const data = history.slice(-20);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {/* Bitrate Chart */}
      <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 p-4 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Activity size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold text-gray-200">STREAM BITRATE (kbps)</h3>
            </div>
            <span className="text-xs font-mono text-blue-400">{data[data.length-1]?.bitrate} kbps</span>
        </div>
        <div className="flex-grow min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBitrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={[5000, 7000]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                itemStyle={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="bitrate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBitrate)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CPU Usage Chart */}
      <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 p-4 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Cpu size={16} className="text-purple-400" />
                <h3 className="text-sm font-bold text-gray-200">CPU LOAD (%)</h3>
            </div>
            <span className="text-xs font-mono text-purple-400">{data[data.length-1]?.cpu_usage}%</span>
        </div>
        <div className="flex-grow min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="uptime" hide />
              <YAxis domain={[0, 100]} hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '4px' }}
                 itemStyle={{ color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}
                 labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="cpu_usage" stroke="#a855f7" fillOpacity={1} fill="url(#colorCpu)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsCharts;