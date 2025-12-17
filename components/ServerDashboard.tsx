import React from 'react';
import { ServerHardware } from '../types';
import { Server, Cpu, HardDrive, Activity, Wifi, WifiOff } from 'lucide-react';
import { SystemUplink } from '../services/SystemUplink';

interface Props {
  hw: ServerHardware;
}

const ServerDashboard: React.FC<Props> = ({ hw }) => {
  if (!hw) return <div className="p-4 text-xs text-gray-500">Loading Hardware Metrics...</div>;

  // Determine connection health based on real CPU/Memory presence
  const isHealthy = hw.ramTotal > 0;
  const cpuLoad = hw.cpuLoad || [];
  const currentLoad = cpuLoad.length > 0 ? cpuLoad[cpuLoad.length - 1] : 0;

  return (
    <div className="bg-kali-panel border border-kali-border rounded-lg p-4 flex flex-col gap-4 h-full shadow-lg">
      
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-kali-border pb-3">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded border ${isHealthy ? 'bg-blue-900/20 border-blue-800' : 'bg-red-900/20 border-red-800'}`}>
                <Server className={isHealthy ? 'text-blue-500' : 'text-red-500'} size={20} />
            </div>
            <div className="overflow-hidden">
                <div className="text-xs text-kali-muted uppercase tracking-wider font-bold">Host Environment</div>
                <div className="text-sm font-mono font-bold text-white truncate w-full" title={hw.model}>
                    {(hw.model || 'Unknown').substring(0, 30)}...
                </div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-[10px] text-kali-muted">SESSION TIME</div>
            <div className="text-xs font-mono text-green-500">{SystemUplink.formatUptime(hw.uptime || 0)}</div>
        </div>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* CPU (Real Lag) */}
        <div className="bg-[#0f0f0f] p-3 rounded border border-kali-border relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-2 text-kali-muted">
                <Cpu size={14} /> <span className="text-[10px] font-bold">THREAD LOAD</span>
            </div>
            <div className="text-2xl font-mono text-white mb-1">
                {currentLoad}%
            </div>
            <div className="flex gap-0.5 h-6 items-end">
                {cpuLoad.map((load, i) => (
                    <div key={i} className={`flex-1 transition-colors duration-300 ${load > 50 ? 'bg-red-600' : 'bg-blue-600/50'}`} style={{height: `${Math.max(10, load)}%`}}></div>
                ))}
            </div>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-[10px] text-gray-500 transition-opacity">
                (Event Loop Lag)
            </div>
        </div>

        {/* RAM (Real Heap) */}
        <div className="bg-[#0f0f0f] p-3 rounded border border-kali-border">
            <div className="flex items-center gap-2 mb-2 text-kali-muted">
                <Activity size={14} /> <span className="text-[10px] font-bold">JS HEAP</span>
            </div>
            {hw.ramTotal > 0 ? (
                <>
                    <div className="text-2xl font-mono text-white mb-1">
                        {hw.ramUsage} <span className="text-sm text-gray-500">MB</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2">
                        <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{width: `${(hw.ramUsage/hw.ramTotal)*100}%`}}></div>
                    </div>
                    <div className="text-[10px] text-gray-500 text-right mt-1">
                        Limit: {hw.ramTotal} MB
                    </div>
                </>
            ) : (
                <div className="h-full flex flex-col justify-center items-center text-gray-600">
                    <span className="text-xs">UNAVAILABLE</span>
                    <span className="text-[9px]">(Browser Restriction)</span>
                </div>
            )}
        </div>

        {/* STORAGE */}
        <div className="bg-[#0f0f0f] p-3 rounded border border-kali-border">
            <div className="flex items-center gap-2 mb-2 text-kali-muted">
                <HardDrive size={14} /> <span className="text-[10px] font-bold">STORAGE</span>
            </div>
            <div className="text-sm font-mono text-gray-300 mb-1 truncate">
                {hw.raidStatus || 'UNKNOWN'}
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
               Access: READ/WRITE
            </div>
        </div>

         {/* NETWORK STATUS */}
         <div className="bg-[#0f0f0f] p-3 rounded border border-kali-border flex flex-col justify-center items-center">
            {hw.uptime > 0 ? ( // Hack to check if initialized
                <div className="flex flex-col items-center gap-2">
                   <WifiOff size={24} className="text-red-500 animate-pulse" />
                   <span className="text-xs font-bold text-red-500">NO UPLINK</span>
                   <span className="text-[9px] text-gray-600">RETRYING...</span>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                   <Wifi size={24} className="text-gray-600" />
                   <span className="text-xs text-gray-600">INITIALIZING</span>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ServerDashboard;