import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Contentful } from '../../../core/contentful';
import { Cart } from '../../../core/cart';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private contentful = inject(Contentful);
  private cart = inject(Cart);

  product = signal<any>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  quantity = signal(1);
  addedToCart = signal(false);

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.error.set('Product not found.');
      this.loading.set(false);
      return;
    }

    try {
      const response = await this.contentful.getTeaBySlug(slug);
      if (response.items.length > 0) {
        this.product.set(response.items[0]);
      } else {
        this.error.set('Product not found. It may no longer be available.');
      }
    } catch (err) {
      this.error.set('Unable to load this product. It may no longer be available.');
      console.error('Contentful fetch error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  renderRichText(document: any): string {
    if (!document || typeof document !== 'object' || !document.nodeType) {
      return typeof document === 'string' ? document : '';
    }
    return documentToHtmlString(document);
  }

  incrementQuantity(): void {
    this.quantity.update(q => q + 1);
  }

  decrementQuantity(): void {
    this.quantity.update(q => (q > 1 ? q - 1 : 1));
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;

    const imageUrl = p.fields['primaryImage']?.fields?.['file']?.['url']
      ? 'https:' + p.fields['primaryImage'].fields['file']['url']
      : null;

    this.cart.addItem({
      productId: p.sys.id,
      slug: p.fields['slug'] || '',
      name: p.fields['productName'] || 'Tea Product',
      price: p.fields['price'] || 0,
      imageUrl,
    }, this.quantity());

    // Show "Added!" feedback briefly
    this.addedToCart.set(true);
    setTimeout(() => this.addedToCart.set(false), 2000);
  }
}
