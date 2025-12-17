import React from 'react';
import { SocialLog } from '../types';
import { Server, Shield, Database } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-galaxy-900 rounded-sm border border-galaxy-700 flex flex-col h-full shadow-lg relative overflow-hidden font-mono">
      <div className="bg-black px-3 py-2 border-b border-galaxy-800 flex justify-between items-center z-10">
        <div className="flex items-center gap-2 text-gray-400">
          <Database size={14} className="text-blue-500" />
          <span className="font-bold text-[10px] uppercase text-blue-500">
            INTERCEPTION LOGS
          </span>
        </div>
        <div className="text-[9px] text-gray-600 flex items-center gap-1">
          <Shield size={10} /> ROOT_ACCESS
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-0 bg-black relative">
        <table className="w-full text-left border-collapse">
            <thead className="bg-galaxy-900 text-[9px] uppercase text-gray-600 sticky top-0 z-10">
                <tr>
                    <th className="px-3 py-1 w-24 border-b border-galaxy-800">Time (UTC)</th>
                    <th className="px-3 py-1 w-32 border-b border-galaxy-800">Source / Node IP</th>
                    <th className="px-3 py-1 border-b border-galaxy-800">Command / Payload</th>
                    <th className="px-3 py-1 w-16 border-b border-galaxy-800 text-right">Stat</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-900">
                {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-blue-900/10 transition-colors">
                        <td className="px-3 py-1 text-gray-500 text-[9px]">{log.timestamp}</td>
                        <td className="px-3 py-1 text-blue-400 text-[9px] truncate max-w-[120px]">
                            {log.platform}
                        </td>
                        <td className="px-3 py-1 text-gray-300 text-[9px] truncate max-w-[200px]">
                            <span className="text-blue-900 mr-1">$</span>{log.message}
                        </td>
                        <td className="px-3 py-1 text-right">
                             <span className="text-[8px] text-green-500 font-bold">200 OK</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialLogPanel;