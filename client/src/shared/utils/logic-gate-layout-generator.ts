import { Edge, Node, XYPosition } from '@xyflow/react';
import { t } from 'i18next';
import { TranslationKeys } from '../enums/error-translate';
import { LogicGateEnum, LogicGateName, LogicGateTypeName } from '../enums/LogicGate';
import { LogicGateAST, LogicGateASTMap } from '../types/LogicGateAST';
import { LogicGateLayout } from '../types/LogicGateLayout';
import { isBinaryGateNode, isInputNode, isLiteralNode, isNotNode } from './logicGateFunction';

const { NOT } = LogicGateEnum;
const { A, B, Y } = LogicGateName;
const { INPUT, OUTPUT, DEFAULT } = LogicGateTypeName;
let nodeIdCounter = 0;

export const createNodeId = (prefix: string = 'node', funcIndex: number): string => {
  return `${prefix}_${funcIndex}_${nodeIdCounter++}`;
};

export const getGateX = (currentX: number, level: number): number => currentX + 250 + (level > 0 ? -100 * (level + 1) : 250 + 200 * level);

export const getSubtreeCenterY = (ast: LogicGateAST, level: number, index: number): number => {
  const spacingY = 100;

  if (isInputNode(ast) || isLiteralNode(ast)) {
    return index * spacingY;
  }

  if (isNotNode(ast)) {
    return getSubtreeCenterY(ast.child, level + 1, index);
  }

  if (isBinaryGateNode(ast)) {
    const totalHeight = getSubtreeHeight(ast);
    let childOffset = index - Math.floor(totalHeight / 2);
    const childYs =
      ast?.children?.map((child) => {
        const h = getSubtreeHeight(child);
        const midIndex = childOffset + Math.floor(h / 2);
        const y = getSubtreeCenterY(child, level + 1, midIndex);
        childOffset += h;
        return y;
      }) ?? [];

    const avgY = childYs?.reduce((a, b) => a + b, 0) / childYs?.length;
    return avgY;
  }

  return index * spacingY;
};

export const calculatePosition = (layer: number, index: number): { x: number; y: number } => {
  const spacingX = 200;
  const spacingY = 100;

  return {
    x: layer * spacingX,
    y: index * spacingY,
  };
};

export const connectEdges = (sourceId: string, targetId: string, index = 0): Edge => {
  return {
    id: `edge-${sourceId}-${targetId}-${index}`,
    source: sourceId,
    target: targetId,
  };
};

export const getPosition = (level: number, index: number): XYPosition => ({
  x: 200 * level,
  y: 100 * index,
});

export const getSubtreeHeight = (ast: LogicGateAST): number => {
  if (isInputNode(ast) || isLiteralNode(ast)) return 1;
  if (isNotNode(ast)) return getSubtreeHeight(ast.child);
  if (isBinaryGateNode(ast)) {
    return ast.children.map(getSubtreeHeight).reduce((a, b) => a + b, 0);
  }
  return 1;
};

export const getAstDepth = (ast: LogicGateAST): number => {
  if (isInputNode(ast) || isLiteralNode(ast)) return 1;
  if (isNotNode(ast)) return 1 + getAstDepth(ast.child);
  if (isBinaryGateNode(ast)) {
    return 1 + Math.max(...ast.children.map(getAstDepth));
  }
  return 1;
};

