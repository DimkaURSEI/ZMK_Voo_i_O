
import React, { useState } from 'react';
import { Machine, Operation } from '../types';
import { OPERATIONS, STATUS_COLORS } from '../constants';
import ThreeDViewer from './ThreeDViewer';

interface SidebarProps {
  machine: Machine | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ machine, onClose }) => {
  const [expandedOp, setExpandedOp] = useState<string | null>(null);

  if (!machine) return null;

  const machineOps = OPERATIONS.filter(op => machine.operations.includes(op.id));

  return (
    <div className="fixed right-0 top-0 h-full w-[500px] bg-[#0d0d0d] border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/30">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight">{machine.name}</h2>
          <p className="text-white/40 text-xs font-mono">{machine.model}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* Статус и Описание */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[machine.status as keyof typeof STATUS_COLORS] }} />
                <span className="uppercase tracking-widest text-sm font-bold">{machine.status}</span>
              </div>
              <span className="text-[10px] text-white/30 font-mono">ID: {machine.id.toUpperCase()}</span>
          </div>
          
          <img src={machine.image} alt={machine.name} className="w-full h-48 object-cover rounded-sm border border-white/10 shadow-lg" />
          
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Техническое описание</h3>
            <p className="text-sm text-white/70 leading-relaxed font-light">{machine.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">3D Модель станка</h3>
            <div className="h-48 w-full bg-black/40 border border-white/5 rounded-lg overflow-hidden relative">
              <ThreeDViewer machineName={machine.name} />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-[8px] uppercase font-bold tracking-widest text-white/40 rounded">
                Интерактивный просмотр
              </div>
            </div>
          </div>
        </section>

        {/* Операции */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] border-b border-white/10 pb-2">Выполняемые операции</h3>
          <div className="space-y-3">
            {machineOps.map(op => (
              <div key={op.id} className="border border-white/10 rounded overflow-hidden">
                <button 
                  onClick={() => setExpandedOp(expandedOp === op.id ? null : op.id)}
                  className="w-full p-4 flex items-center justify-between bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4" style={{ backgroundColor: op.groupColor }} />
                    <span className="text-sm font-semibold">{op.name}</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${expandedOp === op.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {expandedOp === op.id && (
                  <div className="p-4 bg-black/40 space-y-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-white/50">{op.description}</p>
                    <div className="space-y-2">
                      <h4 className="text-[9px] font-bold text-white/30 uppercase">Технологические переходы:</h4>
                      <div className="space-y-1">
                        {op.transitions.map((t, i) => (
                          <div key={i} className="flex items-center gap-3 py-1 border-b border-white/5 last:border-0">
                            <span className="text-[10px] font-mono text-white/20">{i+1}.</span>
                            <span className="text-xs text-white/80">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Инструмент и Расходники */}
        <div className="grid grid-cols-2 gap-6 pb-10">
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Измерительный инструмент</h3>
            <ul className="space-y-2">
              {machine.tools.map((tool, i) => (
                <li key={i} className="text-[11px] text-white/60 font-mono leading-tight border-l-2 border-white/10 pl-2">{tool}</li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Расходные материалы</h3>
            <ul className="space-y-2">
              {machine.consumables.map((item, i) => (
                <li key={i} className="text-[11px] text-white/60 font-mono leading-tight border-l-2 border-white/10 pl-2">{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
