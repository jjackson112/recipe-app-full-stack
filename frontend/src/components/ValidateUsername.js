import React, { useState } from "react";

const ValidateUsername = () => {
    const [username, setUsername] = useState("");
    const [isValidated, setIsValidated] = useState(false);
    const [validateMessage, setValidateMessage] = useState("");

// .trim() removes spaces
    const handleValidateUsername = async () => {
        if (!username.trim()) {
            setValidateMessage("Username is required.");
            return;
        }

        try {
            const res = await fetch("https://recipe-app-full-stack.onrender.com/api/validate-username", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            });

            const data = await res.json();

            if (res.ok) {
                setIsValidated(username);
                setValidateMessage("Username validated. You can now reset your password.");
            } else {
                setValidateMessage(data.message || "Username not found.");
            }
        } catch (err) {
            setValidateMessage("Server error during validation.");
        }
    };

    return (
        <div className="validate-username"> 
            <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username-validate"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value); 
                        setValidateMessage("");
                    }}
                />
            <button id="validate-username-btn" className="header-auth-btns" type="button" onClick={handleValidateUsername}>
                    Validate Username</button>
            {validateMessage && <p>{validateMessage}</p>}
        </div>
    )
}
    export default ValidateUsername;