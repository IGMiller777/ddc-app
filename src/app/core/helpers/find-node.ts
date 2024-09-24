import { TreeNode } from 'primeng/api';

export default function findNodeByKey(
  tree: TreeNode[],
  key: string
): TreeNode | null {
  for (const node of tree) {
    if (node.key === key) {
      return node;
    }

    if (node.children && node.children.length > 0) {
      const foundNode = findNodeByKey(node.children, key);
      if (foundNode) {
        return foundNode;
      }
    }
  }

  return null;
}
