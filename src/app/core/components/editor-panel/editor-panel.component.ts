import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { SharedDataService } from '@services/shared-data.service';
import { MessageService, TreeNode } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';
import { ICONS } from '@data/icons';
import { ToastModule } from 'primeng/toast';
import { STATUSES } from '@models/status';
import { MESSAGES } from '../../contants/messages';

@Component({
  selector: 'app-editor-panel',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    DropdownModule,
    Button,
    ToastModule,
  ],
  templateUrl: './editor-panel.component.html',
  styleUrl: './editor-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class EditorPanelComponent implements OnInit {
  activeNode$ = new BehaviorSubject<TreeNode | null>(null);
  readonly icons = ICONS;

  readonly form = new FormGroup({
    label: new FormControl<string | null>(null, [Validators.required]),
    icon: new FormControl<string | null>(null, [Validators.required]),
  });
  private readonly _sharedDataService = inject(SharedDataService);

  private readonly _messageService = inject(MessageService);

  ngOnInit(): void {
    this._sharedDataService.getActiveNode().subscribe({
      next: (node: TreeNode | null) => {
        if (node) {
          this.form.patchValue({
            label: node.label,
            icon: node.icon,
          });
        }
        this.activeNode$.next(node);
      },
    });
  }

  saveData(): void {
    const formData = this.form.getRawValue();
    const formattedNode = {
      ...this.activeNode$.value,
      label: formData.label,
      icon: formData.icon,
    } as TreeNode;

    this._sharedDataService.setChangeNodeData(formattedNode);

    this._messageService.add({
      severity: STATUSES.success,
      summary: MESSAGES.successCreateHeader,
      detail: MESSAGES.successEditFileMessage,
    });
  }
}
