import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Contentful } from '../../core/contentful';

@Component({
  selector: 'app-shop',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopComponent implements OnInit {
  private contentful = inject(Contentful);

  teas = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    try {
      const response = await this.contentful.getTeas();
      this.teas.set(response.items);
    } catch (err) {
      this.error.set('Unable to load products. Please try again later.');
      console.error('Contentful fetch error:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
