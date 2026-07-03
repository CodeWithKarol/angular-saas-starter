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

interface SignupData {
  email: string;
  password: string;
}

export const routeMeta = {
  canActivate: [guestGuard],
};

@Component({
  selector: 'app-signup.page',
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
        <h1 class="text-4xl font-bold mb-4">Welcome to Our SaaS</h1>
        <p class="text-xl">Build your future, one line of code at a time.</p>
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
            <h2 class="text-2xl font-bold mb-6">Create an account</h2>

          @if (error()) {
            <div class="text-red-500 mb-4">{{ error() }}</div>
          }

          <div class="flex flex-col gap-4 mb-6">
            <button matButton="outlined" type="button">
              Sign up with Google
            </button>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <hr class="flex-grow" />
            <span>or</span>
            <hr class="flex-grow" />
          </div>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Email</mat-label>
            <input
              matInput
              [formField]="signupForm.email"
              type="email"
              autocomplete="email"
            />
            @if (
              signupForm.email().touched() &&
              signupForm.email().errors().length
            ) {
              <mat-error>
                @for (error of signupForm.email().errors(); track error) {
                  {{ error.message }}
                }
              </mat-error>
            }
          </mat-form-field>

          <mat-form-field class="w-full" appearance="outline">
            <mat-label>Password</mat-label>
            <input
              matInput
              [formField]="signupForm.password"
              type="password"
              autocomplete="current-password"
            />
            @if (
              signupForm.password().touched() &&
              signupForm.password().errors().length
            ) {
              <mat-error>
                @for (error of signupForm.password().errors(); track error) {
                  {{ error.message }}
                }
              </mat-error>
            }
          </mat-form-field>

          <button
            matButton="filled"
            type="submit"
            class="w-full"
            [disabled]="isLoading() || signupForm().invalid()"
          >
            {{ isLoading() ? 'Signing up...' : 'Sign Up' }}
          </button>

          <div class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Masz już konto?
            <a routerLink="/login" class="text-violet-600 font-semibold hover:underline">Zaloguj się</a>
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
export default class SignupPage {
  private router = inject(Router);
  private supabase = inject(SupabaseService).client;

  signupModel = signal<SignupData>({
    email: '',
    password: '',
  });

  signupForm = form(this.signupModel, (schemaPath) => {
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
    const { email, password } = this.signupModel();

    const { error } = await this.supabase.auth.signUp({ email, password });

    this.isLoading.set(false);
    if (error) {
      this.error.set(error.message);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
