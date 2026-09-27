# Web2APK + Flutter2APK Bot — by KAIZEN

Bot Telegram dengan menu tombol, 2 fitur:
1. **Web ke APK** — bungkus URL website jadi APK (WebView/Capacitor)
2. **Flutter ke APK** — kirim file .zip project Flutter, di-build jadi APK

Build APK sepenuhnya jalan di GitHub Actions (gratis), bukan di HP — cocok buat Termux.

## Isi folder ini
```
web2apk-kaizen/
├── .github/workflows/build-apk.yml       # workflow build APK dari URL
├── .github/workflows/build-flutter.yml   # workflow build APK dari project Flutter
├── scripts/configure.js                  # isi URL & nama app + update strings.xml
├── scripts/set-icon.js                   # pasang icon custom
├── flutter-jobs/.gitkeep                 # folder tempat upload sementara project flutter
├── capacitor.config.json
├── package.json
├── www/index.html
└── bot.py                                # bot Telegram (JANGAN di-push ke repo publik!)
```

## CARA PAKAI DI TERMUX (tinggal unzip)

### 1. Extract file ini ke folder project kamu
```bash
cd ~/storage/downloads
unzip web2apk-kaizen.zip -d ~/
cd ~/web2apk-kaizen
```
(Kalau folder project lama kamu `~/web2apk` sudah ada dan sudah ke-link ke repo GitHub,
cukup copy file-file baru ini ke situ, jangan bikin folder git baru:)
```bash
cp -r ~/web2apk-kaizen/. ~/web2apk/
cd ~/web2apk
```

### 2. Isi token di bot.py (kalau belum)
Buka `bot.py`, cek bagian atas:
```python
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN", "...")
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN", "...")
GITHUB_OWNER   = os.getenv("GITHUB_OWNER", "...")
GITHUB_REPO    = os.getenv("GITHUB_REPO", "...")
```

### 3. Push file workflow & script ke GitHub (bot.py TIDAK ikut push)
```bash
echo "bot.py" >> .gitignore
git rm --cached bot.py 2>/dev/null
git add .
git commit -m "update: menu tombol + fitur flutter to apk"
git push
```

### 4. Jalankan bot
```bash
pip install python-telegram-bot requests --break-system-packages
python bot.py
```

### 5. Pakai di Telegram
- `/start` → muncul menu tombol:
  - **🔨 Web ke APK** → kirim URL → nama app → icon → APK jadi
  - **🐦 Flutter ke APK** → kirim nama app → kirim file .zip project Flutter (harus ada
    `pubspec.yaml` di root, maks ±20MB karena batas Telegram Bot API standar) → APK jadi
  - **📊 Status Bot** → cek status singkat

## Setting repo GitHub yang wajib
Settings → Actions → General → **Workflow permissions** → pilih **Read and write permissions**
(supaya Release/upload berjalan lancar).

## Catatan
- APK masih **debug/release build tanpa signing key resmi** — belum siap upload ke Play Store.
- Project Flutter yang di-upload otomatis dihapus dari repo GitHub setelah build selesai (cleanup).
- Kalau file Flutter kamu >20MB, perlu setup Local Bot API Server sendiri (di luar cakupan ini).
