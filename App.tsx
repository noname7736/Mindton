import React, { useEffect, useState } from 'react';
import { Rocket, AlertTriangle, Radio, Activity } from 'lucide-react';
import StreamMonitor from './components/StreamMonitor';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import MetricsCharts from './components/MetricsCharts';
import SocialLogPanel from './components/SocialLogPanel';
import { SystemUplink } from './services/SystemUplink';
import { AIAnalysisResult, StreamHealth, SocialLog, SystemStatus } from './types';

export function App() {
  // --- REAL-TIME STATE ---
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatus.OFFLINE);
  
  const [streamHealth, setStreamHealth] = useState<StreamHealth>({
    bitrate: 0, fps: 0, cpu_usage: 0, uplink_status: SystemStatus.OFFLINE, uptime: "--:--:--", 
    uplinkType: 'PRIMARY', currentIngestUrl: 'Waiting for signal...'
  });
  
  const [metricsHistory, setMetricsHistory] = useState<StreamHealth[]>([]);
  const [aiLogs, setAiLogs] = useState<AIAnalysisResult[]>([]);
  const [socialLogs, setSocialLogs] = useState<SocialLog[]>([]);

  // --- AUTONOMOUS CONNECTION HANDLING ---
  useEffect(() => {
    // 1. Subscribe to System Status
    SystemUplink.onStatusChange((status) => {
      setSystemStatus(status);
    });

    // 2. Subscribe to Data Streams
    const handleHealthUpdate = (data: StreamHealth) => {
      setStreamHealth(data);
      setMetricsHistory(prev => [...prev.slice(-29), data]);
    };

    const handleAIAnalysis = (data: AIAnalysisResult) => {
      setAiLogs(prev => [...prev.slice(-49), data]);
    };

    const handleSocialLog = (data: SocialLog) => {
      setSocialLogs(prev => [...prev, data]);
    };

    SystemUplink.subscribe('HEALTH_UPDATE', handleHealthUpdate);
    SystemUplink.subscribe('AI_ANALYSIS', handleAIAnalysis);
    SystemUplink.subscribe('SOCIAL_LOG', handleSocialLog);

    // Cleanup triggers (Though in a 24/7 app, this rarely unmounts)
    return () => {
      SystemUplink.unsubscribe('HEALTH_UPDATE', handleHealthUpdate);
      SystemUplink.unsubscribe('AI_ANALYSIS', handleAIAnalysis);
      SystemUplink.unsubscribe('SOCIAL_LOG', handleSocialLog);
    };
  }, []);

  // --- UI RENDER ---
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 font-sans flex flex-col">
      
      {/* Header: Pure Status, No Controls */}
      <header className="h-16 bg-galaxy-900 border-b border-galaxy-700 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border transition-colors duration-500 ${systemStatus === SystemStatus.ONLINE ? 'bg-galaxy-accent/20 border-galaxy-accent/30' : 'bg-red-900/20 border-red-500/30'}`}>
                <Rocket className={`${systemStatus === SystemStatus.ONLINE ? 'text-galaxy-accent' : 'text-red-500'}`} size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight">MINTON GALAXY</h1>
                <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Autonomous Direct Uplink Node</p>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">CORE STATUS</span>
                
                {systemStatus === SystemStatus.ONLINE && (
                     <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-pulse">
                        <Radio size={16} />
                        CONNECTED TO CORE
                     </div>
                )}
                
                {systemStatus === SystemStatus.RECONNECTING && (
                     <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold">
                        <Activity size={16} className="animate-spin" />
                        ESTABLISHING LINK...
                     </div>
                )}

                {systemStatus === SystemStatus.OFFLINE && (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-bold">
                        <AlertTriangle size={16} />
                        SIGNAL LOST - AUTO-RETRYING
                     </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow p-6 grid grid-cols-12 gap-6 overflow-hidden max-h-[calc(100vh-64px)]">
        
        {/* Left Column: Visuals & Metrics (65%) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
            {/* Live Video Feed */}
            <div className="h-[55%]">
                <StreamMonitor health={streamHealth} />
            </div>
            {/* System Metrics */}
            <div className="h-[45%]">
                <MetricsCharts history={metricsHistory} />
            </div>
        </div>

        {/* Right Column: Intelligence & Logs (35%) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-hidden">
            {/* AI Console */}
            <div className="h-[50%]">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[50%]">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}