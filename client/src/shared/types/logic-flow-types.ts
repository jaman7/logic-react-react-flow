export interface GateNode {
  id: string;
  type: 'logicGate';
  position: { x: number; y: number };
  data: {
    gateType: 'AND' | 'OR' | 'NOT' | 'input';
    label?: string;
    inputs?: string[];
    output?: string;
  };
}

export interface GateEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
