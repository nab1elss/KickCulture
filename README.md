# KickCulture — Frontend

> **Sneakers Original untuk Langkahmu**  
> Platform e-commerce modern untuk sneakerhead dan pecinta fashion streetwear. Dibuat dengan **HTML5**, **CSS3 murni**, dan **Vanilla JavaScript (ES6+)** tanpa ketergantungan library/framework eksternal maupun build step.

---

## 📌 Sekilas Proyek

**KickCulture** menghadirkan pengalaman belanja online yang cepat, responsif, dan kaya animasi mikro (micro-interactions) dengan performa tinggi. Seluruh interaksi, keranjang belanja, wishlist, dan filter produk berjalan di sisi klien (client-side) menggunakan data lokal dan `localStorage`.

---

## ✨ Fitur Utama

### 1. 🎨 Desain & Tampilan Modern
- **Custom Preloader**: Animasi logo SVG KickCulture dengan transisi pembuka halaman yang halus.
- **Smart Sticky Header**: Header otomatis bersembunyi saat scroll ke bawah dan muncul kembali saat scroll ke atas, dilengkapi indikator navigasi berbentuk kapsul (pill) yang mengikuti posisi aktif.
- **Responsive Mobile Navigation**: Menu drawer ramah perangkat layar sentuh dengan transisi mulus.
- **Micro-Animations & Parallax**: Interaksi hover interaktif, efek 3D tilt pada produk, dan transisi halus di setiap elemen.
- **Dukungan Aksesibilitas**: Menghormati pengaturan sistem `prefers-reduced-motion` untuk pengguna yang membatasi animasi gerak.

### 2. 👟 Hero Section Interaktif
- **3 Dynamic Colorways**: Slider sepatu interaktif yang dapat berganti secara otomatis maupun manual.
- **Dynamic Background Adaptor**: Warna latar belakang hero berubah secara adaptif menyesuaikan warna tema varian sepatu yang dipilih.
- **Rotating Badge & Angled Marquee**: Badge melingkar berputar dan ticker dua arah bergaya streetwear.

### 3. 🍱 Bento Grid Kategori
- Tata letak bento box modern yang menampilkan kategori unggulan: *Running*, *Lifestyle*, *Pria*, dan *Wanita*.

### 4. 🛍️ Katalog Produk & Filter Dinamis
- **Kategori Filter**: Filter langsung tanpa reload halaman (*Semua, Running, Lifestyle, Basket, Skate, Promo*).
- **Quick View Modal**: Modal pratinjau detail produk dengan pilihan ukuran sepatu (EU 38–45), deskripsi, dan tombol aksi cepat.
- **Pencarian Cepat (Quick Search)**: Modal pencarian instan dengan shortcut keyboard (`/`).
- **Load More Pagination**: Tombol *Lihat Lebih Banyak* untuk menampilkan produk berikutnya secara bertahap.

### 5. 🛒 Keranjang Belanja & Wishlist (Persistent)
- **Local Storage Sync**: Semua data keranjang dan wishlist tersimpan otomatis di browser, tidak hilang saat halaman di-refresh.
- **Flying Item Animation**: Animasi gambar produk yang terbang menuju ikon keranjang saat ditambahkan.
- **Free Shipping Progress**: Indikator progress gratis ongkir otomatis (min. belanja Rp2.000.000).
- **Pengaturan Kuantitas & Hapus Item**: Kontrol fleksibel langsung dari sidebar drawer.

### 6. 🔥 Promosi & Fitur Komunitas
- **Flash Sale Countdown**: Penghitung waktu mundur real-time menuju akhir periode promo mingguan.
- **Limited Drop Carousel**: Carousel produk edisi terbatas yang mendukung drag/geser mouse dan touch swipe, dilengkapi indikator stok tersisa.
- **Testimonial & Community Gallery**: Ulasan pelanggan dan galeri komunitas berjalan (infinite auto-scroll).
- **Newsletter Subscription**: Form pendaftaran newsletter dengan validasi input dan toast notification.
- **Real-Time Store Status**: Indikator status toko otomatis (Buka / Tutup) yang sinkron dengan zona waktu WIB (09.00 - 21.00 WIB).

---

## 📂 Struktur Folder

```text
Frontend/
├── index.html              # Halaman utama aplikasi web
├── README.md               # Dokumentasi frontend KickCulture
└── assets/
    ├── css/
    │   └── style.css       # Seluruh styling, CSS variables, layout, dan animasi
    ├── js/
    │   ├── data.js         # Dummy dataset produk, kategori, dan konstanta
    │   └── script.js       # Seluruh interaksi UI, state management, dan event listeners
    └── images/
        ├── avatars/        # Foto profil testimoni
        ├── categories/     # Gambar thumbnail bento kategori
        ├── community/      # Gambar galeri komunitas streetwear
        ├── hero/           # Foto produk untuk hero slider
        ├── products/       # Foto katalog sepatu sneakers
        ├── drop-banner.jpg # Banner promosi drop
        ├── favicon.svg     # Favicon website KickCulture
        ├── flash-sale.jpg  # Banner flash sale
        └── logo.svg        # Logo vektor KickCulture
```

---

## 🚀 Cara Menjalankan

Karena proyek ini menggunakan HTML, CSS, dan JavaScript murni, Anda tidak memerlukan proses kompilasi atau instalasi dependensi (`npm install`).

### Opsi 1: Menggunakan Live Server di VS Code (Disarankan)
1. Buka folder `Frontend` atau root `KickCulture` di **Visual Studio Code**.
2. Pasang ekstensi **Live Server** (oleh Ritwick Dey) jika belum ada.
3. Klik kanan pada file `index.html` dan pilih **"Open with Live Server"**.
4. Website akan terbuka otomatis di peramban Anda pada alamat `http://127.0.0.1:5500`.

### Opsi 2: Menggunakan Python HTTP Server
Jika Anda memiliki Python yang terpasang di komputer:
```bash
# Masuk ke folder Frontend
cd Frontend

# Jalankan server lokal
python -m http.server 5500
```
Buka browser dan akses alamat: `http://localhost:5500`

### Opsi 3: Buka Langsung di Browser
Anda juga dapat langsung klik dua kali (double click) file `index.html` untuk membukanya di Google Chrome, Microsoft Edge, Mozilla Firefox, atau browser pilihan Anda.

> **Catatan**: Koneksi internet diperlukan saat pertama kali membuka halaman untuk memuat **Google Fonts** (*Anton*, *Space Grotesk*) dan stylesheet **Remix Icon** dari CDN.

---

## 🛠️ Teknologi yang Digunakan

- **HTML5**: Semantik, aksesibel, dan terstruktur rapi.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Keyframe Animations, dan Media Queries.
- **JavaScript (ES6+)**: Vanilla JS, Document Object Model (DOM) Manipulation, `localStorage` API, Event Delegation, `Intl.NumberFormat`.
- **Eksternal CDN**:
  - [Google Fonts](https://fonts.google.com/) (*Anton*, *Space Grotesk*)
  - [Remix Icon](https://remixicon.com/) (Ikon UI)

---

## 👤 Pembuat

Dikembangkan oleh **[nab1elss](https://github.com/nab1elss)**.
