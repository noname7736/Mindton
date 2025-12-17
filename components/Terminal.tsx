import React, { useEffect, useRef, useState } from 'react';
import { TerminalLine } from '../types';
import { Terminal as TerminalIcon } from 'lucide-react';
import { SystemUplink } from '../services/SystemUplink';

interface Props {
  lines: TerminalLine[];
}

export const Terminal: React.FC<Props> = ({ lines }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      SystemUplink.executeCommand(input);
      setInput('');
  };

  return (
    <div className="bg-[#000] border border-kali-border rounded-lg flex flex-col h-full font-mono text-sm shadow-2xl">
      {/* TERMINAL HEADER */}
      <div className="bg-[#1f1f1f] px-3 py-1.5 flex justify-between items-center border-b border-kali-border">
         <div className="flex items-center gap-2 text-gray-400">
             <TerminalIcon size={12} />
             <span className="text-xs">root@kali-node:~/bin</span>
         </div>
      </div>

      {/* TERMINAL BODY */}
      <div className="flex-grow bg-black p-3 overflow-y-auto font-mono text-xs md:text-sm" onClick={() => document.getElementById('term-input')?.focus()}>
        
        {lines.length === 0 && (
            <div className="text-gray-500 mb-4 opacity-50">
                Kali Linux Enterprise Node [Strict Mode]<br/>
                Waiting for Kernel initialization...
            </div>
        )}
        
        {lines.map((line) => (
            <div key={line.id} className="mb-0.5 break-all flex">
                <span className="text-gray-600 mr-2 shrink-0 select-none">[{line.timestamp}]</span>
                <span>
                    {line.type === 'SUCCESS' && <span className="text-green-500 font-bold">{line.content}</span>}
                    {line.type === 'STDERR' && <span className="text-red-500 font-bold">{line.content}</span>}
                    {line.type === 'STDOUT' && <span className="text-gray-300">{line.content}</span>}
                    {line.type === 'INFO' && <span className="text-blue-400">{line.content}</span>}
                    {line.type === 'DAEMON' && <span className="text-purple-400 italic">:: {line.content}</span>}
                    {line.type === 'KERNEL' && <span className="text-yellow-600 font-bold">[KERNEL] {line.content}</span>}
                    {line.type === 'NET' && <span className="text-cyan-600 font-bold">[NET] {line.content}</span>}
                    {line.type === 'INPUT' && (
                        <div className="flex items-center text-gray-100">
                            <span className="text-green-500 font-bold mr-2">root@kali:~#</span>
                            {line.content}
                        </div>
                    )}
                </span>
            </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
            <span className="text-green-500 font-bold mr-2 select-none">root@kali:~#</span>
            <input 
                id="term-input"
                type="text" 
                className="bg-transparent border-none outline-none text-gray-100 flex-grow font-mono focus:ring-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
                autoFocus
                spellCheck={false}
            />
        </form>
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};