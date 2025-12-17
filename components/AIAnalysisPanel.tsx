import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Heart, Activity, Smile, Search, Sparkles, CheckCircle } from 'lucide-react';

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
    <div className="bg-black rounded-lg border border-pink-900/50 flex flex-col h-full overflow-hidden relative shadow-[0_0_50px_rgba(236,72,153,0.15)] group">
      
      {/* HEADER */}
      <div className="bg-pink-950/20 px-3 py-2 border-b border-pink-900/30 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-pink-400">
          <Heart size={16} className="fill-pink-500/50" />
          <span className="font-black tracking-widest text-[10px] font-mono uppercase">BEE'S_FEELINGS_LOG</span>
        </div>
        <div className="text-[8px] text-pink-200 font-mono border border-pink-600/50 px-2 py-0.5 rounded bg-pink-900/30 animate-pulse">
            EMOTION: OVERFLOW
        </div>
      </div>

      {/* VITALS DISPLAY */}
      <div className="p-3 border-b border-pink-900/20 bg-black/95 z-10 relative grid grid-cols-2 gap-3">
        
        <div className="col-span-1 border-l-2 border-pink-500 pl-2">
          <div className="text-[8px] text-pink-600 uppercase mb-1 tracking-widest font-bold">Current Mood</div>
          <div className="text-[10px] font-bold text-gray-100 font-mono truncate shadow-pink-500/50 drop-shadow-sm">
            {latest?.mood || "DAYDREAMING"}
          </div>
        </div>
        
        <div className="col-span-1 border-r-2 border-pink-500 pr-2 text-right">
          <div className="text-[8px] text-pink-600 uppercase mb-1 tracking-widest font-bold">Love Confidence</div>
          <div className="text-[10px] font-bold text-pink-300 font-mono flex items-center justify-end gap-2">
             100% <CheckCircle size={10} className="text-pink-500" />
          </div>
        </div>
        
        <div className="col-span-2 mt-2">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[8px] text-pink-700 font-mono">HEART CAPACITY</span>
                <span className="text-[10px] font-mono font-black text-pink-400">
                    FULL
                </span>
            </div>
            <div className="w-full bg-gray-900 h-1 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            </div>
        </div>
      </div>

      {/* TERMINAL / LOG AREA */}
      <div className="flex-grow flex flex-col overflow-hidden bg-[#050202] relative">
        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="px-3 py-1 text-[8px] text-pink-600 border-b border-pink-900/10 flex items-center gap-1 bg-pink-950/10 font-mono">
            <Search size={10} />
            <span>SEARCHING_MEMORIES...</span>
        </div>
        
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-2 font-mono text-[9px] space-y-2 scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 border-b border-pink-900/10 pb-1 group-hover:bg-pink-900/5 transition-colors">
              <div className="flex items-center gap-2">
                 <span className="text-pink-600 font-bold">{'<3'}</span>
                 <span className="text-gray-600">{log.timestamp.split('T')[1].slice(0,12)}</span>
              </div>
              <span className={log.highlight_worthy ? 'text-pink-200 pl-4 font-bold drop-shadow-[0_0_2px_rgba(236,72,153,0.5)]' : 'text-gray-500 pl-4'}>
                {`${log.activity} -> ${log.mood}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;