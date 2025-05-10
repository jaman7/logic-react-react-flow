import { IDictionary } from '../components/select/Select.model';
import { IDictType } from '../model';

export interface IThruhTable {
  id?: number;
  input?: string;
  output?: string;
}

export interface IThruhTableDict {
  id?: number;
  displayName?: string;
  entries?: IThruhTable[];
}

export interface IDictionaries extends IDictionary {
  thruhTableDict: IThruhTableDict[];
  [name: string]: IDictType[];
}
