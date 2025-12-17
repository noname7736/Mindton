import React from 'react';
import { SocialLog } from '../types';
import { Server, Shield, Database, Lock, ArrowUpRight, HardDrive, DownloadCloud } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-black rounded-sm border border-emerald-900/50 flex flex-col h-full shadow-[0_0_50px_rgba(16,185,129,0.1)] relative overflow-hidden font-mono group">
      
      {/* HEADER */}
      <div className="bg-black px-3 py-2 border-b border-emerald-900/50 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-emerald-500">
          <HardDrive size={14} className="animate-pulse" />
          <span className="font-black text-[10px] uppercase tracking-widest text-emerald-400">
            TOTAL_EXISTENCE_EXPORT
          </span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-emerald-700 animate-pulse">SIPHON_ACTIVE</span>
            <div className="text-[9px] text-black bg-emerald-500 px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
               <ArrowUpRight size={10} /> TRANSFERRING...
            </div>
        </div>
      </div>
      
      {/* STATS BAR */}
      <div className="bg-emerald-950/10 px-3 py-1 border-b border-emerald-900/30 flex justify-between text-[8px] text-emerald-600 font-bold">
         <span>PROTOCOL: DEEP_SOUL_V4</span>
         <span>DESTINATION: MASTER_SERVER</span>
      </div>

      {/* LOG LIST */}
      <div className="flex-grow overflow-y-auto p-0 bg-black relative scrollbar-hide">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,50,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,50,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <table className="w-full text-left border-collapse relative z-10">
            <thead className="bg-black text-[8px] uppercase text-emerald-800 sticky top-0 z-20 shadow-md">
                <tr>
                    <th className="px-3 py-1 w-20 border-b border-emerald-900/50">Timestamp</th>
                    <th className="px-3 py-1 w-32 border-b border-emerald-900/50">Source Node</th>
                    <th className="px-3 py-1 border-b border-emerald-900/50">Payload / Manifest</th>
                    <th className="px-3 py-1 w-24 border-b border-emerald-900/50 text-right">Integrity</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/30">
                {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-emerald-900/10 transition-colors group/row">
                        <td className="px-3 py-1.5 text-emerald-700 text-[9px] font-mono">{log.timestamp}</td>
                        <td className="px-3 py-1.5 text-emerald-400 text-[9px] truncate max-w-[120px] font-bold font-mono tracking-tighter">
                            {log.platform}
                        </td>
                        <td className="px-3 py-1.5 text-emerald-200/80 text-[9px] truncate max-w-[200px] font-mono">
                            <div className="flex flex-col">
                                <span>{log.message.split('->')[0]}</span>
                                {/* Mini Progress Bar per item */}
                                <div className="w-full h-[2px] bg-emerald-900/50 mt-0.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 animate-[grow_1s_ease-out_forwards]" style={{width: '100%'}}></div>
                                </div>
                            </div>
                        </td>
                        <td className="px-3 py-1.5 text-right">
                             <div className="flex items-center justify-end gap-1 text-[8px] text-emerald-400 font-bold bg-emerald-950/30 px-1 py-0.5 rounded border border-emerald-900/50">
                                <Lock size={8} /> 100%
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* DECORATIVE FOOTER */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 animate-pulse"></div>
    </div>
  );
};

export default SocialLogPanel;