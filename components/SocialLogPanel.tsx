import React from 'react';
import { SocialLog } from '../types';
import { Share2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SocialLogPanelProps {
  logs: SocialLog[];
}

const SocialLogPanel: React.FC<SocialLogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-galaxy-800 rounded-lg border border-galaxy-700 flex flex-col h-full shadow-xl">
      <div className="bg-galaxy-900 px-4 py-3 border-b border-galaxy-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Share2 size={18} />
          <span className="font-bold tracking-wider text-sm">AUTONOMOUS DISPATCHER</span>
        </div>
        <div className="px-2 py-0.5 bg-green-900/50 border border-green-700 rounded text-xs text-green-400 font-mono">
          ACTIVE
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-0">
        <table className="w-full text-left text-sm">
            <thead className="bg-galaxy-900/50 text-xs uppercase text-gray-500 font-mono sticky top-0 backdrop-blur-md">
                <tr>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Platform</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-galaxy-700">
                {logs.slice().reverse().map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">{log.timestamp}</td>
                        <td className="px-4 py-3 text-white font-medium">{log.platform}</td>
                        <td className="px-4 py-3">
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-full w-fit ${
                                log.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 
                                log.status === 'FAILED' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                                {log.status === 'SUCCESS' && <CheckCircle size={12} />}
                                {log.status === 'FAILED' && <XCircle size={12} />}
                                {log.status === 'PENDING' && <Clock size={12} />}
                                {log.status}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[200px]" title={log.message}>
                            {log.message}
                        </td>
                    </tr>
                ))}
                {logs.length === 0 && (
                    <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 italic">No actions triggered yet.</td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default SocialLogPanel;