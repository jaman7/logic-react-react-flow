import HttpService from '@/core/services/http/http.service';
import { IThruhTableDict } from '@/shared/types/dictionaryTypes';
import { catchError, from, map, Observable, of } from 'rxjs';

export const fetchDictionary$ = (): Observable<IThruhTableDict[]> => {
  const http = new HttpService();
  const url = `thruhtable/dictionary`;

  return from(http.get<IThruhTableDict[]>(url, {})).pipe(
    map((response) => {
      return response ?? [];
    }),
    catchError((error) => {
      console.error('Invalid response from FMP API:', error);
      return of([]);
    })
  );
};
