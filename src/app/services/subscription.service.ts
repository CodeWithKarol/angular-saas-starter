import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface SubscriptionInfo {
  hasActiveSubscription: boolean;
  tier: 'basic' | 'standard' | 'premium' | null;
  status?: string;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
  formattedNextBillingDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // Sygnał przechowujący status subskrypcji użytkownika
  subscription = signal<SubscriptionInfo | null>(null);

  // Pomocnicza zmienna zapobiegająca duplikowaniu zapytań o ten sam e-mail
  private loadedEmail: string | null = null;

  constructor() {
    // Reaguj reaktywnie na zmiany stanu zalogowania (np. wylogowanie) bez tworzenia cyklicznych zależności
    effect(() => {
      const user = this.authService.user();
      if (!user) {
        this.clear();
      }
    });
  }

  async loadSubscriptionStatus() {
    const email = this.authService.user()?.email;
    if (!email) {
      this.subscription.set(null);
      this.loadedEmail = null;
      return;
    }

    if (this.loadedEmail === email && this.subscription() !== null) {
      return; // Zablokuj zduplikowane zapytanie jeśli już pobrano
    }
    
    try {
      this.loadedEmail = email;
      const status = await firstValueFrom(
        this.http.get<SubscriptionInfo>(`/api/subscription-status?email=${encodeURIComponent(email)}`)
      );
      this.subscription.set(status);
    } catch (error) {
      console.error('Błąd podczas ładowania statusu subskrypcji:', error);
      this.subscription.set({ hasActiveSubscription: false, tier: null });
    }
  }

  clear() {
    this.loadedEmail = null;
    this.subscription.set(null);
  }
}
