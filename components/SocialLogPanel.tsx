import React from 'react';
import { SocialLog } from '../types';
import { Terminal, ShieldCheck, Lock, ChevronRight } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-[#050002] rounded-xl border border-gray-800 flex flex-col h-full shadow-lg relative overflow-hidden font-mono group">
      
      {/* HEADER */}
      <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800 flex justify-between items-center z-10 backdrop-blur">
        <div className="flex items-center gap-2 text-gray-300">
          <Terminal size={14} className="text-amber-500" />
          <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400">
            SECURE_COMMS_LOG
          </span>
        </div>
        <div className="text-[9px] text-amber-400 bg-amber-950/30 border border-amber-900 px-2 py-0.5 rounded font-bold flex items-center gap-1">
           <Lock size={8} /> ENCRYPTED
        </div>
      </div>
      
      {/* LOG LIST */}
      <div className="flex-grow overflow-y-auto p-0 bg-[#080808] relative scrollbar-hide">
        {/* Striped Background for "Regulation" */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_24px] pointer-events-none"></div>

        <div className="p-3 space-y-1 relative z-10">
            {logs.slice().reverse().map((log) => (
                <div key={log.id} className="flex items-start gap-2 p-1.5 hover:bg-gray-900 rounded transition-all group/item">
                    <div className="mt-0.5 min-w-[12px]">
                        <ChevronRight size={10} className="text-gray-600 group-hover/item:text-amber-500 transition-colors" />
                    </div>
                    <div className="flex-grow flex flex-col">
                        <div className="flex items-center justify-between mb-0.5">
                             <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">{log.platform}</span>
                             <span className="text-[8px] text-gray-700 font-mono">{log.timestamp}</span>
                        </div>
                        <div className="text-[10px] text-gray-300 font-mono leading-tight">
                            <span className="text-pink-500/80 mr-1">{'>'}</span> 
                            {log.message}
                        </div>
                    </div>
                    {log.status === 'SECURED' && (
                        <ShieldCheck size={10} className="text-emerald-500 mt-1 opacity-50 group-hover/item:opacity-100" />
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLogPanel;