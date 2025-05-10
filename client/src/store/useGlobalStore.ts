import { IDictionary } from '@/shared/components/select/Select.model';
import { create } from 'zustand';

type IGlobalState = {
  isSideBarOpen: boolean;
  isLoading: boolean;
  dictionary: IDictionary;
  updateDictionary: (data: Partial<IDictionary>) => void;
  clearStore: () => void;
  setIsSideBarOpen: () => void;
  setIsLoading: (state: boolean) => void;
};

export const useGlobalStore = create<IGlobalState>((set) => ({
  isSideBarOpen: false,
  isLoading: false,
  dictionary: {} as IDictionary,
  updateDictionary: (data) =>
    set((state) => {
      return { dictionary: { ...state.dictionary, ...data } as IDictionary };
    }),
  clearStore: () =>
    set(() => ({
      isSideBarOpen: false,
      isLoading: false,
      dictionary: {} as IDictionary,
    })),
  setIsSideBarOpen: () =>
    set((state) => {
      return { isSideBarOpen: !state.isSideBarOpen };
    }),
  setIsLoading: (state) =>
    set(() => {
      return { isLoading: state };
    }),
}));
