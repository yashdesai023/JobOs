import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import { FaPlus, FaChartBar, FaList, FaTrash, FaExternalLinkAlt, FaChevronDown, FaEdit, FaEye, FaSync } from 'react-icons/fa';

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
            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">{label}</label>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-left flex justify-between items-center focus:border-green-500 transition-colors"
            >
                <span className="truncate">{selectedLabel}</span>
                <FaChevronDown className={`text-white/30 text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-50 w-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                className={`px-4 py-3 text-sm cursor-pointer hover:bg-white/5 transition-colors ${opt.value === value ? 'text-green-400 font-bold bg-green-500/10' : 'text-white/80'}`}
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
            alert("Failed to save application. Ensure 'applications' collection exists in PocketBase.");
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
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-green-500 selection:text-white pb-20 relative overflow-hidden">
            {/* Background Blurs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mt-20 -mr-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] -mb-20 -ml-20 pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-4 max-w-7xl mx-auto w-full relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-10">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-bold text-white mb-2"
                        >
                            Application Tracker
                        </motion.h1>
                        <p className="text-white/40">Manage your job search pipeline efficiently.</p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
                        <button
                            onClick={() => setView('table')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'table' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            <FaList /> Table
                        </button>
                        <button
                            onClick={() => setView('analytics')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'analytics' ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            <FaChartBar /> Analytics
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-50`}
                            title="Refresh Data"
                        >
                            <FaSync className={isRefreshing ? "animate-spin text-green-400" : ""} />
                        </button>
                        <div className="w-[1px] h-6 bg-white/10 mx-1" />
                        <button
                            onClick={() => { resetForm(); setIsModalOpen(true); }}
                            className="px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-500/20 transition-all shadow-lg"
                        >
                            <FaPlus /> Add New
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
                            className="bg-transparent md:bg-[#0a0a0a]/80 md:backdrop-blur-xl md:border md:border-white/10 rounded-2xl md:overflow-hidden md:shadow-2xl"
                        >
                            {/* MOBILE CARD VIEW */}
                            <div className="md:hidden space-y-4">
                                {applications.length === 0 ? (
                                    <div className="text-center text-white/20 py-12">No applications yet.</div>
                                ) : (
                                    applications.map((app) => (
                                        <div key={app.id} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 shadow-lg relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                                        {app.company}
                                                        {app.url && <a href={app.url} target="_blank" rel="noreferrer" className="text-blue-400 text-xs"><FaExternalLinkAlt /></a>}
                                                    </h3>
                                                    <p className="text-white/50 text-sm">{getRoleLabel(app.role)}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[app.status] || 'bg-white/10 text-white'}`}>
                                                    {app.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2 text-sm text-white/60 mb-4">
                                                <div>📍 {app.location || 'N/A'}</div>
                                                <div className="text-right">💰 {app.salary || 'N/A'}</div>
                                                <div className="col-span-2 text-xs opacity-50">Applied: {new Date(app.date_applied).toLocaleDateString()}</div>
                                            </div>

                                            <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
                                                <Link to={`/tracker/${app.id}`} className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-bold flex items-center gap-2">
                                                    <FaEye /> View
                                                </Link>
                                                <button onClick={() => handleEdit(app)} className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(app.id)} className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm">
                                                    <FaTrash />
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
                                        <tr className="bg-white/5 text-white/40 text-xs uppercase tracking-wider border-b border-white/10">
                                            <th className="p-4 font-bold">Role & Company</th>
                                            <th className="p-4 font-bold">Status</th>
                                            <th className="p-4 font-bold">Date Applied</th>
                                            <th className="p-4 font-bold">Location / Salary</th>
                                            <th className="p-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {applications.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="p-12 text-center text-white/20">
                                                    No applications yet. Start by adding one!
                                                </td>
                                            </tr>
                                        ) : (
                                            applications.map((app) => (
                                                <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-white text-lg flex items-center gap-2">
                                                            {app.company}
                                                            {app.url && (
                                                                <a href={app.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><FaExternalLinkAlt className="text-xs" /></a>
                                                            )}
                                                        </div>
                                                        <div className="text-white/50 text-sm">
                                                            {getRoleLabel(app.role)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[app.status] || 'bg-white/10 text-white'}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-white/60 text-sm">
                                                        {new Date(app.date_applied).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-white/60 text-sm">
                                                        <div>{app.location || '-'}</div>
                                                        <div className="text-white/30 text-xs">{app.salary}</div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Link
                                                                to={`/tracker/${app.id}`}
                                                                className="p-2 text-white/20 hover:text-green-400 transition-colors"
                                                                title="View Details"
                                                            >
                                                                <FaEye />
                                                            </Link>
                                                            <button
                                                                onClick={() => handleEdit(app)}
                                                                className="p-2 text-white/20 hover:text-blue-400 transition-colors"
                                                                title="Edit Application"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(app.id)}
                                                                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                                                                title="Delete Application"
                                                            >
                                                                <FaTrash />
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
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {/* KPI CARDS */}
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FaList className="text-6xl text-white" /></div>
                                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Total Applications</h3>
                                <div className="text-5xl font-bold text-white mb-2">{applications.length}</div>
                                <div className="text-green-400 text-sm">Keep passing those pipelines!</div>
                            </div>

                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><FaChartBar className="text-6xl text-purple-500" /></div>
                                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Interview Rate</h3>
                                <div className="text-5xl font-bold text-white mb-2">
                                    {applications.length > 0
                                        ? Math.round((applications.filter(a => ['Interview', 'Offer'].includes(a.status)).length / applications.length) * 100)
                                        : 0}%
                                </div>
                                <div className="text-purple-400 text-sm">Conversion to Interview</div>
                            </div>

                            {/* STATUS DISTRIBUTION */}
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:col-span-2 lg:col-span-1">
                                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-6">Pipeline Funnel</h3>
                                <div className="space-y-3">
                                    {Object.entries(getStatusCounts()).map(([status, count]: any) => (
                                        <div key={status} className="flex items-center gap-4">
                                            <div className="w-24 text-white/60 text-sm text-right">{status}</div>
                                            <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${(count / applications.length) * 100}%`, backgroundColor: STATUS_COLORS[status]?.split(' ')[0].replace('bg-', '')?.replace('/20', '') || '#555' }}
                                                />
                                            </div>
                                            <div className="w-8 text-white font-bold text-sm">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ROLE DISTRIBUTION */}
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:col-span-3">
                                <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-6">Applications by Domain</h3>
                                <div className="flex flex-wrap gap-3">
                                    {Object.entries(getRoleCounts()).map(([role, count]: any) => (
                                        <div key={role} className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
                                            <span className="text-white font-bold">{role}</span>
                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white/60">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ADD MODAL with Glassmorphism */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-4xl p-8 shadow-2xl relative overflow-visible max-h-[90vh] overflow-y-auto"
                            >
                                {/* Decorative gradient blob */}
                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

                                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">✕</button>

                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-green-500 rounded-full inline-block" />
                                    {editId ? 'Edit Application' : 'Track New Application'}
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Company</label>
                                            <input
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none transition-colors placeholder:text-white/10"
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Date Applied</label>
                                            <input
                                                type="date"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none appearance-none"
                                                value={formData.date_applied}
                                                onChange={e => setFormData({ ...formData, date_applied: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Salary (Optional)</label>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none"
                                                placeholder="e.g. $140k"
                                                value={formData.salary}
                                                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Location (Optional)</label>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none"
                                                placeholder="e.g. Remote, NYC"
                                                value={formData.location}
                                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Job Link (Optional)</label>
                                            <input
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none"
                                                placeholder="https://..."
                                                value={formData.url}
                                                onChange={e => setFormData({ ...formData, url: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-white/40 text-xs mb-1 font-bold uppercase tracking-wider">Notes (Optional)</label>
                                        <textarea
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-green-500 outline-none min-h-[100px]"
                                            placeholder="Interview details, contact person, etc..."
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:shadow-green-500/20 text-white font-bold py-4 rounded-xl mt-4 transition-all"
                                    >
                                        {isLoading ? 'Saving...' : (editId ? 'Update Application' : 'Save Application')}
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
