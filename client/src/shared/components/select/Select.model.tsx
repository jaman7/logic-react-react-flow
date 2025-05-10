export type SelectType = 'select';

export interface IDictType {
  displayName?: string;
  id?: number | string;
  [name: string]: any;
}

export interface IDictionary {
  [name: string]: IDictType[];
}

export interface ISelect {
  formControlName?: string;
  placeholder?: string;
  defaultValue?: number | string;
  dictData?: IDictType[];
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'lg';
  mode?: string;
}

export enum SelectEnum {
  SELECT = 'select',
}

export const selectConfigDefault = (): ISelect => ({
  size: 'sm',
  mode: 'default',
  placeholder: '',
  dictData: [],
});
