import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  form,
  FormField,
  required,
  email,
  minLength,
} from '@angular/forms/signals';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SupabaseService } from '../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { guestGuard } from '../../guards/guest.guard';

interface LoginData {
  email: string;
  password: string;
}

export const routeMeta = {
  canActivate: [guestGuard],
};

@Component({
  selector: 'app-login.page',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormField,
    FormsModule,
    RouterLink,
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 h-full overflow-hidden">
      <div
        class="hidden md:flex bg-violet-600 text-white p-12 flex-col justify-center"
      >
        <h1 class="text-4xl font-bold mb-4">Welcome Back</h1>
        <p class="text-xl">Log in to continue your journey.</p>
      </div>
      <div class="flex items-center justify-center p-8">
        <div class="w-full max-w-sm">
          <a routerLink="/" class="inline-flex items-center text-sm text-gray-500 hover:text-violet-600 mb-8 transition gap-1 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Wróć do strony głównej
          </a>

          <form (ngSubmit)="onSubmit()">
            <h2 class="text-2xl font-bold mb-6">Log in to your account</h2>

          @if (error()) {
            <div class="text-red-500 mb-4">{{ error() }}</div>
          }

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              [formField]="loginForm.email"
              type="email"
              autocomplete="email"
            />
            @if (
              loginForm.email().touched() &&
              loginForm.email().errors().length
            ) {
              <mat-error>
                @for (error of loginForm.email().errors(); track error) {
                  {{ error.message }}
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              [formField]="loginForm.password"
              type="password"
              autocomplete="current-password"
            />
            @if (
              loginForm.password().touched() &&
              loginForm.password().errors().length
            ) {
              <mat-error>
                @for (error of loginForm.password().errors(); track error) {
                  {{ error.message }}
                }
              </mat-error>
            }
          </mat-form-field>

          <button
            matButton="filled"
            type="submit"
            class="w-full"
            [disabled]="isLoading() || loginForm().invalid()"
          >
            {{ isLoading() ? 'Logging in...' : 'Log In' }}
          </button>

          <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Nie masz jeszcze konta?
            <a routerLink="/signup" class="text-violet-600 font-semibold hover:underline">Zarejestruj się</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100dvh;
      width: 100vw;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      background: white;
    }
  `,
})
export default class LoginPage {
  private router = inject(Router);
  private supabase = inject(SupabaseService).client;

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Invalid email' });

    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 8, {
      message: 'Password must be at least 8 characters',
    });
  });

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  async onSubmit() {
    this.isLoading.set(true);
    this.error.set(null);
    const { email, password } = this.loginModel();

    const { error } = await this.supabase.auth.signInWithPassword({ email, password });

    this.isLoading.set(false);
    if (error) {
      this.error.set(error.message);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
