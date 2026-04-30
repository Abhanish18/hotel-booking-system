 import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {

    if (!email) {
      alert("Enter email");
      return;
    }

    // 🔐 Role logic
    if (email === "admin@gmail.com") {
      localStorage.setItem("role", "admin");
    } else {
      localStorage.setItem("role", "user");
    }

    // 💾 Save email
    localStorage.setItem("email", email);

    // 🚀 Go to dashboard
    navigate("/home");
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0a1f44"
    }}>

      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "20px",
        width: "350px",
        textAlign: "center"
      }}>

        <h2>🔐 Login</h2>

        <input
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#d6a84a",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Login
        </button>

        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Admin: admin@gmail.com
        </p>

      </div>

    </div>
  );
}

export default Login;