# Dokumentacja endpointów API

---

## 1. Słowniki

### `GET /api/towns`
*   Pobiera pełną listę dostępnych miast.
*   **Sukces (200 OK):** Zwraca tablicę obiektów `Town` `[ { "id": 1, "name": "Kraków" }, ... ]`.

### `GET /api/keywords`
*   Pobiera pełną listę dostępnych słów kluczowych.
*   **Sukces (200 OK):** Zwraca tablicę obiektów `Keyword` `[ { "id": 1, "name": "Elektronika" }, ... ]`.

---

## 2. Portfel Emerald Account

### `GET /api/account/balance`
*   Pobiera aktualny stan konta głównego użytkownika (ID = 1).
*   **Sukces (200 OK):** Zwraca obiekt konta `{ "id": 1, "balance": 10000.00 }`.
*   **Błąd (404 Not Found):** `Nie znaleziono konta!`.

---

## 3. Kampanie (Campaigns)

### `GET /api/campaigns`
*   Pobiera pełną listę wszystkich utworzonych kampanii.
*   **Sukces (200 OK):** Zwraca tablicę obiektów `Campaign`.

### `GET /api/campaigns/{id}`
*   Pobiera szczegóły pojedynczej kampanii na podstawie jej ID.
*   **Sukces (200 OK):** Zwraca obiekt `Campaign`.
*   **Błąd (404 Not Found):** `Nie istnieje kampania o ID={id}`.

### `POST /api/campaigns`
*   Tworzy nową kampanię i pobiera z portfela odpowiednią sumę.
*   **Body (JSON):** Wymaga obiektu `CampaignDTO` (wymagane `name`, `bidAmount`, `campaignFund`, `townId`, `keywordIds`).
*   **Sukces (201 Created):** Zwraca utworzony obiekt `Campaign` z nadanym ID.
*   **Błędy (400 Bad Request):**  
    *   `Kampania musi mieć przypisane co najmniej jedno słowo kluczowe!`
    *   `Niewystarczające środki na koncie!`
    *   `Wybrane miasto nie istnieje!`

### `PUT /api/campaigns/{id}`
*   Aktualizuje dane kampanii. Oblicza różnicę w budżecie i automatycznie pobiera brakujące lub zwraca nadmiarowe środki z EmeraldAccount.
*   **Body (JSON):** Wymaga pełnego obiektu `CampaignDTO`.
*   **Sukces (200 OK):** Zwraca zaktualizowany obiekt `Campaign`.
*   **Błędy (400 Bad Request):**
    *   `Nie istnieje kampania o ID={id}`
    *   `Kampania musi mieć przypisane co najmniej jedno słowo kluczowe!`
    *   `Niewystarczające środki na koncie!`
    *   `Wybrane miasto nie istnieje!`

### `DELETE /api/campaigns/{id}`
*   Usuwa kampanię z systemu i zwraca cały jej przypisany budżet (`campaignFund`) z powrotem do portfela (`EmeraldAccount`).
*   **Sukces (200 OK):** Zwraca komunikat tekstowy: `"Kampania usunięta, środki zwrócone na konto."`
*   **Błędy (400 Bad Request):** 
    *   `Nie istnieje kampania o ID={id}`