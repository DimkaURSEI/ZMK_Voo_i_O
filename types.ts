export enum MachineStatus {
  WORK = 'В РАБОТЕ',
  IDLE = 'ПРОСТОЙ',
  REPAIR = 'РЕМОНТ'
}

export interface Operation {
  id: string;
  name: string;
  code?: string;
  description: string;
  group: string;
  groupColor: string;
  transitions: string[];
}

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  description: string;
  image: string;
  model3d?: string;
  status: MachineStatus;
  operations: string[];
  tools: string[];
  consumables: string[];
  bbox: BBox;
}

export interface MachineFlow {
  id: string;
  name: string;
  sequence: string[]; // Array of machine IDs
  color: string;
}

export interface AppState {
  selectedMachineId: string | null;
  filterOperationGroup: string | null;
  filterStatus: MachineStatus | null;
  viewMode: 'map' | 'table';
  isDrawingMode: boolean;
}