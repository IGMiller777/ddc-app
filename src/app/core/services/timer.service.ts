import { DestroyRef, inject, Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PendingService } from '@services/pending.service';

@Injectable()
export class TimerService {
  private readonly _pendingService = inject(PendingService);

  private readonly _destroyRef = inject(DestroyRef);

  showHidePending(): void {
    this._pendingService.show();

    timer(1000)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => this._pendingService.hide());
  }
}
