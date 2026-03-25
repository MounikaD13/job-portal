import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/apiCheck';
import {
    ArrowLeft, FileText, Download, User, Mail,
    Calendar, CheckCircle, XCircle, Clock, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { value: 'reviewed', label: 'Reviewed', icon: CheckCircle, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

export default function ViewApplicants() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const response = await API.get(`/applications/job/${jobId}`);
                setApplicants(response.data.applications);
            } catch (err) {
                console.error('Failed to fetch applicants:', err);
                toast.error('Failed to load applicants.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const handleStatusUpdate = async (appId, newStatus) => {
        setUpdatingStatusId(appId);
        try {
            await API.put(`/applications/status/${appId}`, { status: newStatus });
            setApplicants(prev => prev.map(app =>
                app._id === appId ? { ...app, status: newStatus } : app
            ));
            toast.success(`Status updated to ${newStatus}`);
        } catch (err) {
            console.error('Status update failed:', err);
            toast.error('Failed to update status.');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 pt-8 pb-12">
                <div className="max-w-6xl mx-auto px-6">
                    <button
                        onClick={() => navigate('/recruiter/my-jobs')}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors mb-6"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Applicants</h1>
                    <p className="text-slate-500">Review and manage candidates who applied for this position.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-6">
                {applicants.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-20 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={32} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No applicants yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto text-sm">
                            We'll notify you as soon as candidates start applying for this job.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {applicants.map((app) => (
                            <div key={app._id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                                    {/* Candidate Info */}
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <User size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-slate-900 truncate">
                                                {app.jobSeekerId?.name || 'Anonymous Candidate'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-semibold mt-1">
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <Mail size={12} className="text-slate-400" />
                                                    {app.jobSeekerId?.email}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <Calendar size={12} className="text-slate-400" />
                                                    Applied {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resume Action */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        {app.resumeId ? (
                                            <a
                                                href={`${import.meta.env.VITE_API_URL}/applications/resume/${app.resumeId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-900/80 text-white text-xs font-bold rounded-xl hover:bg-cyan-800 transition-all shadow-lg shadow-slate-200"
                                            >
                                                <FileText size={16} /> View Resume
                                            </a>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                                No Resume Uploaded
                                            </span>
                                        )}

                                        {/* Status Dropdown / Selector */}
                                        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
                                            {STATUS_OPTIONS.map((opt) => {
                                                const Icon = opt.icon;
                                                const isSelected = app.status === opt.value;
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => handleStatusUpdate(app._id, opt.value)}
                                                        disabled={updatingStatusId === app._id}
                                                        className={`p-2 rounded-xl transition-all flex items-center gap-2 ${isSelected
                                                            ? `${opt.color} shadow-sm px-3`
                                                            : 'text-slate-400 hover:text-slate-600 hover:bg-white'
                                                            }`}
                                                        title={opt.label}
                                                    >
                                                        <Icon size={16} />
                                                        {isSelected && <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {app.coverLetter && (
                                    <div className="mt-6 pt-6 border-t border-slate-50">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 underline decoration-emerald-200 decoration-2 underline-offset-4">Cover Letter / Note</p>
                                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                            {app.coverLetter}
                                        </p>
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
