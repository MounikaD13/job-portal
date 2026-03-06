//this main of add jobs
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/apiCheck'
import toast from 'react-hot-toast'

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
            // Process skills to an array
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
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Post a New Job</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Fill out the details below to create a new job listing.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Job Title */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Developer"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Company Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. New York, NY (or Remote)"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Job Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Part-Time">Part-Time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                </select>
                            </div>

                            {/* Experience Required */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Experience Required (Years) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="experienceRequired"
                                    value={formData.experienceRequired}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="e.g. 3"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Salary Range */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Min Salary
                                </label>
                                <input
                                    type="number"
                                    name="salaryMin"
                                    value={formData.salaryMin}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Max Salary
                                </label>
                                <input
                                    type="number"
                                    name="salaryMax"
                                    value={formData.salaryMax}
                                    onChange={handleChange}
                                    placeholder="e.g. 80000"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Skills Required */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Skills Required (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="skillsRequired"
                                    value={formData.skillsRequired}
                                    onChange={handleChange}
                                    placeholder="e.g. React, Node.js, MongoDB"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Description */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Job Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => navigate('/recruiter/profile')}
                                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium mr-3 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
