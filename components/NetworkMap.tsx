import React from 'react';
import { ReconNode } from '../types';
import { Globe, Cpu, Wifi, Shield, Layout } from 'lucide-react';

interface Props {
  hosts: ReconNode[];
}

export const NetworkMap: React.FC<Props> = ({ hosts }) => {
  return (
    <div className="bg-kali-panel border border-kali-border rounded-lg h-full flex flex-col shadow-lg overflow-hidden">
       {/* HEADER */}
       <div className="p-3 border-b border-kali-border flex justify-between items-center bg-[#151515]">
          <span className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Globe size={14} className="text-blue-500" /> SCOPE ANALYSIS
          </span>
          <span className="text-[10px] bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900 animate-pulse">
             REALTIME
          </span>
       </div>

       {/* RECON GRID */}
       <div className="flex-grow overflow-y-auto p-3">
          <div className="grid grid-cols-1 gap-2">
            
            {hosts.length === 0 && <div className="text-gray-500 text-xs text-center mt-10">Initializing Sensors...</div>}

            {/* Render by Category */}
            {['HARDWARE', 'NETWORK', 'SECURITY', 'SOFTWARE'].map(cat => {
                const items = hosts.filter(h => h.category === cat);
                if (items.length === 0) return null;

                return (
                    <div key={cat} className="mb-4">
                        <div className="text-[10px] font-bold text-gray-500 mb-2 border-b border-gray-800 pb-1 flex items-center gap-2">
                            {cat === 'HARDWARE' && <Cpu size={10}/>}
                            {cat === 'NETWORK' && <Wifi size={10}/>}
                            {cat === 'SECURITY' && <Shield size={10}/>}
                            {cat === 'SOFTWARE' && <Layout size={10}/>}
                            {cat}
                        </div>
                        <div className="space-y-1">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-[#0a0a0a] border border-kali-border px-2 py-1.5 rounded hover:border-gray-600 transition-colors">
                                    <span className="text-xs text-gray-400 font-mono">{item.label}</span>
                                    <span className={`text-xs font-bold font-mono ${
                                        item.status === 'CRITICAL' ? 'text-red-500' : 
                                        item.status === 'WARN' ? 'text-yellow-500' : 'text-blue-400'
                                    }`}>
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

          </div>
       </div>
    </div>
  );
};