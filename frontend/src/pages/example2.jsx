import { useState, useEffect, useRef } from "react"
import api from "../api/apiCheck"
import toast from "react-hot-toast"
import {
  User, Phone, MapPin, Building, Globe,
  Camera, Trash, Pencil, Check, ChevronRight,
  Briefcase, Code, FileText, Upload, Trash2, Plus, X, Download
} from "lucide-react"


const SectionCard = ({ id, title, icon: Icon, children, action }) => (
  <div id={id} className="bg-white border border-gray-200 rounded-2xl p-7 mb-5 shadow-sm hover:shadow-md transition-shadow scroll-mt-6">
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <Icon size={18} className="text-green-800" />
        <h2 className="font-serif text-lg font-normal text-gray-900">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </div>
)

const navItems = [
  { id: "personal-info", label: "Personal Information", icon: User },
  { id: "company-info", label: "Company Information", icon: Building },
  { id: "location", label: "Location", icon: MapPin },
  { id: "company-logo", label: "Company Logo", icon: Globe },
]

export default function RecruiterProfile() {

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeEdit, setActiveEdit] = useState(null)
  const [form, setForm] = useState({})
  const [picUrl, setPicUrl] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeSection, setActiveSection] = useState("personal-info")

  const picRef = useRef()
  const logoRef = useRef()

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/recruiter/profile")
      setProfile(data.profile)
      setForm({
        name: data.profile.name,
        mobileNumber: data.profile.mobileNumber,
        companyName: data.profile.companyName,
        companyAddress: data.profile.companyAddress,
        companyWebsite: data.profile.companyWebsite || "",
        industry: data.profile.industry || "",
        companySize: data.profile.companySize || "",
        aboutCompany: data.profile.aboutCompany || "",
        country: data.profile.country || "",
        state: data.profile.state || "",
        city: data.profile.city || "",
        linkedin: data.profile.linkedin || ""
      })
    } catch {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const fetchProfilePic = async () => {
    try {
      const res = await api.get("/recruiter/profile-pic", { responseType: "blob" })
      setPicUrl(URL.createObjectURL(res.data))
    } catch { }
  }

  const fetchLogo = async () => {
    try {
      const res = await api.get("/recruiter/company-logo", { responseType: "blob" })
      setLogoUrl(URL.createObjectURL(res.data))
    } catch { }
  }

  useEffect(() => {
    const load = async () => {
      await fetchProfile()
      await fetchProfilePic()
      await fetchLogo()
    }
    load()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      for (const item of [...navItems].reverse()) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveSection(item.id)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
    }
  }


  const saveProfile = async () => {
    try {
      await api.put("/recruiter/profile", form)
      toast.success("Profile updated!")
      setActiveEdit(null)
      fetchProfile()
    } catch {
      toast.error("Update failed")
    }
  }

  const uploadPic = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append("profilePic", file)
    try {
      await api.post("/recruiter/upload-profile-pic", fd)
      toast.success("Profile picture updated")
      setPicUrl(null)
      await fetchProfilePic()
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed")
    }
  }

  const deleteProfilePic = async () => {
    if (!confirm("Delete profile picture?")) return
    try {
      await api.delete("/recruiter/profile-pic")
      toast.success("Profile picture deleted")
      setPicUrl(null)
    } catch {
      toast.error("Failed to delete profile picture")
    }
  }

  const uploadLogo = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append("companyLogo", file)
    try {
      await api.post("/recruiter/upload-company-logo", fd)
      toast.success("Logo uploaded")
      await fetchLogo()
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed")
    }
  }

  const deleteLogo = async () => {
    if (!confirm("Delete company logo ?")) return
    try {
      await api.delete("/recruiter/company-logo")
      toast.success("logo picture deleted")
      await fetchLogo()
    } catch {
      toast.error("Failed to delete profile picture")
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none focus:border-green-800 focus:bg-white transition-colors"
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
  const btnPrimary = "inline-flex items-center gap-1.5 bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-green-900 transition-colors border-none"
  const btnOutline = "inline-flex items-center gap-1.5 bg-transparent border border-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:border-green-800 hover:text-green-800 transition-colors"
  const btnGhost = "inline-flex items-center gap-1.5 bg-transparent border-none text-gray-400 text-sm px-2 py-1.5 rounded-lg cursor-pointer hover:text-green-800 transition-colors"

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-stone-100">
      <div className="w-9 h-9 rounded-full border-2 border-gray-200 border-t-green-800 animate-spin" />
    </div>
  )

  if (!profile) return (
    <div className="flex items-center justify-center h-screen bg-stone-100">
      <p className="text-gray-400">Could not load profile.</p>
    </div>
  )

  return (
    <div className="bg-stone-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">

        {/* Hero Card */}
        <div className="relative overflow-hidden bg-green-900 rounded-2xl p-8 flex items-center gap-7 mb-6 flex-col sm:flex-row">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

          <div className="relative flex-shrink-0">
            {picUrl
              ? <img src={picUrl} alt="avatar" onClick={() => setShowImageModal(true)}
                className="w-24 h-24 rounded-full object-cover border-[3px] border-white/30 cursor-pointer hover:scale-105 transition" />
              : <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center border-[3px] border-white/20">
                <User size={38} color="rgba(255,255,255,0.6)" />
              </div>
            }
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-none cursor-pointer flex items-center justify-center text-green-800 shadow-md hover:scale-110 transition-transform"
              onClick={() => picRef.current.click()}>
              <Camera size={13} />
            </button>
            {picUrl && (
              <button onClick={deleteProfilePic}
                className="absolute -bottom-0 -left-1 w-5 h-5 px-1 py-1 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                <Trash size={10} />
              </button>
            )}
            <input ref={picRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={uploadPic} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="font-serif text-[2rem] text-white tracking-tight mb-1">{profile.name}</div>
            <div className="text-white/70 text-sm mb-3">{profile.email}</div>
            <div className="flex gap-2.5 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Building size={12} /> {profile.companyName}              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <MapPin size={12} /> {profile.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Phone size={12} /> {profile.mobileNumber}
              </span>
            </div>
          </div>
        </div>

        {/* split layout */}
        <div className="flex gap-5 items-start">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0 sticky top-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Links</p>
              </div>
              <nav className="py-2">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const isActive = activeSection === id
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left border-none cursor-pointer transition-all group
                        ${isActive
                          ? "bg-green-50 text-green-800 font-semibold border-r-[3px] border-r-green-800"
                          : "bg-transparent text-gray-600 hover:bg-gray-50 hover:text-green-800 font-medium border-r-[3px] border-r-transparent"
                        }`}
                      style={{ outline: "none" }}
                    >
                      <Icon
                        size={15}
                        className={isActive ? "text-green-800" : "text-gray-400 group-hover:text-green-700 transition-colors"}
                      />
                      <span className="flex-1 leading-tight">{label}</span>
                      <ChevronRight
                        size={13}
                        className={`transition-transform ${isActive ? "text-green-700" : "text-gray-300 group-hover:text-green-500"}`}
                      />
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          <div className="flex-1  min-w-0">


            {/* Mobile horizontal pill nav */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium border cursor-pointer transition-all
                    ${activeSection === id
                      ? "bg-green-800 text-white border-green-800"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-800 hover:text-green-800"
                    }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>
            {/* Personal Info */}

            <SectionCard id="personal-info" title="Personal Information" icon={User}
              action={
                <button onClick={() => setActiveEdit("personal")}><Pencil size={14} /></button>}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className={labelCls}>Name</label>
                  <input className={inputCls} value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>

                <div>
                  <label className={labelCls}>Mobile</label>
                  <input className={inputCls} value={form.mobileNumber}
                    onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} />
                </div>

              </div>

              <button onClick={saveProfile} className="mt-4 bg-green-800 text-white px-4 py-2 rounded">
                <Check size={14} /> Save
              </button>

            </SectionCard>
            <SectionCard id="personal-info" title="Personal Information" icon={User}
              action={activeEdit !== "info"
                ? <button className={btnGhost} onClick={() => setActiveEdit("info")}><Pencil size={14} /> Edit</button>
                : null}>
              {activeEdit === "info" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input className={inputCls} value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className={labelCls}>Mobile</label>
                      <input className={inputCls} value={form.mobileNumber}
                        onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} />
                    </div>
                    <div className="sm:col-span-2"><label className={labelCls}>Address</label><input className={inputCls} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} /></div>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button className={btnPrimary} onClick={saveInfo}><Check size={14} /> Save</button>
                    <button className={btnOutline} onClick={() => setActiveEdit(null)}><X size={14} /> Cancel</button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[{ label: "Full Name", value: profile.name }, { label: "Email", value: profile.email }, { label: "Mobile", value: profile.mobileNumber }, { label: "Gender", value: profile.gender }].map(({ label, value }) => (
                    <div key={label}><label className={labelCls}>{label}</label><p className="text-sm text-gray-900">{value}</p></div>
                  ))}
                  <div className="sm:col-span-2"><label className={labelCls}>Address</label><p className="text-sm text-gray-900">{profile.address}</p></div>
                </div>
              )}
            </SectionCard>

            {/* Company Info */}

            <SectionCard id="company-info" title="Company Information" icon={Building}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className={labelCls}>Company Name</label>
                  <input className={inputCls} value={form.companyName}
                    onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
                </div>

                <div>
                  <label className={labelCls}>Website</label>
                  <input className={inputCls} value={form.companyWebsite}
                    onChange={e => setForm(f => ({ ...f, companyWebsite: e.target.value }))} />
                </div>

                <div>
                  <label className={labelCls}>Industry</label>
                  <input className={inputCls} value={form.industry}
                    onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
                </div>

                <div>
                  <label className={labelCls}>Company Size</label>
                  <input className={inputCls} value={form.companySize}
                    onChange={e => setForm(f => ({ ...f, companySize: e.target.value }))} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>About Company</label>
                  <textarea className={inputCls} value={form.aboutCompany}
                    onChange={e => setForm(f => ({ ...f, aboutCompany: e.target.value }))} />
                </div>

              </div>

            </SectionCard>

            {/* Location */}

            <SectionCard id="location" title="Location" icon={MapPin}>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                <input className={inputCls} placeholder="Country"
                  value={form.country}
                  onChange={e => setForm(f => ({ ...f, country: e.target.value }))} />

                <input className={inputCls} placeholder="State"
                  value={form.state}
                  onChange={e => setForm(f => ({ ...f, state: e.target.value }))} />

                <input className={inputCls} placeholder="City"
                  value={form.city}
                  onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />

              </div>

            </SectionCard>

            {/* Company Logo */}

            <SectionCard id="company-logo" title="Company Logo" icon={Globe}>

              <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer"
                onClick={() => logoRef.current.click()}>

                {logoUrl
                  ? <img src={logoUrl} className="mx-auto h-20 object-contain" />
                  : <p>Upload Company Logo</p>
                }

              </div>

              <input ref={logoRef} type="file" className="hidden" onChange={uploadLogo} />

            </SectionCard>

          </div>
        </div>
      </div>
    </div>
  )
}