
import React, { useState } from 'react';
import { Machine, Operation } from '../types';
import { OPERATIONS, STATUS_COLORS, MACHINE_FLOWS } from '../constants';
import ThreeDViewer from './ThreeDViewer';

interface SidebarProps {
  machine: Machine | null;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ machine, onClose }) => {
  const [expandedOp, setExpandedOp] = useState<string | null>(null);

  if (!machine) return null;

  const machineOps = OPERATIONS.filter(op => machine.operations.includes(op.id));
  const flowsInvolved = MACHINE_FLOWS.filter(f => f.sequence.includes(machine.id));

  return (
    <div className="fixed right-0 top-0 h-full w-[500px] bg-[#0d0d0d] border-l border-white/10 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
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

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Status & Info */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: STATUS_COLORS[machine.status as keyof typeof STATUS_COLORS] }} />
                <span className="uppercase tracking-widest text-xs font-black">{machine.status}</span>
              </div>
              <div className="flex gap-2">
                {flowsInvolved.map(f => (
                  <div key={f.id} className="px-2 py-0.5 border border-white/10 bg-white/5 rounded text-[8px] uppercase font-bold" style={{ color: f.color }}>
                    {f.name.split(' ')[0]} Flow
                  </div>
                ))}
              </div>
          </div>
          
          <img src={machine.image} alt={machine.name} className="w-full h-56 object-cover rounded-sm border border-white/10 grayscale hover:grayscale-0 transition-all duration-500" />
          
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Назначение узла</h3>
            <p className="text-sm text-white/80 leading-relaxed font-medium">{machine.description}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Геометрия (Digital Twin)</h3>
            <div className="h-48 w-full bg-black border border-white/5 rounded overflow-hidden relative">
              <ThreeDViewer machineName={machine.name} />
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-[7px] uppercase font-bold tracking-[0.2em] text-white/40">
                Live 3D Viewport
              </div>
            </div>
          </div>
        </section>

        {/* Operations */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] border-b border-white/10 pb-2">Технологические операции</h3>
          <div className="space-y-3">
            {machineOps.map(op => (
              <div key={op.id} className="border border-white/10 rounded-sm overflow-hidden bg-white/5">
                <button 
                  onClick={() => setExpandedOp(expandedOp === op.id ? null : op.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: op.groupColor }} />
                    <span className="text-xs font-black uppercase tracking-widest">{op.name}</span>
                  </div>
                  <div className={`transition-transform duration-300 ${expandedOp === op.id ? 'rotate-180' : ''}`}>
                    <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                {expandedOp === op.id && (
                  <div className="p-5 border-t border-white/5 bg-black/40 space-y-6 animate-in slide-in-from-top-2">
                    <p className="text-[11px] text-white/50 leading-relaxed italic">"{op.description}"</p>
                    <div className="space-y-3">
                      <h4 className="text-[8px] font-black text-white/30 uppercase tracking-widest">Этапы перехода (Workflow):</h4>
                      <div className="space-y-2">
                        {op.transitions.map((t, i) => (
                          <div key={i} className="flex items-center gap-4 group">
                            <span className="text-[9px] font-mono text-white/20 group-hover:text-white/60 transition-colors">0{i+1}</span>
                            <span className="text-[11px] text-white/80 font-bold uppercase tracking-tight">{t}</span>
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

        {/* Tools & Consumables */}
        <div className="grid grid-cols-1 gap-8 pb-12 border-t border-white/10 pt-8">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Инструментальная оснастка</h3>
            <div className="grid grid-cols-2 gap-3">
              {machine.tools.map((tool, i) => (
                <div key={i} className="text-[10px] text-white/70 font-bold uppercase tracking-tighter p-3 border border-white/5 bg-white/[0.02]">{tool}</div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Расходные материалы</h3>
            <div className="grid grid-cols-1 gap-2">
              {machine.consumables.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[10px] text-white/60 font-mono p-2 border-b border-white/5">
                  <span>{item}</span>
                  <span className="text-[8px] opacity-20">STOCK: OK</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
