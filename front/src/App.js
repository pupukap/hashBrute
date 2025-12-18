import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

function LoginPage() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(
          `AssertionError: Hash mismatch:\n  expected = ${data.expected}\n  actual   = ${data.actual}`
        );
        console.error("Access denied");
        return;
      }

      console.log("Access granted, redirecting to forum...");
      navigate("/forum");
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <div className="App App-login">
      <h1 className="title-glow">hashBrute XMAS Edition</h1>
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
      <div className="snow-footer">* * * Merry Pwnmas 2000 * * *</div>
    </div>
  );
}

function ForumPage() {
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
                Re: *** OFFICIAL XMAS CTF FLAG ***<br />
                <span className="flag-text">
                  flag&#123;h4ppy_n3w_y3ar_fr0m_2000s_forum&#125;
                </span>
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
