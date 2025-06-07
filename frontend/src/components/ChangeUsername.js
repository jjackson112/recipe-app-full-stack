import React, { useState } from "react";
import { toast } from "react-toastify";
import ValidateUsername from "./ValidateUsername";

const ChangeUsername = ({ onClose, username }) => {
    const [newUsername, setNewUsername] = useState("");
    
    const handleUsernameChangeSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/update_username', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ new_username: newUsername })
            })

            const data = await response.json()

            if (response.ok) {
                toast.success("Username updated!", "success")
                setNewUsername=("")
                onClose()
            } else {
                toast.error(data.error || "Something went wrong.", "error")
            }
        } catch (error) {
            toast.error("Server error", "error")
        }
    }

    return (
        <form onSubmit={handleUsernameChangeSubmit}>
            <div className="change-username-content">
                <label htmlFor="update-username">New Username</label>
                <input
                    type="username"
                    id="update-username"
                    placeholder="New Username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                />
                <button id="update-username-btn" className="header-auth-btns" type="submit" disabled={!newUsername.trim()}>Submit</button>
                <button className="header-auth-btns" type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
    )
}
export default ChangeUsername;