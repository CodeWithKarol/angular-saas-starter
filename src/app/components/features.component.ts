import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

interface Feature {
  title: string;
  description: string;
}

@Component({
  selector: 'app-features',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <section id="features" class="py-20 bg-gray-50 dark:bg-gray-900 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid md:grid-cols-3 gap-8">
          @for (feature of features; track feature.title) {
            <mat-card appearance="outlined" class="flex flex-col h-full !rounded-xl !shadow-none text-center">
              <mat-card-header class="!px-6 !pt-6 !pb-2 flex justify-center">
                <mat-card-title class="!text-2xl !font-semibold !text-gray-900 dark:!text-gray-100 !leading-snug !m-0">
                  {{ feature.title }}
                </mat-card-title>
              </mat-card-header>
              <mat-card-content class="!px-6 !pb-6 !pt-2 !text-lg !text-gray-600 dark:!text-gray-400 !leading-relaxed flex-grow !m-0">
                {{ feature.description }}
              </mat-card-content>
            </mat-card>
          }
        </div>
      </div>
    </section>
  `,
  host: { class: 'block' }
})
export class FeaturesComponent {
  features: Feature[] = [
    { title: 'Oszczędność czasu', description: 'Automatyzuj powtarzalne zadania i skup się na kreatywnej pracy.' },
    { title: 'Lepsza widoczność', description: 'Pełna kontrola nad projektami dzięki przejrzystym pulpitom nawigacyjnym.' },
    { title: 'Skalowalność', description: 'Narzędzie, które rośnie razem z Twoim zespołem i potrzebami biznesowymi.' }
  ];
}
