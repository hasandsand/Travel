# Wisata Islami Kareem - Web App & Portal Travel Umrah

Aplikasi Portal Travel Umrah & Haji Khusus dengan fitur pendaftaran jamaah, verifikasi dokumen, manifest kamar hotel & penerbangan, visualisasi statistik analitik, serta Laporan Keuangan & Laba/Rugi (P&L) periodik.

## 🚀 Panduan Hosting ke GitHub Pages

Proyek ini telah dikonfigurasi agar dapat langsung di-*deploy* secara otomatis ke **GitHub Pages**.

### Cara 1: Deploy Otomatis via GitHub Actions (Rekomendasi)

1. **Export / Push kode ini ke Repositori GitHub Anda**:
   - Di Google AI Studio, klik menu **Settings (ikon gear)** atau menu pojok kanan atas, lalu pilih **Export to GitHub** (atau Download ZIP lalu `git push` ke repo Anda).
2. **Buka Repositori di GitHub**:
   - Masuk ke tab **Settings** di repo GitHub Anda.
   - Pilih menu **Pages** di sidebar kiri.
   - Di bagian **Build and deployment** > **Source**, pilih **GitHub Actions**.
3. **Selesai**:
   - File alur kerja `.github/workflows/deploy.yml` akan otomatis mengompilasi proyek dan mempublikasikannya ke alamat URL:  
     `https://<username-github>.github.io/<nama-repo>/`

---

### Cara 2: Menjalankan Secara Lokal (Development)

```bash
# 1. Install dependensi
npm install

# 2. Jalankan development server
npm run dev

# 3. Build untuk produksi
npm run build
```
