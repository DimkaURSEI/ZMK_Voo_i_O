import React, { useState, useRef, useEffect } from 'react';
import { Machine, MachineStatus, BBox } from '../types';
import { STATUS_COLORS, OPERATIONS, OPERATION_GROUPS, MACHINE_FLOWS } from '../constants';

interface FactoryMapProps {
  machines: Machine[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isDrawingMode: boolean;
  onNewBox: (box: BBox) => void;
  activeGroupFilter: string | null;
  activeStatusFilter: MachineStatus | null;
}

const FactoryMap: React.FC<FactoryMapProps> = ({ 
  machines, 
  selectedId, 
  onSelect, 
  isDrawingMode,
  onNewBox,
  activeGroupFilter,
  activeStatusFilter 
}) => {
  const [drawing, setDrawing] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getSVGCoords = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const transformed = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDrawingMode) return;
    const coords = getSVGCoords(e);
    setDrawing({ startX: coords.x, startY: coords.y, currentX: coords.x, currentY: coords.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;
    const coords = getSVGCoords(e);
    setDrawing(prev => prev ? { ...prev, currentX: coords.x, currentY: coords.y } : null);
  };

  const handleMouseUp = () => {
    if (!drawing) return;
    const x = Math.min(drawing.startX, drawing.currentX);
    const y = Math.min(drawing.startY, drawing.currentY);
    const width = Math.abs(drawing.currentX - drawing.startX);
    const height = Math.abs(drawing.currentY - drawing.startY);
    if (width > 5 && height > 5) onNewBox({ x, y, width, height });
    setDrawing(null);
  };

  const getCenter = (bbox: BBox) => ({
    x: bbox.x + bbox.width / 2,
    y: bbox.y + bbox.height / 2
  });

  return (
    <div className={`relative w-full h-full bg-[#050505] overflow-hidden ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}>
      
      {/* Fixed Background Layer: Ensure ww.jpg is correctly displayed */}
      <div 
        className="absolute inset-0 bg-contain bg-no-repeat bg-center z-0 transition-all duration-700 pointer-events-none"
        style={{ 
          backgroundImage: `url("./ww.jpg")`, 
          filter: isDrawingMode ? 'brightness(1)' : 'grayscale(0.7) brightness(0.5)'
        }}
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 z-5 pointer-events-none opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <svg 
        ref={svgRef}
        viewBox="0 0 1200 800" 
        className="absolute inset-0 w-full h-full z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <style>{`
            @keyframes dashmove {
              to { stroke-dashoffset: -20; }
            }
            .flow-segment {
              animation: dashmove 0.8s linear infinite;
            }
          `}</style>
        </defs>

        {/* Animated Production Flow Lines */}
        {!isDrawingMode && MACHINE_FLOWS.map(flow => (
          <g key={flow.id} className="flow-group opacity-50 hover:opacity-100 transition-opacity">
            {flow.sequence.map((mId, idx) => {
              if (idx === flow.sequence.length - 1) return null;
              const source = machines.find(m => m.id === mId);
              const target = machines.find(m => m.id === flow.sequence[idx + 1]);
              if (!source || !target) return null;

              const sPos = getCenter(source.bbox);
              const tPos = getCenter(target.bbox);
              
              // If source or target is in REPAIR, flow is red and stopped
              const isInterrupted = source.status === MachineStatus.REPAIR || target.status === MachineStatus.REPAIR;
              const lineColor = isInterrupted ? '#ef4444' : flow.color;

              return (
                <path
                  key={`${flow.id}-${idx}`}
                  d={`M ${sPos.x} ${sPos.y} L ${tPos.x} ${tPos.y}`}
                  stroke={lineColor}
                  strokeWidth="3"
                  strokeDasharray="5, 5"
                  fill="none"
                  className={isInterrupted ? "" : "flow-segment"}
                />
              );
            })}
          </g>
        ))}

        {/* Machines Visualization */}
        {machines.map(machine => {
          const isSelected = selectedId === machine.id;
          const machineOps = OPERATIONS.filter(op => machine.operations.includes(op.id));
          const primaryGroup = machineOps[0]?.group;
          const primaryColor = OPERATION_GROUPS[primaryGroup as keyof typeof OPERATION_GROUPS]?.color || '#fff';
          
          const isDimmed = (activeGroupFilter && !machineOps.some(o => o.group === activeGroupFilter)) ||
                          (activeStatusFilter && machine.status !== activeStatusFilter);

          if (isDimmed) return null;

          return (
            <g 
              key={machine.id} 
              className={`transition-all duration-300 ${isDrawingMode ? 'pointer-events-none' : 'cursor-pointer'}`}
              onClick={(e) => { e.stopPropagation(); if (!isDrawingMode) onSelect(machine.id); }}
            >
              {/* BBox Rect */}
              <rect
                x={machine.bbox.x} y={machine.bbox.y}
                width={machine.bbox.width} height={machine.bbox.height}
                fill={isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)'}
                stroke={isSelected ? '#fff' : primaryColor}
                strokeWidth={isSelected ? 4 : 2}
                filter={isSelected ? "url(#glow)" : ""}
              />

              {/* Icon Placeholder (top left corner) */}
              <rect x={machine.bbox.x} y={machine.bbox.y} width="28" height="28" fill={primaryColor} />
              <text x={machine.bbox.x + 14} y={machine.bbox.y + 19} textAnchor="middle" fontSize="14" fill="white" className="select-none pointer-events-none">
                {OPERATION_GROUPS[primaryGroup as keyof typeof OPERATION_GROUPS]?.icon}
              </text>

              {/* Status Circle (top right corner) */}
              <circle 
                cx={machine.bbox.x + machine.bbox.width - 14} 
                cy={machine.bbox.y + 14} 
                r="6" 
                fill={STATUS_COLORS[machine.status as keyof typeof STATUS_COLORS]} 
              />
              {machine.status === MachineStatus.REPAIR && (
                 <text x={machine.bbox.x + machine.bbox.width - 14} y={machine.bbox.y + 18} textAnchor="middle" fill="white" fontSize="10" className="font-black">!</text>
              )}

              {/* Name Bar */}
              <g>
                <rect x={machine.bbox.x} y={machine.bbox.y - 25} width={Math.min(machine.bbox.width, 200)} height="25" fill="rgba(0,0,0,0.9)" stroke={primaryColor} strokeWidth="1"/>
                <text x={machine.bbox.x + 10} y={machine.bbox.y - 8} fill="#fff" fontSize="10" className="font-black uppercase tracking-widest select-none pointer-events-none">
                  {machine.name}
                </text>
              </g>

              {/* Small status text inside */}
              <text x={machine.bbox.x + machine.bbox.width/2} y={machine.bbox.y + machine.bbox.height - 12} textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" className="uppercase font-bold tracking-widest pointer-events-none">
                {machine.status}
              </text>
            </g>
          );
        })}

        {/* New BBox Preview */}
        {drawing && (
          <rect
            x={Math.min(drawing.startX, drawing.currentX)}
            y={Math.min(drawing.startY, drawing.currentY)}
            width={Math.abs(drawing.currentX - drawing.startX)}
            height={Math.abs(drawing.currentY - drawing.startY)}
            fill="rgba(255,255,255,0.1)"
            stroke="#fff"
            strokeDasharray="4 4"
          />
        )}
      </svg>

      {/* Legend & Controls Overlay */}
      <div className="absolute bottom-10 right-10 z-20 flex flex-col gap-4 pointer-events-none">
        <div className="bg-black/95 backdrop-blur-xl border border-white/10 p-6 rounded shadow-2xl pointer-events-auto">
          <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.4em] mb-4 border-b border-white/10 pb-3">Логистические потоки</h4>
          <div className="space-y-4">
            {MACHINE_FLOWS.map(f => (
              <div key={f.id} className="flex items-center gap-4">
                <div className="w-8 h-1" style={{ backgroundColor: f.color, backgroundImage: 'linear-gradient(to right, white 4px, transparent 4px)', backgroundSize: '8px 1px' }} />
                <span className="text-[10px] uppercase font-black text-white/80 tracking-widest">{f.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-4 border-t border-white/5 pt-3">
                <div className="w-8 h-1 bg-red-600" style={{ backgroundImage: 'linear-gradient(to right, white 4px, transparent 4px)', backgroundSize: '8px 1px' }} />
                <span className="text-[10px] uppercase font-black text-red-500 tracking-widest">Аварийная остановка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryMap;