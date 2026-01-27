import { Component, ChangeDetectionStrategy, signal, inject, computed, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripePaymentElementComponent, injectStripe, StripeElementsDirective } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';
import confetti from 'canvas-confetti';

@Component({
    selector: 'app-pos',
    standalone: true,
    imports: [CommonModule, StripeElementsDirective, StripePaymentElementComponent],
    templateUrl: './pos.html',
    styleUrl: './pos.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PosComponent {
    private paymentService = inject(PaymentService);
    public stripe = injectStripe(); // Made public for template access

    // State
    amountInput = signal<string>('');
    customerName = signal<string>('');
    customerEmail = signal<string>('');

    amount = computed(() => {
        const val = parseFloat(this.amountInput());
        return isNaN(val) ? 0 : val;
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

    // NOTE: For "NFC" or "Contactless" payments in this web app, 
    // we rely on the Digital Wallets (Apple Pay / Google Pay) 
    // which are automatically handled by the Payment Element 
    // if the user's device supports it. 
    // Browsers do not grant direct access to NFC hardware for raw card reading.

    paymentElementOptions: StripePaymentElementOptions = {
        layout: 'tabs',
    };

    // ViewChild for Stripe Payment Element Component
    // Using explicit type or any to avoid property access issues
    paymentElement = viewChild(StripePaymentElementComponent);

    // Keypad Logic
    onKeypadClick(key: string) {
        if (this.isPaymentElementVisible()) return;

        const current = this.amountInput();

        if (key === 'C') {
            this.amountInput.set('');
        } else if (key === 'backspace') {
            this.amountInput.set(current.slice(0, -1));
        } else if (key === '.') {
            if (!current.includes('.')) {
                this.amountInput.set(current + '.');
            }
        } else {
            // Limit to 2 decimal places
            const parts = current.split('.');
            if (parts.length > 1 && parts[1].length >= 2) return;

            this.amountInput.set(current + key);
        }
    }

    // Setters for template binding
    setName(event: Event) {
        this.customerName.set((event.target as HTMLInputElement).value);
    }

    setEmail(event: Event) {
        this.customerEmail.set((event.target as HTMLInputElement).value);
    }

    // Start Payment Flow
    initiatePayment() {
        const amt = this.amount();
        if (amt < 15) {
            alert('Minimum transaction amount is $15.00');
            return;
        }

        if (!this.customerName() || !this.customerEmail()) {
            alert('Please enter Customer Name and Email');
            return;
        }

        this.isProcessing.set(true);

        // Create PaymentIntent via Service
        this.paymentService.createPaymentIntent(amt * 100, {
            customerName: this.customerName(),
            customerEmail: this.customerEmail()
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

        this.isProcessing.set(true);
        const component = this.paymentElement();

        if (!component) {
            console.error('Payment Element not found');
            this.isProcessing.set(false);
            return;
        }

        // Access elements from the component. 
        // We cast to any because the type definition might vary or be missing properties in this environment.
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
                    // Show error
                    console.error(result.error);
                    this.paymentStatus.set('error');
                } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                    // Success
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
        this.amountInput.set('');
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
