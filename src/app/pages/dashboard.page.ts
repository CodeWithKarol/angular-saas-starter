import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { StripeService } from '../services/stripe.service';
import { SubscriptionService } from '../services/subscription.service';
import { authGuard } from '../guards/auth.guard';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStatsComponent } from '../components/dashboard-stats.component';
import { DataTableComponent } from '../components/data-table.component';
import { DatePipe, TitleCasePipe } from '@angular/common';

export const routeMeta = {
  canActivate: [authGuard],
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, DashboardStatsComponent, DataTableComponent, DatePipe, TitleCasePipe],
  template: `
    <div class="p-8 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <button mat-raised-button color="warn" (click)="onLogout()">Wyloguj się</button>
      </div>
      
      <div class="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p class="text-xl mb-1">Witaj, <span class="font-semibold">{{ authService.user()?.email }}</span>!</p>
          
          <div class="flex items-center gap-2 mt-2">
            <span class="text-sm text-gray-500">Plan:</span>
            @if (subscriptionService.subscription()?.hasActiveSubscription) {
              <span class="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400 px-3 py-1 rounded-full text-xs font-semibold capitalize w-fit">
                {{ subscriptionService.subscription()?.tier }}
              </span>
              
              <span class="text-sm text-gray-600 dark:text-gray-300">
                @if (subscriptionService.subscription()?.cancelAtPeriodEnd) {
                  Subskrypcja wygaśnie z dniem {{ subscriptionService.subscription()?.formattedNextBillingDate }}.
                } @else {
                  Kolejna data rozliczenia to {{ subscriptionService.subscription()?.formattedNextBillingDate }}.
                }
              </span>
            } @else {
              <span class="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold w-fit">
                Brak aktywnego planu
              </span>
            }
          </div>
        </div>
        
        @if (subscriptionService.subscription()?.hasActiveSubscription) {
          <button mat-stroked-button (click)="manageBilling()">Zarządzaj płatnościami</button>
        }
      </div>
      
      <app-dashboard-stats />
      <app-data-table />
    </div>
  `,
})
export default class DashboardPage implements OnInit {
  private router = inject(Router);
  private stripeService = inject(StripeService);
  subscriptionService = inject(SubscriptionService);
  authService = inject(AuthService);

  async ngOnInit() {
    // Pobierz status subskrypcji użytkownika tylko wtedy, gdy wchodzi do dashboardu (Lazy Loading)
    await this.subscriptionService.loadSubscriptionStatus();

    // Sprawdź czy jest zapamiętany plan płatności
    const pendingPriceId = localStorage.getItem('pending_price_id');
    if (pendingPriceId) {
      localStorage.removeItem('pending_price_id');
      try {
        const email = this.authService.user()?.email;
        if (email) {
          const stripeCustomer = await this.stripeService.getPrices(); // Sprawdzenie cen (podgląd serwisu)
          // Tutaj sprawdzamy czy użytkownik ma już profil w Stripe
          const check = await this.stripeService.checkCustomer(email);
          if (check.exists && check.customerId) {
            // Istniejący klient - przekieruj do portalu zamiast checkoutu
            await this.stripeService.redirectToPortal(check.customerId);
          } else {
            // Nowy klient - przekieruj do checkoutu
            await this.stripeService.redirectToCheckout(pendingPriceId);
          }
        } else {
          await this.stripeService.redirectToCheckout(pendingPriceId);
        }
      } catch (error) {
        console.error('Błąd podczas przekierowania do płatności po logowaniu:', error);
      }
    }
  }

  async manageBilling() {
    const email = this.authService.user()?.email;
    if (email) {
      try {
        const check = await this.stripeService.checkCustomer(email);
        if (check.exists && check.customerId) {
          await this.stripeService.redirectToPortal(check.customerId);
        }
      } catch (error) {
        console.error('Błąd przy przejściu do portalu:', error);
      }
    }
  }

  async onLogout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
