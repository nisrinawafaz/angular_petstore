## 1. Persamaan Angular dan React

### Component-Based Architecture

Keduanya membangun UI dari komponen-komponen kecil yang bisa dipakai ulang.

### TypeScript

Keduanya mendukung TypeScript. Interface dan type yang sudah dibuat di project Angular (seperti `User`, `Pet`, `Order`) bisa langsung dipindah ke project React **tanpa perubahan apapun**.

### Validasi dengan Zod

Schema Zod yang sudah dibuat (`createUserSchema`, `editUserSchema`, `petSchema`, `orderSchema`) bisa langsung dipakai di React **tanpa perubahan apapun**.

### HTTP / API Calls

Konsep memanggil API tetap sama — keduanya menggunakan `GET`, `POST`, `PUT`, `DELETE`. Yang berbeda hanya library-nya: Angular pakai `HttpClient`, React biasanya pakai `fetch` atau `axios`.

### State Management

Keduanya punya cara mengelola state. Angular pakai `property` di class component, React pakai `useState`. Konsepnya sama yaitu menyimpan data yang mempengaruhi tampilan.

### Routing

Keduanya punya sistem routing berbasis path. Angular pakai `@angular/router`, React pakai `react-router-dom`. Struktur route yang kita buat (`/pets`, `/pets/:id`, `/users`, dll) bisa diaplikasikan langsung di React.

---

## 2. Perbedaan Angular dan React

### Framework vs Library

Angular : Full framework — sudah include router, HTTP client, form handling, DI.
React : Library UI — hanya handle rendering, perlu library tambahan untuk fitur lain |

### Template vs JSX

Angular menggunakan HTML template terpisah dengan directive khusus. React menggunakan JSX yaitu HTML yang ditulis langsung di dalam JavaScript/TypeScript.

### Two-way Binding vs One-way Data Flow

Angular mendukung two-way binding dengan `[(ngModel)]` — perubahan di UI langsung update data, dan sebaliknya. React menggunakan one-way data flow, data mengalir dari parent ke child, dan event handler digunakan untuk update state.

### Dependency Injection

Angular punya sistem DI built-in — service di-inject lewat constructor. React tidak punya DI, sehingga menggunakan `Context API` atau state management library seperti `Redux` atau `Zustand`.

### RxJS vs Promise/async-await

Angular sangat bergantung pada RxJS untuk handle async operations. React lebih sering menggunakan Promise dan async/await yang lebih sederhana, meskipun bisa juga pakai RxJS.

### Class vs Function Component

Angular menggunakan class untuk komponen. React modern menggunakan function component dengan hooks.

### Form Handling

Angular punya dua pendekatan form bawaan: Template-driven (ngModel) dan Reactive Forms (FormGroup). React tidak punya form handling bawaan, biasanya pakai `React Hook Form` atau `Formik`.

---

## 3. Fitur yang Mirip, Hanya Beda Nama

| Konsep                     | Angular                            | React                                          |
| -------------------------- | ---------------------------------- | ---------------------------------------------- |
| **Komponen**               | `@Component` + class               | Function component                             |
| **State lokal**            | Property di class                  | `useState()`                                   |
| **Lifecycle init**         | `ngOnInit()`                       | `useEffect(() => {}, [])`                      |
| **Lifecycle destroy**      | `ngOnDestroy()`                    | Return function di `useEffect`                 |
| **Input dari parent**      | `@Input()`                         | Props                                          |
| **Output ke parent**       | `@Output()` + `EventEmitter`       | Callback props (`onSubmit`, `onChange`)        |
| **Kondisional render**     | `*ngIf`                            | `{condition && <Component />}`                 |
| **Loop render**            | `*ngFor`                           | `.map()`                                       |
| **Styling**                | `.component.css`                   | `.module.css` / Tailwind / styled-components   |
| **Routing**                | `RouterModule` + `app.routes.ts`   | `react-router-dom`                             |
| **Route params**           | `ActivatedRoute.snapshot.paramMap` | `useParams()`                                  |
| **Navigasi**               | `Router.navigate()`                | `useNavigate()`                                |
| **HTTP**                   | `HttpClient`                       | `fetch` / `axios`                              |
| **Guard (proteksi route)** | `CanActivateFn`                    | Route wrapper component                        |
| **Interceptor**            | `HttpInterceptorFn`                | `axios interceptors` / middleware              |
| **Form validation**        | `Validators` + Zod                 | `React Hook Form` + Zod (`zodResolver`)        |
| **UI Library**             | Angular Material                   | MUI (Material UI)                              |
| **Service**                | `@Injectable` class                | Custom hook / Context                          |
| **Dialog/Modal**           | `MatDialog`                        | `useState` + conditional render / MUI `Dialog` |

---

## 4. Tips Migrasi Angular ke React

### 1 — Mulai dari Layer Paling Bawah

Jangan langsung migrasi komponen. Mulai dari yang paling tidak bergantung pada Angular:

```
Urutan migrasi yang disarankan:
1. Models/Interfaces (TypeScript) : copy langsung
2. Zod Schemas : copy langsung
3. Utility functions (core/utils) : copy langsung
4. API Services : rewrite minimal (ganti HttpClient ke axios/fetch)
5. Components : rewrite menggunakan React
```

### 2 — Manfaatkan Zod Schema yang Sudah Ada

Menggunakan validasi zod karena dapat digunakan di keduanya, sehingga schema validasi bisa langsung dipakai di React dengan `zodResolver`:

### 3 — Konversi Service ke Custom Hook

Service Angular yang berisi logic bisa dikonversi ke custom hook React:

### 4 — Konversi RxJS ke async/await

RxJS Observable bisa dikonversi ke async/await:

### 5 — Ganti Angular Material dengan MUI

Angular Material dan MUI (Material UI) sangat mirip — nama komponen dan props hampir sama

### 6 — Konversi Guard ke Protected Route

Angular Guard bisa dikonversi ke Protected Route component di React:

### 7 — Konversi Interceptor ke Axios Interceptor

Angular HTTP Interceptor bisa dikonversi ke Axios interceptor:

### 8 — Migrasi Bertahap Per Fitur

## Tidak perlu migrasi semua sekaligus, dapat diakukan bertahap per fitur

## Catatan

Dengan persiapan yang tepat sejak awal dengan menerapkan hal yang dapat diimplementasikan juga di react (Zod, clean architecture, separation of concerns), migrasi Angular ke React menjadi jauh lebih mudah dan terstruktur.
