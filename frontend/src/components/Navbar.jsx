// import React, { useContext } from 'react'
// import { AuthContext } from "../context/AuthContext"
// import { Link } from 'react-router-dom'

// export default function Navbar() {
//   const { logoutUser, user, role } = useContext(AuthContext)

//   return (
//     <div>
//       <Link to='/'>Home</Link>

//       {!user && (
//         <>
//           <Link to='/login'>Login</Link>
//           <Link to='/register'>Register</Link>
//         </>
//       )}

//       {role === 'jobseeker' ? (
//         <>
//           <Link to='/jobseeker/jobs'>Jobs</Link>
//           <Link to='/jobseeker/applied-jobs'>Applied</Link>
//           <Link to='/jobseeker/profile'>Profile</Link>
//           <button onClick={logoutUser}>Logout</button>
//         </>
//       ) : role === 'recruiter' ? (
//         <>
//           <Link to='/recruiter/profile'>Profile</Link>
//           <Link to='/recruiter/create-jobs'>Add Jobs</Link>
//           <button onClick={logoutUser}>Logout</button>
//         </>
//       ) : null}
//     </div>
//   )
// }
import React, { useContext, useState, useRef, useEffect } from 'react'
import { AuthContext } from "../context/AuthContext"
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { logoutUser, user, role } = useContext(AuthContext)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
      isActive(path)
        ? 'text-indigo-600 bg-indigo-50'
        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
    }`

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const profilePath = role === 'jobseeker' ? '/jobseeker/profile' : '/recruiter/profile'

  const navLinks = role === 'jobseeker'
    ? [
        { to: '/jobseeker/jobs', label: 'Browse Jobs' },
        { to: '/jobseeker/applied-jobs', label: 'Applied Jobs' },
      ]
    : role === 'recruiter'
    ? [
        { to: '/recruiter/create-jobs', label: 'Post a Job' },
        { to: '/recruiter/applied-jobs', label: 'Post a Job' },
      ]
    : []

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">Skill Scout</span>
          </Link>

          {/* Desktop Search Bar — only for logged-in users */}
          {/* {user && 
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills..."
                className="w-full pl-9 pr-4 py-1.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all placeholder:text-slate-400"
              />
            </div>
          </form>
          } */}

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 shrink-0 font-medium ">
            <Link to="/" className={linkClass('/')}>Home</Link>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {!user ? (
              <>
                <Link to="/login" className="px-4 py-1.5 font-medium text-slate-600 hover:text-[#0f172a] hover:bg-slate-100 rounded-md transition-all">
                  Log in
                </Link>
                <Link to="/register" className="px-4 py-1.5 font-semibold text-white bg-[#0f172a] hover:text-cyan-400 rounded-md shadow-sm transition-all">
                  Sign up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  role === 'recruiter' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {role === 'recruiter' ? '🏢 Recruiter' : '👤 Job Seeker'}
                </span>

                {/* Avatar with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-600 hover:border-indigo-400 hover:bg-indigo-200 transition-all focus:outline-none"
                  >
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50 animate-in">
                      {/* User info */}
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          {user?.name ?? user?.email ?? 'User'}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>

                      <Link
                        to={profilePath}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                        </svg>
                        Edit Profile
                      </Link>

                      <button
                        onClick={() => { logoutUser(); setDropdownOpen(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile: Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Search Bar — only for logged-in users */}
        {/* {user && (
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jobs, skills..."
              className="w-full pl-9 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all placeholder:text-slate-400"
            />
          </form>
        </div>
        )} */}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-4 space-y-1 shadow-md">
          <Link to="/" className={`block ${linkClass('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className={`block ${linkClass(link.to)}`} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-slate-100 mt-2">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="block text-center px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-[#0f172a] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-2 text-sm font-semibold text-white bg-[#0f172a] rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {/* User info row */}
                <div className="flex items-center gap-2 px-1 py-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-600">
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{user?.email ?? 'User'}</p>
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      role === 'recruiter' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                    </span>
                  </div>
                </div>

                <Link
                  to={profilePath}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                  </svg>
                  Edit Profile
                </Link>

                <button
                  onClick={() => { logoutUser(); setMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}