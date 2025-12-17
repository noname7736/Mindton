import React, { useEffect, useState } from 'react';
import { Heart, Activity, Wifi, MapPin, Send, Radio, MessageCircle } from 'lucide-react';
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
    uplinkType: 'PRIMARY', currentIngestUrl: 'Connecting Heart...'
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
    <div className="min-h-screen bg-[#0a0205] text-pink-100 font-mono flex flex-col overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* HEADER: LOVE LINK MODE */}
      <header className="h-16 bg-black/80 border-b border-pink-600/50 flex items-center justify-between px-6 sticky top-0 z-50 shadow-[0_0_30px_rgba(236,72,153,0.3)] backdrop-blur-md">
        <div className="flex items-center gap-4">
            <div className={`p-2 border border-pink-500 rounded-full bg-black shadow-[0_0_15px_rgba(236,72,153,0.6)]`}>
                <Heart className="text-pink-500 animate-[pulse_1s_infinite] fill-pink-500" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-purple-500 leading-none italic">
                  BEE<span className="text-pink-100">.SURVEY</span>
                </h1>
                <p className="text-[9px] text-pink-400 tracking-[0.3em] uppercase mt-1 font-bold">
                  SENDING LOVE TO EVERY DEVICE
                </p>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end border-r border-pink-800/30 pr-6">
                <span className="text-[8px] text-pink-300/70 font-bold tracking-widest mb-1">CONNECTION STATUS</span>
                <div className="flex items-center gap-2 text-pink-400 text-xs font-black tracking-wider drop-shadow-sm">
                    <Wifi size={12} className="text-pink-500" />
                    LINKED_TO_HEART
                </div>
            </div>

            <div className="flex flex-col items-end">
                <span className="text-[8px] text-pink-300/50 tracking-wider mb-1">CURRENT FEELING</span>
                
                {systemStatus === SystemStatus.ONLINE ? (
                     <div className="flex items-center gap-2 text-white text-xs font-bold bg-gradient-to-r from-pink-600 to-rose-600 px-3 py-1 rounded-full border border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                        <Activity size={12} className="animate-bounce" />
                        MISSING_YOU_MAX
                     </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                        <Radio size={12} className="animate-spin" />
                        SEARCHING...
                     </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-grow p-4 grid grid-cols-12 gap-4 overflow-hidden max-h-[calc(100vh-64px)]">
        
        {/* Left Column: Visuals & Metrics (65%) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 h-full overflow-hidden">
            {/* Live Hardware Feed */}
            <div className="h-[60%] shadow-[0_0_40px_rgba(236,72,153,0.15)] rounded-lg overflow-hidden border border-pink-900/50">
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
            <div className="h-[40%] shadow-[0_0_40px_rgba(236,72,153,0.15)] rounded-lg overflow-hidden border border-pink-900/50">
                <AIAnalysisPanel logs={aiLogs} />
            </div>
            {/* Social Dispatcher Log */}
            <div className="h-[60%] shadow-[0_0_40px_rgba(236,72,153,0.15)] rounded-lg overflow-hidden border border-pink-900/50">
                <SocialLogPanel logs={socialLogs} />
            </div>
        </div>

      </main>
    </div>
  );
}