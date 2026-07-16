# Architecture Design Record

Dokumentacja wyborów architektonicznych i technologicznych w projekcie, rozważenie alternatyw i ich uzasadnienie.

## Monorepo
* **Alternatywy:** Polyrepo (osobne repozytoria klient/serwer), git submodules.
* **Uzasadnienie:** Przechowywanie kodu backendu i frontendu w jednym repozytorium ułatwia instalację i uruchomienie a przy małej skali projektu repozytorium nie skomplikuje się za bardzo.

## Java Spring Boot
* **Uzasadnienie:** Narzucone przez klienta.  

## H2 Database
* **Uzasadnienie:** Narzucone przez klienta.  

## Spring Data JPA (Hibernate)
* **Alternatywy:** JDBC Template (wymaga pisania SQL-a ręcznie) lub Spring Data JDBC.  
* **Uzasadnienie:** ORM automatyzuje mapowanie obiektów na bazę i generowanie schematu bazy. Skraca czas potrzebny na implementację warstwy bazy danych.  

## Lombok
* **Alternatywy:** Generowanie kodu przez IDE, stosowanie Java Records (niemożliwe do użycia jako encje Hibernate) lub przedłużenie kodu o Gettery/Settery.
* **Uzasadnienie:** Eliminuje powtarzalny kod (gettery, settery, konstruktory), czytelność klas. Trzeba unikać niektórych adnotacji, żeby Lombok i JPA nie wchodziły sobie w drogę (np. `@Data` na encjach JPA).  

## React (Vite)
* **Alternatywy:** Thymeleaf (renderowanie po stronie serwera), Vue.js albo czysty JS.
* **Uzasadnienie:** Pozwala na stworzenie dynamicznego interfejsu SPA. Pozwala na łatwą realizację wymagań klienta (funkcja typeahead, komponent dropdown-menu)
