import React from 'react';
import { Play, Save, FileCode, Plus, AlertTriangle } from 'lucide-react';
import { ScriptFile } from '../types';
import { SystemUplink } from '../services/SystemUplink';

interface Props {
    files: ScriptFile[];
    activeFileId: string;
}

export const ScriptEditor: React.FC<Props> = ({ files, activeFileId }) => {
  const safeFiles = files || [];
  const activeFile = safeFiles.find(f => f.id === activeFileId) || safeFiles[0] || {
      id: '0',
      name: 'No File',
      content: '// No files available',
      language: 'text',
      lastModified: Date.now()
  } as ScriptFile;

  return (
    <div className="bg-kali-panel border border-kali-border rounded-lg flex h-full overflow-hidden shadow-xl flex-col md:flex-row">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-48 bg-[#0a0a0a] border-r border-kali-border flex flex-col shrink-0">
          <div className="p-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-kali-border bg-[#111]">
              PAYLOADS
          </div>
          <div className="flex-grow overflow-y-auto">
              {safeFiles.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => SystemUplink.setActiveFile(file.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-mono cursor-pointer border-l-2 transition-colors ${file.id === activeFileId ? 'bg-[#1a1a1a] text-white border-kali-primary' : 'text-gray-500 border-transparent hover:bg-[#111]'}`}
                  >
                      <FileCode size={12} className={file.id === activeFileId ? 'text-blue-400' : 'text-gray-600'} />
                      <span className="truncate">{file.name}</span>
                      {file.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-auto" />}
                  </div>
              ))}
          </div>
      </div>

      {/* EDITOR */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TOOLBAR */}
        <div className="bg-[#151515] border-b border-kali-border px-3 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-300 bg-[#222] px-2 py-0.5 rounded">{activeFile.name}</span>
                <span className="text-[10px] text-gray-600 uppercase">JavaScript / Node Context</span>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => SystemUplink.runActiveScript()}
                    className="flex items-center gap-2 bg-kali-primary hover:bg-blue-600 text-white px-3 py-1 rounded-sm text-xs font-bold transition-all shadow-lg hover:shadow-blue-900/20 active:translate-y-0.5"
                >
                    <Play size={10} fill="currentColor" /> EXECUTE
                </button>
            </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-grow relative bg-[#0d0d0d] font-mono text-sm overflow-auto">
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-[#111] border-r border-gray-800 text-gray-600 text-right pr-2 pt-2 select-none leading-6 font-mono text-[10px]">
                {(activeFile.content || '').split('\n').map((_, i) => (
                    <div key={i}>{i+1}</div>
                ))}
            </div>
            <textarea 
                className="w-full h-full bg-transparent text-gray-300 p-2 pl-10 focus:outline-none resize-none leading-6 selection:bg-blue-900/50 text-xs md:text-sm"
                value={activeFile.content || ''}
                onChange={(e) => SystemUplink.updateFileContent(activeFile.id, e.target.value)}
                spellCheck={false}
                autoComplete="off"
            />
        </div>
        
        {/* FOOTER HINT */}
        <div className="bg-[#111] px-2 py-0.5 text-[10px] text-gray-600 flex items-center gap-1 border-t border-kali-border">
             <AlertTriangle size={8} />
             <span>Use console.log() to output to Terminal. 'document' and 'window' are accessible.</span>
        </div>
      </div>
    </div>
  );
};