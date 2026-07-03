# Design: AuthService oparte na sygnałach

## Cel
Stworzenie scentralizowanego serwisu do zarządzania stanem autoryzacji użytkownika w aplikacji przy użyciu Angular Signals i Supabase.

## Architektura
- Serwis: AuthService (src/app/services/auth.service.ts).
- Stan: Sygnały (signal) do przechowywania obiektu User.
- Reaktywność: Subskrypcja na onAuthStateChange z Supabase.
- Dostępność: providedIn: 'root'.

## Komponenty AuthService
- **Stan:**
  - user: signal<User | null>(null) - aktualnie zalogowany użytkownik.
  - isLoggedIn: computed<boolean> - czy użytkownik jest zalogowany.
- **Logika:**
  - constructor(): Inicjalizacja stanu (getSession) oraz nasłuchiwanie zmian (onAuthStateChange).
  - logout(): supabase.auth.signOut().
