import React from "react";

const LoginModal = ({onClose}) => {
    return (
        <div className="login-modal-overlay">
            <div className="login-modal-content">
                <form>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" />

                    <button id="register-btn" className="header-auth-btns" type="submit">Register</button>
                    <button id="register-close-btn" className="header-auth-btns" type="button" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    )
}

export default LoginModal;