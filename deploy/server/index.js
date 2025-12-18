require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT;
const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const SALT = process.env.SALT;
const FLAG = process.env.FLAG;

// sha1(salt + password)
function sha1Salted(password) {
  return crypto
    .createHash("sha1")
    .update(SALT + password, "utf8")
    .digest("hex");
}

const EXPECTED_HASH = sha1Salted(SECRET_PASSWORD);

app.use(
  cors({
    origin: "*", // доступ со всех источников
    exposedHeaders: ["X-Access-Denied", "X-Access-Granted"],
  })
);
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { password } = req.body || {};

  if (typeof password !== "string") {
    return res
      .status(400)
      .set("X-Access-Denied", "invalid-input")
      .json({ error: "Invalid password type" });
  }

  const actualHash = sha1Salted(password);

  // Проверка 1: правильный ли пароль (хеш)?
  if (actualHash !== EXPECTED_HASH) {
    return res
      .status(401)
      .set("X-Access-Denied", "hash-mismatch")
      .json({
        error: "Hash mismatch",
        expected: EXPECTED_HASH,
        actual: actualHash,
      });
  }

  // Проверка 2: передана ли соль в заголовке?
  const clientSalt = req.header("x-hash-salt");

  if (!clientSalt || clientSalt !== SALT) {
    // пароль верный, но соль не передана или неправильная
    return res
      .status(401)
      .set("X-Access-Denied", "salt-header-required")
      .json({
        error: "Salt header required or invalid",
        message: "You need to send x-hash-salt header with correct value",
      });
  }

  // обе проверки пройдены — доступ
  return res
    .status(200)
    .set("X-Access-Granted", "true")
    .json({
      message: "Access granted",
      redirect: "/forum",
      flag: FLAG,
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
