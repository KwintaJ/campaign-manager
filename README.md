# Campaign Manager

Prosta aplikacja webowa służąca do zarządzania kampaniami reklamowymi, pozwalająca na kontrolę nad budżetem i informacjami na temat prowadzonych kampanii.

## Instalacja i uruchamianie

Po sklonowaniu tego repozytorium wykonać komendę `docker compose up --build -d` w głównym katalogu projektu.  
Aplikacja będzie dostępna pod adresem `http://localhost:5173`.  

## Funkcje
- **Tworzenie kampanii:** Definiowanie nazwy, wybór miasta, określanie promienia zasięgu, przypisywanie słów kluczowych, budżetu o stawki kampanii.
- **Dynamiczna edycja:** Możliwość aktualizacji parametrów istniejących kampanii z automatycznym przeliczeniem kosztów.
- **System statusów:** Przełączanie kampanii między stanami `ON` / `OFF`.
- **RESTowe API:** Walidacja danych w czasie rzeczywistym, prosty serwer z bazą danych H2.

## Dokumentacja

[TUTAJ](https://github.com/KwintaJ/campaign-manager/blob/main/dokumentacja/API.md) pełna dokumentacja API: dostępne endpointy, zwracane informacje, możliwe statusy i komunikaty błędów.  
[TUTAJ](https://github.com/KwintaJ/campaign-manager/blob/main/dokumentacja/ADR.md) dokumentacja wyborów architektonicznych i technologicznych.  