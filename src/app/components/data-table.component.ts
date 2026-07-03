import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

export interface ProjectData {
  id: number;
  name: string;
  status: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatCardModule],
  template: `
    <mat-card appearance="outlined">
      <mat-card-header class="!p-6">
        <mat-card-title>Twoje Projekty</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="dataSource" class="w-full">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let element"> {{element.id}} </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Nazwa </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element"> {{element.status}} </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  host: { class: 'block' }
})
export class DataTableComponent {
  displayedColumns: string[] = ['id', 'name', 'status'];
  dataSource: ProjectData[] = [
    { id: 1, name: 'Projekt Alfa', status: 'Aktywny' },
    { id: 2, name: 'Projekt Beta', status: 'Wstrzymany' },
    { id: 3, name: 'Projekt Gamma', status: 'Zakończony' },
  ];
}
