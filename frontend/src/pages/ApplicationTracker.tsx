import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import { FaExternalLinkAlt, FaChevronDown, FaSync } from 'react-icons/fa';

import { ROLE_OPTIONS, STATUS_OPTIONS, STATUS_COLORS } from '../constants';

// --- CUSTOM SELECT COMPONENT ---
const CustomSelect = ({ label, value, options, onChange }: { label: string, value: string, options: { value: string, label?: string }[], onChange: (val: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-void border-b border-white/20 pb-2 text-white text-left flex justify-between items-center focus:border-aurora-purple transition-colors font-body"
            >
                <span className="truncate">{selectedLabel}</span>
                <FaChevronDown className={`text-white/30 text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-void border border-white/10 shadow-2xl max-h-60 overflow-y-auto"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-3 text-sm cursor-pointer hover:bg-white/5 transition-colors font-mono ${opt.value === value ? 'text-aurora-purple' : 'text-white/60'}`}
                            >
                                {opt.label || opt.value}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default function ApplicationTracker() {
    const [view, setView] = useState<'table' | 'analytics'>('table');
    const [applications, setApplications] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        company: '',
        role: ROLE_OPTIONS[0].value,
        status: 'Applied',
        date_applied: new Date().toISOString().split('T')[0],
        url: '',
        salary: '',
        location: '',
        notes: ''
    });

    const fetchApplications = async () => {
        try {
            const records = await pb.collection('applications').getFullList({
                sort: '-date_applied',
            });
            setApplications(records);
        } catch (e) {
            console.log("Error fetching applications:", e);
        }
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchApplications();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const resetForm = () => {
        setFormData({
            company: '',
            role: ROLE_OPTIONS[0].value,
            status: 'Applied',
            date_applied: new Date().toISOString().split('T')[0],
            url: '',
            salary: '',
            location: '',
            notes: ''
        });
        setEditId(null);
    };

    const handleEdit = (app: any) => {
        setFormData({
            company: app.company,
            role: app.role,
            status: app.status,
            date_applied: app.date_applied.split('T')[0],
            url: app.url,
            salary: app.salary,
            location: app.location,
            notes: app.notes
        });
        setEditId(app.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editId) {
                await pb.collection('applications').update(editId, formData);
            } else {
                await pb.collection('applications').create(formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchApplications();
        } catch (error) {
            console.error(error);
            alert("Failed to save application.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        try {
            await pb.collection('applications').delete(id);
            fetchApplications();
        } catch (e) {
            console.error(e);
        }
    };

    const getRoleLabel = (slug: string) => {
        return ROLE_OPTIONS.find(opt => opt.value === slug)?.label || slug;
    };

    const getStatusCounts = () => {
        const counts: any = {};
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });
        return counts;
    };

    const getRoleCounts = () => {
        const counts: any = {};
        applications.forEach(app => {
            const label = getRoleLabel(app.role);
            counts[label] = (counts[label] || 0) + 1;
        });
        return counts;
    };

    return (
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-32 relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-purple/5 rounded-full blur-[120px] -mt-20 -mr-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-aurora-cyan/5 rounded-full blur-[120px] -mb-20 -ml-20 pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto w-full relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-white/10 pb-8">
                    <div className="w-full md:w-auto">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">// Pipeline</span>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-6xl font-display font-medium tracking-tight"
                        >
                            APPLICATION <br /> <span className="text-white/40">TRACKER</span>
                        </motion.h1>
                    </div>

                    <div className="w-full md:w-auto flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => setView('table')}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 transition-all ${view === 'table' ? 'bg-white text-black border-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Table View
                        </button>
                        <button
                            onClick={() => setView('analytics')}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 transition-all ${view === 'analytics' ? 'bg-white text-black border-white' : 'text-white/40 hover:text-white'}`}
                        >
                            Analytics
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border border-white/10 transition-all text-white/40 hover:text-white disabled:opacity-50`}
                            title="Refresh Data"
                        >
                            <FaSync className={isRefreshing ? "animate-spin text-aurora-cyan" : ""} />
                        </button>

                        <div className="w-[1px] h-8 bg-white/10 hidden md:block" />

                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="px-6 py-3 bg-aurora-purple text-white hover:bg-aurora-purple/80 text-xs font-mono uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                        >
                            + Track New
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <AnimatePresence mode='wait'>
                    {view === 'table' ? (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="border-t border-white/10"
                        >
                            {/* MOBILE CARD VIEW */}
                            <div className="md:hidden space-y-px bg-white/10 border border-white/10">
                                {applications.length === 0 ? (
                                    <div className="text-center text-white/20 py-12 bg-void font-mono text-xs">No applications yet.</div>
                                ) : (
                                    applications.map((app) => (
                                        <div key={app.id} className="bg-void p-6">
                                            <div className="flex justify-between items-start mb-4 gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="font-display font-medium text-white text-xl flex items-center gap-2 truncate">
                                                        {app.company}
                                                        {app.url && <a href={app.url} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white text-xs shrink-0"><FaExternalLinkAlt /></a>}
                                                    </h3>
                                                    <p className="text-white/50 text-xs font-mono uppercase tracking-wider truncate">{getRoleLabel(app.role)}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest border shrink-0 ${STATUS_COLORS[app.status] || 'text-white/60 border-white/10'}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-xs font-mono text-white/40 mb-6">
                                                <div className="truncate">{app.location || 'N/A'}</div>
                                                <div className="text-right truncate">{app.salary || 'N/A'}</div>
                                                <div className="col-span-2 pt-2 border-t border-white/10">
                                                    Applied: {new Date(app.date_applied).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-px bg-white/10 border border-white/10">
                                                <Link to={`/tracker/${app.id}`} className="flex-1 py-3 bg-void hover:bg-white/5 text-white/60 hover:text-white text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                                    View
                                                </Link>
                                                <button onClick={() => handleEdit(app)} className="flex-1 py-3 bg-void hover:bg-white/5 text-white/60 hover:text-aurora-cyan text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(app.id)} className="flex-1 py-3 bg-void hover:bg-white/5 text-white/60 hover:text-red-400 text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* DESKTOP TABLE VIEW */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-white/40 text-[10px] uppercase font-mono tracking-widest border-b border-white/10">
                                            <th className="p-6 font-normal">Role & Company</th>
                                            <th className="p-6 font-normal">Status</th>
                                            <th className="p-6 font-normal">Date Applied</th>
                                            <th className="p-6 font-normal">Details</th>
                                            <th className="p-6 font-normal text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {applications.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center text-white/20 font-mono text-sm">
                                                    No applications yet. Start by adding one!
                                                </td>
                                            </tr>
                                        ) : (
                                            applications.map((app) => (
                                                <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-6">
                                                        <div className="font-display font-medium text-white text-lg flex items-center gap-2">
                                                            {app.company}
                                                            {app.url && (
                                                                <a href={app.url} target="_blank" rel="noreferrer" className="text-white/20 hover:text-white transition-colors"><FaExternalLinkAlt className="text-[10px]" /></a>
                                                            )}
                                                        </div>
                                                        <div className="text-white/40 text-xs font-mono uppercase tracking-wider mt-1">
                                                            {getRoleLabel(app.role)}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1 text-[10px] font-mono uppercase tracking-widest border ${STATUS_COLORS[app.status] || 'text-white/60 border-white/10'}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-white/60 text-sm font-mono">
                                                        {new Date(app.date_applied).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-6 text-white/60 text-sm font-mono">
                                                        <div>{app.location || '-'}</div>
                                                        <div className="text-white/30 text-xs">{app.salary}</div>
                                                    </td>
                                                    <td className="p-6 text-right">
                                                        <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link
                                                                to={`/tracker/${app.id}`}
                                                                className="text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest font-mono"
                                                            >
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() => handleEdit(app)}
                                                                className="text-white/40 hover:text-aurora-cyan transition-colors text-[10px] uppercase tracking-widest font-mono"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(app.id)}
                                                                className="text-white/40 hover:text-red-400 transition-colors text-[10px] uppercase tracking-widest font-mono"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10"
                        >
                            {/* KPI CARDS */}
                            <div className="bg-void p-8 group hover:bg-white/[0.02] transition-colors">
                                <div className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Total Applications</div>
                                <div className="text-6xl font-display font-medium text-white mb-2">{applications.length}</div>
                                <div className="text-aurora-cyan text-xs font-mono">Keep pushing.</div>
                            </div>

                            <div className="bg-void p-8 group hover:bg-white/[0.02] transition-colors">
                                <div className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Interview Rate</div>
                                <div className="text-6xl font-display font-medium text-white mb-2">
                                    {applications.length > 0
                                        ? Math.round((applications.filter(a => ['Interview', 'Offer'].includes(a.status)).length / applications.length) * 100)
                                        : 0}%
                                </div>
                                <div className="text-aurora-purple text-xs font-mono">Conversion Strength</div>
                            </div>

                            {/* STATUS DISTRIBUTION */}
                            <div className="bg-void p-8 md:col-span-2 lg:col-span-1 hover:bg-white/[0.02] transition-colors">
                                <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">Pipeline Funnel</h3>
                                <div className="space-y-4">
                                    {Object.entries(getStatusCounts()).map(([status, count]: any) => (
                                        <div key={status} className="flex items-center gap-4">
                                            <div className="w-24 text-white/60 text-xs font-mono text-right">{status}</div>
                                            <div className="flex-1 h-px bg-white/10">
                                                <div
                                                    className="h-full bg-white"
                                                    style={{ width: `${(count / applications.length) * 100}%` }}
                                                />
                                            </div>
                                            <div className="w-8 text-white font-mono text-xs">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ROLE DISTRIBUTION */}
                            <div className="bg-void p-8 md:col-span-3 hover:bg-white/[0.02] transition-colors">
                                <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-6">Applications by Domain</h3>
                                <div className="flex flex-wrap gap-4">
                                    {Object.entries(getRoleCounts()).map(([role, count]: any) => (
                                        <div key={role} className="border border-white/10 px-4 py-2 flex items-center gap-3 hover:border-white/40 transition-colors">
                                            <span className="text-white font-display text-sm">{role}</span>
                                            <span className="text-white/40 text-xs font-mono">[{count}]</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ADD MODAL with Minimal Line Style */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-void border border-white/10 w-full max-w-4xl p-12 shadow-2xl relative max-h-[90vh] overflow-y-auto"
                            >
                                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors font-mono text-xl">✕</button>

                                <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-4 block">
                                    // {editId ? 'Modify Record' : 'New Entry'}
                                </span>
                                <h2 className="text-4xl font-display font-medium text-white mb-12">
                                    APPLICATION DETAILS
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="group">
                                            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Company</label>
                                            <input
                                                required
                                                className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-display text-xl placeholder:text-white/10"
                                                placeholder="e.g. Google"
                                                value={formData.company}
                                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            {/* Custom Select for Status */}
                                            <CustomSelect
                                                label="Status"
                                                value={formData.status}
                                                options={STATUS_OPTIONS.map(s => ({ value: s.value, label: s.value }))}
                                                onChange={(val) => setFormData({ ...formData, status: val })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        {/* Custom Select for Role */}
                                        <CustomSelect
                                            label="Role / Domain"
                                            value={formData.role}
                                            options={ROLE_OPTIONS}
                                            onChange={(val) => setFormData({ ...formData, role: val })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="group">
                                            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Date Applied</label>
                                            <input
                                                type="date"
                                                className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm uppercase"
                                                value={formData.date_applied}
                                                onChange={e => setFormData({ ...formData, date_applied: e.target.value })}
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Salary (Optional)</label>
                                            <input
                                                className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm"
                                                placeholder="e.g. $140k"
                                                value={formData.salary}
                                                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="group">
                                            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Location (Optional)</label>
                                            <input
                                                className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm"
                                                placeholder="e.g. Remote, NYC"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Job Link (Optional)</label>
                                            <input
                                                className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm"
                                                placeholder="https://..."
                                                value={formData.url}
                                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Notes (Optional)</label>
                                        <textarea
                                            className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors min-h-[100px] font-body text-sm leading-relaxed"
                                            placeholder="Interview details, contact person, etc..."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-white text-black hover:bg-white/90 font-mono uppercase tracking-widest text-xs font-bold py-5 mt-4 transition-all"
                                    >
                                        {isLoading ? 'Processing...' : (editId ? 'Update Record' : 'Save Record')}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
