import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Brain, Zap, Terminal, Sparkles, Scan, Fingerprint, Eye, Activity } from 'lucide-react';

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
    <div className="bg-black rounded-lg border border-purple-900/50 flex flex-col h-full shadow-[0_0_40px_rgba(147,51,234,0.2)] overflow-hidden relative">
      <div className="bg-purple-950/30 px-4 py-2 border-b border-purple-900/50 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-purple-400">
          <Brain size={18} className="animate-pulse" />
          <span className="font-black tracking-wider text-sm italic">GEMINI DARK PSYCH ENGINE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-900/30 border border-purple-500/50 text-xs text-purple-300 font-mono shadow-[0_0_15px_rgba(168,85,247,0.4)]">
            <Eye size={10} className="fill-purple-300" />
            MODE: DEEP_INCEPTION
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 border-b border-purple-900/30 bg-black/80 z-10 relative">
        <div className="absolute top-0 right-0 p-2 opacity-10 text-purple-600 animate-pulse">
            <Activity size={80} />
        </div>
        
        <div className="col-span-1 z-10">
          <div className="text-[10px] text-purple-600 uppercase mb-1 tracking-widest font-bold">Deep Psyche Penetration</div>
          <div className="text-lg font-bold text-gray-100 truncate drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{latest?.activity || "Infiltrating..."}</div>
        </div>
        <div className="col-span-1 z-10">
          <div className="text-[10px] text-purple-600 uppercase mb-1 tracking-widest font-bold">Devotion Singularity</div>
          <div className="text-lg font-bold text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] flex items-center gap-2">
            {latest?.mood || "..."} <Sparkles size={14} className="animate-spin text-purple-200" />
          </div>
        </div>
        
        <div className="col-span-2 z-10">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[10px] text-purple-800 font-mono">SOUL MERGER RATE (ABSOLUTE)</span>
                <span className="text-xl font-mono font-black text-purple-400">
                    {latest?.confidence || 0}%
                </span>
            </div>
            {/* High Tech Progress Bar */}
            <div className="w-full bg-black h-2 rounded-full overflow-hidden border border-purple-900/50 relative">
                {/* Ticks */}
                <div className="absolute inset-0 flex justify-between px-1">
                     {[...Array(10)].map((_, i) => <div key={i} className="w-[1px] h-full bg-purple-900/50"></div>)}
                </div>
                <div 
                    className="h-full transition-all duration-200 shadow-[0_0_20px_rgba(168,85,247,1)] bg-gradient-to-r from-purple-900 via-purple-500 to-white" 
                    style={{ width: `${latest?.confidence || 0}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="flex-grow flex flex-col overflow-hidden bg-black relative">
        <div className="px-4 py-2 text-[10px] text-purple-800 border-b border-purple-900/30 flex items-center gap-2 bg-purple-900/10">
            <Terminal size={10} />
            <span>PSYCHO-METRIC LOG STREAM</span>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 font-mono text-[10px] space-y-2 scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2 opacity-90 hover:opacity-100 transition-opacity">
              <span className="text-purple-700">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={log.highlight_worthy ? 'text-purple-300 font-bold drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]' : 'text-gray-500'}>
                {log.highlight_worthy ? '⚡ IMPLANT:' : '>'} {log.activity} :: <span className="text-purple-500">{log.mood}</span>
              </span>
            </div>
          ))}
          {logs.length === 0 && <div className="text-purple-900 italic">Waiting for subject...</div>}
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;