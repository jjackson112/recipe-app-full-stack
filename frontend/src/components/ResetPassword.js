import React, { useState } from "react";


const ResetPassword = ({ username, onClose }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        if (!newPassword || !confirmPassword) {
            setMessage("Both fields are required")
        }

        try {
            const response = await fetch("https://recipe-app-full-stack.onrender.com/api/reset-password", {
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
                    <label htmlFor="new-password">New Password</label>
                        <input
                            type="password"
                            id="new-password"
                            placeholder="New password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <br/>
                    <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {message && <p>{message}</p>}

                <button id="reset-submit-btn" className="header-auth-btns" type="submit">Submit</button>
                <button id="reset-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default ResetPassword;