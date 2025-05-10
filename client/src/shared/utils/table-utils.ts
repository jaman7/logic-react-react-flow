import { ILazyState, ITableColumns, ITableColumnsType } from '../components/table/table.model';

export const createTableColumnsConfig = (
  config: {
    [name: string]: ITableColumns;
  },
  params: {
    prefix?: string;
  } = {}
): ITableColumns[] => {
  const { prefix } = params || {};
  return Object.keys(config)?.map((key) => {
    const { type: colType, sortField, sortable, customHeader, userLogoSize, filterType, filter, ...rest } = config?.[key] ?? {};
    const header = customHeader ?? `${prefix ?? 'table'}.${key}`;
    const type: ITableColumnsType = colType ?? ('text' as ITableColumnsType);
    const column: ITableColumns = {
      ...rest,
      type,
      header,
      field: key,
      sortField: sortField ?? key,
      sortable: sortable !== undefined ? sortable : true,
      filter: { ...filter, type: filter?.type ?? filterType },
      customizeValue: (val) => {
        return val;
      },
    };

    return column;
  });
};

export const setTableParams = (event: ILazyState): Record<string, unknown> => {
  const tableParam: Record<string, unknown> = {};
  const { page, pageSize, sortOrder, sortBy: sortField, filters } = event;

  tableParam.page = page;
  tableParam.pageSize = pageSize;
  tableParam.sortBy = sortField ?? '';
  tableParam.sortOrder = sortOrder;

  if (filters && Object.keys(filters)?.length) {
    Object.entries(filters)?.forEach(([key, data]) => {
      const { value } = data || {};
      if (value !== null) {
        if (typeof value !== 'string' || value.length >= 1) {
          tableParam[key] = value;
        } else {
          delete tableParam[key];
        }
      } else if (tableParam[key]) {
        delete tableParam[key];
      }
    });
  }

  if (!tableParam?.sortBy || tableParam.sortBy === '') delete tableParam.sortBy;
  if (!tableParam?.sortOrder) delete tableParam.sortOrder;

  return tableParam;
};
