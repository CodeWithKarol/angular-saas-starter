# AuthService Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Implementacja AuthService do przechowywania stanu użytkownika (zalogowany/wylogowany).

**Architecture:**
- Serwis: AuthService (src/app/services/auth.service.ts).
- Stan: Sygnały (signal) do przechowywania obiektu User.
- Reaktywność: Subskrypcja na onAuthStateChange z Supabase.

**Tech Stack:**
- Angular 22
- Supabase Auth

---

### Task 1: Utworzenie pliku AuthService
**Files:**
- Create: src/app/services/auth.service.ts

- [ ] **Step 1: Implementacja struktury serwisu**

`	ypescript
import { Injectable, signal, computed } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { supabase } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = signal<User | null>(null);
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    this.initAuth();
  }

  private async initAuth() {
    const { data } = await supabase.auth.getSession();
    this.user.set(data.session?.user ?? null);

    supabase.auth.onAuthStateChange((event, session) => {
      this.user.set(session?.user ?? null);
    });
  }

  async logout() {
    await supabase.auth.signOut();
  }
}
`

### Task 2: Rejestracja serwisu i użycie
**Files:**
- Modify: src/app/pages/(auth)/signup.page.ts

- [ ] **Step 1: Aktualizacja SignupPage, aby po sukcesie aktualizować AuthState**
- (W praktyce Supabase zrobi to automatycznie przez onAuthStateChange w AuthService, więc tu wystarczy tylko przekierowanie)

`	ypescript
// w SignupPage onSubmit:
    } else {
      // Rejestracja udana, AuthState zostanie zaktualizowany przez AuthService
      this.router.navigate(['/dashboard']);
    }
`

