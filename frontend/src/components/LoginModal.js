import React, { useState } from "react";

const LoginModal = ({onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

    const response = await fetch("https://recipe-app-frontend-gr6b.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        onClose(); // Close modal
    } else {
        alert("Login failed.");
    }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content" onSubmit={handleLoginSubmit}>
                <form>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button id="register-btn" className="header-auth-btns" type="submit">Register</button>
                    <button id="register-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    )
}

export default LoginModal;