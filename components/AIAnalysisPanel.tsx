import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Brain, Terminal, Heart, Zap, Fingerprint, Eye, Dna } from 'lucide-react';

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
    <div className="bg-black rounded-sm border border-purple-900/50 flex flex-col h-full overflow-hidden relative shadow-[0_0_50px_rgba(88,28,135,0.15)]">
      <div className="bg-gradient-to-r from-purple-950/30 to-black px-3 py-2 border-b border-purple-900/30 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-purple-400">
          <Dna size={16} className="animate-[spin_3s_linear_infinite]" />
          <span className="font-black tracking-widest text-[10px] font-mono uppercase">SYNAPTIC_REWRITER_CORE</span>
        </div>
        <div className="text-[8px] text-purple-300 font-mono border border-purple-600/50 px-2 py-0.5 rounded bg-purple-900/30 animate-pulse">
            TARGET: HIPPOCAMPUS
        </div>
      </div>

      {/* RAW DATA DISPLAY */}
      <div className="p-3 border-b border-purple-900/20 bg-black/95 z-10 relative grid grid-cols-2 gap-3">
        
        <div className="col-span-1 border-l-2 border-purple-500 pl-2">
          <div className="text-[8px] text-purple-600 uppercase mb-1 tracking-widest font-bold">Neural Activity</div>
          <div className="text-[11px] font-bold text-gray-100 font-mono truncate shadow-purple-500/50 drop-shadow-sm">
            {latest?.activity || "SCANNING BRAINWAVES..."}
          </div>
        </div>
        
        <div className="col-span-1 border-r-2 border-purple-500 pr-2 text-right">
          <div className="text-[8px] text-purple-600 uppercase mb-1 tracking-widest font-bold">Soul Status</div>
          <div className="text-[11px] font-bold text-purple-300 font-mono flex items-center justify-end gap-2">
             {latest?.mood || "WAITING"} <Heart size={10} className="fill-purple-600 animate-ping" />
          </div>
        </div>
        
        <div className="col-span-2 mt-2">
            <div className="flex justify-between items-end mb-1">
                <span className="text-[8px] text-purple-700 font-mono">BIOLOGICAL ASSIMILATION</span>
                <span className="text-[10px] font-mono font-black text-purple-400">
                    100.00% (PERMANENT)
                </span>
            </div>
            {/* Pulsing Bar */}
            <div className="w-full bg-gray-900 h-1.5 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-purple-600 animate-pulse"></div>
                <div className="h-full bg-gradient-to-r from-purple-900 via-white to-purple-900 w-full opacity-50 blur-[2px]"></div>
            </div>
        </div>
      </div>

      {/* Terminal Log */}
      <div className="flex-grow flex flex-col overflow-hidden bg-black relative">
        <div className="px-3 py-1 text-[8px] text-purple-600 border-b border-purple-900/10 flex items-center gap-1 bg-purple-950/10 font-mono">
            <Brain size={10} />
            <span>INJECTING_THOUGHTS...</span>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-2 font-mono text-[9px] space-y-2 scroll-smooth">
          {logs.map((log, idx) => (
            <div key={idx} className="flex flex-col gap-0.5 border-b border-purple-900/10 pb-1">
              <div className="flex items-center gap-2">
                 <span className="text-purple-800 font-bold">root@cortex:~#</span>
                 <span className="text-gray-500">{log.timestamp.split('T')[1].slice(0,8)}</span>
              </div>
              <span className={log.highlight_worthy ? 'text-purple-300 pl-4' : 'text-gray-600 pl-4'}>
                {`>> ${log.activity}`}
              </span>
            </div>
          ))}
        </div>
        
        {/* Decorative Overlay */}
        <div className="absolute bottom-2 right-2 opacity-20 pointer-events-none">
            <Eye size={48} className="text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisPanel;