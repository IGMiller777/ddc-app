import { DestroyRef, inject, Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PendingService } from '@services/pending.service';

@Injectable()
export class TimerService {
  private readonly _pendingService = inject(PendingService);

  hidePending(destroyRef: DestroyRef) {
    timer(2000)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(() => {
        this._pendingService.hide();
      });
  }
}
