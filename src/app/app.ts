import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementBarComponent } from './components/announcement-bar/announcement-bar';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AnnouncementBarComponent, NavbarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-announcement-bar />
    <app-navbar />
    <main>
      <router-outlet />
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }

    main {
      min-height: calc(100vh - var(--nav-height) - var(--announcement-height));
    }
  `
})
export class App {}
