import { ChangeDetectionStrategy, Component, signal, inject, computed, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { StripePaymentElementComponent, injectStripe, StripeElementsDirective } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { Cart } from '../../core/cart';
import { PaymentService } from '../../services/payment.service';
import confetti from 'canvas-confetti';

type CheckoutStep = 'review' | 'info' | 'payment' | 'confirmation';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, StripeElementsDirective, StripePaymentElementComponent],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  protected cart = inject(Cart);
  private paymentService = inject(PaymentService);
  private router = inject(Router);
  public stripe = injectStripe();

  // Step state
  currentStep = signal<CheckoutStep>('review');
  stepIndex = computed(() => {
    const map: Record<CheckoutStep, number> = { review: 0, info: 1, payment: 2, confirmation: 3 };
    return map[this.currentStep()];
  });

  // Customer info
  customerName = signal('');
  customerEmail = signal('');

  // Payment state
  isProcessing = signal(false);
  paymentStatus = signal<'idle' | 'processing' | 'success' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  // Stripe
  elementsOptions = signal<StripeElementsOptions>({
    locale: 'en',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#8A8C43',
        colorBackground: '#ffffff',
        colorText: '#030000',
        colorDanger: '#df1b41',
        borderRadius: '12px',
        spacingUnit: '4px',
      },
    },
  } as StripeElementsOptions);

  paymentElementOptions: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  paymentElement = viewChild(StripePaymentElementComponent);

  // Step navigation
  goToStep(step: CheckoutStep): void {
    this.errorMessage.set(null);
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  proceedToInfo(): void {
    if (!this.cart.hasItems()) {
      this.errorMessage.set('Your cart is empty. Add some teas first!');
      return;
    }
    this.goToStep('info');
  }

  proceedToPayment(): void {
    const name = this.customerName().trim();
    const email = this.customerEmail().trim();

    if (!name) {
      this.errorMessage.set('Please enter your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.errorMessage.set(null);
    this.isProcessing.set(true);

    const amountInCents = Math.round(this.cart.totalPrice() * 100);

    this.paymentService.createPaymentIntent(amountInCents, {
      customerName: name,
      customerEmail: email,
      lineItems: this.cart.getLineItemsSummary(),
    }).subscribe({
      next: (res) => {
        this.elementsOptions.set({
          ...this.elementsOptions(),
          clientSecret: res.clientSecret,
        } as StripeElementsOptions);
        this.isProcessing.set(false);
        this.goToStep('payment');
      },
      error: (err: any) => {
        console.error('PaymentIntent error:', err);
        this.errorMessage.set(err.message || 'Failed to initialize payment. Please try again.');
        this.isProcessing.set(false);
      }
    });
  }

  confirmPayment(): void {
    if (this.isProcessing()) return;
    this.isProcessing.set(true);
    this.errorMessage.set(null);

    const component = this.paymentElement();
    if (!component) {
      this.errorMessage.set('Payment form not ready. Please wait a moment.');
      this.isProcessing.set(false);
      return;
    }

    const elements = (component as any).elements;

    this.stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout',
        payment_method_data: {
          billing_details: {
            name: this.customerName(),
            email: this.customerEmail(),
          }
        }
      },
      redirect: 'if_required'
    }).subscribe({
      next: (result: any) => {
        if (result.error) {
          this.errorMessage.set(result.error.message || 'Payment failed. Please try again.');
          this.paymentStatus.set('error');
        } else if (result.paymentIntent?.status === 'succeeded') {
          this.paymentStatus.set('success');
          this.cart.clearCart();
          this.goToStep('confirmation');
          this.triggerConfetti();
        }
        this.isProcessing.set(false);
      },
      error: (err: any) => {
        console.error('Payment error:', err);
        this.errorMessage.set('An unexpected error occurred. Please try again.');
        this.paymentStatus.set('error');
        this.isProcessing.set(false);
      }
    });
  }

  // Helpers
  setName(event: Event): void {
    this.customerName.set((event.target as HTMLInputElement).value);
  }

  setEmail(event: Event): void {
    this.customerEmail.set((event.target as HTMLInputElement).value);
  }

  updateItemQty(productId: string, event: Event): void {
    const qty = parseInt((event.target as HTMLInputElement).value, 10);
    if (qty > 0) {
      this.cart.updateQuantity(productId, qty);
    }
  }

  reset(): void {
    this.currentStep.set('review');
    this.paymentStatus.set('idle');
    this.router.navigate(['/shop']);
  }

  private triggerConfetti(): void {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 60, spread: 100, origin: { y: 0.5 } }), 300);
  }
}
