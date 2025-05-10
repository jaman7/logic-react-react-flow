import { t } from 'i18next';
import { TranslationKeys } from '../enums/error-translate';
import { LogicGateEnum, LogicGateTypeName } from '../enums/LogicGate';
import { LogicGateAST } from '../types/LogicGateAST';

const { NOT } = LogicGateEnum;
const { INPUT } = LogicGateTypeName;

export const tokenize = (expr: string): string[] => {
  const result: string[] = [];
  let i = 0;

  while (i < expr.length) {
    const char = expr[i];

    if (/[A-Z]/.test(char)) {
      result.push(char);
      i++;
    } else if (char === '0' || char === '1') {
      result.push(char);
      i++;
    } else if (char === '¬' || char === '+' || char === '·' || char === '(' || char === ')') {
      result.push(char);
      i++;
    } else {
      throw new Error(t(TranslationKeys.INVALID_CHARACTER, { char }));
    }
  }

  return result;
};

export const parseOr = (tokens: string[]): LogicGateAST => {
  const children = [parseAnd(tokens)];
  while (tokens[0] === '+') {
    tokens.shift();
    children.push(parseAnd(tokens));
  }
  return children.length === 1 ? children[0] : { type: 'OR', children };
};

export const parseAnd = (tokens: string[]): LogicGateAST => {
  const children = [parsePrimary(tokens)];
  while (tokens[0] === '·') {
    tokens.shift();
    children.push(parsePrimary(tokens));
  }
  return children.length === 1 ? children[0] : { type: 'AND', children };
};

export const parsePrimary = (tokens: string[]): LogicGateAST => {
  if (!tokens.length) throw new Error(t(TranslationKeys.UNEXPECTED_END));

  const token = tokens.shift()!;
  if (token === '0' || token === '1') {
    return {
      type: INPUT,
      name: token,
    };
  }
  if (token === '¬') {
    return { type: NOT, child: parsePrimary(tokens) };
  }
  if (token === '(') {
    const node = parseOr(tokens);
    if (tokens.shift() !== ')') throw new Error(t(TranslationKeys.EXPECTED_CLOSING_PAREN));
    return node;
  }
  if (/[A-Z]/.test(token)) {
    return { type: INPUT, name: token };
  }

  throw new Error(t(TranslationKeys.UNEXPECTED_TOKEN, { token }));
};

export const insertExplicitAnd = (expr: string): string => {
  return expr.replace(/([A-Z01])'/g, '¬$1').replace(/([A-Z01)])(?=[A-Z(¬])/g, '$1·');
};

export const parseBooleanExpressionToTree = (expr: string): LogicGateAST => {
  const cleaned = expr.replace(/\s+/g, '');
  const normalized = insertExplicitAnd(cleaned);
  const tokens = tokenize(normalized);
  const ast = parseOr(tokens);

  if (tokens.length > 0) throw new Error(t(TranslationKeys.UNEXPECTED_END, { token: tokens.join(', ') }));
  return ast;
};
