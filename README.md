# --- FILMAG ---
Aplikacja dla branży produkcyjnej.
<br/>
Cel: gromadzenie i przekazywanie zgłoszeń od operatorów maszyn.
### Część aplikacji - backend

### Demo:
Wersja demonstracyjna: [https://filmag-demo.herokuapp.com](https://filmag-demo.herokuapp.com)
<br/>
Loginy: Operator, Magazynier, Kierownik, Prezes.
<br/>
Hasło: 12345
<br/>
<br/>

### Opis aplikacji:
- aplikacja napisana w Node.js / express,
- stosowanie funkcji typu middleware do identyfikacji, sprawdzania uprawnień i czasu ostatniej aktywności,
- użycie biblioteki bcrypt do hashowania haseł użytkowników,
- redukcja zapytań do bazy danych przez zapamiętanie wyników w cache,
- tokenizacja danych z użyciem biblioteki jsonwebtoken,
- przechowywanie wrażliwych danych w zmiennych środowiskowych na serwerze, np. adres bazy danych i dane dostępu, czy \"soli" *Salt*,
- @hapi/joi - walidacja otrzymanych danych od użytkownika,
- baza danych - mongoDB, mongoose, tworzenie modeli danych i obsługa zapytań,
- obsługa operacji CRUD przez interfejsy API wg zasobów, np. api/tasks, api/users,
- biblioteki pomocnicze: helmet, compression, cors, lodash, xlsx, nodemailer,
- podział struktury kodu, tzn. osobno routes, models, middlewares, startup files.
<br/>

## UŻYTE TECHNOLOGIE
<img src="prezentacja/stack.png" alt="użyte technologie">
<br/>

## UWAGI
Jest to demonstracyjne repozytorium, tzn. posiada tylko część kodu.