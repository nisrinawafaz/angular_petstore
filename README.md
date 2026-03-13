Angular merupakan framework frontend buatan Google dan pertama kali rilis tahun 2016. Bahasa utamanya TypeScript.

## Fitur Utama

**Component-Based Architecture**
Aplikasi dipecah jadi komponen-komponen kecil yang bisa dipakai ulang. Setiap komponen punya 3 file terpisah: `.ts` buat logika, `.html` buat tampilan, `.css` buat styling.

**Signals (Reaktivitas Modern)**
Sistem reaktivitas baru yang memungkinkan Angular mendeteksi perubahan data secara spesifik dan presisi, meningkatkan performa aplikasi secara signifikan tanpa harus mengecek seluruh komponen.

**Standalone Components**
Komponen yang tidak lagi bergantung pada NgModule. Hal ini membuat struktur kode lebih simpel, modular, dan mudah dipelajari bagi pemula.

**Two-Way Data Binding**
Sinkronisasi otomatis antara model (data) dan view (tampilan). maksudnya perubahan di input langsung update variable dan sebaliknya. Kalau di React manual pakai `onChange`.

**Dependency Injection (DI)**
Sistem bawaan Angular buat "nyuntik" service atau dependency ke dalam komponen. Penggunaannya dengan cara deklarasi di constructor.

**Routing Bawaan**
Angular punya router sendiri yang powerful (support lazy loading, route guard, dan parameter URL) tanpa perlu library tambahan.

**RxJS & Observable**
Angular pakai RxJS buat handle data yang async atau berubah seiring waktu. Semua HTTP request di Angular mengembalikan Observable, bukan Promise. Bisa subscribe dari banyak komponen sekaligus dan semua otomatis dapat update.

**Angular CLI**
Angular bisa bikin komponen, service, module, dll bisa lewat satu perintah.

---

## Kelebihan

- Struktur kode yang konsisten dan terstandar, biasanya cocok untuk kerja tim besar
- Karena menggunakan TypeScript, maka error ketangkap lebih awal sebelum runtime
- Semua sudah tersedia bawaan sehingga tidak perlu banayak library
- Angular CLI mempercepat setup dan pengembangan
- Dokumentasi resmi lengkap dan well-maintained oleh Google
- Cocok buat enterprise-level application yang butuh skalabilitas
- Dengan fitur terbaru seperti Zoneless Change Detection, Angular kini mampu bersaing dalam hal kecepatan dengan framework yang lebih ringan seperti Vue atau Svelte.

## Kekurangan

- Learning curve cukup curam, Angular memiliki banyak konsep kompleks yang harus dipelajari sekaligus. Terutama buat yang baru kenal TypeScript
- Boilerplate banyak : untuk fitur sederhana pun butuh banyak file dan membutuhkan lebih banyak baris kode untuk fitur sederhana dibandingkan framework minimalis.
- Bundle size cenderung memiliki ukuran file awal yang lebih besar karena membawa banyak fitur bawaan
- Overkill buat project kecil atau simple landing page
- Konsep seperti Observable, DI, dan Decorator butuh waktu buat terbiasa

---

## Konsep Penting yang Perlu Dipahami

- Module (NgModule) : pengelompokan komponen yang saling berkaitan
- Decorator (`@Component`, `@Injectable`, dll) : metadata yang nempel di class
- Lifecycle Hooks : `ngOnInit`, `ngOnDestroy`, dll. Mirip `useEffect` di React
- @Input() / @Output() : cara komponen parent-child saling komunikasi, mirip props di React
- Pipe : transformasi data langsung di template, contoh: `{{ harga | currency }}`
- Observable : Observable lebih powerful: bisa di-cancel, bisa emit berkali-kali, bisa di-pipe

---

## Kapan Pakai Angular?

- Butuh struktur yang strict biar semua developer nulis kode dengan gaya yang sama
- Aplikasi enterprise yang kompleks
- Aplikasi yang memerlukan pemrosesan data real-time dan manajemen state yang kuat.
