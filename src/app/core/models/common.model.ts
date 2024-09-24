import { TreeNode } from 'primeng/api';

export type Icon = { name: string; icon: string };

export type DragType = {
  dragNode: TreeNode;
  dropNode: TreeNode;
  index: number;
  originalEvent: DragEvent;
};
