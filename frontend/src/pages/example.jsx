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
/// my jobs 

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiCheck';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Clock, DollarSign, TrendingUp, Plus, Eye, Edit, Trash2, X, Check } from 'lucide-react';

export default function MyJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingJobId, setEditingJobId] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const response = await API.get('/jobs/my-jobs');
                setJobs(response.data.jobs);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                toast.error("Failed to load your jobs.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, []);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;

        try {
            await API.delete(`/jobs/${jobId}`);
            toast.success("Job deleted successfully");
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (err) {
            console.error("Failed to delete job:", err);
            toast.error("Could not delete the job.");
        }
    };

    const handleEditClick = (job) => {
        setEditingJobId(job._id);
        setEditFormData({
            title: job.title || '',
            companyName: job.companyName || '',
            location: job.location || '',
            jobType: job.jobType || 'Full-Time',
            description: job.description || '',
            salaryMin: job.salary?.min || '',
            salaryMax: job.salary?.max || '',
            experienceRequired: job.experienceRequired || '',
            skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : ''
        });
    };

    const handleCancelEdit = () => {
        setEditingJobId(null);
        setEditFormData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
    };

    const handleSaveEdit = async (jobId) => {
        try {
            const updateData = {
                title: editFormData.title,
                companyName: editFormData.companyName,
                location: editFormData.location,
                jobType: editFormData.jobType,
                description: editFormData.description,
                experienceRequired: Number(editFormData.experienceRequired),
                salary: {
                    min: editFormData.salaryMin ? Number(editFormData.salaryMin) : null,
                    max: editFormData.salaryMax ? Number(editFormData.salaryMax) : null
                },
                skillsRequired: editFormData.skillsRequired.split(',').map(skill => skill.trim()).filter(Boolean)
            };

            const response = await API.put(`/jobs/${jobId}`, updateData);
            toast.success("Job updated successfully");

            setJobs(jobs.map(job => job._id === jobId ? response.data.job : job));
            setEditingJobId(null);
        } catch (err) {
            console.error("Failed to update job:", err);
            toast.error(err.response?.data?.message || "Could not update the job.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-400 font-medium tracking-wide">Loading your jobs…</p>
                </div>
            </div>
        );
    }

    const jobTypeColors = {
        'Full-Time': 'bg-blue-50 text-blue-700',
        'Part-Time': 'bg-amber-50 text-amber-700',
        'Remote': 'bg-violet-50 text-violet-700',
        'Internship': 'bg-rose-50 text-rose-700',
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Banner */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Briefcase size={14} className="text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">My Posted Jobs</h1>
                        </div>
                        <p className="text-sm text-slate-500 pl-9">
                            {jobs.length > 0 ? `${jobs.length} active listing${jobs.length !== 1 ? 's' : ''}` : 'No listings yet'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/recruiter/create-jobs')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-200 whitespace-nowrap"
                    >
                        <Plus size={15} />
                        Post New Job
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

                {jobs.length === 0 ? (
                    /* ── Empty State ── */
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 sm:p-20 text-center shadow-sm">
                        <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                            <Briefcase size={28} className="text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs posted yet</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
                            You haven't posted any job openings. Create your first listing to start receiving applications.
                        </p>
                        <button
                            onClick={() => navigate('/recruiter/create-jobs')}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                        >
                            <Plus size={15} />
                            Post Your First Job
                        </button>
                    </div>
                ) : (
                    /* ── Job Cards Grid ── */
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {jobs.map((job) => (
                            <div
                                key={job._id}
                                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden"
                            >
                                {editingJobId === job._id ? (
                                    /* ── Edit Mode ── */
                                    <div className="flex flex-col flex-1">
                                        {/* Edit Header */}
                                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Editing Job</p>
                                            <button onClick={handleCancelEdit} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </div>

                                        {/* Edit Form */}
                                        <div className="px-5 py-4 flex flex-col gap-3 flex-1">
                                            <div>
                                                <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Job Title</label>
                                                <input type="text" name="title" value={editFormData.title} onChange={handleEditChange}
                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Company Name</label>
                                                <input type="text" name="companyName" value={editFormData.companyName} onChange={handleEditChange}
                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div>
                                                    <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Location</label>
                                                    <input type="text" name="location" value={editFormData.location} onChange={handleEditChange}
                                                        className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Job Type</label>
                                                    <select name="jobType" value={editFormData.jobType} onChange={handleEditChange}
                                                        className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors">
                                                        <option value="Full-Time">Full-Time</option>
                                                        <option value="Part-Time">Part-Time</option>
                                                        <option value="Remote">Remote</option>
                                                        <option value="Internship">Internship</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <div>
                                                    <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Min Salary</label>
                                                    <input type="number" name="salaryMin" value={editFormData.salaryMin} onChange={handleEditChange}
                                                        className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                                </div>
                                                <div>
                                                    <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Max Salary</label>
                                                    <input type="number" name="salaryMax" value={editFormData.salaryMax} onChange={handleEditChange}
                                                        className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Experience (Years)</label>
                                                <input type="number" name="experienceRequired" value={editFormData.experienceRequired} onChange={handleEditChange}
                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-[0.6875rem] font-semibold text-slate-400 uppercase tracking-widest mb-1">Skills (comma-separated)</label>
                                                <input type="text" name="skillsRequired" value={editFormData.skillsRequired} onChange={handleEditChange}
                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors" />
                                            </div>
                                        </div>

                                        {/* Edit Footer */}
                                        <div className="px-5 py-4 border-t border-slate-100 flex gap-2.5 justify-end bg-slate-50">
                                            <button onClick={handleCancelEdit}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors">
                                                <X size={13} /> Cancel
                                            </button>
                                            <button onClick={() => handleSaveEdit(job._id)}
                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-100">
                                                <Check size={13} /> Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* ── View Mode ── */
                                    <div className="flex flex-col flex-1">
                                        {/* Card Header */}
                                        <div className="px-5 pt-5 pb-4">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-slate-900 truncate leading-snug" title={job.title}>{job.title}</h3>
                                                    <p className="text-sm text-slate-500 font-medium mt-0.5 truncate">{job.companyName}</p>
                                                </div>
                                                <span className={`shrink-0 px-2.5 py-1 text-[0.6875rem] font-bold rounded-lg ${jobTypeColors[job.jobType] || 'bg-slate-100 text-slate-600'}`}>
                                                    {job.jobType}
                                                </span>
                                            </div>

                                            {/* Meta Info */}
                                            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <MapPin size={12} className="text-slate-400 shrink-0" />
                                                    <span className="truncate">{job.location}</span>
                                                </div>
                                                {job.experienceRequired !== undefined && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <TrendingUp size={12} className="text-slate-400 shrink-0" />
                                                        <span>{job.experienceRequired} {job.experienceRequired === 1 ? 'yr' : 'yrs'} exp.</span>
                                                    </div>
                                                )}
                                                {(job.salary?.min || job.salary?.max) && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 col-span-2">
                                                        <DollarSign size={12} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            {job.salary.min ? `₹${job.salary.min.toLocaleString()}` : ''}
                                                            {job.salary.min && job.salary.max && ' – '}
                                                            {job.salary.max ? `₹${job.salary.max.toLocaleString()}` : ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-slate-100 mx-5"></div>

                                        {/* Description + Skills */}
                                        <div className="px-5 py-4 flex-1">
                                            {job.description && (
                                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">{job.description}</p>
                                            )}
                                            <div className="flex flex-wrap gap-1.5">
                                                {job.skillsRequired && job.skillsRequired.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="px-2.5 py-1 text-[0.6875rem] font-medium text-slate-600 bg-slate-100 rounded-lg">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skillsRequired && job.skillsRequired.length > 3 && (
                                                    <span className="px-2.5 py-1 text-[0.6875rem] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg">
                                                        +{job.skillsRequired.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer */}
                                        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-2xl">
                                            <span className="text-[0.6875rem] text-slate-400 font-medium">
                                                {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    title="Edit Job"
                                                    onClick={() => handleEditClick(job)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
                                                >
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button
                                                    title="Delete Job"
                                                    onClick={() => handleDelete(job._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
//version2 
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiCheck';
import toast from 'react-hot-toast';
import {
    Briefcase, MapPin, DollarSign, Users, CalendarDays,
    Plus, Edit, Trash2, X, Check, Search, CircleDot, Clock3
} from 'lucide-react';

const JOB_TYPE_STYLES = {
    'Full-Time': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'Part-Time': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    'Remote': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    'Internship': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
};

function FieldInput({ label, name, value, onChange, type = 'text' }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
        </div>
    );
}

export default function MyJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingJobId, setEditingJobId] = useState(null);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const response = await API.get('/jobs/my-jobs');
                setJobs(response.data.jobs);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
                toast.error("Failed to load your jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    // ── Derived stats ──
    const stats = useMemo(() => {
        const active = jobs.filter(j => j.status !== 'draft').length;
        const draft = jobs.filter(j => j.status === 'draft').length;
        const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
        const latest = jobs.length
            ? new Date(Math.max(...jobs.map(j => new Date(j.createdAt)))).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—';
        return { active, draft, totalApps, latest };
    }, [jobs]);

    // ── Filtered jobs ──
    const filteredJobs = useMemo(() => {
        if (!searchQuery.trim()) return jobs;
        const q = searchQuery.toLowerCase();
        return jobs.filter(j =>
            j.title?.toLowerCase().includes(q) ||
            j.companyName?.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q)
        );
    }, [jobs, searchQuery]);

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await API.delete(`/jobs/${jobId}`);
            toast.success("Job deleted successfully");
            setJobs(jobs.filter(job => job._id !== jobId));
        } catch (err) {
            toast.error("Could not delete the job.");
        }
    };

    const handleEditClick = (job) => {
        setEditingJobId(job._id);
        setExpandedJobId(job._id);
        setEditFormData({
            title: job.title || '',
            companyName: job.companyName || '',
            location: job.location || '',
            jobType: job.jobType || 'Full-Time',
            description: job.description || '',
            salaryMin: job.salary?.min || '',
            salaryMax: job.salary?.max || '',
            experienceRequired: job.experienceRequired || '',
            skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : ''
        });
    };

    const handleCancelEdit = () => {
        setEditingJobId(null);
        setEditFormData({});
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (jobId) => {
        try {
            const updateData = {
                title: editFormData.title,
                companyName: editFormData.companyName,
                location: editFormData.location,
                jobType: editFormData.jobType,
                description: editFormData.description,
                experienceRequired: Number(editFormData.experienceRequired),
                salary: {
                    min: editFormData.salaryMin ? Number(editFormData.salaryMin) : null,
                    max: editFormData.salaryMax ? Number(editFormData.salaryMax) : null
                },
                skillsRequired: editFormData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean)
            };
            const response = await API.put(`/jobs/${jobId}`, updateData);
            toast.success("Job updated successfully");
            setJobs(jobs.map(job => job._id === jobId ? response.data.job : job));
            setEditingJobId(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not update the job.");
        }
    };

    const toggleExpand = (jobId) => {
        if (editingJobId === jobId) return;
        setExpandedJobId(prev => prev === jobId ? null : jobId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                    <span className="text-xs font-medium text-slate-400 tracking-wide">Fetching your listings…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/*sticky header*/}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">

                    {/* Top Row — Brand + Post button */}
                    <div className="flex items-center justify-between gap-4 pt-4 pb-3">
                        <div className="flex items-center gap-3">
                            {/* <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
                                <Briefcase size={15} className="text-white" />
                            </div> */}
                            <div>
                                <h1 className="text-sm font-bold text-slate-900 leading-none">My Posted Jobs</h1>
                                <p className="text-[0.7rem] text-slate-400 mt-0.5 leading-none">{jobs.length} total listing{jobs.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-1 sm:gap-0 pb-3 overflow-x-auto scrollbar-none">
                        {/* Active */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 mr-2 shrink-0">
                            <CircleDot size={12} className="text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">{stats.active}</span>
                            <span className="text-[0.65rem] text-emerald-600 font-medium">Active</span>
                        </div>

                        {/* Draft */}
                        {/* <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 mr-2 shrink-0">
                            <Clock3 size={12} className="text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">{stats.draft}</span>
                            <span className="text-[0.65rem] text-slate-500 font-medium">Draft</span>
                        </div> */}

                        {/* Total Applications */}
                        {/* <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 mr-2 shrink-0">
                            <Users size={12} className="text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">{stats.totalApps}</span>
                            <span className="text-[0.65rem] text-slate-500 font-medium">Applications</span>
                        </div> */}

                        {/* Last Posted */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 mr-4 shrink-0">
                            <CalendarDays size={12} className="text-slate-500" />
                            <span className="text-[0.65rem] text-slate-500 font-medium">Last posted</span>
                            <span className="text-xs font-bold text-slate-700">{stats.latest}</span>
                        </div>

                        {/* Divider */}
                        <div className="hidden sm:block w-px h-5 bg-slate-200 mr-4 shrink-0" />

                        {/* Search */}
                        <div className="relative flex-1 min-w-[10rem] max-w-xs shrink-0">
                            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search by title, company, location…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-700 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder-slate-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X size={11} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════
                MAIN CONTENT
            ══════════════════════════════ */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8">

                {jobs.length === 0 ? (
                    /* ── Empty State ── */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                            <Briefcase size={24} className="text-slate-400" />
                        </div>
                        <h2 className="text-base font-bold text-slate-700 mb-1">No jobs posted yet</h2>
                        <p className="text-sm text-slate-400 max-w-xs mb-7 leading-relaxed">
                            Start attracting talent by creating your first job listing.
                        </p>
                        <button
                            onClick={() => navigate('/recruiter/create-jobs')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            <Plus size={14} /> Create Listing
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

                        {/* ── Column Headers (desktop) ── */}
                        <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200">
                            {['Role', 'Location', 'Type', 'Salary', ''].map((col, i) => (
                                <span key={i} className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">{col}</span>
                            ))}
                        </div>

                        {/* ── No Search Results ── */}
                        {filteredJobs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <Search size={20} className="text-slate-300 mb-3" />
                                <p className="text-sm font-semibold text-slate-500 mb-1">No results for "{searchQuery}"</p>
                                <p className="text-xs text-slate-400">Try a different title, company, or location.</p>
                            </div>
                        )}

                        {/* ── Job Rows ── */}
                        <div className="divide-y divide-slate-100">
                            {filteredJobs.map((job) => {
                                const isEditing = editingJobId === job._id;
                                const isExpanded = expandedJobId === job._id;

                                return (
                                    <div key={job._id} className="group">

                                        {/* Main Row */}
                                        <div
                                            className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 px-5 sm:px-6 py-4 items-center cursor-pointer select-none transition-colors duration-150 ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/60'}`}
                                            onClick={() => toggleExpand(job._id)}
                                        >
                                            {/* Role + Company */}
                                            <div className="min-w-0 flex flex-col">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-slate-900 truncate">{job.title}</span>
                                                    <span className={`sm:hidden inline-flex px-2 py-0.5 text-[0.6rem] font-bold rounded-full ${JOB_TYPE_STYLES[job.jobType] || 'bg-slate-100 text-slate-500'}`}>
                                                        {job.jobType}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-400 truncate mt-0.5">{job.companyName}</span>
                                            </div>

                                            {/* Location */}
                                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                                                <MapPin size={11} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                            </div>

                                            {/* Type Badge */}
                                            <div className="hidden sm:block">
                                                <span className={`inline-flex px-2.5 py-1 text-[0.625rem] font-bold rounded-full ${JOB_TYPE_STYLES[job.jobType] || 'bg-slate-100 text-slate-500'}`}>
                                                    {job.jobType}
                                                </span>
                                            </div>

                                            {/* Salary */}
                                            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                                                {(job.salary?.min || job.salary?.max) ? (
                                                    <>
                                                        <DollarSign size={11} className="text-slate-400 shrink-0" />
                                                        <span>
                                                            {job.salary.min ? `₹${(job.salary.min / 1000).toFixed(0)}k` : ''}
                                                            {job.salary.min && job.salary.max ? '–' : ''}
                                                            {job.salary.max ? `₹${(job.salary.max / 1000).toFixed(0)}k` : ''}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-300 text-base leading-none">—</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleEditClick(job)}
                                                    title="Edit"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                                >
                                                    <Edit size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job._id)}
                                                    title="Delete"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 size={13} />
                                                </button>

                                                <div className="w-px h-4 bg-slate-200 mx-0.5" />

                                                {/* ── Details / Hide text toggle ── */}
                                                <button
                                                    onClick={() => toggleExpand(job._id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.65rem] font-bold rounded-lg border transition-colors ${isExpanded
                                                        ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <span>Hide</span>
                                                            <span className="text-slate-400">›</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>Details</span>
                                                            <span className="text-slate-400">›</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* ── Expanded Panel ── */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-100 bg-slate-50 px-5 sm:px-6 py-5">
                                                {isEditing ? (
                                                    /* ── Edit Form ── */
                                                    <div>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">Editing Listing</span>
                                                            <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                                <X size={14} />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                                                            <FieldInput label="Job Title" name="title" value={editFormData.title} onChange={handleEditChange} />
                                                            <FieldInput label="Company Name" name="companyName" value={editFormData.companyName} onChange={handleEditChange} />
                                                            <FieldInput label="Location" name="location" value={editFormData.location} onChange={handleEditChange} />

                                                            <div className="flex flex-col gap-1">
                                                                <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Job Type</label>
                                                                <select name="jobType" value={editFormData.jobType} onChange={handleEditChange}
                                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all">
                                                                    <option value="Full-Time">Full-Time</option>
                                                                    <option value="Part-Time">Part-Time</option>
                                                                    <option value="Remote">Remote</option>
                                                                    <option value="Internship">Internship</option>
                                                                </select>
                                                            </div>

                                                            <FieldInput label="Min Salary (₹)" name="salaryMin" value={editFormData.salaryMin} onChange={handleEditChange} type="number" />
                                                            <FieldInput label="Max Salary (₹)" name="salaryMax" value={editFormData.salaryMax} onChange={handleEditChange} type="number" />
                                                            <FieldInput label="Experience (Years)" name="experienceRequired" value={editFormData.experienceRequired} onChange={handleEditChange} type="number" />

                                                            <div className="sm:col-span-2">
                                                                <FieldInput label="Skills (comma-separated)" name="skillsRequired" value={editFormData.skillsRequired} onChange={handleEditChange} />
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col gap-1 mb-5">
                                                            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Description</label>
                                                            <textarea
                                                                name="description"
                                                                value={editFormData.description}
                                                                onChange={handleEditChange}
                                                                rows={3}
                                                                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all"
                                                            />
                                                        </div>

                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={handleCancelEdit}
                                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors">
                                                                <X size={11} /> Cancel
                                                            </button>
                                                            <button onClick={() => handleSaveEdit(job._id)}
                                                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm">
                                                                <Check size={11} /> Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* ── View Detail Panel ── */
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                                                        {/* Description */}
                                                        <div className="sm:col-span-2">
                                                            <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 mb-2">Description</p>
                                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                                {job.description || <span className="italic text-slate-300">No description provided.</span>}
                                                            </p>

                                                            {/* Mobile-only meta */}
                                                            <div className="sm:hidden mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin size={11} className="text-slate-400" />{job.location}
                                                                </span>
                                                                {(job.salary?.min || job.salary?.max) && (
                                                                    <span className="flex items-center gap-1">
                                                                        <DollarSign size={11} className="text-slate-400" />
                                                                        {job.salary.min ? `₹${(job.salary.min / 1000).toFixed(0)}k` : ''}
                                                                        {job.salary.min && job.salary.max ? '–' : ''}
                                                                        {job.salary.max ? `₹${(job.salary.max / 1000).toFixed(0)}k` : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Sidebar */}
                                                        <div className="flex flex-col gap-4">
                                                            {job.skillsRequired?.length > 0 && (
                                                                <div>
                                                                    <p className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400 mb-2">Skills Required</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {job.skillsRequired.map((skill, i) => (
                                                                            <span key={i} className="px-2.5 py-1 text-[0.65rem] font-semibold text-slate-600 bg-white border border-slate-200 rounded-md">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="grid grid-cols-2 gap-2">
                                                                {job.experienceRequired !== undefined && (
                                                                    <div className="bg-white border border-slate-200 rounded-xl p-3">
                                                                        <p className="text-[0.55rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Experience</p>
                                                                        <p className="text-sm font-bold text-slate-800">{job.experienceRequired} <span className="text-xs font-normal text-slate-400">yrs</span></p>
                                                                    </div>
                                                                )}
                                                                <div className="bg-white border border-slate-200 rounded-xl p-3">
                                                                    <p className="text-[0.55rem] font-bold uppercase tracking-widest text-slate-400 mb-1">Posted</p>
                                                                    <p className="text-sm font-bold text-slate-800">
                                                                        {new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Table Footer ── */}
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                {filteredJobs.length !== jobs.length
                                    ? `${filteredJobs.length} of ${jobs.length} listing${jobs.length !== 1 ? 's' : ''}`
                                    : `${jobs.length} total listing${jobs.length !== 1 ? 's' : ''}`
                                }
                            </span>
                            <button
                                onClick={() => navigate('/recruiter/create-jobs')}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                <Plus size={11} /> Add another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}