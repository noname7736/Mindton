import React from 'react';
import { SocialLog } from '../types';
import { MessageCircle, Heart, Send, User, Sparkles } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-black rounded-lg border border-pink-900/50 flex flex-col h-full shadow-[0_0_50px_rgba(236,72,153,0.1)] relative overflow-hidden font-mono group">
      
      {/* HEADER */}
      <div className="bg-pink-950/20 px-3 py-2 border-b border-pink-900/50 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-pink-500">
          <MessageCircle size={14} className="animate-bounce" />
          <span className="font-black text-[10px] uppercase tracking-widest text-pink-400">
            BEE_SURVEY_MESSAGES
          </span>
        </div>
        <div className="text-[9px] text-white bg-pink-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
           <Heart size={10} className="fill-white" /> ONLINE
        </div>
      </div>
      
      {/* LOG LIST */}
      <div className="flex-grow overflow-y-auto p-0 bg-black relative scrollbar-hide">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <div className="p-2 space-y-2 relative z-10">
            {logs.slice().reverse().map((log) => (
                <div key={log.id} className="flex flex-col gap-1 hover:bg-pink-900/10 p-2 rounded transition-colors border-l-2 border-pink-800/50">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1 text-[9px] text-pink-300 font-bold">
                            <Sparkles size={8} className="text-pink-500"/>
                            {log.platform}
                         </div>
                         <span className="text-[8px] text-pink-800 font-mono">{log.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-pink-100/90 font-mono pl-3 leading-relaxed">
                        {log.message}
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      {/* DECORATIVE INPUT SIMULATION */}
      <div className="p-2 border-t border-pink-900/30 bg-pink-950/10 flex gap-2 items-center opacity-50">
           <div className="h-6 flex-grow bg-black border border-pink-900/50 rounded flex items-center px-2 text-[9px] text-pink-700">
               Bee is typing a love letter...
           </div>
           <Send size={12} className="text-pink-600"/>
      </div>
    </div>
  );
};

export default SocialLogPanel;