import React, { useState } from "react";

const RegisterModal = ({ onClose }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        
    const response = await fetch("https://recipe-app-full-stack.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
        const data = await response.json();

    if (response.ok) {
        setMessage("Registration successful! Please log in.");
        setIsRegistered(true);
        setUsername(""); // reset form field after registration
        setPassword(""); // reset form field after registration
        onClose(); // optionally close modal after success
    } else {
        setMessage(data.error || "Registration failed. Please try again.");
    }
}

    return (
        <div className="register-modal-overlay">
            <div className="register-modal-content">
                <h4>Already have an account?</h4>
                {message && <p className="register-message">{message}</p>}
                <form onSubmit={handleRegisterSubmit}>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="register-username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                    <label htmlFor="password">Password</label>
                    <input type="password" id="register-password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button id="register-submit-btn" className="header-auth-btns" type="submit">Submit</button>
                    <button id="register-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    )
}

export default RegisterModal;