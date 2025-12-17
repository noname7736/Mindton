import React, { useEffect, useState } from 'react';
import { Radio, AlertTriangle, Eye, Flame, ShieldAlert } from 'lucide-react';
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
    <div className="min-h-screen bg-[#050505] text-gray-300 font-mono flex flex-col overflow-hidden selection:bg-red-900 selection:text-white">
      
      {/* REAL HEADER */}
      <header className="h-16 bg-black border-b border-red-900/20 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <div className={`p-2 border border-red-900/50 ${systemStatus === SystemStatus.ONLINE ? 'bg-red-950/20 text-red-500 shadow-[0_0_15px_rgba(255,0,0,0.2)]' : 'bg-gray-900 text-gray-600'}`}>
                <ShieldAlert className={systemStatus === SystemStatus.ONLINE ? "animate-pulse" : ""} size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tighter text-gray-200 leading-none">
                  MINTON_GALAXY <span className="text-red-600 text-xs align-top px-1 border border-red-600 rounded-sm">CONFIDENTIAL</span>
                </h1>
                <p className="text-[10px] text-red-700 tracking-[0.2em] uppercase mt-1">
                  TACTICAL SURVEILLANCE SUITE [LIVE]
                </p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r border-gray-800 pr-6">
                <span className="text-[9px] text-gray-600 tracking-widest mb-1">OPERATION SCOPE</span>
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold tracking-wider">
                    <Flame size={12} className="fill-red-900" />
                    THAILAND_SECTOR_ACTIVE
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-600 tracking-wider mb-1">SYSTEM STATE</span>
                
                {systemStatus === SystemStatus.ONLINE ? (
                     <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-pulse">
                        <Radio size={12} />
                        CONNECTED
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <AlertTriangle size={12} />
                        RETRYING...
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
            <div className="h-[60%]">
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
            <div className="h-[40%]">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[60%]">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}