import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);

  // This should call your actual backend to create a PaymentIntent.
  // Since we don't have a backend yet, this simulates a response.
  createPaymentIntent(amount: number): Observable<{ clientSecret: string }> {
    console.warn('Simulating PaymentIntent creation. Connect to a backend for real payments.');
    // Simulated delay
    return of({ clientSecret: 'pi_mock_secret_12345' }).pipe(delay(1000));
  }
}
