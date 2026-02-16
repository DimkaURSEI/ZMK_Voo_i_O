
import React from 'react';
import { Machine } from '../types';
import { OPERATIONS, OPERATION_GROUPS, STATUS_COLORS } from '../constants';

interface MachineTableProps {
  machines: Machine[];
  onSelect: (id: string) => void;
}

const MachineTable: React.FC<MachineTableProps> = ({ machines, onSelect }) => {
  return (
    <div className="w-full h-full overflow-auto bg-[#0a0a0a] p-10">
      <div className="max-w-7xl mx-auto border border-white/10 rounded overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
              <th className="px-6 py-5 border-b border-white/10">ID</th>
              <th className="px-6 py-5 border-b border-white/10">Оборудование</th>
              <th className="px-6 py-5 border-b border-white/10">Статус</th>
              <th className="px-6 py-5 border-b border-white/10">Тех. Процессы</th>
              <th className="px-6 py-5 border-b border-white/10">Группа</th>
              <th className="px-6 py-5 border-b border-white/10">Инструменты</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {machines.map((machine) => {
              const machineOps = OPERATIONS.filter(op => machine.operations.includes(op.id));
              return (
                <tr 
                  key={machine.id} 
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  onClick={() => onSelect(machine.id)}
                >
                  <td className="px-6 py-6 text-[10px] text-white/20 font-mono">{machine.id.toUpperCase()}</td>
                  <td className="px-6 py-6">
                    <div className="font-bold text-sm text-white">{machine.name}</div>
                    <div className="text-[10px] text-white/30 font-mono uppercase">{machine.model}</div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[machine.status as keyof typeof STATUS_COLORS] }} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{machine.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1">
                      {machineOps.map(op => (
                        <span key={op.id} className="text-[9px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60 uppercase">
                          {op.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] text-white/50 uppercase tracking-widest">
                      {OPERATION_GROUPS[machineOps[0]?.group as keyof typeof OPERATION_GROUPS]?.name}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-[10px] text-white/30 truncate max-w-[150px]">
                      {machine.tools.join(', ')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MachineTable;
