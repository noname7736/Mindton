import React from 'react';
import { SocialLog } from '../types';
import { Server, Shield, Database, Lock, ArrowUpRight, HardDrive, DownloadCloud, Monitor, Smartphone, Cpu } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-black rounded-sm border border-cyan-900/50 flex flex-col h-full shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden font-mono group">
      
      {/* HEADER */}
      <div className="bg-black px-3 py-2 border-b border-cyan-900/50 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-cyan-500">
          <Cpu size={14} className="animate-spin-slow" />
          <span className="font-black text-[10px] uppercase tracking-widest text-cyan-400">
            DEVICE_ACCESS_LOG
          </span>
        </div>
        <div className="text-[9px] text-black bg-cyan-600 px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.5)]">
           <Monitor size={10} /> MONITORING
        </div>
      </div>
      
      {/* LOG LIST */}
      <div className="flex-grow overflow-y-auto p-0 bg-black relative scrollbar-hide">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        <table className="w-full text-left border-collapse relative z-10">
            <thead className="bg-black text-[8px] uppercase text-cyan-800 sticky top-0 z-20 shadow-md">
                <tr>
                    <th className="px-3 py-1 w-20 border-b border-cyan-900/50">Time</th>
                    <th className="px-3 py-1 w-24 border-b border-cyan-900/50">Port/IO</th>
                    <th className="px-3 py-1 border-b border-cyan-900/50">Event Detail</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-cyan-950/30">
                {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-cyan-900/10 transition-colors group/row">
                        <td className="px-3 py-1.5 text-cyan-700 text-[9px] font-mono">{log.timestamp}</td>
                        <td className="px-3 py-1.5 text-cyan-400 text-[9px] font-bold font-mono tracking-tighter">
                            {log.platform}
                        </td>
                        <td className="px-3 py-1.5 text-cyan-200/80 text-[9px] font-mono">
                            {log.message}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* DECORATIVE FOOTER */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 animate-pulse"></div>
    </div>
  );
};

export default SocialLogPanel;