export const buildGateLayout = (
  ast: LogicGateAST,
  nodes: Node[],
  edges: Edge[],
  parentId: string,
  level: number,
  index: number,
  maxDepth: number,
  funcIndex = 0
): string => {
  const spacingX = 200;
  const currentX = level * spacingX;
  const currentY = getSubtreeCenterY(ast, level, index);

  if (isInputNode(ast)) {
    const inputId = `${INPUT}_${funcIndex}_${ast?.name}`;
    nodes.push({
      id: inputId,
      type: INPUT,
      data: { label: ast?.name },
      position: { x: 0, y: currentY },
    });

    return inputId;
  }

  if (isNotNode(ast)) {
    const childId = buildGateLayout(ast.child, nodes, edges, parentId, level + 1, index, maxDepth, funcIndex);
    const notId = createNodeId(NOT, funcIndex);
    nodes.push({
      id: notId,
      type: DEFAULT,
      data: { label: NOT, type: NOT, gateType: NOT, inputs: [A], outputs: [Y] },
      position: { x: getGateX(currentX, level), y: currentY - 100 },
    });

    edges.push({ id: `edge_${childId}_${notId}`, source: childId, target: notId, type: 'animatedSvg' });

    return notId;
  }

  if (isBinaryGateNode(ast)) {
    const gateType = ast?.type;
    const gateId = createNodeId(gateType, funcIndex);
    const inputLabels = ast.children.map((_, i) => (i === 0 ? A : B));

    nodes.push({
      id: gateId,
      type: DEFAULT,
      data: { label: ast.type, type: ast.type, gateType: ast.type, inputs: inputLabels, outputs: [Y] },
      position: { x: getGateX(currentX, level), y: currentY - 100 },
    });

    const totalHeight = getSubtreeHeight(ast);
    let childOffset = index - Math.floor(totalHeight / 2);

    ast.children.forEach((child) => {
      const childHeight = getSubtreeHeight(child);
      const childIndex = childOffset + Math.floor(childHeight / 2);
      const childId = buildGateLayout(child, nodes, edges, gateId, level + 1, childIndex, maxDepth);
      edges.push({ id: `edge_${childId}_${gateId}`, source: childId, target: gateId });
      childOffset += childHeight;
    });

    return gateId;
  }

  if (isLiteralNode(ast)) {
    const literalId = `literal_${ast.value}_${createNodeId('node', funcIndex)}`;

    nodes.push({
      id: literalId,
      type: INPUT,
      data: { label: ast.value },
      position: { x: 0, y: currentY },
    });
    return literalId;
  }

  throw new Error(t(TranslationKeys.UNSUPORTED_AST, { type: (ast as any).type }));
};

export const generateLayoutFromAST = (ast: LogicGateAST, outputName: string, xOffset = 0, yOffset = 0, funcIndex = 0): LogicGateLayout => {
  nodeIdCounter = 0;

  if (isInputNode(ast)) {
    const inputNodeId = `${INPUT}_${funcIndex}_${ast.name}`;
    const outputNodeId = `${OUTPUT}_${funcIndex}_${outputName}`;
    const depth = getAstDepth(ast);

    const inputNode: Node = {
      id: inputNodeId,
      type: INPUT,
      data: { label: ast.name },
      position: {
        x: xOffset,
        y: yOffset,
      },
    };

    const outputNode: Node = {
      id: outputNodeId,
      type: OUTPUT,
      data: { label: outputName },
      position: {
        x: xOffset + depth * 200,
        y: yOffset,
      },
    };

    const edge: Edge = {
      id: `edge_${inputNodeId}_${outputNodeId}`,
      source: inputNodeId,
      target: outputNodeId,
      sourceHandle: OUTPUT,
      targetHandle: INPUT,
      type: 'animatedSvg',
      style: {
        strokeWidth: 2,
        stroke: '#FF0072',
      },
    };

    return {
      nodes: [inputNode, outputNode],
      edges: [edge],
    };
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const outputNodeId = `${OUTPUT}_${funcIndex}_${outputName}`;
  const maxDepth = getAstDepth(ast);
  const outputNode: Node = {
    id: outputNodeId,
    type: OUTPUT,
    data: { label: outputName },
    position: { x: maxDepth * 200 + xOffset + 50, y: yOffset },
  };

  const rootId = buildGateLayout(ast, nodes, edges, outputNodeId, 0, 0, maxDepth, funcIndex);

  edges.push({ id: `edge_${rootId}_${outputNodeId}`, source: rootId, target: outputNodeId });
  nodes.push(outputNode);

  return { nodes, edges };
};

export const generateLayoutForAllOutputs = (astMap: LogicGateASTMap): LogicGateLayout => {
  const combinedLayout: LogicGateLayout = { nodes: [], edges: [] };
  const yOffsetStep = 300;

  let index = 0;
  for (const [outputName, ast] of Object.entries(astMap)) {
    const offsetY = index * yOffsetStep;
    const layout = generateLayoutFromAST(ast, outputName, 0, offsetY, index);

    combinedLayout.nodes.push(...layout.nodes);
    combinedLayout.edges.push(...layout.edges);

    index++;
  }

  return combinedLayout;
};
