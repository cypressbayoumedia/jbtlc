# Phase 2: Contentful Integration & Data Binding

## 1. Environment Configuration
Antigravity CLI must inject the following Contentful credentials into the environment files (`environment.ts` and `environment.development.ts`).

```typescript
export const environment = {
  production: false,
  contentful: {
    spaceId: 'tqb515urgt7e',
    accessToken: 'cWZJFn5fHd9tlplPnOdzJeVv6wcX4Y0bHoGt9On6AAU',
  }
};
```

## 2. Dependency Installation
Run the following package installation: 
```bash
npm install contentful
```

## 3. Data Provider Setup (Modern Naming Convention)
Create a new standalone provider file named `contentful.ts` (dropping the `.service` naming convention). 

```typescript
import { Injectable } from '@angular/core';
import { createClient } from 'contentful';
import { environment } from '../environments/environment';

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
}
```

## 4. Binding Data to Existing UI (Modern Naming Convention)
Antigravity CLI must update the existing `Shop` and `Learn` files to inject the `Contentful` provider and bind the fetched data to the templates. Component suffixes must be omitted per the modern standard.

### 4.1. Update `Shop`
- **Injection:** Inject the `Contentful` provider into the `Shop` class.
- **Logic:** Call `getTeas()` during initialization to retrieve the `botanicalTeaProduct` entries. Assign the resolved items to a local signal or observable.
- **Template Binding:** Iterate over the response items. Map the `fields.productName`, `fields.price`, and `fields.primaryImage.fields.file.url` to the existing product grid layout. Ensure the UI clearly emphasizes the botanical leaf nature of the teas.

### 4.2. Update `Learn`
- **Injection:** Inject the `Contentful` provider into the `Learn` class.
- **Logic:** Call `getLearnArticles()` to retrieve `learnArticle` entries.
- **Template Binding:** Iterate over the response items to populate the educational cards. Map `fields.title`, `fields.author`, and `fields.heroImage.fields.file.url` to the existing UI elements.
