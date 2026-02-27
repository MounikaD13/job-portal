import { Navigate, Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function RoleRoute({ allowedRoles }) {
  const { user, role, loading } = useContext(AuthContext)

  if (loading) return null

  if (!user) return <Navigate to="/login" replace />

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}