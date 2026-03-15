import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class Home {
  private titleService = inject(Title);
  private metaService = inject(Meta);

  constructor() {
    this.titleService.setTitle("J & B's Tropical Leaf Corner | Pure Soursop & Wellness Blends");
    this.metaService.updateTag({ name: 'description', content: 'Discover the natural healing benefits of 100% pure Soursop leaves and our exclusive Tropical Blend featuring Mango & Pineapple Guava.' });
  }
}
