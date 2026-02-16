
import React, { useState, useRef, useEffect } from 'react';
import { Machine, MachineStatus, BBox } from '../types';
import { STATUS_COLORS, OPERATIONS, OPERATION_GROUPS } from '../constants';

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

  // Конвертация экранных координат в координаты SVG (0-1200 x 0-800)
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

    if (width > 5 && height > 5) {
      onNewBox({ x, y, width, height });
    }
    setDrawing(null);
  };

  // Используем переименованный файл 'ww.jpg'
  // Путь './ww.jpg' обычно работает лучше для локальных ресурсов
  const workshopImageUrl = "ww.jpg";

  return (
    <div className={`relative w-full h-full bg-[#050505] overflow-hidden ${isDrawingMode ? 'cursor-crosshair' : 'cursor-default'}`}>
      
      {/* Сетка разметки (Blueprint style) - на самом заднем плане */}
      <div className="absolute inset-0 pointer-events-none opacity-5" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
             backgroundSize: '50px 50px'
           }} 
      />

      {/* Подложка цеха */}
      <div 
        className="absolute inset-0 bg-contain bg-no-repeat bg-center transition-all duration-1000 z-0"
        style={{ 
          backgroundImage: `url("${workshopImageUrl}")`,
          filter: isDrawingMode ? 'none' : 'grayscale(0.6) brightness(0.7)'
        }}
      />
      
      {/* SVG Слой для интерактивности и отрисовки рамок */}
      <svg 
        ref={svgRef}
        viewBox="0 0 1200 800" 
        className="absolute inset-0 w-full h-full z-10"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Существующие станки */}
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
              onClick={(e) => {
                e.stopPropagation();
                if (!isDrawingMode) onSelect(machine.id);
              }}
            >
              {/* Прозрачная область для клика, чуть шире BBOX */}
              <rect
                x={machine.bbox.x - 5} y={machine.bbox.y - 5}
                width={machine.bbox.width + 10} height={machine.bbox.height + 10}
                fill="transparent"
              />

              {/* Основной BBOX */}
              <rect
                x={machine.bbox.x} y={machine.bbox.y}
                width={machine.bbox.width} height={machine.bbox.height}
                fill={isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
                stroke={isSelected ? '#fff' : primaryColor}
                strokeWidth={isSelected ? 3 : 1.5}
                className="machine-glow"
              />

              {/* Метка типа операции */}
              <rect 
                x={machine.bbox.x} y={machine.bbox.y} 
                width="24" height="24" 
                fill={primaryColor} 
                fillOpacity="0.8"
              />
              <text x={machine.bbox.x + 12} y={machine.bbox.y + 16} textAnchor="middle" fontSize="12" fill="white" className="select-none">
                {OPERATION_GROUPS[primaryGroup as keyof typeof OPERATION_GROUPS]?.icon}
              </text>

              {/* Название станка */}
              <g>
                <rect 
                  x={machine.bbox.x} y={machine.bbox.y - 20} 
                  width={Math.min(machine.bbox.width, 160)} height="20" 
                  fill="rgba(0,0,0,0.8)" 
                />
                <text 
                  x={machine.bbox.x + 6} y={machine.bbox.y - 6} 
                  fill="#fff" fontSize="9" 
                  className="font-bold uppercase tracking-widest select-none"
                >
                  {machine.name}
                </text>
              </g>

              {/* Индикатор статуса */}
              <circle 
                cx={machine.bbox.x + machine.bbox.width - 12} 
                cy={machine.bbox.y + 12} 
                r="4" 
                fill={STATUS_COLORS[machine.status as keyof typeof STATUS_COLORS]} 
              />
              
              {/* Декоративные уголки */}
              <path d={`M ${machine.bbox.x} ${machine.bbox.y + 10} L ${machine.bbox.x} ${machine.bbox.y} L ${machine.bbox.x + 10} ${machine.bbox.y}`} fill="none" stroke="white" strokeWidth="0.5" />
              <path d={`M ${machine.bbox.x + machine.bbox.width - 10} ${machine.bbox.y + machine.bbox.height} L ${machine.bbox.x + machine.bbox.width} ${machine.bbox.y + machine.bbox.height} L ${machine.bbox.x + machine.bbox.width} ${machine.bbox.y + machine.bbox.height - 10}`} fill="none" stroke="white" strokeWidth="0.5" />
            </g>
          );
        })}

        {/* Отрисовка текущей рамки при разметке */}
        {drawing && (
          <g>
            <rect
              x={Math.min(drawing.startX, drawing.currentX)}
              y={Math.min(drawing.startY, drawing.currentY)}
              width={Math.abs(drawing.currentX - drawing.startX)}
              height={Math.abs(drawing.currentY - drawing.startY)}
              fill="rgba(255,255,255,0.1)"
              stroke="#fff"
              strokeWidth="1"
              strokeDasharray="5 5"
            />
          </g>
        )}
      </svg>

      {/* Индикация режима */}
      {isDrawingMode && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white text-black px-8 py-3 rounded border-2 border-black font-black text-[10px] uppercase tracking-[0.3em] shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] z-20">
          Режим разметки активен: Выделите область на фото
        </div>
      )}

      {/* Легенда */}
      <div className="absolute bottom-8 right-8 pointer-events-none z-20">
        <div className="bg-black/90 backdrop-blur-md border border-white/10 p-6 rounded shadow-2xl">
          <h4 className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] mb-4 border-b border-white/10 pb-2">Группы операций</h4>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(OPERATION_GROUPS).map(([key, group]) => (
              <div key={key} className="flex items-center gap-4">
                <span className="text-sm grayscale opacity-50">{group.icon}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: group.color }} />
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider whitespace-nowrap">{group.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryMap;
