# Web2APK Bot — by KAIZEN

Bot Telegram yang mengubah URL website jadi file APK, build otomatis lewat
GitHub Actions (gratis, jalan di cloud — cocok dipakai dari Termux tanpa PC).

## Struktur

```
web2apk-kaizen/
├── .github/workflows/build-apk.yml   # workflow build APK
├── scripts/configure.js              # isi URL & nama app ke config
├── scripts/set-icon.js               # pasang icon custom
├── capacitor.config.json             # config Capacitor
├── package.json
├── www/index.html                    # fallback offline page
└── bot.py                            # bot Telegram
```

## Setup (urutan)

### 1. Buat repo GitHub
- Buat repo baru, misal `web2apk-kaizen`
- Push semua isi folder ini ke repo tsb (branch `main`)
- Jalankan sekali di lokal/Termux untuk generate project Android:
  ```
  npm install
  npm install -g @capacitor/cli
  npx cap add android
  git add . && git commit -m "init android project" && git push
  ```
  (folder `android/` wajib ada di repo supaya workflow bisa build)

### 2. Buat Personal Access Token (PAT)
- GitHub → Settings → Developer settings → Personal access tokens → Fine-grained (atau classic)
- Scope minimal: `repo`, `workflow`
- Simpan token-nya (tidak akan muncul lagi)

### 3. Buat bot Telegram
- Chat @BotFather di Telegram → `/newbot` → catat token bot

### 4. Setup di Termux
```
pkg install python git -y
pip install python-telegram-bot requests --break-system-packages
```

### 5. Isi konfigurasi
Buka `bot.py`, isi (atau set sebagai environment variable):
```
TELEGRAM_TOKEN = "token bot dari BotFather"
GITHUB_TOKEN   = "PAT dari langkah 2"
GITHUB_OWNER   = "username github kamu"
GITHUB_REPO    = "web2apk-kaizen"
```

### 6. Jalankan bot
```
python bot.py
```
Biar tetap hidup walau app ditutup, pakai `tmux`:
```
pkg install tmux
tmux new -s bot
python bot.py
# tekan Ctrl+B lalu D untuk keluar tanpa mematikan bot
```

## Alur pemakaian bot
1. `/start` → bot minta URL website
2. Kirim URL → bot minta nama aplikasi
3. Kirim nama app → bot minta icon (atau `/skip`)
4. Bot trigger GitHub Actions, polling status build
5. Kalau sukses, bot kirim file `.apk` langsung ke chat

## Catatan
- Build APK jalan sepenuhnya di GitHub Actions (gratis untuk repo publik/limit
  bulanan untuk privat) — bukan di HP, jadi ringan buat Termux.
- Kalau dulu kamu dapat error `404 Not Found` saat trigger workflow, biasanya karena:
  - file `build-apk.yml` belum ke-push ke branch `main`
  - nama file workflow di `bot.py` (`WORKFLOW_FILE`) tidak cocok
  - PAT tidak punya scope `workflow`
- APK yang dihasilkan masih **debug build** (belum ditandatangani untuk rilis
  Play Store). Untuk rilis resmi perlu tambah step signing dengan keystore.
