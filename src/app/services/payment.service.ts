import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  customerName?: string;
  customerEmail?: string;
  lineItems?: { name: string; qty: number; price: number }[];
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private functions = inject(Functions);

  createPaymentIntent(
    amount: number,
    metadata?: {
      customerName?: string;
      customerEmail?: string;
      lineItems?: { name: string; qty: number; price: number }[];
    }
  ): Observable<PaymentIntentResponse> {
    const callable = httpsCallable<PaymentIntentRequest, PaymentIntentResponse>(
      this.functions,
      'createPaymentIntent'
    );

    return from(callable({
      amount,
      currency: 'usd',
      customerName: metadata?.customerName,
      customerEmail: metadata?.customerEmail,
      lineItems: metadata?.lineItems,
    })).pipe(
      map(result => result.data)
    );
  }
}
