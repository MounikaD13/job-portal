import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/apiCheck';
import toast from 'react-hot-toast';
import {
    MapPin, DollarSign, Users, CalendarDays,
    Plus, Edit, Trash2, X, Check, Search, CircleDot, Clock3,
    Briefcase, Calendar, ChevronDown, ChevronUp, Image
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
                type={type} name={name} value={value} onChange={onChange}
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
                console.error('Failed to fetch jobs:', err);
                toast.error('Failed to load your jobs.');
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    const stats = useMemo(() => {
        const active = jobs.filter(j => j.status !== 'draft').length;
        const draft = jobs.filter(j => j.status === 'draft').length;
        const totalApps = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);
        const latest = jobs.length
            ? new Date(Math.max(...jobs.map(j => new Date(j.createdAt))))
                .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—';
        return { active, draft, totalApps, latest };
    }, [jobs]);

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
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await API.delete(`/jobs/${jobId}`);
            toast.success('Job deleted successfully');
            setJobs(prev => prev.filter(j => j._id !== jobId));
        } catch {
            toast.error('Could not delete the job.');
        }
    };

    const handleEditClick = (job) => {
        setEditingJobId(job._id);
        setExpandedJobId(job._id);
        setEditFormData({
            title: job.title || '',
            companyName: job.companyName || '',
            companyLogoId: job.companyLogoId || '',
            location: job.location || '',
            jobType: job.jobType || 'Full-Time',
            description: job.description || '',
            salaryMin: job.salary?.min || '',
            salaryMax: job.salary?.max || '',
            experienceRequired: job.experienceRequired || '',
            skillsRequired: job.skillsRequired ? job.skillsRequired.join(', ') : ''
        });
    };

    const handleCancelEdit = () => { setEditingJobId(null); setEditFormData({}); };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditLogoChange = async (jobId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Local preview
        const reader = new FileReader();
        reader.onloadend = () => setEditFormData(prev => ({ ...prev, logoPreview: reader.result }));
        reader.readAsDataURL(file);

        // Upload to backend
        try {
            const uploadData = new FormData();
            uploadData.append('companyLogo', file);
            const response = await API.post('/jobs/upload-logo', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setEditFormData(prev => ({ ...prev, companyLogoId: response.data.fileId }));
            toast.success('Logo uploaded successfully');
        } catch (err) {
            console.error('Logo upload error:', err);
            toast.error('Failed to upload logo');
        }
    };

    const handleSaveEdit = async (jobId) => {
        try {
            const updateData = {
                title: editFormData.title,
                companyName: editFormData.companyName,
                companyLogoId: editFormData.companyLogoId || null,
                location: editFormData.location,
                jobType: editFormData.jobType,
                description: editFormData.description,
                experienceRequired: Number(editFormData.experienceRequired),
                salary: {
                    min: editFormData.salaryMin ? Number(editFormData.salaryMin) : null,
                    max: editFormData.salaryMax ? Number(editFormData.salaryMax) : null,
                },
                skillsRequired: editFormData.skillsRequired.split(',').map(s => s.trim()).filter(Boolean),
            };
            const response = await API.put(`/jobs/${jobId}`, updateData);
            toast.success('Job updated successfully');
            setJobs(prev => prev.map(j => j._id === jobId ? response.data.job : j));
            setEditingJobId(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not update the job.');
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
            <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-[0.1rem]">
                {/*top*/}
                <div className="pt-10 pb-8">
                    {/* Title row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                My Posted Jobs
                            </h1>
                            <p className="text-sm text-slate-400 mt-1">
                                {jobs.length} listing{jobs.length !== 1 ? 's' : ''} · Manage your open roles
                            </p>
                        </div>
                    </div>
                    {/* ── Stats row ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {/* Active */}
                        <div className="bg-green-300/14 border border-slate-300 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <CircleDot size={17} className="text-emerald-500" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Active</span>
                            </div>
                            <span className="text-3xl font-extrabold text-slate-900 leading-none">{stats.active}</span>
                            <span className="text-xs text-slate-400">live listings</span>
                        </div>

                        {/* Draft */}
                        {/* <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock3 size={14} className="text-amber-400" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Draft</span>
                            </div>
                            <span className="text-3xl font-extrabold text-slate-900 leading-none">{stats.draft}</span>
                            <span className="text-xs text-slate-400">unpublished</span>
                        </div> */}

                        {/* Applications */}
                        {/* <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <Users size={14} className="text-sky-500" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Applications</span>
                            </div>
                            <span className="text-3xl font-extrabold text-slate-900 leading-none">{stats.totalApps}</span>
                            <span className="text-xs text-slate-400">total received</span>
                        </div> */}

                        {/* Last Posted */}
                        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-1 shadow-sm">
                            <div className="flex items-center gap-2 mb-1">
                                <CalendarDays size={17} className="text-violet-400" />
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">Last Posted</span>
                            </div>
                            <span className="text-lg font-extrabold text-slate-900 leading-none mt-1">{stats.latest}</span>
                            <span className="text-xs text-slate-400">most recent</span>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="relative">
                        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by job title, company or location…"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300/30 focus:border-transparent shadow-sm transition-all placeholder-slate-400" />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* TABLE*/}
                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
                            <Plus size={22} className="text-slate-400" />
                        </div>
                        <h2 className="text-base font-bold text-slate-700 mb-1">No jobs posted yet</h2>
                        <p className="text-sm text-slate-400 max-w-xs mb-7 leading-relaxed">
                            Create your first listing to start receiving applications.
                        </p>
                        <button
                            onClick={() => navigate('/recruiter/create-jobs')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-colors"
                        >
                            <Plus size={14} /> Create Listing
                        </button>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-10">

                        {/* Column headers — desktop */}
                        <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-200">
                            {['Role & company', 'Location', 'Type', 'Salary(min-max)', ''].map((col, i) => (
                                <span key={i} className="text-[0.625rem] font-bold uppercase tracking-widest text-slate-400">{col}</span>
                            ))}
                        </div>

                        {/* No search results */}
                        {filteredJobs.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <Search size={20} className="text-slate-300 mb-3" />
                                <p className="text-sm font-semibold text-slate-500 mb-1">No results for "{searchQuery}"</p>
                                <p className="text-xs text-slate-400">Try a different title, company, or location.</p>
                            </div>
                        )}

                        {/* Rows */}
                        <div className="divide-y divide-slate-100">
                            {filteredJobs.map((job) => {
                                const isEditing = editingJobId === job._id;
                                const isExpanded = expandedJobId === job._id;

                                return (
                                    <div key={job._id} className="group">

                                        {/* ── Main row ── */}
                                        <div
                                            className={`grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 px-5 sm:px-6 py-4 items-center cursor-pointer select-none transition-colors duration-150 ${isExpanded ? 'bg-slate-50/80' : 'hover:bg-slate-50/60'}`}
                                            onClick={() => toggleExpand(job._id)}
                                        >
                                            {/* Role */}
                                            <div className="min-w-0 flex items-center gap-3">
                                                {/* Logo avatar */}
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0 border border-slate-200">
                                                    {job.companyLogoId ? (
                                                        <img src={`${import.meta.env.VITE_API_URL}/jobs/logo/${job.companyLogoId}`} alt={job.companyName} className="w-full h-full object-contain" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
                                                    ) : null}
                                                    <span className="text-sm font-bold text-slate-400" style={{ display: job.companyLogoId ? 'none' : 'flex' }}>
                                                        {job.companyName?.charAt(0)?.toUpperCase() || '?'}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex flex-col">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-slate-900 truncate">{job.title}</span>
                                                        <span className={`sm:hidden inline-flex px-2 py-0.5 text-[0.6rem] font-bold rounded-full ${JOB_TYPE_STYLES[job.jobType] || 'bg-slate-100 text-slate-500'}`}>
                                                            {job.jobType}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 truncate mt-0.5">{job.companyName}</span>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                                                <MapPin size={14} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                            </div>

                                            {/* Type */}
                                            <div className="hidden sm:block">
                                                <span className={`inline-flex px-2.5 py-1 text-[0.625rem] font-bold rounded-full ${JOB_TYPE_STYLES[job.jobType] || 'bg-slate-100 text-slate-500'}`}>
                                                    {job.jobType}
                                                </span>
                                            </div>

                                            {/* Salary */}
                                            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
                                                {(job.salary?.min || job.salary?.max) ? (
                                                    <>
                                                        <span>
                                                            {job.salary.min ? `₹${(job.salary.min).toFixed(0)}` : ''}
                                                            {job.salary.min && job.salary.max ? '–' : ''}
                                                            {job.salary.max ? `₹${(job.salary.max).toFixed(0)}` : ''}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-slate-300 text-base leading-none">—</span>
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 sm:gap-2 pr-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => navigate(`/recruiter/job/${job._id}/applicants`)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                                    title="View Applicants"
                                                >
                                                    <Users size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditClick(job)}
                                                    className={`p-2 rounded-xl transition-all ${isEditing ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(job._id)} title="Delete"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={15} />
                                                </button>
                                                <div className="w-px h-4 bg-slate-200 mx-0.5" />
                                                <button
                                                    onClick={() => toggleExpand(job._id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[0.65rem] font-bold rounded-lg border transition-colors ${isExpanded
                                                        ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    {isExpanded ? 'Hide ›' : 'Details ›'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* ── Expanded panel ── */}
                                        {isExpanded && (
                                            <div className="border-t border-slate-100 bg-slate-50 px-5 sm:px-6 py-5">
                                                {isEditing ? (
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
                                                            <div className="flex flex-col gap-1">
                                                                <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Company Logo</label>
                                                                <div className="flex items-center gap-2">
                                                                    <input type="file" accept="image/*" onChange={(e) => handleEditLogoChange(job._id, e)}
                                                                        className="flex-1 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all" />
                                                                    <div className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                        {editFormData.logoPreview || editFormData.companyLogoId ? (
                                                                            <img src={editFormData.logoPreview || `${import.meta.env.VITE_API_URL}/jobs/logo/${editFormData.companyLogoId}`} alt="preview" className="w-full h-full object-contain" onError={e => e.target.style.display = 'none'} />
                                                                        ) : <span className="text-xs text-slate-300">?</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <FieldInput label="Location" name="location" value={editFormData.location} onChange={handleEditChange} />
                                                            <div className="flex flex-col gap-1">
                                                                <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Job Type</label>
                                                                <select name="jobType" value={editFormData.jobType} onChange={handleEditChange}
                                                                    className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent transition-all">
                                                                    <option value="Full-Time">Full-Time</option>
                                                                    <option value="Part-Time">Part-Time</option>
                                                                    <option value="Remote">Remote</option>
                                                                    <option value="Internship">Internship</option>
                                                                </select>
                                                            </div>
                                                            <FieldInput label="Min Salary (₹)" name="salaryMin" value={editFormData.salaryMin} onChange={handleEditChange} type="number" />
                                                            <FieldInput label="Max Salary (₹)" name="salaryMax" value={editFormData.salaryMax} onChange={handleEditChange} type="number" />
                                                            <FieldInput label="Experience (Years)" name="experienceRequired" value={editFormData.experienceRequired} onChange={handleEditChange} type="number" />
                                                            <div className="sm:col-span-2 lg:col-span-3">
                                                                <FieldInput label="Skills (comma-separated)" name="skillsRequired" value={editFormData.skillsRequired} onChange={handleEditChange} />
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-1 mb-5">
                                                            <label className="text-[0.65rem] font-semibold uppercase tracking-widest text-slate-400">Description</label>
                                                            <textarea name="description" value={editFormData.description} onChange={handleEditChange} rows={3}
                                                                className="w-full px-3 py-2 text-sm text-slate-800 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all" />
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
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                        <div className="sm:col-span-2">
                                                            <p className="text-[0.625rem] font-bold uppercase tracking-widest text-black mb-2 underline">Description</p>
                                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                                {job.description || <span className="italic text-slate-300">No description provided.</span>}
                                                            </p>
                                                            <div className="sm:hidden mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin size={14} className="text-slate-400" />{job.location}</span>
                                                                {(job.salary?.min || job.salary?.max) && (
                                                                    <span className="flex items-center gap-1">
                                                                        <label className='text-slate-500'>salary:</label>                                                                        {job.salary.min ? `₹${(job.salary.min).toFixed(0)}` : ''}
                                                                        {job.salary.min && job.salary.max ? '–' : ''}
                                                                        {job.salary.max ? `₹${(job.salary.max).toFixed(0)}` : ''}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-4">
                                                            {job.skillsRequired?.length > 0 && (
                                                                <div>
                                                                    <p className="text-[0.625rem] font-bold uppercase tracking-widest text-black mb-2 underline">Skills Required</p>
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

                        {/* Table footer */}
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                {filteredJobs.length !== jobs.length
                                    ? `${filteredJobs.length} of ${jobs.length} listing${jobs.length !== 1 ? 's' : ''}`
                                    : `${jobs.length} total listing${jobs.length !== 1 ? 's' : ''}`}
                            </span>
                            <button onClick={() => navigate('/recruiter/create-jobs')}
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                <Plus size={16} /> Add another
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}