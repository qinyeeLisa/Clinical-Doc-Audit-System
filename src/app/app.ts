import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  template: `
  <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  //templateUrl: './app.html',

  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ClinicalNotes');
}
