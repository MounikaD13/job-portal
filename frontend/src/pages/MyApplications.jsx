import React, { useState, useEffect } from 'react';
import API from '../api/apiCheck';
import { Briefcase, MapPin, Clock, FileText, ChevronRight, Search, Inbox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
    pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    reviewed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    accepted: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
};

export default function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await API.get('/applications/my-applications');
                setApplications(response.data.applications);
            } catch (err) {
                console.error('Failed to fetch applications:', err);
                toast.error('Failed to load your applications.');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-8 h-8 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-white border-b border-slate-200 pt-12 pb-16">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-2">My Applications</h1>
                    <p className="text-slate-500">Track the status of your job applications and career progress.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8">
                {applications.length === 0 ? (
                    <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm">
                            You haven't applied to any jobs yet. Start exploring opportunities that match your skills.
                        </p>
                        <button
                            onClick={() => navigate('/jobs')}
                            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            Browse Available Jobs
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app) => (
                            <div
                                key={app._id}
                                className="group bg-white border border-slate-200 rounded-3xl p-6 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer"
                                onClick={() => navigate(`/job/${app.jobId?._id}`)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                            {app.jobId?.companyLogoId ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}/jobs/logo/${app.jobId.companyLogoId}`}
                                                    alt={app.jobId.companyName}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <Briefcase size={24} className="text-slate-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                                {app.jobId?.title || 'Unknown Position'}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium mt-1">
                                                <span className="text-slate-700 font-bold">{app.jobId?.companyName}</span>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    {app.jobId?.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} className="text-slate-400" />
                                                    Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:min-w-[200px]">
                                        <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${STATUS_STYLES[app.status] || 'bg-slate-100 text-slate-600'}`}>
                                            {app.status}
                                        </span>
                                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>

                                {app.coverLetter && (
                                    <div className="mt-6 pt-6 border-t border-slate-50">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">My Note</p>
                                        <p className="text-sm text-slate-600 line-clamp-2 italic italic">
                                            "{app.coverLetter}"
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
