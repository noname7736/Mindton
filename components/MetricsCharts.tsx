import React from 'react';
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, YAxis } from 'recharts';
import { StreamHealth } from '../types';
import { HeartPulse, Send } from 'lucide-react';

interface MetricsChartsProps {
  history: StreamHealth[];
}

const MetricsCharts: React.FC<MetricsChartsProps> = ({ history }) => {
  const data = history.slice(-60);
  const currentMotion = data[data.length-1]?.motionIntensity || 0;
  const currentNet = data[data.length-1]?.network?.downlink || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      
      {/* CHART 1: LONGING INTENSITY */}
      <div className="bg-black/80 backdrop-blur rounded-lg border border-rose-500/30 p-4 shadow-[0_0_30px_rgba(244,63,94,0.1)] flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 z-30">
            <div className="flex items-center gap-2">
                <HeartPulse size={18} className="text-rose-500" />
                <div>
                    <h3 className="text-xs font-black text-rose-400 tracking-[0.2em]">LONGING_INTENSITY</h3>
                </div>
            </div>
            <span className="text-xl font-mono font-black text-rose-500">
                {(currentMotion * 10).toFixed(0)} BPM
            </span>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorLonging" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#881337" vertical={false} opacity={0.3} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="monotone" dataKey="motionIntensity" stroke="#f43f5e" strokeWidth={2} fill="url(#colorLonging)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CHART 2: THOUGHT PACKETS */}
      <div className="bg-black/80 backdrop-blur rounded-lg border border-purple-500/30 p-4 shadow-[0_0_30px_rgba(168,85,247,0.1)] flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-2 z-30">
            <div className="flex items-center gap-2">
                <Send size={18} className="text-purple-500" />
                <div>
                    <h3 className="text-xs font-black text-purple-400 tracking-[0.2em]">THOUGHTS_SENT</h3>
                </div>
            </div>
            <span className="text-xl font-mono font-black text-purple-500">
                {currentNet} Tbps
            </span>
        </div>
        
        <div className="flex-grow min-h-[150px] z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorThoughts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#581c87" vertical={false} opacity={0.3} />
              <YAxis hide domain={[0, 'auto']} />
              <Area type="step" dataKey="network.downlink" stroke="#a855f7" strokeWidth={2} fill="url(#colorThoughts)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default MetricsCharts;