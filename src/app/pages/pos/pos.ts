import { Component, ChangeDetectionStrategy, signal, inject, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripePaymentElementComponent, injectStripe, StripeElementsDirective } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';
import confetti from 'canvas-confetti';

@Component({
    selector: 'app-pos',
    imports: [CommonModule, StripeElementsDirective, StripePaymentElementComponent],
    templateUrl: './pos.html',
    styleUrl: './pos.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosComponent {
    private paymentService = inject(PaymentService);
    public stripe = injectStripe(); // Made public for template access

    // State
    products = [
        { id: 'soursop', name: 'Soursop Leaves', description: 'Fresh, organic Soursop leaves.', price: 15, image: 'assets/products/soursop-leaves.png' },
        { id: 'tropical', name: 'Tropical Blend', description: 'Includes Soursop, Mango, and Pineapple Guava.', price: 25, image: 'assets/products/tropical-blend.png' }
    ];

    selectedProduct = signal<{ id: string, name: string, description: string, price: number } | null>(null);
    quantity = signal<number>(1);
    customerName = signal<string>('');
    customerEmail = signal<string>('');

    amount = computed(() => {
        const product = this.selectedProduct();
        return product ? product.price * this.quantity() : 0;
    });

    isProcessing = signal(false);
    isPaymentElementVisible = signal(false);
    paymentStatus = signal<'idle' | 'processing' | 'success' | 'error'>('idle');

    // Stripe
    elementsOptions = signal<StripeElementsOptions>({
        locale: 'en',
        appearance: {
            theme: 'stripe',
            variables: {
                colorPrimary: '#0071e3', // Apple Blue
                colorBackground: '#ffffff',
                colorText: '#1d1d1f',
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

    selectProduct(product: any) {
        if (this.isProcessing()) return;

        this.selectedProduct.set(product);
        this.quantity.set(1);
    }

    incrementQuantity() {
        this.quantity.update(q => q + 1);
    }

    decrementQuantity() {
        this.quantity.update(q => (q > 1 ? q - 1 : 1));
    }

    // Setters for template binding
    setName(event: Event) {
        this.customerName.set((event.target as HTMLInputElement).value);
    }

    setEmail(event: Event) {
        this.customerEmail.set((event.target as HTMLInputElement).value);
    }

    // Start Transaction (manual trigger)
    startCheckout() {
        this.isProcessing.set(true);

        // Create PaymentIntent via Service (initially without customer details)
        this.paymentService.createPaymentIntent(this.amount() * 100, {
            customerName: '',
            customerEmail: ''
        }).subscribe({
            next: (res) => {
                this.elementsOptions.set({
                    ...this.elementsOptions(),
                    clientSecret: res.clientSecret,
                } as StripeElementsOptions);
                this.isPaymentElementVisible.set(true);
                this.isProcessing.set(false);
            },
            error: (err: any) => {
                console.error(err);
                this.isProcessing.set(false);
                alert(err.message || 'Failed to initialize payment.');
            }
        });
    }

    // Confirm Payment
    confirmPayment() {
        if (this.isProcessing()) return;

        if (!this.customerName() || !this.customerEmail()) {
            alert('Please enter your Name and Email to complete the specific purchase.');
            return;
        }

        this.isProcessing.set(true);
        const component = this.paymentElement();

        if (!component) {
            console.error('Payment Element not found');
            this.isProcessing.set(false);
            return;
        }

        // Access elements from the component. 
        const elements = (component as any).elements;

        this.stripe.confirmPayment({
            elements: elements,
            confirmParams: {
                return_url: window.location.href,
                payment_method_data: {
                    billing_details: {
                        name: this.customerName(),
                        email: this.customerEmail()
                    }
                }
            },
            redirect: 'if_required'
        }).subscribe({
            next: (result: any) => {
                if (result.error) {
                    console.error(result.error);
                    this.paymentStatus.set('error');
                } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    this.paymentStatus.set('success');
                    this.triggerConfetti();
                }
                this.isProcessing.set(false);
            },
            error: (err: any) => {
                console.error(err);
                this.paymentStatus.set('error');
                this.isProcessing.set(false);
            }
        });
    }

    reset() {
        this.selectedProduct.set(null);
        this.isPaymentElementVisible.set(false);
        this.paymentStatus.set('idle');
    }

    triggerConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
