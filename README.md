## E-Ticketing

Aplikasi sederhana ini digunakan untuk melakukan pemesanan tiket konser secara Online.

## Tools yang Digunakan

-   **[Laravel](https://laravel.com/)**
-   **[ReactJS](https://reactjs.org/)**
-   **[InertiaJS](https://inertiajs.com/)**
-   **[Vite](https://vitejs.dev/)**
-   **[Tailwind](https://tailwindcss.com/)**
-   **[Daisy UI](https://daisyui.com/)**
-   **[MySQL](https://www.mysql.com/)**

## Config

-   Database: e-ticketing
    Login Admin
-   Username: agenx@gmail.com
-   Password : 12345678

## Tahapan Installasi

Prasyarat

-   Composer
-   NodeJS

Buka terminal, arahkan pada root directory aplikasi kemudian jalankan perintah berikut:

```
$ composer update
```

Donwload dependensi yang dibutuhkan oleh ReactJS, dll :

```
$ npm run install
```

setelah dependensi yang dibutuhkan sudah didownload kemudian lakukan migrasi database atau restore file database.sql

```
$ php artisan migrate --seed
```

jalankan aplikasi

```
$ php artisan serve
```

```
$ npm run dev
```
