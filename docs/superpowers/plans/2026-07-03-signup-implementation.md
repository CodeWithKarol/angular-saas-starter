# Implementacja Rejestracji Użytkownika Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementacja rejestracji użytkownika z wykorzystaniem Supabase Auth w komponencie `SignupPage`.

**Architecture:**
- Bezpośrednie wywołanie `supabase.auth.signUp` w komponencie `SignupPage`.
- Dodanie obsługi stanu ładowania i wyświetlania błędów.

**Tech Stack:**
- Angular 22
- Supabase Auth

---

### Task 1: Przygotowanie komponentu SignupPage
**Files:**
- Modify: `C:\Users\e-klms\Documents\repos\angular-saas-starter\src\app\pages\(auth)\signup.page.ts`

- [ ] **Step 1: Dodanie sygnałów stanu**
```typescript
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
```

### Task 2: Implementacja logiki rejestracji
**Files:**
- Modify: `C:\Users\e-klms\Documents\repos\angular-saas-starter\src\app\pages\(auth)\signup.page.ts`

- [ ] **Step 1: Dodanie metody onSubmit**
```typescript
  async onSubmit() {
    this.isLoading.set(true);
    this.error.set(null);
    const { email, password } = this.signupModel();
    
    const { error } = await supabase.auth.signUp({ email, password });
    
    this.isLoading.set(false);
    if (error) {
      this.error.set(error.message);
    } else {
      // Przekierowanie po sukcesie
      console.log("Rejestracja udana");
    }
  }
```

### Task 3: Aktualizacja szablonu
**Files:**
- Modify: `C:\Users\e-klms\Documents\repos\angular-saas-starter\src\app\pages\(auth)\signup.page.ts`

- [ ] **Step 1: Aktualizacja formularza i przycisku**
- Zmień `form` na: `<form class="w-full max-w-sm" (ngSubmit)="onSubmit()">`
- Zmień przycisk na: 
```html
<button
  matButton="filled"
  type="submit"
  class="w-full"
  [disabled]="isLoading() || signupForm().invalid()"
>
  {{ isLoading() ? "Signing up..." : "Sign Up" }}
</button>
```

- [ ] **Step 2: Dodanie wyświetlania błędu**
```html
@if (error()) {
  <div class="text-red-500 mb-4">{{ error() }}</div>
}
```
