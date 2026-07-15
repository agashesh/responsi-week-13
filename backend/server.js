const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const cvFilePath = path.join(__dirname, "data", "cv.json");

function readCvData() {
  const file = fs.readFileSync(cvFilePath, "utf-8");
  return JSON.parse(file);
}

app.get("/", (req, res) => {
  res.json({
    message: "Backend CV Express.js berjalan dengan baik",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server aktif",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/cv", (req, res) => {
  try {
    const cvData = readCvData();
    res.json(cvData);
  } catch (error) {
    res.status(500).json({
      error: "Gagal membaca data CV",
      message: error.message,
    });
  }
});

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  next();
});

app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint tidak ditemukan",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend berjalan di http://localhost:${PORT}`);
  console.log(`📄 Endpoint CV: http://localhost:${PORT}/api/cv`);
});
