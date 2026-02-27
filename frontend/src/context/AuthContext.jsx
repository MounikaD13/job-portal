import { useState, useEffect, createContext } from "react";
import API from '../api/apiCheck'
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()//create some default database Store
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    //login automatic when page refreshed
    useEffect(()=>{
        const token=localStorage.getItem("token")
        if(token){
            API.get("/me")
            .then(res=>{
                setUser(res.data.user)
                setRole(res.data.role)
            })
            .catch(()=>{
                localStorage.removeItem("token")
            })
            .finally(()=>setLoading(false))
        }
        else{
            setLoading(false)
        }
    },[])
    const loginUser = (data) => {
        setUser(data.user)
        setRole(data.role)
        localStorage.setItem("token", data.token)
        // localStorage.setItem("user", JSON.stringify(data.user))
        // localStorage.setItem("role", data.role)
        navigate("/")
    }
    const logoutUser = async () => {
        await API.post("/logout")
            .then((res) => {
            // console.log(res.data)
                localStorage.removeItem("token")
                // localStorage.removeItem("user")
                // localStorage.removeItem("role")
                setUser(null)
                setRole(null)
                navigate("/login")
            })
    }
    return (

        <AuthContext.Provider value={{ loginUser, logoutUser, user, role,loading }}>
            {children}
        </AuthContext.Provider>

    )
}