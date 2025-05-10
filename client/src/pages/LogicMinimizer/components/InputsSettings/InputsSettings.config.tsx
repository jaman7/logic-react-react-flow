import { IFormElementsConfig, IFormElementsEnum } from '@/shared/components/formElements/FormElements.model';

const { RANGE, SELECT } = IFormElementsEnum;

export const formConfig: IFormElementsConfig = {
  inputs: { config: { formCellType: RANGE, max: 4, min: 1 } },
  outputs: { config: { formCellType: RANGE, max: 4, min: 1 } },
  thruhTable: {
    config: { formCellType: SELECT, dictName: 'thruhTableDict', size: 'xs' },
  },
};
