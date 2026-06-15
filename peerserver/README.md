# RC Arena — Server PeerJS Sendiri

Server signaling kecil buat menggantikan broker publik PeerJS. Tugasnya cuma
**menjodohkan** dua HP (handshake WebRTC). Setelah konek, data mobil dikirim
**peer-to-peer**, tidak lewat server ini — jadi bebannya ringan.

> Kenapa perlu HTTPS/WSS? Halaman AR kamu dibuka lewat HTTPS. Browser memblokir
> koneksi WebSocket tidak aman (`ws://`) dari halaman HTTPS (mixed content).
> Jadi server signaling **wajib** diakses lewat `wss://` (HTTPS).

## Isi folder
- `server.js` — server PeerJS (Express + ExpressPeerServer)
- `package.json` — dependensi
- `Dockerfile` — buat deploy via container
- `Caddyfile` — reverse proxy + HTTPS otomatis (untuk VPS sendiri)

---

## 1. Tes di lokal (tanpa HTTPS)

```bash
cd peerserver
npm install
npm start
# -> PeerJS server listening on :9000/peer
```

Buka http://localhost:9000/ — harus muncul "RC Arena PeerJS server: OK".
Cukup untuk memastikan jalan; untuk AR lintas-HP lanjut ke HTTPS di bawah.

---

## 2. Cara termudah: deploy ke Render / Railway (HTTPS otomatis)

1. Push folder `peerserver/` ke sebuah repo GitHub.
2. Di Render.com → New → Web Service → pilih repo.
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Render otomatis kasih domain `https://namamu.onrender.com` (sudah HTTPS).
3. Selesai. Server kamu ada di `namamu.onrender.com`.

Railway/Fly.io polanya sama: deploy Node app, mereka kasih HTTPS otomatis.

---

## 3. VPS sendiri + Caddy (kontrol penuh)

Butuh: VPS, domain yang A-record-nya nunjuk ke IP VPS, Node 18+, dan Caddy.

```bash
cd peerserver
npm install
node server.js &                 # jalan di port 9000
# edit Caddyfile: ganti rc.domainmu.com dengan domainmu
caddy run --config Caddyfile     # Caddy urus TLS/HTTPS otomatis
```

Caddy akan ambil sertifikat Let's Encrypt sendiri, lalu mem-proxy
`https://rc.domainmu.com` → `localhost:9000`. WSS langsung jalan.

Pakai Docker? `docker build -t rc-peer . && docker run -p 9000:9000 rc-peer`
lalu taruh Caddy/nginx di depannya untuk TLS.

---

## 4. Arahkan app AR ke server kamu

Buka `markerless-ar-rc.html`, cari blok `PEER_CONFIG` di atas `<script type="module">`,
ganti jadi:

```js
const PEER_CONFIG = { host: 'rc.domainmu.com', port: 443, path: '/peer', secure: true };
```

- `host`  : domain server kamu (tanpa https://)
- `port`  : 443 untuk HTTPS (Render/Caddy)
- `path`  : `/peer` (sesuai server.js; ganti via env PEER_PATH kalau mau)
- `secure`: `true` (wajib karena pakai HTTPS)

Set balik ke `null` kapan saja untuk kembali ke broker publik.

---

## Catatan
- `allow_discovery` sengaja `false` supaya daftar peer tidak bisa diintip orang.
- Server ini stateless; mau scale tinggal jalankan beberapa instance di belakang
  load balancer dengan sticky session.
- Topologi app: pemain "Host" jadi relay (star). Untuk room besar, pertimbangkan
  pindah ke server-authoritative (kirim state ke server, server broadcast).
