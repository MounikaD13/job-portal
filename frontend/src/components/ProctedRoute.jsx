/* import { Navigate,Outlet } from 'react-router-dom'
export default function ProtectedRoute({ children }) {
    console.log("from protected route", children)
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    const role=localStorage.getItem('role')
    //not logged in 
    if (!token || !user||!role) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />
    }
    //logged in 
    return <Outlet />
}*/
import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function ProtectedRoute() {
  const { user,loading } = useContext(AuthContext)
// ⛔ wait until auth check completes
  if (loading) return null   // or spinner
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}