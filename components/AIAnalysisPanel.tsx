import React, { useRef, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Brain, Zap, Terminal } from 'lucide-react';

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
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 flex flex-col h-full shadow-xl">
      <div className="bg-galaxy-900 px-4 py-2 border-b border-galaxy-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-galaxy-accent">
          <Brain size={18} />
          <span className="font-bold tracking-wider text-sm">GEMINI VISION CORE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-mono">
            <Zap size={10} className="fill-blue-300" />
            MODEL: gemini-1.5-flash-lite
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4 border-b border-galaxy-700 bg-galaxy-800/50">
        <div className="col-span-1">
          <div className="text-xs text-gray-400 uppercase mb-1">Current Activity</div>
          <div className="text-lg font-bold text-white truncate">{latest?.activity || "Initializing..."}</div>
        </div>
        <div className="col-span-1">
          <div className="text-xs text-gray-400 uppercase mb-1">Detected Mood</div>
          <div className="text-lg font-bold text-white">{latest?.mood || "..."}</div>
        </div>
        <div className="col-span-2">
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-gray-400">CONFIDENCE SCORE</span>
                <span className={`text-xl font-mono font-bold ${latest?.confidence > 85 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {latest?.confidence || 0}%
                </span>
            </div>
            <div className="w-full bg-galaxy-700 h-2 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${latest?.confidence > 85 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                    style={{ width: `${latest?.confidence || 0}%` }}
                ></div>
            </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden bg-black/40">
        <div className="px-4 py-2 text-xs text-gray-500 border-b border-galaxy-700 flex items-center gap-2">
            <Terminal size={12} />
            <span>ANALYSIS LOG</span>
        </div>
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 font-mono text-xs space-y-2">
          {logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-gray-600">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
              <span className={log.highlight_worthy ? 'text-galaxy-accent font-bold' : 'text-gray-400'}>
                {log.highlight_worthy ? '⚡ TRIGGER:' : '>'} {log.activity} ({log.mood}) - {log.confidence}%
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