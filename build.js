const fs = require("fs");
const path = require("path");

const rootDir = __dirname;
const frontendDist = path.join(rootDir, "frontend", "dist");
const backendPublic = path.join(rootDir, "backend", "public");

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

function copyDir(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Folder source tidak ditemukan: ${source}`);
  }

  fs.mkdirSync(target, { recursive: true });

  const items = fs.readdirSync(source);

  for (const item of items) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

console.log("Membersihkan folder backend/public...");
removeDir(backendPublic);

console.log("Menyalin hasil build React ke backend/public...");
copyDir(frontendDist, backendPublic);

console.log("Build production selesai.");
