import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // e.g., { username: 'testuser' }

// On initial load, check session via backend
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/current_user`, {
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
    const login = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/current_user`, {
            method: 'GET',
            credentials: 'include',
        })
        
        if (res.ok) {
            const data = await res.json()
            setUser(data)
            setIsLoggedIn(true)
        }
    };

    // <--- ADD THIS LOGOUT FUNCTION ---
    const logout = async () => {        
        await fetch(`{import.meta.env.VITE_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        })

        setIsLoggedIn(false)
        setUser(null)
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);