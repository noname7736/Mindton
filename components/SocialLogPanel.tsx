import React from 'react';
import { SocialLog } from '../types';
import { CheckCircle, Globe, Zap } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 flex flex-col h-full shadow-xl relative overflow-hidden">
      <div className="bg-galaxy-900 px-4 py-3 border-b border-galaxy-700 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-white">
          <Globe size={18} className="text-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            GLOBAL x THAILAND HYPER-GRID
          </span>
        </div>
        <div className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-xs text-blue-300 font-mono flex items-center gap-2 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
          </span>
          ACTIVE NODES: MAX
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-0 relative bg-black/20">
        <table className="w-full text-left text-sm">
            <thead className="bg-galaxy-900/80 text-[10px] uppercase text-gray-500 font-mono sticky top-0 backdrop-blur-md z-10 border-b border-galaxy-700">
                <tr>
                    <th className="px-4 py-2 w-20">Time</th>
                    <th className="px-4 py-2 w-32">Target Node</th>
                    <th className="px-4 py-2 w-20">Stat</th>
                    <th className="px-4 py-2">Payload Content</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-galaxy-700/50">
                {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-2 font-mono text-gray-500 text-[10px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-4 py-2 text-cyan-100 font-bold text-[11px] truncate max-w-[120px]" title={log.platform}>
                            {log.platform}
                        </td>
                        <td className="px-4 py-2">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-green-400">
                                <Zap size={8} className="fill-green-400" /> OK
                            </span>
                        </td>
                        <td className="px-4 py-2 text-gray-300 text-[11px] truncate max-w-[180px] group-hover:text-white transition-colors" title={log.message}>
                            <span className="text-galaxy-accent/70 font-mono mr-1">{'>'}</span> {log.message}
                        </td>
                    </tr>
                ))}
                {logs.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">Initializing Hyper-Grid Connection...</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialLogPanel;