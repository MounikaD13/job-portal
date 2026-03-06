import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/apiCheck'
import toast from 'react-hot-toast'
import {
    Briefcase, Building2, MapPin, Clock, TrendingUp, ChevronDown,
    DollarSign, Wrench, FileText, ArrowLeft, Send
} from 'lucide-react'

const FieldWrapper = ({ label, required, hint, children }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
            {label} {required && <span className="text-red-500 normal-case tracking-normal">*</span>}
        </label>
        {children}
        {hint && <p className="text-[11px] text-gray-400 leading-relaxed">{hint}</p>}
    </div>
)

const inputCls = "w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-150 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-gray-300"

const selectCls = "w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-150 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 cursor-pointer appearance-none"

const SectionHeading = ({ label }) => (
    <div className="flex items-center gap-2.5 mb-5">
        <div className="w-1 h-5 rounded-full bg-green-700" />
        <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-widest">{label}</span>
    </div>
)

const IconWrap = ({ children }) => (
    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
        {children}
    </span>
)

export default function AddJob() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        companyName: '',
        location: '',
        jobType: 'Full-Time',
        salaryMin: '',
        salaryMax: '',
        experienceRequired: '',
        skillsRequired: '',
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const skillsArray = formData.skillsRequired
                .split(',')
                .map((skill) => skill.trim())
                .filter((skill) => skill.length > 0)
            const payload = {
                title: formData.title,
                description: formData.description,
                companyName: formData.companyName,
                location: formData.location,
                jobType: formData.jobType,
                experienceRequired: Number(formData.experienceRequired),
                skillsRequired: skillsArray,
            }
            if (formData.salaryMin || formData.salaryMax) {
                payload.salary = {
                    min: formData.salaryMin ? Number(formData.salaryMin) : 0,
                    max: formData.salaryMax ? Number(formData.salaryMax) : 0,
                }
            }
            const response = await API.post('/jobs', payload)
            toast.success(response.data.message || 'Job added successfully!')
            navigate('/recruiter/profile')
        } catch (err) {
            console.error('Add job error:', err)
            toast.error(err.response?.data?.message || 'Failed to add job. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">

                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate('/recruiter/profile')}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-green-800 transition-colors mb-6"
                >
                    <ArrowLeft size={15} /> Back to Profile
                </button>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">

                    {/* Green Header */}
                    <div className="relative overflow-hidden px-7 py-7 bg-gradient-to-br from-green-900 via-cyan-900 to-green-700">
                        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
                        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/[0.04] pointer-events-none" />
                        <div className="relative flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                                <Briefcase size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">Post a New Job</h1>
                                <p className="text-white/60 text-sm mt-0.5">Fill in the details to publish your listing</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

                        {/* ── Basic Information ───────────────────────────────── */}
                        <section>
                            <SectionHeading label="Basic Information" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                {/* Job Title — full width */}
                                <div className="sm:col-span-2">
                                    <FieldWrapper label="Job Title" required>
                                        <div className="relative">
                                            <IconWrap><Briefcase size={14} /></IconWrap>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="e.g. Senior Frontend Developer"
                                                className={inputCls}
                                            />
                                        </div>
                                    </FieldWrapper>
                                </div>

                                {/* Company Name */}
                                <FieldWrapper label="Company Name" required>
                                    <div className="relative">
                                        <IconWrap><Building2 size={14} /></IconWrap>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Acme Corp"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                                {/* Location */}
                                <FieldWrapper label="Location" required>
                                    <div className="relative">
                                        <IconWrap><MapPin size={14} /></IconWrap>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Bangalore (or Remote)"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                            </div>
                        </section>

                        <div className="border-t border-dashed border-gray-100" />

                        {/* ── Job Details ─────────────────────────────────────── */}
                        <section>
                            <SectionHeading label="Job Details" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                                {/* Job Type */}
                                <FieldWrapper label="Job Type" required>
                                    <div className="relative">
                                        <IconWrap><Clock size={14} /></IconWrap>
                                        <select
                                            name="jobType"
                                            value={formData.jobType}
                                            onChange={handleChange}
                                            required
                                            className={selectCls}
                                        >
                                            <option value="Full-Time">Full-Time</option>
                                            <option value="Part-Time">Part-Time</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                        <ChevronDown
                                            size={18}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        />
                                    </div>
                                </FieldWrapper>

                                {/* Experience */}
                                <FieldWrapper label="Experience Required (Years)" required>
                                    <div className="relative">
                                        <IconWrap><TrendingUp size={14} /></IconWrap>
                                        <input
                                            type="number"
                                            name="experienceRequired"
                                            value={formData.experienceRequired}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            placeholder="e.g. 3"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                                {/* Salary Min */}
                                <FieldWrapper label="Min Salary" hint="Optional — leave blank if not applicable">
                                    <div className="relative">
                                        <IconWrap><DollarSign size={14} /></IconWrap>
                                        <input
                                            type="number"
                                            name="salaryMin"
                                            value={formData.salaryMin}
                                            onChange={handleChange}
                                            placeholder="e.g. 500000"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                                {/* Salary Max */}
                                <FieldWrapper label="Max Salary" hint="Optional — leave blank if not applicable">
                                    <div className="relative">
                                        <IconWrap><DollarSign size={14} /></IconWrap>
                                        <input
                                            type="number"
                                            name="salaryMax"
                                            value={formData.salaryMax}
                                            onChange={handleChange}
                                            placeholder="e.g. 800000"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                            </div>
                        </section>

                        <div className="border-t border-dashed border-gray-100" />

                        {/* ── Skills & Description ─────────────────────────────── */}
                        <section>
                            <SectionHeading label="Skills & Description" />
                            <div className="flex flex-col gap-5">

                                {/* Skills */}
                                <FieldWrapper label="Skills Required" hint="Separate multiple skills with commas — e.g. React, Node.js, MongoDB">
                                    <div className="relative">
                                        <IconWrap><Wrench size={14} /></IconWrap>
                                        <input
                                            type="text"
                                            name="skillsRequired"
                                            value={formData.skillsRequired}
                                            onChange={handleChange}
                                            placeholder="e.g. React, Node.js, MongoDB"
                                            className={inputCls}
                                        />
                                    </div>
                                </FieldWrapper>

                                {/* Description */}
                                <FieldWrapper label="Job Description" required>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-3 text-gray-300 pointer-events-none">
                                            <FileText size={14} />
                                        </span>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder="Describe the role, responsibilities, and requirements..."
                                            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-150 focus:border-green-700 focus:ring-2 focus:ring-green-700/10 placeholder:text-gray-300 resize-y leading-relaxed"
                                        />
                                    </div>
                                </FieldWrapper>

                            </div>
                        </section>

                        {/* ── Actions ─────────────────────────────────────────── */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/recruiter/profile')}
                                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-800 hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                        </svg>
                                        Posting…
                                    </>
                                ) : (
                                    <>
                                        <Send size={14} /> Post Job
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}