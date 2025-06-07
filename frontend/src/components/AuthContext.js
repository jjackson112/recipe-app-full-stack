import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);
const apiUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : 'https://recipe-app-full-stack.onrender.com/api';


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // e.g., { username: 'testuser' }
    const [loading, setLoading] = useState(false)

// On initial load, check session via backend
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch(`${apiUrl}/current_user`, {
                    method: 'GET',
                    credentials: 'include', // important for cookies
                })

                if (res.ok) {
                    const data = await res.json()
                    setUser(data)
                    setIsLoggedIn(true)
                } else {
                    setUser(null)
                    setIsLoggedIn(false)
                }
            } catch (error) {
                console.error('Error checking current user', error)
                setUser(null)
                setIsLoggedIn(false)
            }
        }
        fetchCurrentUser()
    }, [])

    // Login after successful login request and recheck user
    const login = async (username, password) => {
        setLoading(true)
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Login failed");
            }

    // fetch current user info
        const userRes = await fetch(`${apiUrl}/current_user`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!userRes.ok) {
            throw new Error("Failed to fetch user info");
        }

        const userData = await userRes.json();
        setUser(userData);
        setIsLoggedIn(true);
    } catch (error) {
        console.error("Login error:", error);
        setUser(null);
        setIsLoggedIn(false);
        throw error;
    }  finally {
        setLoading(false)
    }
};

    // <--- ADD THIS LOGOUT FUNCTION ---
    const logout = async () => {    
        try {  
            await fetch(`${apiUrl}/logout`, {
                method: 'POST',
                credentials: 'include',
            })
        } catch (error) {
            console.error("Logout failed", error)
        }
        setIsLoggedIn(false)
        setUser(null)
    };

    // handleCategoryChange passed as a prop
    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
