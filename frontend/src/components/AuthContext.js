import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode from jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(null); // e.g., { username: 'testuser' }
    const [isLoggedIn, setIsLoggedIn] = useState(!!token);

    // decodedToken.sub is not a string, it's actually an object
    // pay attention to how the JWT token's payload looks and gengerates on the backend

    // On initial load, check if token exists
    useEffect(() => {
        if (token) {
            // You might want to decode the token to get user info
            try {
                const decodedToken = jwtDecode(token); // requires jwt-decode library
                const username = decodedToken?.sub?.username || decodedToken?.username || decodedToken?.name //set user data from token
                setUser({ username })
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Failed to decode token or token is invalid:", error);
                // Clear invalid token
                localStorage.removeItem('token');
                setToken(null)
                setIsLoggedIn(false);
                setUser(null); // Clear the user data
            }
        } else {
            setIsLoggedIn(false)
            setUser(null)
        }
    }, [token]); // re-run when token changes

    // Login function: takes token and optional user data (e.g., if backend sends it separately)
    const login = (token, userDataFromBackend = null) => {
        localStorage.setItem('token', token);
        setToken(token);
        setIsLoggedIn(true);

        if (userDataFromBackend) {
            // If backend provides user data directly (e.g., {id: 1, username: 'testuser'})
            setUser(userDataFromBackend);
        } else {
            // Otherwise, decode from the token (ensure 'username' claim exists in your JWT)
            try {
                const decodedToken = jwtDecode(token);
                const username = decodedToken?.sub?.username || decodedToken?.username || decodedToken?.name
                setUser({username })
            } catch (error) {
                console.error("Failed to decode token on login:", error);
                setUser(null); // Or set a default like { username: 'User' }
            }
        }
    };

    // <--- ADD THIS LOGOUT FUNCTION ---
    const logout = () => {
        localStorage.removeItem('token'); // Remove the token from local storage
        setToken(null)
        setUser(null)
        setIsLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);