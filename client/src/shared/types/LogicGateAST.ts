import { LogicGateBinaryType } from './logic-gate';

export type LogicGateAST =
  | {
      type: LogicGateBinaryType;
      children: LogicGateAST[];
    }
  | {
      type: 'NOT';
      child: LogicGateAST;
    }
  | {
      type: 'input';
      name: string;
    }
  | { type: 'literal'; value: '0' | '1' };

export type LogicGateASTMap = Record<string, LogicGateAST>;
