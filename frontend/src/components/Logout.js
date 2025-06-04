import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // adjust path if needed

// remove the token to logout and then redirect

const Logout = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        // localStorage.getItem('token') - removed since nothing is being done with the token
        logout()
        navigate("/")
    }, [logout, navigate]) // why not an empty dependency array to run only once - see note below

    return null // no need to render anything
}

export default Logout;

/* But according to the React Hooks rules, any function or variable you use 
inside a useEffect should be declared in the dependency array 
— even if it's stable — because React wants to ensure correctness 
if anything ever does change. */