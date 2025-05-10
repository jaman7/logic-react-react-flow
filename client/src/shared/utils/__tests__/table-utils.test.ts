import { ILazyState, ITableColumns } from '@/shared/components/table/table.model';
import { createTableColumnsConfig, setTableParams } from '../table-utils';

describe('createTableColumnsConfig', () => {
  it('should create column config with default prefix and values', () => {
    const config: { [name: string]: ITableColumns } = {
      name: {
        editable: true,
        editorType: 'input',
        validatorConfig: {},
      },
    };

    const result = createTableColumnsConfig(config, { prefix: 'test' });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      editable: true,
      editorType: 'input',
      field: 'name',
      header: 'test.name',
      sortable: true,
      type: 'text',
      filter: { type: undefined },
    });
  });

  it('should use customHeader if provided', () => {
    const config: { [name: string]: ITableColumns } = {
      age: {
        editable: false,
        editorType: 'input',
        validatorConfig: {},
        customHeader: 'custom.age.header',
      },
    };

    const result = createTableColumnsConfig(config);
    expect(result[0].header).toBe('custom.age.header');
  });
});

describe('setTableParams', () => {
  it('should return correct params with filters and sorting', () => {
    const event: unknown = {
      page: 2,
      pageSize: 25,
      sortOrder: 1,
      sortBy: 'email',
      filters: {
        email: { value: 'test@example.com' },
        status: { value: 'active' },
      },
    };

    const result = setTableParams(event as ILazyState);
    expect(result).toEqual({
      page: 2,
      pageSize: 25,
      sortBy: 'email',
      sortOrder: 1,
      email: 'test@example.com',
      status: 'active',
    });
  });

  it('should omit empty or invalid filters', () => {
    const event: unknown = {
      page: 1,
      pageSize: 10,
      sortOrder: null,
      sortBy: '',
      filters: {
        name: { value: '' },
        age: { value: null },
        city: { value: 'Paris' },
      },
    };

    const result = setTableParams(event as ILazyState);
    expect(result).toEqual({
      page: 1,
      pageSize: 10,
      city: 'Paris',
    });
  });
});
