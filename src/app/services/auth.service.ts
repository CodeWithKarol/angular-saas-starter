import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  
  user = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.user());
  isInitialized = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  private async initAuth() {
    const { data } = await this.supabase.auth.getSession();
    const currentUser = data.session?.user ?? null;
    this.user.set(currentUser);
    
    this.isInitialized.set(true);

    this.supabase.auth.onAuthStateChange(async (event, session) => {
      const newUser = session?.user ?? null;
      this.user.set(newUser);
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
  }
}
