import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from "../api/apiCheck"
import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'

export default function Login() {
  const { loginUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) return showMessage('Please fill all fields', 'error')
    setLoading(true)
    try {
      const res = await API.post("/login", { email, password })
      loginUser(res.data)
      switch (res.data.role) {
        case "jobseeker": navigate("/jobseeker/profile"); 
        break
        case "recruiter": navigate("/recruiter/profile"); 
        break
        case "admin": navigate("/admin/dashboard"); 
        break
        default: navigate("/")
      }
    } catch (err) {
      showMessage(err.response?.data?.message || "Login failed", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">

      {/* ── LEFT PANEL ── */}
      <div className="lg:w-[50%] w-full bg-[#0f172a] text-white px-[6%] py-[2.5rem] lg:py-0 relative overflow-hidden">

        {/* background blobs */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 60% at 20% 70%, rgba(20,184,166,0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(6,182,212,0.12) 0%, transparent 60%)",
          }}
        />

        {/* MOBILE VIEW */}
        <div className="block lg:hidden text-center z-10 py-[1.5rem]">
          <p className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-cyan-400 mb-[0.8rem]">
            Your career, elevated
          </p>

          <h1 className="text-[2rem] font-bold leading-tight">
            Find your next <br />
            <span className="text-cyan-400">dream role</span>
            <br />
            today.
          </h1>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex flex-col justify-center h-full py-[3rem] px-[8%] relative z-10">

          {/* center content */}
          <div>
            <p className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-cyan-400 mb-[1rem]">
              Your career, elevated
            </p>

            <h1
              style={{
                fontSize: "clamp(2.2rem,3.5vw,3rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1.4rem",
              }}
            >
              Find your next <br />
              <span className="text-cyan-400">dream role</span>
              <br />
              today.
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.75,
                maxWidth: 360,
              }}
            >
              Connect with recruiters, track applications, and land the job you
              deserve — all in one place.
            </p>
          </div>

          {/* stats */}
          <div className="flex gap-[2.5rem] mt-[3rem]">
            <div>
              <p className="text-[1.6rem] font-bold">12k+</p>
              <p className="text-[0.75rem] text-white/45 mt-[0.2rem]">
                Active jobs
              </p>
            </div>

            <div>
              <p className="text-[1.6rem] font-bold">4.8k</p>
              <p className="text-[0.75rem] text-white/45 mt-[0.2rem]">
                Companies
              </p>
            </div>

            <div>
              <p className="text-[1.6rem] font-bold">98%</p>
              <p className="text-[0.75rem] text-white/45 mt-[0.2rem]">
                Satisfaction
              </p>
            </div>
          </div>

        </div>
      </div>
      {/* ── RIGHT PANEL ── */}
      <div className="lg:w-[50%] w-full flex items-center justify-center bg-[#f8fafc] py-[1rem]">

        <div className="w-[100%] sm:w-[95%] md:w-[75%] lg:w-[80%] bg-white rounded-[1.2rem] shadow-[0_1rem_2rem_rgba(0,0,0,0.08)] p-[3rem]">

          <h2 className="text-[1.8rem] font-bold text-[#0f172a]">Sign In</h2>
          <p className="text-[1rem] text-gray-500 mt-[0.5rem] mb-[2rem]">
            Enter your credentials to continue
          </p>

          {message.text && (
            <div className={`mb-[1.5rem] p-[1rem] rounded-[0.6rem] text-[0.95rem] font-medium flex items-center gap-[0.5rem] ${message.type === 'success'
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
              {message.type === 'success'
                ? <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                : <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              }
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-[1.5rem]">

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem] border border-gray-200 focus:outline-none focus:border-cyan-400 text-[0.95rem]"
            />

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem] border border-gray-200 focus:outline-none focus:border-cyan-400 text-[0.95rem] pr-[3rem]"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-[1rem] top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition"
                tabIndex={-1}
              >
                {showPass
                  ? <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                }
              </button>
            </div>

            <div className="flex justify-end" style={{ marginTop: '-0.5rem' }}>
              <Link to="/forgot-password" className="text-[0.85rem] font-medium text-cyan-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-[1rem] rounded-[0.6rem] bg-[#0f172a] text-white font-semibold hover:bg-black transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-[0.5rem]"
            >
              {loading && (
                <span className="inline-block w-[14px] h-[14px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

          </form>

          <p className="text-[0.95rem] text-gray-500 mt-[1.5rem]">
            Don't have an account?
            <Link to="/register" className="ml-[0.4rem] font-medium text-cyan-600 hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}