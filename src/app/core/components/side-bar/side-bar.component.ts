import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { DataService } from '@services/data.service';
import { AsyncPipe } from '@angular/common';
import {
  TreeModule,
  TreeNodeDropEvent,
  TreeNodeSelectEvent,
} from 'primeng/tree';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { startWith, Subject, switchMap, tap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { SharedDataService } from '@services/shared-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MESSAGES } from '../../contants/messages';
import { STATUSES } from '@models/status';
import { TimerService } from '@services/timer.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [AsyncPipe, TreeModule, ButtonDirective, Button, ToastModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  providers: [TreeDragDropService, MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideBarComponent implements OnInit {
  selectedFile!: TreeNode | null;
  foldersData: TreeNode[] = [];
  private readonly _dataService = inject(DataService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _sharedDataService = inject(SharedDataService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _messageService = inject(MessageService);
  private readonly _timerService = inject(TimerService);
  private refreshTrigger$ = new Subject<void>();
  public folders$ = this.refreshTrigger$.pipe(
    startWith(undefined),
    switchMap(() => this._dataService.getTreeNodes()),
    tap(a => {
      this.foldersData = a;
    })
  );

  ngOnInit(): void {
    this._sharedDataService
      .getChangedNode()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: node => {
          if (node) {
            const x = this._dataService.changeNode(node);
            if (x) {
              this.refreshTrigger$.next();
            }
          }
        },
      });
  }

  public createFolders(): void {
    this._dataService
      .createFolders()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(r => {
        if (r) {
          this.refreshTrigger$.next();

          this._messageService.add({
            severity: STATUSES.success,
            summary: MESSAGES.errorCreateHeader,
            detail: MESSAGES.successCreate50FoldersMessage,
          });

          this._cdr.markForCheck();
        }
      });
  }

  public createFiles() {
    if (this.selectedFile?.key) {
      this._dataService
        .createFiles(this.selectedFile)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(() => {
          this._messageService.add({
            severity: STATUSES.success,
            summary: MESSAGES.errorCreateHeader,
            detail: MESSAGES.successCreate50FilesMessage,
          });
        });
    } else {
      this._messageService.add({
        severity: STATUSES.warn,
        summary: MESSAGES.errorCreateHeader,
        detail: MESSAGES.errorCreateMessage,
      });
    }
  }

  selectFile(node: TreeNodeSelectEvent): void {
    this._sharedDataService.setActiveNode(node.node);
  }

  unselectFile(): void {
    this.selectedFile = null;
    this._sharedDataService.setActiveNode(null);
  }

  handleOnNodeDrop(event: TreeNodeDropEvent): void {
    if (event?.originalEvent?.shiftKey) {
      this.refreshTrigger$.next();
    } else {
      this._dataService
        .updateTreeNodes(this.foldersData)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe(a => {
          if (a) {
            this.refreshTrigger$.next();
          }
        });
    }
  }
}
