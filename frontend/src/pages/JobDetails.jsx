import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/apiCheck';
import { AuthContext } from '../context/AuthContext';
import {
    ArrowLeft, MapPin, Clock, DollarSign, TrendingUp,
    Briefcase, Calendar, Building2, Send, Share2, Bookmark, X, FileText, Upload
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, role } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    // Application state
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [resume, setResume] = useState(null);
    const [isApplying, setIsApplying] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await API.get(`/jobs/${id}`);
                setJob(response.data.job);
            } catch (err) {
                console.error('Error fetching job details:', err);
                toast.error('Failed to load job details.');
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobDetails();
    }, [id, navigate]);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) return toast.error('Please upload your resume');

        setIsApplying(true);
        try {
            const formData = new FormData();
            formData.append('resume', resume);
            formData.append('coverLetter', coverLetter);

            await API.post(`/applications/apply/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('Application submitted successfully!');
            setShowApplyModal(false);
            setCoverLetter('');
            setResume(null);
        } catch (err) {
            console.error('Application error:', err);
            toast.error(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!job) return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-5xl mx-auto px-6 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    {/* Main Content */}
                    <div className="space-y-8">
                        {/* Header card */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-start gap-6">
                                <div className="w-10 h-10 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                                    {job.companyLogoId ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}/jobs/logo/${job.companyLogoId}`}
                                            alt={job.companyName}
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <Building2 size={24} className="text-slate-300" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs uppercase tracking-wider rounded-full ring-1 ring-emerald-200">
                                            {job.jobType}
                                        </span>
                                        <span className="text-sm text-slate-400 font-medium flex items-center gap-1.5">
                                            <Calendar size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight mb-2">
                                        {job.title}
                                    </h1>
                                    <div className="text-md font-bold text-slate-600 flex items-center gap-2">
                                        {job.companyName}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                        <MapPin size={16} className="text-slate-400" /> {job.location}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Experience</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                        <TrendingUp size={16} className="text-slate-400" /> {job.experienceRequired} Years
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Job Type</p>
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                                        <Briefcase size={16} className="text-slate-400" /> {job.jobType}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Salary</p>
                                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                                        {job.salary?.min && job.salary?.max
                                            ? `₹${job.salary.min.toLocaleString()}- ₹${job.salary.max.toLocaleString()}`
                                            : job.salary?.min
                                                ? `₹${job.salary.min.toLocaleString()}`
                                                : job.salary?.max
                                                    ? `₹${job.salary.max.toLocaleString()}`
                                                    : 'Negotiable'}                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                                Job Description
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                                Key Skills Required
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skillsRequired?.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-sm rounded-xl">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Apply */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200 sticky top-24">
                            <h3 className="text-white font-bold text-xl mb-2">Ready to apply?</h3>
                            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                Submit your profile and start your journey with {job.companyName} today.
                            </p>

                            {role === 'recruiter' ? (
                                <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-center">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Recruiter View</p>
                                    <p className="text-sm text-slate-200">You cannot apply to jobs as a recruiter.</p>
                                </div>
                            ) : !user ? (
                                <button
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                                    onClick={() => navigate('/login')}
                                >
                                    Login to Apply
                                </button>
                            ) : (
                                <button
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                                    onClick={() => setShowApplyModal(true)}
                                >
                                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    Apply Now
                                </button>
                            )}

                            <p className="text-[10px] text-center text-slate-500 mt-6 uppercase tracking-widest font-bold">
                                {job.applicantsCount || 0} People applied
                            </p>
                        </div>

                        {/* Company Info (Mocked for now as we don't have a separate company collection) */}
                        {/* <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                            <h4 className="font-bold text-slate-900 mb-4 tracking-tight">About the company</h4>
                            <p className="text-sm text-slate-500 leading-relaxed mb-4">
                                {job.companyName} is a leading organization in the industry, focused on innovation and excellence.
                            </p>
                            <button className="w-full py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                View Company Profile
                            </button>
                        </div> */}
                    </div>

                </div>
            </div>

            {/* Application Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isApplying && setShowApplyModal(false)} />

                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Apply for Position</h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{job.title} at {job.companyName}</p>
                            </div>
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm"
                                disabled={isApplying}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleApply} className="p-8 space-y-6">
                            {/* Resume Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Resume / CV (PDF Preferred)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => setResume(e.target.files[0])}
                                        className="hidden"
                                        id="resume-upload"
                                        required
                                    />
                                    <label
                                        htmlFor="resume-upload"
                                        className={`flex flex-col items-center justify-center w-full py-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${resume ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-400 bg-slate-50/50'
                                            }`}
                                    >
                                        {resume ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{resume.name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">Change file</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-sm">
                                                    <Upload size={24} />
                                                </div>
                                                <p className="text-sm font-bold text-slate-600">Click to upload resume</p>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight mt-1">PDF, DOC up to 5MB</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            {/* Cover Letter */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cover Letter / Note</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell the recruiter why you're a good fit..."
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-slate-400 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isApplying}
                                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${isApplying ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
                                    }`}
                            >
                                {isApplying ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Submit Application
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
