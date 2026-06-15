# RC Arena — Markerless AR

Mobil RC di AR tanpa marker (WebXR). Solo & multiplayer, suara mesin, drift,
arena + rintangan. Jalan di **Chrome Android** (perangkat ARCore). iOS Safari
belum mendukung WebXR.

## Struktur
```
rc-arena/
├── index.html        ← game-nya (buka ini)
├── rc-car.glb        ← model mobil (biner; jangan di-edit teks)
├── .nojekyll         ← biar GitHub Pages nggak utak-atik file
└── peerserver/       ← (opsional) signaling server sendiri — BUKAN untuk Pages
```

## Deploy game (GitHub Pages — gratis, HTTPS otomatis)
1. Buat repo baru → **Add file → Upload files** → drag SELURUH isi folder ini
   (termasuk `rc-car.glb` yang biner — harus di-upload, bukan di-paste).
2. **Settings → Pages →** Source: branch `main`, folder `/ (root)` → Save.
3. Tunggu 1–2 menit, dapat URL `https://username.github.io/nama-repo/`.
4. Buka di Chrome Android → izinkan kamera.

> WebXR butuh HTTPS. GitHub Pages sudah HTTPS, jadi aman. Jangan buka `file://`.

## Mode main
- **Solo / multiplayer broker publik:** langsung jalan, tidak perlu server.
- **Multiplayer:** isi nama + kode room sama, satu "Host", sisanya "Gabung",
  lalu kalibrasi 2 titik (tap titik A & B yang sama secara fisik).

## Pakai server sendiri (opsional)
Folder `peerserver/` **tidak** jalan di GitHub Pages (Pages cuma file statis).
Deploy ke Render/Railway, lalu ubah `PEER_CONFIG` di `index.html`.
Detail lengkap di `peerserver/README.md`.

## Ganti model mobil sendiri
Di `index.html` set `USE_GLB = true`, host `rc-car.glb` di folder yang sama.
Model harus Y-up, ground di y≈0, roda jadi node bernama
`wheel_FL / wheel_FR / wheel_RL / wheel_RR`.
