import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StreamHealth } from '../types';
import { Activity, Wifi } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  const data = history.slice(-60);
  const currentMotion = data[data.length-1]?.motionIntensity || 0;
  const currentNet = data[data.length-1]?.network?.downlink || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      
      {/* CHART 1: KINETIC FORCE (Motion) */}
      <div className="bg-black/95 backdrop-blur rounded-sm border border-orange-900/50 p-4 shadow-[0_0_30px_rgba(249,115,22,0.1)] flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 z-30">
            <div className="flex items-center gap-2">
                <Activity size={18} className="text-orange-500" />
                <div>
                    <h3 className="text-xs font-black text-orange-500 tracking-[0.2em]">KINETIC_FORCE</h3>
                </div>
            </div>
            <span className="text-xl font-mono font-black text-orange-400">
                {currentMotion.toFixed(2)} G
            </span>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorMotion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#431407" vertical={false} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="monotone" dataKey="motionIntensity" stroke="#f97316" strokeWidth={2} fill="url(#colorMotion)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: NETWORK FLUX */}
      <div className="bg-black/95 backdrop-blur rounded-sm border border-blue-900/50 p-4 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 z-30">
            <div className="flex items-center gap-2">
                <Wifi size={18} className="text-blue-500" />
                <div>
                    <h3 className="text-xs font-black text-blue-500 tracking-[0.2em]">DOWNLINK_FLUX</h3>
                </div>
            </div>
            <span className="text-xl font-mono font-black text-blue-400">
                {currentNet} Mbps
            </span>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a8a" vertical={false} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="step" dataKey="network.downlink" stroke="#3b82f6" strokeWidth={2} fill="url(#colorNet)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default MetricsCharts;