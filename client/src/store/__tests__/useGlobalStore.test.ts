import { IDictionary } from '@/shared/components/select/Select.model';
import { useGlobalStore } from '../useGlobalStore';

describe('useGlobalStore', () => {
  beforeEach(() => {
    useGlobalStore.setState({
      isSideBarOpen: false,
      isLoading: false,
      dictionary: {},
    });
  });

  it('should toggle isSideBarOpen', () => {
    expect(useGlobalStore.getState().isSideBarOpen).toBe(false);

    useGlobalStore.getState().setIsSideBarOpen();
    expect(useGlobalStore.getState().isSideBarOpen).toBe(true);

    useGlobalStore.getState().setIsSideBarOpen();
    expect(useGlobalStore.getState().isSideBarOpen).toBe(false);
  });

  it('should set isLoading to true', () => {
    expect(useGlobalStore.getState().isLoading).toBe(false);

    useGlobalStore.getState().setIsLoading(true);
    expect(useGlobalStore.getState().isLoading).toBe(true);
  });

  it('should update dictionary with partial data', () => {
    const partialDict: IDictionary = { myKey: [{ id: 1, displayName: 'dickt' }] };
    useGlobalStore.getState().updateDictionary(partialDict);
    expect(useGlobalStore.getState().dictionary).toEqual(partialDict);
  });

  it('should merge dictionary updates', () => {
    const initial = { a: [{ id: 1, displayName: 'x' }] };
    const update = { b: [{ id: 1, displayName: 'y' }] };

    useGlobalStore.getState().updateDictionary(initial);
    useGlobalStore.getState().updateDictionary(update);

    expect(useGlobalStore.getState().dictionary).toEqual({
      a: [{ id: 1, displayName: 'x' }],
      b: [{ id: 1, displayName: 'y' }],
    });
  });

  it('should clear store to default values', () => {
    useGlobalStore.setState({
      isSideBarOpen: true,
      isLoading: true,
      dictionary: { a: [{ id: 1, displayName: 'z' }] },
    });

    useGlobalStore.getState().clearStore();

    const { isSideBarOpen, isLoading, dictionary } = useGlobalStore.getState();

    expect({ isSideBarOpen, isLoading, dictionary }).toEqual({
      isSideBarOpen: false,
      isLoading: false,
      dictionary: {},
    });
  });
});
