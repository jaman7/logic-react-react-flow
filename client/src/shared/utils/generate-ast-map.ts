import { MinimizedFunction } from '@/pages/LogicMinimizer/LogicMinimizer.model';
import { t } from 'i18next';
import { TranslationKeys } from '../enums/error-translate';
import { LogicGateASTMap } from '../types/LogicGateAST';
import { parseBooleanExpressionToTree } from './logic-expression-parser';

export const generateASTMapFromMinimizedFunctions = (logicExpFns: MinimizedFunction[]): LogicGateASTMap => {
  const astMap: LogicGateASTMap = {};

  logicExpFns?.forEach((fn) => {
    try {
      const ast = parseBooleanExpressionToTree(fn.expression);
      astMap[fn.label] = ast;
    } catch (err) {
      console.warn(t(TranslationKeys.EXPRESSION_PARSE_ERROR, { label: fn.label, error: (err as Error)?.message }));
    }
  });

  return astMap;
};
