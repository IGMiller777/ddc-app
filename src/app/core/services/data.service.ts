import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NODES_DATA } from '@data/data';
import { TreeNode } from 'primeng/api';
import generateGUID from '@helpers/generate-guid';
import generateRandomLabel from '@helpers/generate-label';
import findNodeByKey from '@helpers/find-node';

@Injectable({ providedIn: 'root' })
export class DataService {
  public getTreeNodes(): Observable<TreeNode[]> {
    return of([...NODES_DATA]);
  }

  updateTreeNodes(data: TreeNode[]): Observable<boolean> {
    return new Observable(o => {
      NODES_DATA.length = 0;
      data.forEach(a => NODES_DATA.push(a));
      o.next(true);

      o.complete();
    });
  }

  createFolders(): Observable<boolean> {
    return new Observable(observer => {
      for (let i = 0; i <= 50; i++) {
        const newFolder = {
          key: generateGUID(),
          icon: 'pi pi-inbox',
          ...generateRandomLabel(),
        };

        NODES_DATA.push(newFolder);
      }

      observer.next(true);
      observer.complete();
    });
  }

  public createFiles(node: TreeNode): Observable<boolean> {
    return new Observable(observer => {
      const files = [];

      for (let i = 0; i <= 50; i++) {
        const newFolder = {
          key: generateGUID(),
          icon: 'pi pi-check-circle',
          ...generateRandomLabel(),
        };

        files.push(newFolder);
      }
      node.children = files;

      observer.next(true);
      observer.complete();
    });
  }

  public changeNode(node: TreeNode): boolean {
    if (node?.key) {
      const currentNode = findNodeByKey(NODES_DATA, node?.key);
      if (currentNode) {
        currentNode.label = node.label;
        currentNode.icon = node.icon;

        return true;
      }
    }

    return false;
  }
}
