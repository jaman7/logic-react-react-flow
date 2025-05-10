import { IModalButtonsType } from '@/shared/types/modal';
import { DataTableFilterMetaData } from 'primereact/datatable';

export type ITableIconsType = 'VIEW' | 'EDIT' | 'DELETE';

export type ITableColumnsType = 'Text' | 'DateTime' | 'Checkbox' | 'Boolean' | 'UserList';

export type MatchModeTypes = 'equals' | 'startsWith' | 'contains' | 'in' | 'notContains' | 'endsWith' | 'notEquals' | 'inputIn';

export type IColumnEditorType = 'input' | 'select' | 'checkbox';

export interface ITableColumns {
  field?: string;
  header?: string;
  type?: ITableColumnsType;
  sortField?: string;
  sortable?: boolean;
  formatDate?: string;
  customHeader?: string;
  userLogoSize?: number;
  format?: string;
  disableFilterSort?: boolean;
  filterType?: 'select' | 'input' | 'datepicker' | 'checkbox';
  editable?: boolean;
  editorType?: IColumnEditorType;
  editorValidator?: <T>(val: T, rowData: T, column?: ITableColumns, index?: number) => boolean | string;
  validatorConfig?: { maxLength?: number; regex?: RegExp; customMessage?: string };

  filter?: {
    field?: string;
    type?: 'select' | 'input' | 'datepicker' | 'checkbox';
    matchMode?: MatchModeTypes;
    options?: { label: string; value: any }[];
    placeholder?: string;
    dateTimeType?: 'month' | 'year' | 'date';
    dateTimeMode?: 'single' | 'range';
    format?: string;
  };
  customizeValue?: <T>(val: T) => T | string;
}

export interface ITableButtonAction {
  rowData?: unknown | object;
  type?: IModalButtonsType;
}

export interface ILazyState {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  sort?: { field?: string | null; order?: undefined | null | 0 | 1 | -1 };
  filters?: { [name: string]: DataTableFilterMetaData };
  page?: number;
  pageSize?: number;
}
