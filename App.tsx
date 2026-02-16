
import React, { useState, useMemo } from 'react';
import { AppState, MachineStatus, BBox, Machine } from './types';
import { MACHINES as INITIAL_MACHINES } from './mockData';
import { OPERATION_GROUPS } from './constants';
import FactoryMap from './components/FactoryMap';
import Sidebar from './components/Sidebar';
import MachineTable from './components/MachineTable';

const App: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [state, setState] = useState<AppState>({
    selectedMachineId: null,
    filterOperationGroup: null,
    filterStatus: null,
    viewMode: 'map',
    isDrawingMode: false
  });
  
  const [pendingBox, setPendingBox] = useState<BBox | null>(null);

  const selectedMachine = useMemo(() => 
    machines.find(m => m.id === state.selectedMachineId) || null
  , [state.selectedMachineId, machines]);

  const handleNewBox = (box: BBox) => {
    setPendingBox(box);
  };

  const assignMachine = (machineId: string) => {
    if (!pendingBox) return;
    
    setMachines(prev => prev.map(m => 
      m.id === machineId ? { ...m, bbox: pendingBox } : m
    ));
    setPendingBox(null);
  };

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(machines, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "factory_config.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    console.log("Current Config:", JSON.stringify(machines, null, 2));
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050505] overflow-hidden text-white font-sans">
      {/* Шапка */}
      <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between z-40 bg-black/90 backdrop-blur-md">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black font-black flex items-center justify-center text-2xl rounded-sm">Z</div>
            <div>
               <h1 className="text-sm font-black uppercase tracking-[0.4em] leading-none">ЗМК.МОНИТОР</h1>
               <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-1">Industrial Asset Manager</p>
            </div>
          </div>
          
          <nav className="flex bg-white/5 p-1 rounded border border-white/10">
            <button 
              onClick={() => setState(p => ({...p, viewMode: 'map'}))}
              className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${state.viewMode === 'map' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Карта цеха
            </button>
            <button 
              onClick={() => setState(p => ({...p, viewMode: 'table'}))}
              className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${state.viewMode === 'table' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
            >
              Реестр оборудования
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
           <button 
             onClick={() => setState(p => ({...p, isDrawingMode: !p.isDrawingMode}))}
             className={`px-4 py-2 rounded border text-[10px] font-bold uppercase tracking-widest transition-all ${state.isDrawingMode ? 'bg-red-500 border-red-500 text-white' : 'bg-transparent border-white/20 text-white/60 hover:border-white'}`}
           >
             {state.isDrawingMode ? 'Выйти из разметки' : 'Начать разметку'}
           </button>
           
           <button 
             onClick={exportConfig}
             className="px-4 py-2 rounded bg-white text-black border border-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-all"
           >
             Экспорт JSON
           </button>
        </div>
      </header>

      {/* Контент */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Фильтры (скрыты в режиме разметки для удобства) */}
        {!state.isDrawingMode && (
          <div className="absolute top-8 left-8 z-30 flex gap-3">
            <select 
              className="bg-black border border-white/10 rounded px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 outline-none focus:border-white transition-all appearance-none cursor-pointer"
              onChange={(e) => setState(p => ({...p, filterStatus: e.target.value as MachineStatus || null}))}
            >
              <option value="">Все статусы</option>
              {Object.keys(MachineStatus).map(s => <option key={s} value={MachineStatus[s as keyof typeof MachineStatus]}>{MachineStatus[s as keyof typeof MachineStatus]}</option>)}
            </select>

            <select 
              className="bg-black border border-white/10 rounded px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/70 outline-none focus:border-white transition-all appearance-none cursor-pointer"
              onChange={(e) => setState(p => ({...p, filterOperationGroup: e.target.value || null}))}
            >
              <option value="">Все тех. группы</option>
              {Object.entries(OPERATION_GROUPS).map(([key, group]) => (
                <option key={key} value={key}>{group.name}</option>
              ))}
            </select>
          </div>
        )}

        {state.viewMode === 'map' ? (
          <FactoryMap 
            machines={machines} 
            selectedId={state.selectedMachineId} 
            onSelect={(id) => setState(p => ({...p, selectedMachineId: id}))}
            isDrawingMode={state.isDrawingMode}
            onNewBox={handleNewBox}
            activeGroupFilter={state.filterOperationGroup}
            activeStatusFilter={state.filterStatus}
          />
        ) : (
          <MachineTable machines={machines} onSelect={(id) => setState(p => ({...p, selectedMachineId: id, viewMode: 'map'}))} />
        )}

        {/* Модалка назначения оборудования */}
        {pendingBox && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-lg p-8 max-w-md w-full shadow-2xl space-y-6">
              <h2 className="text-xl font-bold uppercase tracking-tighter">Назначить оборудование</h2>
              <p className="text-xs text-white/40 font-mono">Выделенная область: {Math.round(pendingBox.width)}x{Math.round(pendingBox.height)} px</p>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {machines.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => assignMachine(m.id)}
                    className="w-full text-left p-4 rounded border border-white/5 hover:bg-white/5 hover:border-white/20 transition-all flex justify-between items-center group"
                  >
                    <div>
                      <div className="text-sm font-bold group-hover:text-blue-400">{m.name}</div>
                      <div className="text-[10px] text-white/30 uppercase">{m.model}</div>
                    </div>
                    <div className="text-[10px] text-white/20 font-mono">{m.id}</div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setPendingBox(null)}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <Sidebar machine={selectedMachine} onClose={() => setState(p => ({...p, selectedMachineId: null}))} />
      </div>

      <footer className="h-10 border-t border-white/10 px-8 flex items-center justify-between text-[9px] font-mono text-white/20 uppercase tracking-[0.3em] bg-black">
        <div>ZMK Assets v1.0 / Drawing Mode: {state.isDrawingMode ? 'ON' : 'OFF'}</div>
        <div className="flex gap-8">
          <span>{machines.length} объектов в реестре</span>
          <span>PostgreSQL Ready</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
