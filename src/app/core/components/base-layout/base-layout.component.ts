import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { EditorPanelComponent } from '../editor-panel/editor-panel.component';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PendingService } from '@services/pending.service';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { TimerService } from '@services/timer.service';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [
    EditorPanelComponent,
    SideBarComponent,
    ProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './base-layout.component.html',
  styleUrl: './base-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TimerService],
})
export class BaseLayoutComponent implements OnInit {
  private readonly _timerService = inject(TimerService);

  private readonly _pendingService = inject(PendingService);
  pending$: Observable<boolean> = this._pendingService.pending$;

  ngOnInit() {
    this._timerService.showHidePending();
  }
}
