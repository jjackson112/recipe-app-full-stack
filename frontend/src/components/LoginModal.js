import React, { useState } from "react";
import { useAuth } from './AuthContext'; // ADJUST THIS PATH based on where your AuthContext.js is located
import ValidateUsername from "./ValidateUsername";
import ChangeUsername from "./ChangeUsername";

const LoginModal = ({onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showValidateUsername, setShowValidateUsername] = useState(false);
    const [showChangeUsername, setShowChangeUsername] = useState(false)

    const { login, loading } = useAuth(); // <--- Get the login function from context

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage("Please enter both username and password."); // Improved clarity
            return;
        }

        try {
            await login(username, password); // the ONLY call needed
            setMessage("Login successful!");
            setUsername("");
            setPassword("");
            onClose(); // closes modal
        } catch (err) {
            console.error("Login failed:", err);
            setMessage("Login failed: " + err.message);
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <p><strong>Do you have an account?<br/> When you have an account, you can add, edit or delete recipes to the database.</strong></p>
                {message && <p className="error-message">{message}</p>}

                <form onSubmit={handleLoginSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setMessage("");}}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setMessage("");}}
                        required
                    />

                    <button id="login-submit-btn" className="header-auth-btns" type="submit" disabled={loading}> {loading ? "Logging in..." : "Submit"} </button>
                    <button id="login-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                    <button id="reset-password-btn" className="header-auth-btns" type="button" onClick={() => setShowValidateUsername(true)}>Reset Password</button>
                    <button id="reset-username-btn" className="header-auth-btns" type="button" onClick={() => setShowChangeUsername(true)}>Change Username</button>
                </form>

                {showValidateUsername && (
                    <div className="nested-modal">
                        <ValidateUsername onClose={() => {setShowValidateUsername(false)}} />
                    </div>
                )}
                {showChangeUsername && (
                    <div className="change-password">
                        <ChangeUsername onClose={() => {setShowChangeUsername(false)}} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginModal;