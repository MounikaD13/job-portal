import { useState, useEffect, useRef } from "react"
import api from '../api/apiCheck'
import toast from "react-hot-toast";
import {
  User, Phone, MapPin, Briefcase, GraduationCap,
  Code, FileText, Upload, Pencil, Trash2, Plus, Check,
  X, Download, Camera, Trash, ChevronRight
} from "lucide-react"


const SkillTag = ({ skill, onRemove, editable }) => (
  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">
    {skill}
    {editable && (
      <button onClick={() => onRemove(skill)} className="flex items-center p-0 bg-transparent border-none cursor-pointer text-green-800 hover:text-red-600 transition-colors">
        <X size={12} />
      </button>
    )}
  </span>
)

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
  { id: "skills-experience", label: "Skills & Experience", icon: Code },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "resume", label: "Resume", icon: FileText },
]

export default function JobSeekerProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeEdit, setActiveEdit] = useState(null)
  const [form, setForm] = useState({})
  const [skillInput, setSkillInput] = useState("")
  const [eduForm, setEduForm] = useState({ degree: "", institution: "", percentage: "", yearOfPassing: "" })
  const [addingEdu, setAddingEdu] = useState(false)
  const [picUrl, setPicUrl] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeSection, setActiveSection] = useState("personal-info")
  const picRef = useRef()
  const resumeRef = useRef()

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/jobseeker/profile")
      setProfile(data.profile)
      setForm({
        name: data.profile.name,
        mobileNumber: data.profile.mobileNumber,
        address: data.profile.address,
        skills: [...data.profile.skills],
        experience: data.profile.experience,
      })
    } catch {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const fetchProfilePic = async () => {
    try {
      const res = await api.get("/jobseeker/profile-pic", { responseType: "blob" })
      const imageUrl = URL.createObjectURL(res.data)
      setPicUrl(imageUrl)
    } catch { }
  }

  useEffect(() => {
    const load = async () => {
      await fetchProfile()
      await fetchProfilePic()
    }
    load()
  }, [])

  // Track active section on scroll
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

  const saveInfo = async () => {
    try {
      await api.put("/jobseeker/profile", { name: form.name, mobileNumber: form.mobileNumber, address: form.address })
      toast.success("Info updated!")
      setActiveEdit(null)
      fetchProfile()
    } catch {
      toast.error("Failed to update info")
    }
  }

  const saveSkills = async () => {
    try {
      await api.put("/jobseeker/profile", { skills: form.skills, experience: form.experience })
      toast.success("Skills updated!")
      setActiveEdit(null)
      fetchProfile()
    } catch { toast.error("Failed to update skills") }
  }

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s) return
    if (form.skills.includes(s)) { toast.error("Skill already added"); return }
    setForm(f => ({ ...f, skills: [...f.skills, s] }))
    setSkillInput("")
  }

  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))

  const addEducation = async () => {
    if (!eduForm.degree || !eduForm.institution) { toast.error("Degree and institution are required"); return }
    try {
      await api.post("/jobseeker/education", eduForm)
      toast.success("Education added!")
      setEduForm({ degree: "", institution: "", percentage: "", yearOfPassing: "" })
      setAddingEdu(false)
      fetchProfile()
    } catch { toast.error("Failed to add education") }
  }

  const deleteEducation = async (eduId) => {
    if (!confirm("Delete this education entry?")) return
    try {
      await api.delete(`/jobseeker/education/${eduId}`)
      toast.success("Education removed")
      fetchProfile()
    } catch { toast.error("Failed to delete education") }
  }

  const saveEducation = async (eduId) => {
    try {
      await api.put(`/jobseeker/education/${eduId}`, eduForm)
      toast.success("Education updated!")
      setActiveEdit(null)
      fetchProfile()
    } catch { toast.error("Failed to update education") }
  }

  const startEditEdu = (edu) => {
    setActiveEdit(edu._id)
    setEduForm({ degree: edu.degree, institution: edu.institution, percentage: edu.percentage || "", yearOfPassing: edu.yearOfPassing || "" })
  }

  const uploadPic = async (e) => {
    const file = e.target.files[0];
    if (!file) return
    const fd = new FormData();
    fd.append("profilePic", file)
    try {
      await api.post("/jobseeker/upload-profile-pic", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Profile picture updated!");
      setPicUrl(null)
      await fetchProfilePic()
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed")
    }
  }

  const deleteProfilePic = async () => {
    if (!confirm("Delete profile picture?")) return
    try {
      await api.delete("/jobseeker/profile-pic")
      toast.success("Profile picture deleted")
      setPicUrl(null)
    } catch {
      toast.error("Failed to delete profile picture")
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return
    const fd = new FormData();
    fd.append("resume", file)
    try {
      await api.post("/jobseeker/upload-resume", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Resume uploaded!");
      fetchProfile()
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed")
    }
  }

  const downloadResume = async () => {
    try {
      const res = await api.get("/jobseeker/resume", { responseType: "blob" })
      const url = URL.createObjectURL(res.data)
      const a = document.createElement("a");
      a.href = url;
      a.download = profile.resumeFilename || "resume.pdf";
      a.click()
    } catch {
      toast.error("Failed to download resume")
    }
  }

  const deleteResume = async () => {
    if (!confirm("Delete your resume?")) return
    try {
      await api.delete("/jobseeker/resume");
      toast.success("Resume deleted"); 
      fetchProfile()
    } catch { toast.error("Failed to delete resume") }
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
                <Briefcase size={12} /> {profile.experience} yr{profile.experience !== 1 ? "s" : ""} exp
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <MapPin size={12} /> {profile.address}
              </span>
              <span className="inline-flex items-center gap-1 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                <Phone size={12} /> {profile.mobileNumber}
              </span>
            </div>
          </div>
        </div>

        {/* split layout */}
        <div className="flex gap-5 items-start">

          {/* ── Left Sidebar (desktop only, sticky) ── */}
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

          {/* ── Main Content ── */}
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

            {/* Personal Information */}
            <SectionCard id="personal-info" title="Personal Information" icon={User}
              action={activeEdit !== "info"
                ? <button className={btnGhost} onClick={() => setActiveEdit("info")}><Pencil size={14} /> Edit</button>
                : null}>
              {activeEdit === "info" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Full Name</label><input className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
                    <div><label className={labelCls}>Mobile Number</label><input className={inputCls} value={form.mobileNumber} onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} /></div>
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

            {/* Skills & Experience */}
            <SectionCard id="skills-experience" title="Skills & Experience" icon={Code}
              action={activeEdit !== "skills"
                ? <button className={btnGhost} onClick={() => setActiveEdit("skills")}><Pencil size={14} /> Edit</button>
                : null}>
              {activeEdit === "skills" ? (
                <>
                  <div className="mb-3.5">
                    <label className={labelCls}>Years of Experience</label>
                    <input type="number" min="0" className={inputCls} style={{ width: 120 }} value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
                  </div>
                  <div className="mb-3.5">
                    <label className={labelCls}>Skills</label>
                    <div className="flex flex-wrap gap-2 mb-4">{form.skills.map(s => <SkillTag key={s} skill={s} onRemove={removeSkill} editable />)}</div>
                    <div className="flex gap-2">
                      <input className={`${inputCls} flex-1`} placeholder="Add a skill (e.g. React)" value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} />
                      <button className={btnPrimary} onClick={addSkill}><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button className={btnPrimary} onClick={saveSkills}><Check size={14} /> Save</button>
                    <button className={btnOutline} onClick={() => setActiveEdit(null)}><X size={14} /> Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4"><label className={labelCls}>Experience</label><p className="text-sm text-gray-900">{profile.experience} year{profile.experience !== 1 ? "s" : ""}</p></div>
                  <div><label className={labelCls}>Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.skills.length ? profile.skills.map(s => <SkillTag key={s} skill={s} />) : <span className="text-gray-400 text-sm">No skills added yet</span>}
                    </div>
                  </div>
                </>
              )}
            </SectionCard>

            {/* Education */}
            <SectionCard id="education" title="Education" icon={GraduationCap}
              action={<button className={btnGhost} onClick={() => setAddingEdu(true)}><Plus size={14} /> Add</button>}>
              <div className="flex flex-col gap-3.5">
                {profile.education.length === 0 && !addingEdu && <p className="text-gray-400 text-sm">No education added yet.</p>}
                {profile.education.map(edu => (
                  <div key={edu._id} className="relative border border-gray-200 rounded-xl px-4 py-4 hover:border-green-800 transition-colors">
                    {activeEdit === edu._id ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[{ label: "Degree", key: "degree" }, { label: "Institution", key: "institution" }, { label: "Percentage / CGPA", key: "percentage" }, { label: "Year of Passing", key: "yearOfPassing", type: "number" }].map(({ label, key, type }) => (
                            <div key={key}><label className={labelCls}>{label}</label><input className={inputCls} type={type || "text"} value={eduForm[key]} onChange={e => setEduForm(f => ({ ...f, [key]: e.target.value }))} /></div>
                          ))}
                        </div>
                        <div className="flex gap-2.5 mt-4">
                          <button className={btnPrimary} onClick={() => saveEducation(edu._id)}><Check size={14} /> Save</button>
                          <button className={btnOutline} onClick={() => setActiveEdit(null)}><X size={14} /> Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="absolute top-3.5 right-3.5 flex gap-1.5">
                          <button className="p-1.5 bg-transparent border-none cursor-pointer text-gray-400 hover:text-green-800 transition-colors" onClick={() => startEditEdu(edu)}><Pencil size={14} /></button>
                          <button className="p-1.5 bg-transparent border-none cursor-pointer text-gray-400 hover:text-red-600 transition-colors" onClick={() => deleteEducation(edu._id)}><Trash2 size={14} /></button>
                        </div>
                        <div className="font-semibold text-sm mb-1">{edu.degree}</div>
                        <div className="text-gray-500 text-sm mb-1.5">{edu.institution}</div>
                        <div className="flex gap-4">
                          {edu.percentage && <span className="text-xs text-gray-400">📊 {edu.percentage}</span>}
                          {edu.yearOfPassing && <span className="text-xs text-gray-400">🎓 {edu.yearOfPassing}</span>}
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {addingEdu && (
                  <div className="border border-green-800 rounded-xl p-4 bg-green-50 mt-1">
                    <p className="font-semibold text-sm mb-3.5">New Education Entry</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[{ label: "Degree *", key: "degree", placeholder: "e.g. B.Tech CSE" }, { label: "Institution *", key: "institution", placeholder: "College / University" }, { label: "Percentage / CGPA", key: "percentage", placeholder: "e.g. 8.5 / 85%" }, { label: "Year of Passing", key: "yearOfPassing", placeholder: "e.g. 2024", type: "number" }].map(({ label, key, placeholder, type }) => (
                        <div key={key}><label className={labelCls}>{label}</label><input className={inputCls} type={type || "text"} placeholder={placeholder} value={eduForm[key]} onChange={e => setEduForm(f => ({ ...f, [key]: e.target.value }))} /></div>
                      ))}
                    </div>
                    <div className="flex gap-2.5 mt-4">
                      <button className={btnPrimary} onClick={addEducation}><Check size={14} /> Add</button>
                      <button className={btnOutline} onClick={() => setAddingEdu(false)}><X size={14} /> Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* Resume */}
            <SectionCard id="resume" title="Resume" icon={FileText}>
              {profile.hasResume ? (
                <>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-7 text-center cursor-pointer hover:border-green-800 hover:bg-green-50 transition-all" onClick={downloadResume}>
                    <FileText size={32} className="text-green-800 mx-auto mb-2.5" />
                    <div className="font-semibold text-sm mb-1">{profile.resumeFilename}</div>
                    <div className="text-gray-400 text-xs">Click to preview / download</div>
                  </div>
                  <div className="flex gap-2 justify-center mt-4">
                    <button className={btnOutline} onClick={downloadResume}><Download size={14} /> Download</button>
                    <button className={btnOutline} onClick={() => resumeRef.current.click()}><Upload size={14} /> Replace</button>
                    <button className="inline-flex items-center gap-1 bg-transparent border border-gray-200 text-gray-400 text-sm font-medium px-2 py-2 rounded-lg cursor-pointer hover:text-red-600 transition-colors" onClick={deleteResume}>
                      <Trash2 size={14} /><span className="hidden sm:inline">Delete</span></button>
                  </div>
                </>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-7 text-center cursor-pointer hover:border-green-800 hover:bg-green-50 transition-all" onClick={() => resumeRef.current.click()}>
                  <Upload size={32} className="text-green-800 mx-auto mb-2.5" />
                  <div className="font-semibold text-sm mb-1">Upload your Resume</div>
                  <div className="text-gray-400 text-xs">PDF only · Max 5MB</div>
                </div>
              )}
              <input ref={resumeRef} type="file" accept="application/pdf" className="hidden" onChange={handleResumeUpload} />
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
            <img src={picUrl} alt="Profile Preview" className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}