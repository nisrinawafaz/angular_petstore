## Pengertian Angular

Angular adalah framework front-end berbasis TypeScript yang dikembangkan dan dikelola oleh Google. Angular digunakan untuk membangun aplikasi web modern yang bersifat dinamis (single-page application / SPA) dengan struktur yang terorganisir dan scalable.

## Fitur Utama

1. **Component-Based Architecture**
   Aplikasi dipecah jadi komponen-komponen kecil yang bisa dipakai ulang. Setiap komponen punya 3 file terpisah: `.ts` buat logika, `.html` buat tampilan, `.css` buat styling.

2. **Signals (Reaktivitas Modern)**
   Sistem reaktivitas baru yang memungkinkan Angular mendeteksi perubahan data secara spesifik dan presisi, meningkatkan performa aplikasi secara signifikan tanpa harus mengecek seluruh komponen.

3. **Standalone Components**
   Komponen yang tidak lagi bergantung pada NgModule. Hal ini membuat struktur kode lebih simpel, modular, dan mudah dipelajari bagi pemula. (update angular terbaru)

4. **Two-Way Data Binding**
   Sinkronisasi otomatis antara model (data) dan view (tampilan). maksudnya perubahan di input langsung update variable dan sebaliknya.

5. **Dependency Injection (DI)**
   Sistem bawaan Angular buat "nyuntik" service atau dependency ke dalam komponen. Hal iniMemudahkan pengelolaan dependensi antar komponen dan service.

6. **Routing Module**
   Angular punya router sendiri yang powerful (support lazy loading, route guard, dan parameter URL) tanpa perlu library tambahan. Mendukung navigasi antar halaman dalam aplikasi SPA.

7. **RxJS & Observable**
   Angular pakai RxJS buat handle data yang async atau berubah seiring waktu. Bisa subscribe dari banyak komponen sekaligus dan semua otomatis dapat update.

8. **Angular CLI**
   Angular bisa bikin komponen, service, module, dll bisa lewat satu perintah.

---

## Kelebihan

- Struktur kode yang konsisten dan terstandar, biasanya cocok untuk kerja tim besar
- Semua sudah tersedia bawaan sehingga tidak perlu banayak library
- Angular CLI mempercepat setup dan pengembangan
- Menggunakan TypeScript secara default sehingga membantu meningkatkan kualitas kode dengan type safety.
- Dokumentasi resmi lengkap dan well-maintained oleh Google
- Cocok buat enterprise-level application yang butuh skalabilitas
- Dengan fitur terbaru seperti Zoneless Change Detection, Angular kini mampu bersaing dalam hal kecepatan dengan framework yang lebih ringan seperti Vue atau Svelte.

## Kekurangan

- Learning curve cukup tinggi, Angular memiliki banyak konsep kompleks yang harus dipelajari sekaligus.
- Boilerplate banyak : untuk fitur sederhana pun butuh banyak file dan membutuhkan lebih banyak baris kode untuk fitur sederhana dibandingkan framework minimalis.
- Bundle size cenderung memiliki ukuran file awal yang lebih besar karena membawa banyak fitur bawaan.
- Overkill buat project kecil atau simple.

---

## Catatan

1. Sintaks binding

- {{ var }} tampilkan data ke HTML
- [attr]="var" set atribut HTML dari ts
- (event)="fn()" tangkap aksi user
- [(ngModel)] dua arah, perlu import FormsModule

2. Direktif template

- \*ngIf / @if kondisi tampil/sembunyi
- \*ngFor / @for perulangan list

3. Struktur component

- Setiap component terdiri dari 3 file: .ts .html .css
- selector = nama tag HTML-nya
- @Input() untuk terima data dari parent (seperti props React)
- @Output() + EventEmitter untuk kirim event ke parent

4. Lifecycle hooks

- constructor khusus untuk Dependency Injection
- ngOnInit untuk fetch data & logika awal : mirip useEffect([], [])
- ngOnDestroy untuk cleanup, unsubscribe Observable
- ngOnChanges dipanggil saat @Input() berubah

5. Observable & RxJS

- http.get() mengembalikan Observable, bukan data langsung
- Pakai .subscribe() untuk ambil datanya

---

Link Demo : https://drive.google.com/drive/folders/1iz6SfgoSClv9R7QoQjzxhewBEuL4-I1T?usp=sharing
