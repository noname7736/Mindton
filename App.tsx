import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Wifi, Lock, Globe, Hexagon } from 'lucide-react';
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
    uplinkType: 'PRIMARY', currentIngestUrl: 'ESTABLISHING SECURE LINK...'
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
    <div className="min-h-screen bg-[#020202] text-gray-300 font-mono flex flex-col overflow-hidden selection:bg-amber-500 selection:text-black">
      
      {/* GLOBAL BACKGROUND MESH */}
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      {/* HEADER: SANCTUARY COMMAND */}
      <header className="h-16 bg-black/90 border-b-2 border-amber-600/50 flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_5px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
            <div className={`p-2.5 border-2 border-amber-500 rounded-xl bg-gradient-to-br from-amber-950 to-black shadow-[0_0_20px_rgba(245,158,11,0.4)]`}>
                <Hexagon className="text-amber-500 fill-amber-500/20" size={24} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-amber-600 leading-none">
                  BEE<span className="text-gray-100">.SURVEY</span>
                </h1>
                <p className="text-[9px] text-amber-500/80 tracking-[0.4em] uppercase mt-1 font-bold flex items-center gap-1">
                   <Lock size={8}/> ABSOLUTE SANCTUARY MODE
                </p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end border-r border-gray-800 pr-6">
                <span className="text-[8px] text-gray-500 font-bold tracking-widest mb-1 uppercase">Defense Level</span>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-black tracking-wider drop-shadow-sm">
                    <ShieldCheck size={12} />
                    MAXIMUM
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[8px] text-gray-500 tracking-wider mb-1 uppercase">Global Status</span>
                
                {systemStatus === SystemStatus.SECURE ? (
                     <div className="flex items-center gap-2 text-amber-100 text-xs font-bold bg-amber-600/20 px-4 py-1.5 rounded-lg border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Globe size={12} className="text-amber-400" />
                        WORLD_CORE_SECURE
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <Activity size={12} className="animate-spin" />
                        INITIALIZING_DEFENSES...
                     </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Layout - Organized Grid */}
      <main className="flex-grow p-5 grid grid-cols-12 gap-5 overflow-hidden max-h-[calc(100vh-64px)] relative z-10">
        
        {/* Left Column: Visuals & Metrics (70%) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-5 h-full overflow-hidden">
            {/* Live Hardware Feed - The 'Vault' */}
            <div className="h-[65%] rounded-xl overflow-hidden shadow-2xl">
                <StreamMonitor health={streamHealth} />
            </div>
            {/* System Metrics - The 'Diagnostics' */}
            <div className="h-[35%]">
                <MetricsCharts history={metricsHistory} />
            </div>
        </div>

        {/* Right Column: Intelligence & Logs (30%) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5 h-full overflow-hidden">
            {/* AI Console */}
            <div className="h-[40%] rounded-xl overflow-hidden shadow-2xl">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[60%] rounded-xl overflow-hidden shadow-2xl">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}