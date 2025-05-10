import { IFormElementsConfig } from '@/shared/components/formElements/FormElements.model';

export const loginConfig = (): IFormElementsConfig => ({
  email: {},
  password: { config: { formCellType: 'input-password' } },
});

export const defaultConfig = (): IFormElementsConfig => ({
  name: {},
  email: {},
  password: { config: { formCellType: 'input-password' } },
  passwordConfirm: { config: { formCellType: 'input-password' } },
});

export const defaultValues = () => ({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});

export const loginValues = () => ({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
});
