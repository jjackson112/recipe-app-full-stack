import React, { useState } from "react";

const LoginModal = ({onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        
    if (!username || !password) {
        setMessage("Please enter a valid username or password.")
        return;
    }

    try {
        const response = await fetch("https://recipe-app-frontend-gr6b.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.token) {
            localStorage.setItem("token", data.token);
            setUsername("") // reset field after login
            setPassword("") // reset field after login
            setMessage("")
            onClose() // Close modal
        } else {
            setMessage(data.error || "Login failed.");
        }
    } catch (err) {
        setMessage("Server error, please try again.");
    }
};

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
            <p><strong>Do you have an account?<br/> When you have an account, you can add, edit or delete recipes to the database.</strong></p>
            {message && <p style={{ color: 'red' }}>{message}</p>}
                <form onSubmit={handleLoginSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button id="login-submit-btn" className="header-auth-btns" type="submit">Submit</button>
                    <button id="login-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    )
}

export default LoginModal;