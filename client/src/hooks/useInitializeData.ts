import { fetchDictionary$ } from '@/shared/services/dictService';
import { IThruhTableDict } from '@/shared/types/dictionaryTypes';
import { useGlobalStore } from '@/store/useGlobalStore';
import { combineLatest } from 'rxjs';

export const initializeData = () => {
  const { updateDictionary } = useGlobalStore.getState();

  const subscription = combineLatest([fetchDictionary$()]).subscribe(([thruhTableDict]) => {
    updateDictionary({
      thruhTableDict: thruhTableDict as IThruhTableDict[],
    });
  });

  return subscription;
};
