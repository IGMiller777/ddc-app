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
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';
import { MessageService, TreeDragDropService, TreeNode } from 'primeng/api';
import { Button, ButtonDirective } from 'primeng/button';
import { startWith, Subject, switchMap, tap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { SharedDataService } from '@services/shared-data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private refreshTrigger$ = new Subject<void>();
  public folders$ = this.refreshTrigger$.pipe(
    startWith(undefined),
    switchMap(() => this._dataService.getTreeNodes()),
    tap(a => {
      this.foldersData = a;
    })
  );

  ngOnInit() {
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

  public createFolders() {
    this._dataService
      .createFolders()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(r => {
        if (r) {
          this.refreshTrigger$.next();
          this._messageService.add({
            severity: 'success',
            summary: 'Успешно!',
            detail: '50 папок успешно создано!',
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
        .subscribe();
    } else {
      this._messageService.add({
        severity: 'warn',
        summary: 'Ошибка создания',
        detail:
          'Для того, чтобы создать 50 элементов, выберите папку, в которой нужно их создать',
      });
    }
  }

  selectFile(node: TreeNodeSelectEvent) {
    this._sharedDataService.setActiveNode(node.node);
  }

  unselectFile(): void {
    this.selectedFile = null;
    this._sharedDataService.setActiveNode(null);
  }

  handleOnNodeDrop(event: any) {
    if (event.originalEvent.shiftKey) {
      //   TODO - Copy
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
