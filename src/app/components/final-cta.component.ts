import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-cta',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <section class="py-20 px-6 text-center bg-violet-600 text-white">
      <h2 class="text-3xl font-bold mb-6">Gotowy, aby zacząć?</h2>
      <button matButton="filled" class="!bg-white !text-violet-700" (click)="navigateToSignup()">Stwórz konto</button>
    </section>
  `,
  host: { class: 'block' }
})
export class FinalCTAComponent {
  constructor(private router: Router) {}

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}

