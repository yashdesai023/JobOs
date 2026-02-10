import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import { LuArrowLeft, LuExternalLink, LuCalendar, LuMapPin, LuDollarSign, LuFileText, LuTrash } from 'react-icons/lu';
import { STATUS_COLORS } from '../constants';

export default function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                if (!id) return;
                const record = await pb.collection('applications').getOne(id);
                setApp(record);
            } catch (error) {
                console.error("Error fetching application:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApp();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this application?")) return;
        try {
            await pb.collection('applications').delete(id!);
            navigate('/tracker');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center text-white font-mono text-xs uppercase tracking-widest">
                <div className="animate-pulse text-aurora-cyan">Loading Record...</div>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="min-h-screen bg-void flex flex-col items-center justify-center text-white font-body p-6">
                <h2 className="text-2xl font-display font-medium mb-4 text-white">Application Not Found</h2>
                <div className="flex gap-4">
                    <Link to="/tracker" className="px-6 py-3 border border-white/10 hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-widest transition-all">
                        Return to Tracker
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-32">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full">

                {/* Back Link */}
                <Link to="/tracker" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group font-mono text-xs uppercase tracking-widest">
                    <LuArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" /> Back to Tracker
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-white/10 bg-white/[0.02]"
                >
                    {/* Header Banner */}
                    <div className="p-8 md:p-12 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tight">{app.company}</h1>
                                {app.url && (
                                    <a href={app.url} target="_blank" rel="noreferrer" className="text-white/30 hover:text-white transition-colors p-2 border border-white/10 hover:border-white rounded-full">
                                        <LuExternalLink className="text-sm" />
                                    </a>
                                )}
                            </div>
                            <p className="text-xl md:text-2xl text-white/60 font-light">{app.role}</p>
                        </div>

                        <div className={`px-4 py-2 border text-xs font-mono uppercase tracking-widest ${STATUS_COLORS[app.status] || 'border-white/10 text-white'}`}>
                            {app.status}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">

                        {/* Left Column: Details */}
                        <div className="md:col-span-1 p-8 md:p-12 space-y-8">
                            <div>
                                <h3 className="text-white/40 text-[10px] uppercase font-mono tracking-[0.2em] mb-6">At a Glance</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 group">
                                        <LuCalendar className="text-white/20 group-hover:text-aurora-purple transition-colors mt-0.5" />
                                        <div>
                                            <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Applied On</div>
                                            <div className="text-sm font-medium">{new Date(app.date_applied).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <LuMapPin className="text-white/20 group-hover:text-aurora-cyan transition-colors mt-0.5" />
                                        <div>
                                            <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Location</div>
                                            <div className="text-sm font-medium">{app.location || 'Remote (Unspecified)'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 group">
                                        <LuDollarSign className="text-white/20 group-hover:text-emerald-400 transition-colors mt-0.5" />
                                        <div>
                                            <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider mb-1">Salary</div>
                                            <div className="text-sm font-medium">{app.salary || 'Not Disclosed'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10">
                                <button
                                    onClick={handleDelete}
                                    className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-red-500/50 hover:bg-red-500/10 text-white/40 hover:text-red-400 py-3 font-mono text-xs uppercase tracking-widest transition-all"
                                >
                                    <LuTrash /> Delete Record
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Notes */}
                        <div className="md:col-span-2 p-8 md:p-12 min-h-[400px]">
                            <h3 className="text-white/40 text-[10px] uppercase font-mono tracking-[0.2em] mb-8 flex items-center gap-2">
                                <LuFileText /> Notes & Updates
                            </h3>

                            {app.notes ? (
                                <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-wrap leading-relaxed font-light text-lg">
                                    {app.notes}
                                </div>
                            ) : (
                                <div className="text-white/20 font-mono text-xs italic">
                                    No notes added for this application yet.
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    );
}
