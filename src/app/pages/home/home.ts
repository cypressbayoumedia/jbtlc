import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero';

@Component({
  selector: 'app-home',
  imports: [HeroComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
  `,
  styles: `
    :host {
      display: block;
    }
  `
})
export class Home {}
