import { Injectable, inject } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private functions = inject(Functions);

  createPaymentIntent(amount: number, metadata?: { customerName?: string, customerEmail?: string }): Observable<{ clientSecret: string }> {
    const createPaymentIntent = httpsCallable<{ amount: number; currency: string; customerName?: string; customerEmail?: string }, { clientSecret: string }>(
      this.functions,
      'createPaymentIntent'
    );

    return from(createPaymentIntent({
      amount,
      currency: 'usd',
      customerName: metadata?.customerName,
      customerEmail: metadata?.customerEmail
    })).pipe(
      map(result => result.data)
    );
  }
}
