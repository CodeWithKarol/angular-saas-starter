# Design: Landing Page SaaS (Generyczny)

## Cel
Stworzenie nowoczesnego, uniwersalnego landing page'a dla projektu SaaS w architekturze AnalogJS.

## Struktura sekcji
1. **Hero**: H1, podtytuł, CTA (Primary/Secondary).
2. **Features**: 3 kolumny z ikonami, nagłówkami i krótkimi opisami korzyści.
3. **Social Proof**: Pasek z logotypami ("zaufali nam").
4. **Final CTA**: Sekcja zachęcająca do rejestracji.

## Aspekty techniczne
- **Framework**: AnalogJS (Angular 22).
- **Stylizacja**: Tailwind CSS.
- **Komponenty**: Standalone, wykorzystanie Signal-based patterns, natywny control flow (`@for`, `@if`).
- **Wydajność**: SSG (Static Site Generation) dla szybkiego ładowania (LCP).

## Planowane pliki
- `src/app/pages/index.page.ts`: Główny szablon strony.
- Opcjonalne sub-komponenty w `src/app/components/` dla lepszej modularności (np. `hero.component.ts`).

## Zgodność z założeniami
- Mobile-first design.
- Dostępność (AXE/WCAG).
- Czysty "SaaS look".
