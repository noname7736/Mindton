import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Brain, Terminal, HeartPulse, Activity, Fingerprint } from 'lucide-react';

interface AIAnalysisPanelProps {
  logs: AIAnalysisResult[];
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const latest = logs[logs.length - 1];

  return (
    <div className="bg-black rounded-sm border border-purple-900/30 flex flex-col h-full overflow-hidden relative">
      <div className="bg-purple-950/10 px-3 py-1 border-b border-purple-900/30 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-purple-500">
          <Activity size={14} className="animate-pulse" />
          <span className="font-bold tracking-widest text-[10px] font-mono">BIO-METRIC TELEMETRY</span>
        </div>
        <div className="text-[9px] text-purple-700 font-mono">
            LIVE SENSOR DATA
        </div>
      </div>

      {/* RAW DATA DISPLAY */}
      <div className="p-3 border-b border-purple-900/20 bg-black z-10 relative grid grid-cols-2 gap-2">
        
        <div className="col-span-1 border border-purple-900/30 p-2 rounded-sm">
          <div className="text-[8px] text-purple-800 uppercase mb-1 tracking-widest">Physiological</div>
          <div className="text-sm font-bold text-gray-300 font-mono truncate">{latest?.activity || "NO SIGNAL"}</div>
        </div>
        
        <div className="col-span-1 border border-purple-900/30 p-2 rounded-sm">
          <div className="text-[8px] text-purple-800 uppercase mb-1 tracking-widest">Psychological</div>
          <div className="text-sm font-bold text-purple-400 font-mono flex items-center gap-2">
            {latest?.mood || "..."} <HeartPulse size={12} className="animate-pulse text-red-500" />
          </div>
        </div>
        
        <div className="col-span-2 mt-1">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[8px] text-purple-900 font-mono">NEURAL LINK STABILITY</span>
                <span className="text-sm font-mono font-bold text-purple-500">
                    {latest?.confidence || 0}%
                </span>
            </div>
            <div className="w-full bg-purple-950/20 h-1 relative">
                <div 
                    className="h-full bg-purple-600 transition-all duration-100" 
                    style={{ width: `${latest?.confidence || 0}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="flex-grow flex flex-col overflow-hidden bg-black relative">
        <div className="px-3 py-1 text-[8px] text-purple-900 border-b border-purple-900/10 flex items-center gap-1 bg-purple-950/5 font-mono">
            <Terminal size={8} />
            <span>RAW_DATA_STREAM_V4</span>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-2 font-mono text-[9px] space-y-1 scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-purple-800 opacity-50">{log.timestamp.split('T')[1].split('.')[0]}Z</span>
              <span className={log.highlight_worthy ? 'text-purple-400' : 'text-gray-600'}>
                {log.activity} :: {log.mood}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-purple-900/30 text-[8px]">INITIALIZING SENSORS...</div>}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;