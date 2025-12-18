require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3001;
const SECRET_PASSWORD = process.env.SECRET_PASSWORD || "aquarium";
const SALT = process.env.SALT || "takuya";

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
        origin: "http://localhost:3000",
        exposedHeaders: ["X-Access-Denied", "X-Access-Granted"],
    })
);
app.use(express.json());

app.post("/api/login", (req, res) => {
    const { password } = req.body || {};
    const actualHash = sha1Salted(password);

    if (typeof password !== "string") {
        return res
            .status(400)
            .set("X-Access-Denied", "invalid input")
            .json({ error: "Invalid password type" });
    }

    // читаем кастомный заголовок с солью
    const clientSalt = req.header("x-hash-salt");

    if ((!clientSalt && clientSalt !== SALT) && actualHash == EXPECTED_HASH) {
        // соль не передана или неправильная — не пускаем
        return res
            .status(401)
            .set("X-Access-Denied", "invalid header and hash mismatch")
            .set("x-hash-salt", "header not used")
            .json({
                error: "Invalid salt header",
            });
    }

    if (actualHash !== EXPECTED_HASH) {
        return res
            .status(401)
            .set("X-Access-Denied", "hash mismatch")
            .json({
                error: "Hash mismatch",
                expected: EXPECTED_HASH,
                actual: actualHash,
            });
    }

    if (!clientSalt && clientSalt !== SALT) {
        // соль не передана или неправильная — не пускаем
        return res
            .status(401)
            .set("X-Access-Denied", "invalid salt header")
            .set("x-hash-salt", "header not used")
            .json({
                error: "Invalid salt header",
            });
    }

    // правильный пароль + верная соль в заголовке => доступ к форуму
    return res
        .status(200)
        .set("X-Access-Granted", "true")
        .json({
            message: "Access granted",
            redirect: "/forum",
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
