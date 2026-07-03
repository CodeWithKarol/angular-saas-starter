import { Component, inject, signal, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { StripeService } from '../services/stripe.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CurrencyPipe, UpperCasePipe],
  template: `
    <section class="py-20 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold mb-12">Wybierz swój plan</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          @for (price of prices(); track price.id) {
            <mat-card appearance="outlined" class="p-6 flex flex-col h-full">
              <mat-card-header>
                <mat-card-title class="!text-2xl">{{ price.product.name }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="py-6 flex-grow">
                <p class="text-4xl font-bold mb-4">
                  {{ price.unit_amount! / 100 | currency: (price.currency | uppercase) : 'symbol' }}
                </p>
                <p class="mb-8 text-gray-600">{{ price.product.description }}</p>
                <button matButton="filled" (click)="subscribe(price.id)">Wybierz</button>
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </section>
  `,
  host: { class: 'block' }
})
export class PricingComponent implements OnInit {
  private stripeService = inject(StripeService);
  private authService = inject(AuthService);
  private router = inject(Router);
  prices = signal<any[]>([]);

  async ngOnInit() {
    this.prices.set(await this.stripeService.getPrices());
  }

  async subscribe(priceId: string) {
    try {
      if (this.authService.isLoggedIn()) {
        const user = this.authService.user();
        const email = user?.email;

        if (email) {
          // Dla MVP odpytujemy bezpiecznie Stripe na serwerze po emailu
          const check = await this.stripeService.checkCustomer(email);

          if (check.exists && check.customerId) {
            // Użytkownik ma aktywny profil klienta w Stripe - przekieruj do portalu
            await this.stripeService.redirectToPortal(check.customerId);
          } else {
            // Brak aktywnego profilu klienta - przekieruj do zakupu (Checkout)
            await this.stripeService.redirectToCheckout(priceId);
          }
        }
      } else {
        // Zapamiętaj wybrany plan i przekieruj do rejestracji
        localStorage.setItem('pending_price_id', priceId);
        this.router.navigate(['/signup']);
      }
    } catch (error) {
      console.error('Błąd podczas subskrypcji:', error as Error);
    }
  }
}
