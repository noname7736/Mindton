import React, { useEffect, useState } from 'react';
import { Rocket, Zap, Radio, Activity, Cpu, AlertTriangle } from 'lucide-react';
import StreamMonitor from './components/StreamMonitor';
import AIAnalysisPanel from './components/AIAnalysisPanel';
import MetricsCharts from './components/MetricsCharts';
import SocialLogPanel from './components/SocialLogPanel';
import { SystemUplink } from './services/SystemUplink';
import { AIAnalysisResult, StreamHealth, SocialLog, SystemStatus } from './types';

export function App() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(SystemStatus.OFFLINE);
  const [streamHealth, setStreamHealth] = useState<StreamHealth>({
    bitrate: 0, fps: 0, cpu_usage: 0, uplink_status: SystemStatus.OFFLINE, uptime: "--:--:--", 
    uplinkType: 'PRIMARY', currentIngestUrl: 'Waiting for signal...'
  });
  
  const [metricsHistory, setMetricsHistory] = useState<StreamHealth[]>([]);
  const [aiLogs, setAiLogs] = useState<AIAnalysisResult[]>([]);
  const [socialLogs, setSocialLogs] = useState<SocialLog[]>([]);

  useEffect(() => {
    SystemUplink.onStatusChange(setSystemStatus);

    const handleHealthUpdate = (data: StreamHealth) => {
      setStreamHealth(data);
      setMetricsHistory(prev => [...prev.slice(-49), data]); // Keep more history for smoother charts
    };

    const handleAIAnalysis = (data: AIAnalysisResult) => {
      setAiLogs(prev => [...prev.slice(-99), data]); // Keep more logs
    };

    const handleSocialLog = (data: SocialLog) => {
      setSocialLogs(prev => [...prev.slice(-200), data]); // Keep a lot of logs
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
    <div className="min-h-screen bg-[#050914] text-gray-200 font-sans flex flex-col overflow-hidden">
      
      {/* MAX HEADER */}
      <header className="h-18 bg-galaxy-900/90 backdrop-blur-md border-b border-galaxy-accent/20 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl shadow-galaxy-accent/5">
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl border-2 transition-all duration-300 shadow-[0_0_15px_rgba(139,92,246,0.5)] ${systemStatus === SystemStatus.ONLINE ? 'bg-galaxy-accent border-galaxy-accent text-white' : 'bg-red-900/20 border-red-500 text-red-500'}`}>
                <Rocket className="animate-pulse" size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-white leading-none italic">
                  MINTON<span className="text-galaxy-accent">GALAXY</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 not-italic">ULTIMATE</span>
                </h1>
                <p className="text-[11px] text-cyan-400 font-mono tracking-[0.2em] uppercase font-bold mt-1">
                  Autonomous Direct Uplink Node [MAX]
                </p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            {/* Overdrive Badge */}
            <div className="hidden md:flex flex-col items-end border-r border-galaxy-700 pr-6">
                <span className="text-[9px] text-gray-400 font-mono tracking-widest mb-1">SYSTEM PERFORMANCE</span>
                <div className="flex items-center gap-2 text-yellow-400 text-sm font-black tracking-wider shadow-yellow-500/20 drop-shadow-sm">
                    <Zap size={16} className="fill-yellow-400 animate-bounce" />
                    OVERDRIVE ENABLED
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-500 font-mono tracking-wider mb-1">CORE STATUS</span>
                
                {systemStatus === SystemStatus.ONLINE ? (
                     <div className="flex items-center gap-2 text-green-400 text-sm font-bold animate-pulse bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                        <Radio size={16} />
                        CONNECTED TO CORE
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-500 text-sm font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        <AlertTriangle size={16} />
                        RETRYING UPLINK...
                     </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow p-4 lg:p-6 grid grid-cols-12 gap-6 overflow-hidden max-h-[calc(100vh-72px)]">
        
        {/* Left Column: Visuals & Metrics (65%) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 h-full overflow-hidden">
            {/* Live Video Feed */}
            <div className="h-[55%] shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-lg">
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
            <div className="h-[45%] shadow-[0_0_20px_rgba(139,92,246,0.1)] rounded-lg">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[55%] shadow-[0_0_20px_rgba(59,130,246,0.1)] rounded-lg">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}