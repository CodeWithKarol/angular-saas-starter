import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero.component';
import { FeaturesComponent } from '../components/features.component';
import { PricingComponent } from '../components/pricing.component';
import { FinalCTAComponent } from '../components/final-cta.component';
import { FooterComponent } from '../components/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, FeaturesComponent, PricingComponent, FinalCTAComponent, FooterComponent],
  template: `
    <main>
      <app-hero />
      <app-features />
      <app-pricing />
      <app-final-cta />
    </main>
    <app-footer />
  `,
  host: { class: 'flex flex-col min-h-screen !m-0 !p-0' }
})
export default class Home {}
