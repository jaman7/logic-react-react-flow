import { LogicGateAST } from '@/shared/types/LogicGateAST';
import { generateLayoutFromAST } from '../logic-gate-layout-generator';

test('generates layout for AST with AND', () => {
  const ast: LogicGateAST = {
    type: 'AND',
    children: [
      { type: 'input', name: 'A' },
      { type: 'input', name: 'B' },
    ],
  };

  const layout = generateLayoutFromAST(ast, 'Y');
  expect(layout.nodes.length).toBeGreaterThan(0);
  expect(layout.edges.length).toBeGreaterThan(0);
});
