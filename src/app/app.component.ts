import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from './core/components/side-bar/side-bar.component';
import { EditorPanelComponent } from './core/components/editor-panel/editor-panel.component';
import { BaseLayoutComponent } from './core/components/base-layout/base-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BaseLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'drag-copy';
}
