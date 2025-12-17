import React, { useEffect, useRef, useState } from 'react';
import { TerminalLine } from '../types';
import { Terminal as TerminalIcon, Command } from 'lucide-react';
import { SystemUplink } from '../services/SystemUplink';

interface Props {
  lines: TerminalLine[];
}

export const Terminal: React.FC<Props> = ({ lines }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  
  const safeLines = lines || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [safeLines]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      SystemUplink.executeCommand(input);
      setInput('');
  };

  return (
    <div className="bg-[#000] border border-kali-border rounded-lg flex flex-col h-full font-mono text-sm shadow-2xl relative overflow-hidden">
      {/* TERMINAL HEADER */}
      <div className="bg-[#151515] px-3 py-1.5 flex justify-between items-center border-b border-kali-border shrink-0">
         <div className="flex items-center gap-2 text-gray-400">
             <TerminalIcon size={12} />
             <span className="text-xs font-bold">root@kali-enterprise:~/ops</span>
         </div>
         <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
         </div>
      </div>

      {/* TERMINAL BODY */}
      <div className="flex-grow bg-[#050505] p-3 overflow-y-auto font-mono text-xs md:text-sm" onClick={() => document.getElementById('term-input')?.focus()}>
        
        {safeLines.length === 0 && (
            <div className="text-gray-600 mb-4 text-[10px]">
                Kali Enterprise Kernel [Version 6.8.9]<br/>
                (c) 2024 Offensive Security. All rights reserved.<br/><br/>
                System is ready. Type 'help' for commands.
            </div>
        )}
        
        {safeLines.map((line) => (
            <div key={line.id} className="mb-0.5 break-all flex group">
                <span className="text-gray-700 mr-2 shrink-0 select-none text-[10px] pt-0.5">{line.timestamp}</span>
                <span className="leading-tight">
                    {line.type === 'SUCCESS' && <span className="text-green-500 font-bold">➜ {line.content}</span>}
                    {line.type === 'STDERR' && <span className="text-red-500 font-bold">✖ {line.content}</span>}
                    {line.type === 'STDOUT' && <span className="text-gray-300">{line.content}</span>}
                    {line.type === 'INFO' && <span className="text-blue-400">ℹ {line.content}</span>}
                    {line.type === 'DAEMON' && <span className="text-purple-400 italic">⚙ {line.content}</span>}
                    {line.type === 'KERNEL' && <span className="text-yellow-600 font-bold">[KERN] {line.content}</span>}
                    {line.type === 'NET' && <span className="text-cyan-600 font-bold">[UPLINK] {line.content}</span>}
                    {line.type === 'EXEC' && <span className="text-pink-500 font-bold">[JS] {line.content}</span>}
                    {line.type === 'INPUT' && (
                        <div className="flex items-center text-gray-100 mt-2 mb-1">
                            <span className="text-green-500 font-bold mr-2">root@kali:~#</span>
                            <span className="text-white">{line.content}</span>
                        </div>
                    )}
                </span>
            </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center mt-2 border-t border-dashed border-gray-800 pt-2">
            <span className="text-green-500 font-bold mr-2 select-none animate-pulse">root@kali:~#</span>
            <input 
                id="term-input"
                type="text" 
                className="bg-transparent border-none outline-none text-gray-100 flex-grow font-mono focus:ring-0 placeholder-gray-800"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                autoFocus
                placeholder="Enter command..."
                spellCheck={false}
            />
        </form>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};