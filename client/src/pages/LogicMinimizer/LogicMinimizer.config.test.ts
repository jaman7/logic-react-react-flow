import { generateTableConfig } from './LogicMinimizer.config';
import { LogicMinimizerTranslate } from './LogicMinimizer.enum';

describe('generateTableConfig', () => {
  const mockT = (key: string, options?: any) => {
    if (key === LogicMinimizerTranslate.INVALIDBINARY) {
      return `Invalid binary - expected ${options.bits} bits`;
    }
    if (key === LogicMinimizerTranslate.INVALIDLENGTH) {
      return `Invalid length - expected ${options.maxLength} bits`;
    }
    if (key === LogicMinimizerTranslate.REQUIRED) {
      return `Value is required`;
    }
    return key;
  };

  it('should generate config with correct input validator', () => {
    const config = generateTableConfig(3, 2, mockT);

    expect(config.input).toBeDefined();
    const validator = config.input.editorValidator;

    expect(validator?.('101', '', config.input)).toBe(true);
    expect(validator?.('', '', config.input)).toBe('Value is required');
    expect(validator?.('102', '', config.input)).toBe('Invalid binary - expected 3 bits');
    expect(validator?.('10', '', config.input)).toBe('Invalid length - expected 3 bits');
  });

  it('should generate config with correct output validator', () => {
    const config = generateTableConfig(3, 2, mockT);
    const validator = config.output.editorValidator;

    expect(validator?.('01', '', config.output)).toBe(true);
    expect(validator?.('2', '', config.output)).toBe('Invalid binary - expected 2 bits');
    expect(validator?.('1', '', config.output)).toBe('Invalid length - expected 2 bits');
  });
});
