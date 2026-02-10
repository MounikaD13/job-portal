import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from "../api/apiCheck"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await API.post("/login", { email, password })

      localStorage.setItem("accessToken", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      localStorage.setItem("role", res.data.role)

      switch (res.data.role) {
        case "jobseeker":
          navigate("/jobseeker/dashboard")
          break
        case "recruiter":
          navigate("/recruiter/dashboard")
          break
        case "admin":
          navigate("/admin/dashboard")
          break
        default:
          navigate("/")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)]">
      <div className="bg-white w-[92%] sm:w-[80%] md:w-[60%] lg:w-[40%] rounded-xl shadow-2xl p-[2rem]">

        <h1 className="text-[1.6rem] font-bold text-center mb-[1.5rem]">
          <span className="text-[#3fd1f2]">User</span>
          <span className="text-[#22e1a1]"> Login</span>
        </h1>

        {error && (
          <div className="mb-[1.2rem] p-[0.8rem] rounded-lg text-[0.9rem] font-semibold bg-red-100 text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-[1.2rem]">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-[1rem] py-[0.9rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3fd1f2]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-[1rem] py-[0.9rem] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22e1a1]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-[0.9rem] rounded-lg text-white font-bold bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)] hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-[0.9rem] mt-[1.4rem] text-slate-600">
          Don’t have an account?
          <Link to="/register" className="text-purple-700 font-semibold ml-[0.3rem]">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}
