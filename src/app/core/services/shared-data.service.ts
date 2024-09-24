import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TreeNode } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class SharedDataService {
  private activeNode$ = new BehaviorSubject<TreeNode | null>(null);
  private changedNode$ = new BehaviorSubject<TreeNode | null>(null);

  setActiveNode(node: TreeNode | null): void {
    this.activeNode$.next(node);
  }

  getActiveNode(): Observable<TreeNode | null> {
    return this.activeNode$.asObservable();
  }

  setChangeNodeData(node: TreeNode): void {
    this.changedNode$.next(node);
  }

  getChangedNode(): Observable<TreeNode | null> {
    return this.changedNode$.asObservable();
  }
}
