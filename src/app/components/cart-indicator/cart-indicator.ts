import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart } from '../../core/cart';

@Component({
  selector: 'app-cart-indicator',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a routerLink="/checkout" class="cart-btn" aria-label="View cart" id="cart-indicator">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      @if (cart.totalItems() > 0) {
        <span class="cart-badge" [attr.aria-label]="cart.totalItems() + ' items in cart'">
          {{ cart.totalItems() > 99 ? '99+' : cart.totalItems() }}
        </span>
      }
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .cart-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      color: var(--color-black);
      transition: background var(--transition-fast), color var(--transition-fast);
      text-decoration: none;
    }

    .cart-btn:hover {
      background: rgba(138, 140, 67, 0.1);
      color: var(--color-olive);
    }

    .cart-badge {
      position: absolute;
      top: 0;
      right: -2px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      font-family: var(--font-body);
      font-size: 0.65rem;
      font-weight: 700;
      line-height: 18px;
      text-align: center;
      color: var(--color-white, #fff);
      background: var(--color-olive);
      border-radius: 9px;
      animation: badge-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes badge-pop {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
  `
})
export class CartIndicator {
  protected cart = inject(Cart);
}
