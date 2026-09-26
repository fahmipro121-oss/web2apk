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

console.log(`Config diatur:
  Nama App : ${appName}
  URL      : ${url}
  Package  : ${packageId}
  Developer: KAIZEN`);
