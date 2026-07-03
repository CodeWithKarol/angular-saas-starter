import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  async getPrices() {
    return firstValueFrom(this.http.get<any[]>('/api/prices'));
  }

  async checkCustomer(email: string) {
    return firstValueFrom(
      this.http.get<{ exists: boolean; customerId: string | null }>(
        `/api/customer-check?email=${encodeURIComponent(email)}`
      )
    );
  }

  async redirectToCheckout(priceId: string) {
    try {
      const email = this.authService.user()?.email;
      const response = await firstValueFrom(
        this.http.post<{ url: string }>('/api/checkout', { priceId, email })
      );

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        console.error('Brak URL w odpowiedzi z serwera:', response);
      }
    } catch (error) {
      console.error('Błąd podczas przekierowania do Stripe:', error);
    }
  }

  async redirectToPortal(customerId: string) {
    try {
      const response = await firstValueFrom(
        this.http.post<{ url: string }>('/api/portal', { customerId })
      );

      if (response && response.url) {
        window.location.href = response.url;
      } else {
        console.error('Brak URL portalu w odpowiedzi z serwera:', response);
      }
    } catch (error) {
      console.error('Błąd podczas przekierowania do portalu Stripe:', error);
    }
  }
}
