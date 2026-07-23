import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { Contentful } from '../../core/contentful';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.html',
  styleUrl: './learn.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearnComponent implements OnInit {
  private contentful = inject(Contentful);

  articles = signal<any[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    try {
      const response = await this.contentful.getLearnArticles();
      this.articles.set(response.items);
    } catch (err) {
      this.error.set('Unable to load articles. Please try again later.');
      console.error('Contentful fetch error:', err);
    } finally {
      this.loading.set(false);
    }
  }
}
