import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Brain, Zap, Terminal, Sparkles, Scan } from 'lucide-react';

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
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 flex flex-col h-full shadow-xl overflow-hidden relative">
      <div className="bg-galaxy-900 px-4 py-2 border-b border-galaxy-700 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-galaxy-accent">
          <Brain size={18} />
          <span className="font-bold tracking-wider text-sm italic">GEMINI ULTRA VISION</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300 font-mono shadow-[0_0_10px_rgba(168,85,247,0.2)]">
            <Zap size={10} className="fill-purple-300" />
            MODEL: gemini-1.5-pro-max
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 border-b border-galaxy-700 bg-galaxy-800/50 z-10 relative">
        <div className="absolute top-0 right-0 p-2 opacity-10">
            <Scan size={64} />
        </div>
        
        <div className="col-span-1 z-10">
          <div className="text-[10px] text-gray-400 uppercase mb-1 tracking-wider">Detection Activity</div>
          <div className="text-lg font-bold text-white truncate drop-shadow-md">{latest?.activity || "Initializing..."}</div>
        </div>
        <div className="col-span-1 z-10">
          <div className="text-[10px] text-gray-400 uppercase mb-1 tracking-wider">Sentiment / Mood</div>
          <div className="text-lg font-bold text-cyan-300 drop-shadow-md flex items-center gap-2">
            {latest?.mood || "..."} <Sparkles size={14} className="animate-spin-slow" />
          </div>
        </div>
        
        <div className="col-span-2 z-10">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-gray-400 font-mono">CONFIDENCE INDEX</span>
                <span className={`text-xl font-mono font-black ${latest?.confidence > 95 ? 'text-green-400' : 'text-green-500'}`}>
                    {latest?.confidence || 0}%
                </span>
            </div>
            {/* High Tech Progress Bar */}
            <div className="w-full bg-galaxy-900 h-2 rounded-full overflow-hidden border border-white/5 relative">
                {/* Ticks */}
                <div className="absolute inset-0 flex justify-between px-1">
                     {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-full bg-black/50"></div>)}
                </div>
                <div 
                    className={`h-full transition-all duration-200 shadow-[0_0_10px_rgba(74,222,128,0.5)] ${latest?.confidence > 95 ? 'bg-gradient-to-r from-green-600 to-green-400' : 'bg-green-600'}`} 
                    style={{ width: `${latest?.confidence || 0}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="flex-grow flex flex-col overflow-hidden bg-black/60 relative">
        <div className="px-4 py-2 text-[10px] text-gray-500 border-b border-galaxy-700 flex items-center gap-2 bg-black/20">
            <Terminal size={10} />
            <span>REAL-TIME INFERENCE LOG</span>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 font-mono text-[10px] space-y-1.5 scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity">
              <span className="text-gray-600">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={log.highlight_worthy ? 'text-galaxy-accent font-bold' : 'text-gray-400'}>
                {log.highlight_worthy ? '⚡ TARGET:' : '>'} {log.activity} :: {log.mood}
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-gray-600 italic">Waiting for stream data...</div>}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;