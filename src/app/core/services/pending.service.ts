import { Injectable } from '@angular/core';

import { map, Observable, ReplaySubject, scan } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PendingService {
  private readonly _increment$ = new ReplaySubject<number>(2);
  private readonly _counter$ = this._increment$.pipe(
    scan((prev, curr) => (prev + curr < 0 ? 0 : prev + curr), 0),
  );

  get pending$(): Observable<boolean> {
    return this._counter$.pipe(map((counter) => !!counter));
  }

  show(): void {
    this._increment$.next(1);
  }

  hide(): void {
    this._increment$.next(-1);
  }
}
