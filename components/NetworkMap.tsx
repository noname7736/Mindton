import React from 'react';
import { NetworkHost } from '../types';
import { Globe, ShieldAlert, Monitor, Server } from 'lucide-react';

interface Props {
  hosts: NetworkHost[];
}

export const NetworkMap: React.FC<Props> = ({ hosts }) => {
  return (
    <div className="bg-kali-panel border border-kali-border rounded-lg h-full flex flex-col">
       <div className="p-3 border-b border-kali-border flex justify-between items-center bg-[#151515]">
          <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Globe size={14} className="text-blue-500" /> TARGET SCOPE
          </span>
          <span className="text-xs bg-red-900/30 text-red-500 px-2 py-0.5 rounded border border-red-900">
             ACTIVE
          </span>
       </div>

       <div className="flex-grow overflow-y-auto p-2 space-y-2">
          {hosts.map((host) => (
              <div key={host.ip} className="bg-[#0a0a0a] border border-kali-border p-3 rounded hover:border-blue-500/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          {host.os.includes('Windows') ? <Monitor size={16} className="text-blue-400"/> : <Server size={16} className="text-gray-400"/>}
                          <div>
                              <div className="text-sm font-bold text-gray-200">{host.ip}</div>
                              <div className="text-[10px] text-gray-500">{host.hostname}</div>
                          </div>
                      </div>
                      <div className={`text-xs font-bold px-1.5 py-0.5 rounded ${host.vulnerabilityScore > 7 ? 'bg-red-900 text-red-400' : 'bg-green-900 text-green-400'}`}>
                          CVSS: {host.vulnerabilityScore}
                      </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                      {host.ports.map(p => (
                          <span key={p} className="text-[10px] bg-gray-800 text-gray-300 px-1 rounded border border-gray-700">
                              {p}
                          </span>
                      ))}
                  </div>
                  <div className="mt-2 text-[10px] text-gray-600 font-mono">
                      OS: {host.os}
                  </div>
              </div>
          ))}
       </div>
    </div>
  );
};