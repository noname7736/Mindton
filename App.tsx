import React, { useEffect, useState } from 'react';
import { SystemUplink } from './services/SystemUplink';
import { EnterpriseState } from './types';
import ServerDashboard from './components/ServerDashboard';
import { ScriptEditor } from './components/ScriptEditor';
import { Terminal } from './components/Terminal';
import { NetworkMap } from './components/NetworkMap';
import { Shield, Radio, Bot, Power } from 'lucide-react';

export function App() {
  const [state, setState] = useState<EnterpriseState | null>(null);

  useEffect(() => {
    return SystemUplink.subscribe(setState);
  }, []);

  if (!state) return <div className="h-screen bg-black text-white flex items-center justify-center font-mono">Initializing Sentinel AI...</div>;

  return (
    <div className="h-screen bg-[#050505] text-gray-300 font-sans flex flex-col overflow-hidden">
      
      {/* TOP NAVIGATION BAR (Kali/Gnome Style) */}
      <nav className="h-14 bg-[#121212] border-b border-[#2a2a2a] flex items-center justify-between px-4 shrink-0 z-50 shadow-md">
          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-bold text-white tracking-tight">
                  <div className={`p-1.5 rounded-sm transition-colors ${state.autonomousMode ? 'bg-purple-600 animate-pulse' : 'bg-gray-700'}`}>
                      <Shield size={18} className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="hidden md:inline leading-tight">KALI ENTERPRISE</span>
                    <span className="text-[10px] text-gray-500 font-mono leading-tight">SENTINEL EDITION</span>
                  </div>
              </div>

              {/* AUTONOMOUS TOGGLE */}
              <div 
                className={`ml-6 flex items-center gap-2 px-3 py-1 rounded border cursor-pointer select-none transition-all ${state.autonomousMode ? 'bg-purple-900/30 border-purple-500' : 'bg-gray-900 border-gray-700 hover:border-gray-500'}`}
                onClick={() => SystemUplink.toggleAutonomousMode()}
              >
                  <Bot size={16} className={state.autonomousMode ? 'text-purple-400' : 'text-gray-500'} />
                  <span className={`text-xs font-bold tracking-wider ${state.autonomousMode ? 'text-purple-300' : 'text-gray-500'}`}>
                      {state.autonomousMode ? 'UNMANNED: ACTIVE' : 'MANUAL CONTROL'}
                  </span>
                  {state.autonomousMode && <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>}
              </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-2">
                  <Radio size={14} className={state.connectionMode === 'REMOTE_SOCKET' ? 'text-green-500 animate-pulse' : 'text-yellow-500'} />
                  <span className={state.connectionMode === 'REMOTE_SOCKET' ? 'text-green-500' : 'text-yellow-500'}>
                    {state.connectionMode === 'REMOTE_SOCKET' ? 'UPLINK: ONLINE' : 'LOCAL KERNEL'}
                  </span>
              </div>
              <div className="border-l border-gray-700 pl-4 flex items-center gap-2">
                  <Power size={12} className={state.autonomousMode ? 'text-purple-500' : 'text-gray-500'}/>
                  OPERATOR: {state.autonomousMode ? <span className="text-purple-400 font-bold">SENTINEL AI</span> : 'secadmin'}
              </div>
          </div>
      </nav>

      {/* MAIN CONTENT GRID */}
      <div className="flex-grow p-4 grid grid-cols-12 grid-rows-12 gap-4 overflow-hidden">
          
          {/* ROW 1: SERVER STATS (Top) */}
          <div className="col-span-12 lg:col-span-12 row-span-3">
              <ServerDashboard hw={state.hardware} />
          </div>

          {/* ROW 2: MAIN WORKSPACE */}
          
          {/* Left: Code Editor */}
          <div className="col-span-12 lg:col-span-6 row-span-5 relative z-10">
              <ScriptEditor files={state.files} activeFileId={state.activeFileId} />
          </div>

          {/* Right: Network Map */}
          <div className="col-span-12 lg:col-span-6 row-span-5 relative z-10">
              <NetworkMap hosts={state.hosts} />
          </div>

          {/* ROW 3: TERMINAL OUTPUT (Bottom) */}
          <div className="col-span-12 row-span-4">
              <Terminal lines={state.terminal} />
          </div>

      </div>

      {/* FOOTER STATUS */}
      <footer className="h-6 bg-[#0a0a0a] border-t border-[#2a2a2a] flex items-center justify-between px-4 text-[10px] text-gray-500 font-mono">
          <div>EXT4-FS | RAID10 | ENCRYPTED</div>
          <div>POWEREDGE R750 | iDRAC 9 Enterprise | {state.autonomousMode ? 'SENTINEL WATCHDOG: MONITORING' : 'IDLE'}</div>
      </footer>
    </div>
  );
}