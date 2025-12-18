/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      const accessDeniedHeader = res.headers.get("X-Access-Denied");

      if (!res.ok) {
        // Ошибка: неправильный пароль (hash mismatch)
        if (accessDeniedHeader === "hash-mismatch") {
          console.error(
            `AssertionError: Hash mismatch:\n  expected = ${data.expected}\n  actual   = ${data.actual}`
          );
          console.error("Access denied");
          setError("Hash mismatch - incorrect password");
          return;
        }

        // Ошибка: пароль верный, но не передана соль
        if (accessDeniedHeader === "salt-header-required") {
          console.warn(
            "Salt header required!"
          );
          console.warn(data.message);
          setError("Salt header is required to gain access");
          return;
        }

        // Другая ошибка
        console.error("Login error:", data.error);
        setError(data.error || "Login failed");
        return;
      }

      // Успешный вход
      console.log("Access granted, redirecting to forum...");
      navigate("/forum", { state: { flag: "{" + data.flag + "}"} });
    } catch (err) {
      console.error("Request failed:", err);
      setError("Connection error");
    }
  };

  return (
    <div className="App App-login">
      <h1 className="title-glow">Hash Collider XMAS Edition</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="password"
          placeholder="Введите пароль..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-2000"
        />
        <button type="submit" className="btn-2000">
          Войти
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="snow-footer">* * * Merry Pwnmas 2000 * * *</div>
    </div>
  );
}

function ForumPage() {
  const location = useLocation();
  const flag = location.state?.flag || "flag{not_found}";

  return (
    <div className="App forum-bg">
      <div className="forum-container">
        <div className="forum-header">
          <marquee behavior="scroll" direction="left">
            🎄 Welcome to XMAS h4x0r forum v2.0 (c) 2000 🎄
          </marquee>
        </div>

        <table className="forum-table" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              <th>Тема</th>
              <th>Автор</th>
              <th>Ответов</th>
              <th>Последнее сообщение</th>
            </tr>
          </thead>
          <tbody>
            <tr className="forum-row-highlight">
              <td>
                <b>[STICKY]</b> *** OFFICIAL XMAS CTF FLAG ***
              </td>
              <td>admin_santa</td>
              <td>1337</td>
              <td>Сегодня, 00:00</td>
            </tr>
            <tr>
              <td>
                Re: *** OFFICIAL XMAS CTF FLAG ***
                <br />
                <span className="flag-text">{flag}</span>
              </td>
              <td>rudolf</td>
              <td>1</td>
              <td>Сегодня, 00:01</td>
            </tr>
            <tr>
              <td>Как украсить модем гирляндой?</td>
              <td>dialup_56k</td>
              <td>4</td>
              <td>Вчера, 23:59</td>
            </tr>
          </tbody>
        </table>

        <div className="forum-footer">
          <blink>Powered by phpBB v1.4 (но на самом деле React)</blink>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forum" element={<ForumPage />} />
    </Routes>
  );
}

export default App;
