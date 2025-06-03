import React, { useState } from "react";

const ResetPassword = ({ onClose }) => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const [username, setUsername] = useState("")
    const [isValidated, setIsValidated] = useState(false)
    const [validateMessage, setValidateMessage] = useState("")

    const handleReset = async (e) => {
        e.preventDefault();

    if (newPassword !== confirmPassword) {
        setMessage("Passwords don't match")
        return
    }

    try {
        const response = await fetch(`api/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({new_password: newPassword})
        })

        const data = await response.json()

        if (response.ok) {
            setMessage("Password reset is successful. Redirecting...")
            setTimeout(() => onClose(), 3000)
        } else {
            setMessage(data.message || "Reset failed.")
        } 
    } catch (err) {
            setMessage("An error has occurred. Please try resetting your password.")
    }
}

    return (
        <div className="reset-password-content">
            <form onSubmit={handleReset}>
                <h4>Reset Password</h4>
                <label htmlFor="username">Username</label>
                <input
                    type="username"
                    id="username-validate"
                    placeholder="Validate username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="new password">New Password</label>
                <input
                    type="password"
                    id="new-password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <label htmlFor="confirm password">Confirm Password</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button id="reset-password-submit-btn" className="header-auth-btns" type="submit">Submit</button>
                <button id="reset-password-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    )
}

export default ResetPassword;