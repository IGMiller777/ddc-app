import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BaseLayoutComponent } from '@components/base-layout/base-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BaseLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'drag-copy';
}
