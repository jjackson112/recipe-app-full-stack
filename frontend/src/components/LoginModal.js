import React, { useState } from "react";
import { useAuth } from './AuthContext'; // ADJUST THIS PATH based on where your AuthContext.js is located
import ResetPassword from "./ResetPassword";

const LoginModal = ({onClose}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showResetModal, setShowResetModal] = useState(false)

    const { login } = useAuth(); // <--- Get the login function from context

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage("Please enter both username and password."); // Improved clarity
            return;
        }

        try { // <--- Entire fetch operation is within this try block
            // !!! CRITICAL: CORRECT THIS URL TO YOUR BACKEND API'S LOGIN ENDPOINT !!!
            // It should NOT be your frontend URL.
            const response = await fetch("https://recipe-app-full-stack.onrender.com/api/login", { // <--- CORRECTED URL ASSUMPTION
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) { // Check if the HTTP response status is 2xx
                if (data.access_token) { // Check if the backend actually sent a token
                    setMessage("Login successful!");
                    // CRITICAL: Use the login function from AuthContext to update global state
                    login(data.token, { username: username }); // Pass token and the username

                    setUsername(""); // Reset form fields
                    setPassword("");
                    // setMessage(""); // Message will disappear when modal closes
                    onClose(); // Close modal on success
                } else {
                    // This else block is for when response.ok is true but no token is found (unusual for login)
                    setMessage(data.message || "Login failed: No token received from server.");
                }
            } else {
                // This else block handles non-2xx HTTP responses (e.g., 401 Unauthorized, 400 Bad Request)
                setMessage(data.message || data.error || "Login failed. Please check your credentials.");
            }
        } catch (err) { // <--- This catch block now correctly handles errors from the entire try block
            console.error("Network or server error during login:", err); // Log the full error for debugging
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
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button id="login-submit-btn" className="header-auth-btns" type="submit">Submit</button>
                    <button id="login-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                    <button id="reset-password-btn" className="header-auth-btns" type="button" onClick={() => setShowResetModal(true)}>Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;