import { Injectable } from '@angular/core';
import { createClient } from 'contentful';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Contentful {
  private client = createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.accessToken
  });

  // Fetch botanical leaf tea products (strictly tea leaves, no fruit products)
  getTeas(query?: object): Promise<any> {
    return this.client.getEntries({
      content_type: 'botanicalTeaProduct',
      ...query
    });
  }

  // Fetch educational articles
  getLearnArticles(query?: object): Promise<any> {
    return this.client.getEntries({
      content_type: 'learnArticle',
      ...query
    });
  }

  // Fetch a single tea product by its slug
  getTeaBySlug(slug: string): Promise<any> {
    return this.client.getEntries({
      content_type: 'botanicalTeaProduct',
      'fields.slug': slug,
      limit: 1
    });
  }
}
