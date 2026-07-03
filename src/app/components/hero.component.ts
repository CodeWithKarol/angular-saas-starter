import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <section class="min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <h1 class="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">
        Zmień sposób, w jaki <span class="text-violet-600">zarządzasz pracą</span>
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
        Intuicyjne narzędzie, które eliminuje chaos i pomaga skupić się na tym, co naprawdę ważne. Zacznij za darmo w 2 minuty.
      </p>
      <div class="flex gap-4 justify-center items-center">
        <button matButton="filled" color="primary" (click)="navigateToSignup()">Zacznij za darmo</button>
        <button matButton="outlined" (click)="scrollToFeatures()">Dowiedz się więcej</button>
      </div>
    </section>
  `,
  host: {
    class: 'block'
  }
})
export class HeroComponent {
  private router = inject(Router);
  private viewportScroller = inject(ViewportScroller);

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }

  scrollToFeatures() {
    this.viewportScroller.scrollToAnchor('features');
  }
}
