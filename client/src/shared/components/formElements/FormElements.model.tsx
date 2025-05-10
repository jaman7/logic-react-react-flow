import { IInput } from '../input/input.model';
import { InputTypes } from '../input/input.types';
import { IDictType, ISelect } from '../select/Select.model';

export type IFormElementsTypes =
  | 'select'
  | 'text'
  | 'number'
  | 'search'
  | 'password'
  | 'range'
  | 'input-text'
  | 'input-number'
  | 'input-search'
  | 'input-password'
  | 'input-range'
  | 'textarea'
  | 'text-value';

export enum IFormElementsEnum {
  SELECT = 'select',
  TEXTAREA = 'textarea',
  TEXT = 'input-text',
  NUMBER = 'input-number',
  SEARCH = 'input-search',
  PASSWORD = 'input-password',
  RANGE = 'input-range',
  TEXT_VALUE = 'text-value',
}

export type IFormElements = Omit<ISelect & IInput, 'type'> & {
  formControlName?: string;
  header?: string;
  isNoHeader?: boolean;
  iconComponent?: React.JSX.Element;
  disabled?: boolean;
  formCellType?: IFormElementsTypes;
  value?: string | number | string[] | number[] | null;
  type?: InputTypes;
  hidden?: boolean;
  styleClass?: string;
  valueStyleClass?: string;
  prefix?: string;
  placeholder?: string;
  name?: string;
  max?: number;
  min?: number;
  step?: number;
  rows?: number;
  cols?: number;
  dictName?: string;
  dictData?: IDictType[];
  config?: IFormElements;
  defaultValue?: number | string;
  size?: 'xs' | 'sm' | 'lg';
  mode?: string;
};

export interface IFormElementsConfig {
  [name: string]: IFormElements;
}

export const FormCellConfigDefault = (): IFormElements => ({
  isNoHeader: false,
  step: 1,
  type: 'text',
});
