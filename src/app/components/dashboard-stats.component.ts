import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <mat-card appearance="outlined" class="p-6">
        <mat-card-title class="!text-sm text-gray-500 uppercase tracking-wide">Aktywne projekty</mat-card-title>
        <mat-card-content class="!text-4xl font-bold mt-2">12</mat-card-content>
      </mat-card>
      
      <mat-card appearance="outlined" class="p-6">
        <mat-card-title class="!text-sm text-gray-500 uppercase tracking-wide">Zużycie limitów</mat-card-title>
        <mat-card-content class="!text-4xl font-bold mt-2">75%</mat-card-content>
      </mat-card>

      <mat-card appearance="outlined" class="p-6">
        <mat-card-title class="!text-sm text-gray-500 uppercase tracking-wide">Powiadomienia</mat-card-title>
        <mat-card-content class="!text-4xl font-bold mt-2">3</mat-card-content>
      </mat-card>
    </div>
  `,
  host: { class: 'block' }
})
export class DashboardStatsComponent {}
