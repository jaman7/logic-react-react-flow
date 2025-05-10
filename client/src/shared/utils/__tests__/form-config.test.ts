import { IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';
import { createConfigForm } from '../form-config';

describe('createConfigForm', () => {
  const baseConfig: IFormElementsConfig = {
    name: {
      config: {
        formCellType: 'input-text',
        header: 'Custom Name',
        placeholder: 'Enter name',
        value: 'John',
      },
    },
    age: {
      config: {
        formCellType: 'input-number',
        value: 30,
      },
    },
    description: {
      config: {
        formCellType: 'text-value',
        value: 'readonly field',
      },
    },
  };

  it('should generate correct config form with prefix', () => {
    const form = createConfigForm(baseConfig, { prefix: 'form' });

    expect(form).toHaveLength(3);

    expect(form[0]).toEqual({
      formControlName: 'name',
      type: 'text',
      config: {
        formCellType: 'input-text',
        header: 'Custom Name',
        placeholder: 'Enter name',
        value: 'John',
        prefix: 'form',
        type: 'text',
        dictData: [],
        dictName: 'name',
      },
    });

    expect(form[1].formControlName).toBe('age');
    expect(form[1]?.type).toBe('number');
    expect(form[1]?.config?.header).toBe('form.age');
    expect(form[1]?.config?.placeholder).toBe('form.age');

    expect(form[2].formControlName).toBe('description');
    expect(form[2].type).toBeUndefined(); // because formCellType is 'text-value'
    expect(form[2].config?.header).toBe('');
  });

  it('should handle missing config safely', () => {
    const emptyConfig = {
      empty: {} as any,
    };
    const result = createConfigForm(emptyConfig, { prefix: 'test' });
    expect(result[0].formControlName).toBe('empty');
    expect(result[0].config?.prefix).toBe('test');
  });
});
