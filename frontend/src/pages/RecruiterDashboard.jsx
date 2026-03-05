import { useState, useEffect, useRef } from "react"
import api from "../api/apiCheck"
import toast from "react-hot-toast"
import {
  User,
  Phone,
  MapPin,
  Building,
  Briefcase,
  Camera,
  Pencil,
  Check,
  X,
  Globe,
  Eye,
  Trash2,
  Upload,
  ChevronRight
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
  { id: "recruiter-info", label: "Recruiter Information", icon: User },
  { id: "company-info", label: "Company Information", icon: Building },
  { id: "location", label: "Location", icon: MapPin },
  { id: "company-logo", label: "Company Logo", icon: Globe }
]

export default function RecruiterProfile() {

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({})
  const [activeEdit, setActiveEdit] = useState(null)
  const [logoUrl, setLogoUrl] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeSection, setActiveSection] = useState("recruiter-info")
  const logoRef = useRef()

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 outline-none focus:border-green-800 focus:bg-white transition"
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
  const btnPrimary = "inline-flex items-center gap-1.5 bg-green-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-900"
  const btnOutline = "inline-flex items-center gap-1.5 border border-gray-200 text-gray-800 text-sm px-4 py-2 rounded-lg hover:border-green-800 hover:text-green-800"
  const btnGhost = "inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-green-800"

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

  const fetchLogo = async () => {
    try {
      const res = await api.get("/recruiter/company-logo", {
        responseType: "blob"
      })
      const url = URL.createObjectURL(res.data)
      setLogoUrl(url)

    } catch { }

  }

  useEffect(() => {
    const load = async () => {
      await fetchProfile()
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

  const saveProfile = async () => {
    try {
      await api.put("/recruiter/profile", form)
      toast.success("Profile updated")
      setActiveEdit(null)
      fetchProfile()
    } catch {
      toast.error("Update failed")
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
      fetchLogo()
    } catch {
      toast.error("Upload failed")
    }

  }

  const deleteLogo = async () => {
    if (!confirm("Delete company logo?")) return
    try {
      await api.delete("/recruiter/company-logo")
      toast.success("Logo deleted")
      setLogoUrl(null)
    } catch {
      toast.error("Delete failed")
    }

  }
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      setActiveSection(id)
    }
  }

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
        {/* HERO CARD */}
        <div className="relative overflow-hidden bg-green-900 rounded-2xl p-8 flex items-center gap-7 mb-6 flex-col sm:flex-row">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-white/[0.03] pointer-events-none" />

          <div className="relative flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <Building size={36} color="white" />
              </div>
            )}

            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border-none cursor-pointer flex items-center justify-center text-green-800 shadow-md hover:scale-110 transition-transform"
              onClick={() => logoRef.current.click()}>
              <Camera size={13} />
            </button>
            <input ref={logoRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={uploadLogo} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="font-serif text-[2rem] text-white tracking-tight mb-1">{profile.name}</div>
            <div className="text-white/70 text-sm mb-3">{profile.email}</div>
            <div className="flex gap-2.5 flex-wrap justify-center sm:justify-start">
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Building size={12} /> {profile.companyName}              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <MapPin size={12} /> {profile.city}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Phone size={12} /> {profile.mobileNumber}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-5">
          {/* SIDEBAR */}
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

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
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

            {/* Recruiter Info */}
            <SectionCard
              id="recruiter-info"
              title="Recruiter Information"
              icon={User}
              action={
                activeEdit !== "info" &&
                <button
                  onClick={() => setActiveEdit("info")}
                  className={btnGhost}>
                  <Pencil size={14} /> Edit
                </button>
              }>
              {activeEdit === "info" ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Name</label>
                      <input
                        className={inputCls}
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Mobile Number</label>
                      <input
                        className={inputCls}
                        value={form.mobileNumber}
                        onChange={(e) =>
                          setForm({ ...form, mobileNumber: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>linkedin</label>
                      <input
                        className={inputCls}
                        value={form.linkedin}
                        onChange={(e) =>
                          setForm({ ...form,linkedin: e.target.value })
                        }
                      />
                    </div>

                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      className={btnPrimary}
                      onClick={saveProfile}>
                      <Check size={14} /> Save
                    </button>
                    <button
                      className={btnOutline}
                      onClick={() => setActiveEdit(null)}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Name</label>
                    <p>{profile.name}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Mobile</label>
                    <p>{profile.mobileNumber}</p>
                  </div>
                  <div>
                    <label className={labelCls}>linkedin</label>
                    <p>{profile.linkedin}</p>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* COMPANY INFO */}
            <SectionCard
              id="company-info" title="Company Information"
              icon={Building}
              action={
                activeEdit !== "company"
                  ? <button className={btnGhost} onClick={() => setActiveEdit("company")}>
                    <Pencil size={14} /> Edit
                  </button>
                  : null}>
              {activeEdit === "company" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Website</label>
                      <input
                        className={inputCls}
                        value={form.companyWebsite}
                        onChange={e => setForm({ ...form, companyWebsite: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Industry</label>
                      <input
                        className={inputCls}
                        value={form.industry}
                        onChange={e => setForm({ ...form, industry: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Company Size</label>
                      <input
                        className={inputCls}
                        value={form.companySize}
                        onChange={e => setForm({ ...form, companySize: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>About Company</label>
                      <textarea
                        className={inputCls}
                        value={form.aboutCompany}
                        onChange={e => setForm({ ...form, aboutCompany: e.target.value })} />
                    </div>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button className={btnPrimary} onClick={saveProfile}>
                      <Check size={14} /> Save
                    </button>
                    <button className={btnOutline} onClick={() => setActiveEdit(null)}>
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Company Name</label>
                    <p>{profile.companyName}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Website</label>
                    <p>{profile.companyWebsite}</p>
                  </div>
                  <div>
                    <label className={labelCls}>Industry</label>
                    <p>{profile.industry}</p>
                  </div>

                  <div>
                    <label className={labelCls}>Company Size</label>
                    <p>{profile.companySize}</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelCls}>About Company</label>
                    <p>{profile.aboutCompany}</p>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* LOCATION */}
            <SectionCard
              id="location"
              title="Location"
              icon={MapPin}
              action={
                activeEdit !== "location"
                  ? (
                    <button className={btnGhost} onClick={() => setActiveEdit("location")}>
                      <Pencil size={14} /> Edit
                    </button>
                  )
                  : null}>
              {activeEdit === "location" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div>
                      <label className={labelCls}>Country</label>
                      <input
                        className={inputCls}
                        value={form.country || ""}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>State</label>
                      <input
                        className={inputCls}
                        value={form.state || ""}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>City</label>
                      <input
                        className={inputCls}
                        value={form.city || ""}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>

                  </div>

                  <div className="flex gap-2.5 mt-4">

                    <button className={btnPrimary} onClick={saveProfile}>
                      <Check size={14} /> Save
                    </button>

                    <button className={btnOutline} onClick={() => setActiveEdit(null)}>
                      <X size={14} /> Cancel
                    </button>

                  </div>
                </>

              ) : (

                (!profile.country && !profile.state && !profile.city)

                  ? (
                    <p className="text-gray-400 text-sm">
                      No location added yet.
                    </p>
                  )

                  : (

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                      <div>
                        <label className={labelCls}>Country</label>
                        <p className="text-sm text-gray-900">{profile.country}</p>
                      </div>

                      <div>
                        <label className={labelCls}>State</label>
                        <p className="text-sm text-gray-900">{profile.state}</p>
                      </div>

                      <div>
                        <label className={labelCls}>City</label>
                        <p className="text-sm text-gray-900">{profile.city}</p>
                      </div>

                    </div>

                  )

              )}

            </SectionCard>

            {/* COMPANY LOGO SECTION */}
            <SectionCard
              id="company-logo"
              title="Company Logo"
              icon={Globe}>
              <div className="flex flex-col items-center gap-4">
                {logoUrl ? (
                  <>
                    <img
                      src={logoUrl}
                      className="w-32 h-32 rounded-xl object-cover border " />
                    <div className="flex gap-2">
                      <button
                        className={btnOutline}
                        onClick={() => setShowImageModal(true)}>
                        <Eye size={14} />Preview
                      </button>
                      <button
                        className={btnOutline}
                        onClick={() => logoRef.current.click()}>
                        <Camera size={14} />Replace
                      </button>
                      <button className="inline-flex items-center gap-1 bg-transparent border border-gray-200 text-gray-400 text-sm font-medium px-2 py-2 rounded-lg cursor-pointer hover:text-red-600 transition-colors"
                        onClick={deleteLogo}>
                        <Trash2 size={14} /><span className="hidden sm:inline">Delete</span></button>
                    </div>
                  </>
                ) : (
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer text-center"
                    onClick={() => logoRef.current.click()}>
                    <Camera
                      size={32}
                      className="mx-auto text-green-800 mb-2" />
                    Upload Company Logo
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative">
            <button onClick={() => setShowImageModal(false)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:scale-110 transition">
              <X size={16} />
            </button>
            <img src={logoUrl} className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>

  )
}