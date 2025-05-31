import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode from jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // e.g., { username: 'testuser' }

    // On initial load, check if token exists
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // You might want to decode the token to get user info
            try {
                const decodedToken = jwtDecode(token); // requires jwt-decode library
                setUser({ username: decodedToken.username }) //set user data from token
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to decode token or token is invalid:", error);
                // Clear invalid token
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setUser(null);
            }
        }
    }, []);

    // Login function: takes token and optional user data (e.g., if backend sends it separately)
    const login = (token, userDataFromBackend = null) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);

        if (userDataFromBackend) {
            // If backend provides user data directly (e.g., {id: 1, username: 'testuser'})
            setUser(userDataFromBackend);
        } else {
            // Otherwise, decode from the token (ensure 'username' claim exists in your JWT)
            try {
                const decodedToken = jwtDecode(token);
                setUser({ username: decodedToken.username });
            } catch (error) {
                console.error("Failed to decode token on login:", error);
                setUser(null); // Or set a default like { username: 'User' }
            }
        }
    };

    // <--- ADD THIS LOGOUT FUNCTION ---
    const logout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        setIsLoggedIn(false); // Set login status to false
        setUser(null); // Clear the user data
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);