import { ITableColumns } from '@/shared/components/table/table.model';
import { BinaryInputMode } from '@/shared/enums/binary-input-mode';
import { BinaryInputModeType } from '@/shared/types/binary-input';
import { TruthTableRow } from '@/shared/types/truth-table';
import { create } from 'zustand';
import { IFormPanelValues } from '../components/InputsSettings/InputsSettings.model';
import { formDefault } from '../LogicMinimizer.config';

const { MANUAL } = BinaryInputMode;

type LogicMinimizerState = {
  formValues: IFormPanelValues;
  tableColumns: ITableColumns[];
  tableData: TruthTableRow[];
  currentMode: BinaryInputModeType;
  updateFormValues: (data: Partial<IFormPanelValues>) => void;
  updateTableColumns: (data: ITableColumns[]) => void;
  updateTableData: (data: TruthTableRow[]) => void;
  updateModeChange: (mode: BinaryInputModeType) => void;
};

export const useLogicMinimizerStore = create<LogicMinimizerState>((set) => ({
  formValues: formDefault,
  tableColumns: [],
  tableData: [],
  currentMode: MANUAL,
  updateFormValues: (data) =>
    set((state) => {
      if (JSON.stringify(state.formValues) === JSON.stringify({ ...state.formValues, ...data })) {
        return state;
      }
      return { formValues: { ...state.formValues, ...data } };
    }),
  updateTableColumns: (data) => set({ tableColumns: data }),
  updateTableData: (data) => set({ tableData: data }),
  updateModeChange: (data) => set({ currentMode: data }),
}));
