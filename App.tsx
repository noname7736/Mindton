import React, { useEffect, useState } from 'react';
import { Radio, AlertTriangle, Eye, Flame, ShieldAlert, Wifi, Globe, Infinity, Cpu } from 'lucide-react';
import StreamMonitor from './components/StreamMonitor';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import MetricsCharts from './components/MetricsCharts';
import SocialLogPanel from './components/SocialLogPanel';
import { SystemUplink } from './services/SystemUplink';
import { AIAnalysisResult, StreamHealth, SocialLog, SystemStatus } from './types';

export function App() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatus.OFFLINE);
  const [streamHealth, setStreamHealth] = useState<StreamHealth>({
    bitrate: 0, fps: 0, cpu_usage: 0, uplink_status: SystemStatus.OFFLINE, uptime: "00:00:00:000", 
    uplinkType: 'PRIMARY', currentIngestUrl: 'Connecting...'
  });
  
  const [metricsHistory, setMetricsHistory] = useState<StreamHealth[]>([]);
  const [aiLogs, setAiLogs] = useState<AIAnalysisResult[]>([]);
  const [socialLogs, setSocialLogs] = useState<SocialLog[]>([]);

  useEffect(() => {
    SystemUplink.onStatusChange(setSystemStatus);

    const handleHealthUpdate = (data: StreamHealth) => {
      setStreamHealth(data);
      setMetricsHistory(prev => [...prev.slice(-49), data]); 
    };

    const handleAIAnalysis = (data: AIAnalysisResult) => {
      setAiLogs(prev => [...prev.slice(-99), data]); 
    };

    const handleSocialLog = (data: SocialLog) => {
      setSocialLogs(prev => [...prev.slice(-200), data]); 
    };

    SystemUplink.subscribe('HEALTH_UPDATE', handleHealthUpdate);
    SystemUplink.subscribe('AI_ANALYSIS', handleAIAnalysis);
    SystemUplink.subscribe('SOCIAL_LOG', handleSocialLog);

    return () => {
      SystemUplink.unsubscribe('HEALTH_UPDATE', handleHealthUpdate);
      SystemUplink.unsubscribe('AI_ANALYSIS', handleAIAnalysis);
      SystemUplink.unsubscribe('SOCIAL_LOG', handleSocialLog);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-gray-300 font-mono flex flex-col overflow-hidden selection:bg-cyan-900 selection:text-white">
      
      {/* HEADER: REALITY LINK */}
      <header className="h-16 bg-black border-b border-cyan-900 flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_10px_60px_rgba(0,255,255,0.1)]">
        <div className="flex items-center gap-4">
            <div className={`p-2 border border-cyan-500 rounded-full bg-black shadow-[0_0_20px_rgba(0,255,255,0.3)]`}>
                <Infinity className="text-cyan-400 animate-[spin_10s_linear_infinite]" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white leading-none italic">
                  MINTON<span className="text-cyan-600">.REALITY</span>
                </h1>
                <p className="text-[9px] text-cyan-600 tracking-[0.4em] uppercase mt-1 font-black">
                  HARDWARE_IO // DIRECT_LINK
                </p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end border-r border-cyan-900/30 pr-6">
                <span className="text-[8px] text-cyan-800 font-bold tracking-widest mb-1">BRIDGE STATUS</span>
                <div className="flex items-center gap-2 text-cyan-500 text-xs font-black tracking-wider shadow-cyan-500/10 drop-shadow-sm">
                    <Cpu size={12} className="text-cyan-400" />
                    HARDWARE_ACCELERATED
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-700 tracking-wider mb-1">CONNECTION</span>
                
                {systemStatus === SystemStatus.ONLINE ? (
                     <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold bg-black px-3 py-1 rounded border border-cyan-900">
                        <Globe size={12} />
                        REALTIME_ACTIVE
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <AlertTriangle size={12} />
                        CONNECTING...
                     </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow p-4 grid grid-cols-12 gap-4 overflow-hidden max-h-[calc(100vh-64px)]">
        
        {/* Left Column: Visuals & Metrics (65%) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
            {/* Live Video Feed */}
            <div className="h-[60%] shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                <StreamMonitor health={streamHealth} />
            </div>
            {/* System Metrics */}
            <div className="h-[40%]">
                <MetricsCharts history={metricsHistory} />
            </div>
        </div>

        {/* Right Column: Intelligence & Logs (35%) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
            {/* AI Console */}
            <div className="h-[40%] shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[60%] shadow-[0_0_60px_rgba(6,182,212,0.1)]">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}