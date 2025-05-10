import { LogicGateType } from './logic-gate';

export interface LogicGateActivePorts {
  inputs?: boolean[];
  outputs?: boolean[];
}

export interface LogicGateNodeData {
  gateType: LogicGateType;
  inputs: string[];
  output: string;
}

export interface TempSignalMap {
  [signalName: string]: string;
}
