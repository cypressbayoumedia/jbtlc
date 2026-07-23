import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class Cart {
  /** All items currently in the cart */
  readonly items = signal<CartItem[]>(this.loadFromStorage());

  /** Total number of individual items (sum of quantities) */
  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  /** Total price in dollars */
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  /** Whether the cart has any items */
  readonly hasItems = computed(() => this.items().length > 0);

  constructor() {
    // Persist to localStorage whenever items change
    effect(() => {
      const items = this.items();
      try {
        localStorage.setItem('jbtlc_cart', JSON.stringify(items));
      } catch {
        // localStorage may be unavailable (SSR, private mode)
      }
    });
  }

  addItem(product: Omit<CartItem, 'quantity'>, quantity = 1): void {
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.productId);
      if (existing) {
        return items.map(i =>
          i.productId === product.productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...items, { ...product, quantity }];
    });
  }

  removeItem(productId: string): void {
    this.items.update(items => items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  }

  clearCart(): void {
    this.items.set([]);
  }

  /** Get line items summary for Stripe metadata */
  getLineItemsSummary(): { name: string; qty: number; price: number }[] {
    return this.items().map(i => ({
      name: i.name,
      qty: i.quantity,
      price: i.price,
    }));
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem('jbtlc_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
