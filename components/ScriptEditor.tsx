import React from 'react';
import { Play, Save, FileCode, Copy, FileText, Plus } from 'lucide-react';
import { ScriptFile } from '../types';
import { SystemUplink } from '../services/SystemUplink';

interface Props {
    files: ScriptFile[];
    activeFileId: string;
}

export const ScriptEditor: React.FC<Props> = ({ files, activeFileId }) => {
  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Tab') {
          e.preventDefault();
          const target = e.target as HTMLTextAreaElement;
          const start = target.selectionStart;
          const end = target.selectionEnd;
          const newValue = activeFile.content.substring(0, start) + "    " + activeFile.content.substring(end);
          SystemUplink.updateFileContent(activeFileId, newValue);
          // Cursor position handling would go here in a full implementation
      }
  };

  return (
    <div className="bg-kali-panel border border-kali-border rounded-lg flex h-full overflow-hidden shadow-xl">
      
      {/* SIDEBAR */}
      <div className="w-48 bg-[#0a0a0a] border-r border-kali-border flex flex-col">
          <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-kali-border">
              Workspace
          </div>
          <div className="flex-grow overflow-y-auto">
              {files.map(file => (
                  <div 
                    key={file.id}
                    onClick={() => SystemUplink.setActiveFile(file.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer border-l-2 transition-colors ${file.id === activeFileId ? 'bg-[#151515] text-white border-blue-500' : 'text-gray-400 border-transparent hover:bg-[#111]'}`}
                  >
                      <FileCode size={14} className={file.id === activeFileId ? 'text-blue-400' : 'text-gray-600'} />
                      <span className="truncate">{file.name}</span>
                      {file.isDirty && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-auto" />}
                  </div>
              ))}
          </div>
          <div className="p-2 border-t border-kali-border">
              <button className="w-full flex items-center justify-center gap-2 bg-[#151515] hover:bg-[#222] text-gray-400 py-1.5 rounded text-xs transition-colors">
                  <Plus size={12} /> New Script
              </button>
          </div>
      </div>

      {/* EDITOR */}
      <div className="flex-grow flex flex-col min-w-0">
        {/* TOOLBAR */}
        <div className="bg-[#1a1a1a] border-b border-kali-border px-3 py-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-300">{activeFile.name}</span>
                {activeFile.isDirty ? 
                    <span className="text-xs text-yellow-500 italic"> (Unsaved)</span> : 
                    <span className="text-xs text-gray-600 italic"> (Saved)</span>
                }
            </div>
            <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-white transition-colors" title="Save">
                    <Save size={14} />
                </button>
                <button 
                    onClick={() => SystemUplink.runActiveScript()}
                    className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                >
                    <Play size={12} /> RUN
                </button>
            </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-grow relative bg-[#0d0d0d] font-mono text-sm overflow-auto">
            <div className="absolute top-0 left-0 bottom-0 w-10 bg-[#151515] border-r border-gray-800 text-gray-600 text-right pr-2 pt-2 select-none leading-6 font-mono text-xs">
                {activeFile.content.split('\n').map((_, i) => (
                    <div key={i}>{i+1}</div>
                ))}
            </div>
            <textarea 
                className="w-full h-full bg-transparent text-gray-300 p-2 pl-12 focus:outline-none resize-none leading-6 selection:bg-blue-900"
                value={activeFile.content}
                onChange={(e) => SystemUplink.updateFileContent(activeFile.id, e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
            />
        </div>
      </div>
    </div>
  );
};