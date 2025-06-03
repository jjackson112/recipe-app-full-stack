import React, { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ResetPassword = ({ onClose }) => {
    const [username, setUsername] = useState("");
    const [isValidated, setIsValidated] = useState(false);
    const [validateMessage, setValidateMessage] = useState("");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleValidateUsername = async () => {
        if (!username.trim()) {
            setValidateMessage("Username is required.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/validate-username`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (res.ok) {
                setIsValidated(true);
                setValidateMessage("Username validated. You can now reset your password.");
            } else {
                setValidateMessage(data.message || "Username not found.");
            }
        } catch (err) {
            setValidateMessage("Server error during validation.");
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();

        if (!isValidated) {
            setMessage("Please validate your username first.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setMessage("Passwords are required")
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, new_password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage("Password reset successful. Redirecting...");
                setTimeout(() => onClose(), 3000);
            } else {
                setMessage(data.message || "Password reset failed.");
            }
        } catch (err) {
            setMessage("Server error. Please try again.");
        }
    };

    return (
        <div className="reset-password-content">
            <form onSubmit={handleReset}>
                <h4>Reset Password</h4>

                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username-validate"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value); 
                        setValidateMessage("");
                        setMessage("")
                    }}
                />
                <button type="button" onClick={handleValidateUsername}>
                    Validate Username
                </button>
                {validateMessage && <p>{validateMessage}</p>}

                {isValidated && (
                    <>
                        <label htmlFor="new-password">New Password</label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}

                {message && <p>{message}</p>}

                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default ResetPassword;
