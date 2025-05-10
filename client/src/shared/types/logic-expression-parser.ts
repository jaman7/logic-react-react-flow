type LogicExpressionNode =
  | { type: 'VAR'; name: string }
  | { type: 'NOT'; child: LogicExpressionNode }
  | { type: 'AND' | 'OR'; left: LogicExpressionNode; right: LogicExpressionNode };
