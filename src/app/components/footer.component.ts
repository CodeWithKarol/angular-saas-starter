import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="py-10 text-center text-gray-500 border-t border-gray-200">
      <p>&copy; 2026 SaaS Starter. Wszelkie prawa zastrzeżone.</p>
    </footer>
  `,
  host: { class: 'block' }
})
export class FooterComponent {}
