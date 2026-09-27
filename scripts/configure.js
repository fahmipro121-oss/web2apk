// configure.js - by KAIZEN
// Mengisi URL website, nama app, dan package ID ke capacitor.config.json
const fs = require("fs");
const path = require("path");

function getArg(name, fallback) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const url = getArg("url");
const appName = getArg("name", "Web2APK");
const packageId = getArg("package", "com.kaizen.web2apk");

if (!url) {
  console.error("ERROR: --url wajib diisi");
  process.exit(1);
}

const configPath = path.join(__dirname, "..", "capacitor.config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

config.appId = packageId;
config.appName = appName;
config.server = config.server || {};
config.server.url = url;
config.server.androidScheme = "https";
config.server.cleartext = true;

fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

// PENTING: npx cap sync TIDAK mengubah nama app native di strings.xml.
// Itu cuma dibuat sekali saat "npx cap add android" pertama kali.
// Jadi kita harus timpa manual di sini setiap build.
const stringsPath = path.join(
  __dirname, "..", "android", "app", "src", "main", "res", "values", "strings.xml"
);

if (fs.existsSync(stringsPath)) {
  let xml = fs.readFileSync(stringsPath, "utf8");
  const escaped = appName.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  xml = xml.replace(
    /<string name="app_name">.*?<\/string>/,
    `<string name="app_name">${escaped}</string>`
  );
  xml = xml.replace(
    /<string name="title_activity_main">.*?<\/string>/,
    `<string name="title_activity_main">${escaped}</string>`
  );

  fs.writeFileSync(stringsPath, xml);
  console.log(`strings.xml diupdate -> app_name: ${appName}`);
} else {
  console.log("strings.xml belum ada (folder android belum di-generate).");
}

console.log(`Config diatur:
  Nama App : ${appName}
  URL      : ${url}
  Package  : ${packageId}
  Developer: KAIZEN`);
