// set-icon.js - by KAIZEN
// Salin icon-source.png ke semua slot mipmap Android (tanpa resize presisi,
// Android akan otomatis scale; untuk hasil terbaik pakai gambar 512x512).
const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "assets", "icon-source.png");

if (!fs.existsSync(source)) {
  console.log("Tidak ada icon custom, pakai default Capacitor.");
  process.exit(0);
}

const mipmapDirs = [
  "mipmap-mdpi",
  "mipmap-hdpi",
  "mipmap-xhdpi",
  "mipmap-xxhdpi",
  "mipmap-xxxhdpi",
];

const resBase = path.join(__dirname, "..", "android", "app", "src", "main", "res");

for (const dir of mipmapDirs) {
  const target = path.join(resBase, dir);
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  fs.copyFileSync(source, path.join(target, "ic_launcher.png"));
  fs.copyFileSync(source, path.join(target, "ic_launcher_round.png"));
  fs.copyFileSync(source, path.join(target, "ic_launcher_foreground.png"));
}

console.log("Icon berhasil dipasang di semua ukuran mipmap. - KAIZEN");
