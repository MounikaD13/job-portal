import { useState, useEffect, useRef } from "react"
import api from "../api/apiCheck"
import toast from "react-hot-toast"

import {
  User,
  Phone,
  MapPin,
  Building,
  Globe,
  Camera,
  Trash,
  Pencil,
  Check,
  X,
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
    } catch {}
  }

  const fetchLogo = async () => {
    try {
      const res = await api.get("/recruiter/company-logo", { responseType: "blob" })
      setLogoUrl(URL.createObjectURL(res.data))
    } catch {}
  }

  useEffect(() => {
    const load = async () => {
      await fetchProfile()
      await fetchProfilePic()
      await fetchLogo()
    }
    load()
  }, [])

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
      fetchProfilePic()
    } catch {
      toast.error("Upload failed")
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

  const inputCls = "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:border-green-800 focus:bg-white"
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"

  if (loading) return <p className="text-center mt-20">Loading...</p>

  return (

    <div className="bg-stone-100 min-h-screen">

      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">

        {/* Hero Card */}

        <div className="relative overflow-hidden bg-green-900 rounded-2xl p-8 flex items-center gap-7 mb-6 flex-col sm:flex-row">

          <div className="relative flex-shrink-0">

            {picUrl ? (
              <img src={picUrl} className="w-24 h-24 rounded-full object-cover border-[3px] border-white/30" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center border-[3px] border-white/20">
                <User size={38} color="white" />
              </div>
            )}

            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center"
              onClick={() => picRef.current.click()}>
              <Camera size={13} />
            </button>

            <input ref={picRef} type="file" className="hidden" onChange={uploadPic} />

          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-[2rem] text-white">{profile.name}</div>
            <div className="text-white/70 text-sm">{profile.email}</div>

            <div className="flex gap-2 mt-2 flex-wrap">

              <span className="bg-white/15 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Building size={12} /> {profile.companyName}
              </span>

              <span className="bg-white/15 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Phone size={12} /> {profile.mobileNumber}
              </span>

            </div>
          </div>

        </div>

        <div className="flex gap-5">

          {/* Sidebar */}

          <aside className="hidden lg:block w-56 sticky top-6">
            <div className="bg-white border rounded-2xl shadow-sm">
              <nav className="py-2">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => document.getElementById(id).scrollIntoView({ behavior: "smooth" })}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50">
                    <Icon size={15} />
                    {label}
                    <ChevronRight size={13} className="ml-auto" />
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1">

            {/* Personal Info */}

            <SectionCard id="personal-info" title="Personal Information" icon={User}
              action={<button onClick={() => setActiveEdit("personal")}><Pencil size={14} /></button>}>

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