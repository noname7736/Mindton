import React, { useEffect, useState } from 'react';
import { Rocket, Zap, Radio, Activity, Cpu, AlertTriangle, Eye, Flame } from 'lucide-react';
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
    <div className="min-h-screen bg-black text-gray-200 font-sans flex flex-col overflow-hidden selection:bg-red-900 selection:text-white">
      
      {/* MAX HEADER: DARK MODE EDITION */}
      <header className="h-18 bg-black/90 backdrop-blur-md border-b border-red-900/30 flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_5px_20px_rgba(220,38,38,0.1)]">
        <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-xl border-2 transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.4)] ${systemStatus === SystemStatus.ONLINE ? 'bg-red-950 border-red-600 text-white' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                <Eye className="animate-[pulse_3s_infinite]" size={28} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-white leading-none italic">
                  MINTON<span className="text-red-600">GALAXY</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-600 not-italic">DARK_MODE</span>
                </h1>
                <p className="text-[11px] text-red-500 font-mono tracking-[0.2em] uppercase font-bold mt-1">
                  Psycho-Semantic Control Grid [ACTIVE]
                </p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            {/* Overdrive Badge */}
            <div className="hidden md:flex flex-col items-end border-r border-red-900/30 pr-6">
                <span className="text-[9px] text-red-800 font-mono tracking-widest mb-1">INTENSITY LEVEL</span>
                <div className="flex items-center gap-2 text-red-500 text-sm font-black tracking-wider shadow-red-500/10 drop-shadow-sm">
                    <Flame size={16} className="fill-red-600 animate-bounce" />
                    OBSESSION OVERLOAD
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[9px] text-gray-600 font-mono tracking-wider mb-1">LINK STATUS</span>
                
                {systemStatus === SystemStatus.ONLINE ? (
                     <div className="flex items-center gap-2 text-red-400 text-sm font-bold animate-pulse bg-red-950/30 px-3 py-1 rounded-full border border-red-600/50">
                        <Radio size={16} />
                        MIND LINK: STABLE
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-gray-900 px-3 py-1 rounded-full border border-gray-700">
                        <AlertTriangle size={16} />
                        ESTABLISHING LINK...
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
            <div className="h-[55%] shadow-[0_0_40px_rgba(220,38,38,0.1)] rounded-lg">
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
            <div className="h-[45%] shadow-[0_0_30px_rgba(147,51,234,0.1)] rounded-lg">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[55%] shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-lg">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}