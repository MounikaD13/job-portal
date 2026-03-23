import React, { useState, useEffect, useMemo } from 'react';
import API from '../api/apiCheck';
import { Search, MapPin, Clock, DollarSign, TrendingUp, Briefcase, Filter, X, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const JOB_TYPE_STYLES = {
    'Full-Time': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    'Part-Time': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    'Remote': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    'Internship': 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
};

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await API.get('/jobs');
                setJobs(response.data.jobs);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
                toast.error('Failed to load jobs. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch =
                job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === 'All' || job.jobType === selectedType;
            return matchesSearch && matchesType;
        });
    }, [jobs, searchQuery, selectedType]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-[3px] border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                    <span className="text-sm font-medium text-slate-400 tracking-wide">Finding best opportunities…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-slate-200 pt-12 pb-16">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                            Find your next <span className="text-emerald-600">dream job</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10">
                            Browse through hundreds of curated opportunities from top companies around the world.
                        </p>

                        {/* Search Bar */}
                        <div className="relative group">
                            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by job title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 placeholder-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 -mt-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <div className="lg:w-64 shrink-0">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter size={16} className="text-slate-900" />
                                <h3 className="font-bold text-slate-900">Filters</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-3">Job Type</label>
                                    <div className="space-y-2">
                                        {['All', 'Full-Time', 'Part-Time', 'Remote', 'Internship'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedType(type)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedType === type
                                                        ? 'bg-slate-900 text-white'
                                                        : 'text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Jobs List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="text-slate-900 font-bold">{filteredJobs.length}</span> jobs
                            </p>
                            {/* Sort - Simplified for now */}
                            <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                Sort by: <span className="text-slate-900 font-bold">Newest</span>
                            </div>
                        </div>

                        {filteredJobs.length === 0 ? (
                            <div className="bg-white border border-slate-200 rounded-2xl py-20 px-6 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    We couldn't find any jobs matching your search criteria. Try a different keyword or filter.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedType('All') }}
                                    className="mt-6 text-emerald-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {filteredJobs.map(job => (
                                    <div
                                        key={job._id}
                                        className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer"
                                        onClick={() => navigate(`/job/${job._id}`)}
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                            {/* Company Logo */}
                                            <div className="w-14 h-14 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                                                {job.companyLogoId ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}/jobs/logo/${job.companyLogoId}`}
                                                        alt={job.companyName}
                                                        className="w-full h-full object-contain"
                                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
                                                    />
                                                ) : null}
                                                <Briefcase size={24} className="text-slate-300" style={{ display: job.companyLogoId ? 'none' : 'block' }} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${JOB_TYPE_STYLES[job.jobType] || 'bg-slate-100 text-slate-600'}`}>
                                                        {job.jobType}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                                        {job.companyName}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin size={14} className="text-slate-400" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <TrendingUp size={14} className="text-slate-400" />
                                                        {job.experienceRequired} yrs
                                                    </div>
                                                    {(job.salary?.min || job.salary?.max) && (
                                                        <div className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                            <DollarSign size={14} className="text-emerald-500" />
                                                            {job.salary.min ? `₹${job.salary.min.toLocaleString()}` : ''}
                                                            {job.salary.min && job.salary.max ? ' – ' : ''}
                                                            {job.salary.max ? `₹${job.salary.max.toLocaleString()}` : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Icon */}
                                            <div className="hidden sm:flex self-center">
                                                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                                                    <ChevronRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
