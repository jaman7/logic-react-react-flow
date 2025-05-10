import { InputTypes } from './input.types';

export interface IInput {
  type?: InputTypes;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disableBtnNumbers?: boolean;
  disabled?: boolean;
  value?: string | number;
  size?: 'xs' | 'sm' | 'lg';
}

export const inputConfigDefault = (): IInput => ({
  size: 'sm',
  placeholder: '',
  step: 1,
  type: 'text',
  disableBtnNumbers: false,
});
