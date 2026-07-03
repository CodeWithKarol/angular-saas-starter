# Design: Rejestracja użytkownika przez Supabase

## Architektura
- Implementacja bezpośrednio w komponencie SignupPage.
- Wykorzystanie klienta supabase zaimportowanego z ../../app.config.

## Komponent SignupPage
- **Stan:**
  - isLoading (signal<boolean>): do śledzenia stanu zapytania.
  - rror (signal<string | null>): do przechowywania komunikatu o błędzie.
- **Logika:**
  - onSubmit(): asynchroniczna metoda wywołująca supabase.auth.signUp.
  - Obsługa błędów i przekierowanie po sukcesie.

## Szablon
- Dodanie (ngSubmit) do formularza.
- Wyświetlanie błędu wewnątrz szablonu.
- Stan przycisku zależny od isLoading i signupForm().invalid().
