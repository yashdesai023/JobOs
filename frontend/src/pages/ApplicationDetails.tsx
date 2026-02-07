import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import { FaArrowLeft, FaExternalLinkAlt, FaCalendar, FaMapMarkerAlt, FaMoneyBillWave, FaStickyNote } from 'react-icons/fa';
import { STATUS_COLORS } from '../constants';

export default function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                console.log("Fetching application with ID:", id);
                if (!id) {
                    console.error("No ID provided in URL");
                    return;
                }
                const record = await pb.collection('applications').getOne(id);
                console.log("Fetched record:", record);
                setApp(record);
            } catch (error) {
                console.error("Error fetching application:", error);
                // navigate('/tracker'); // Disable auto-redirect for debugging
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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="animate-pulse">Loading Application Details...</div>
            </div>
        );
    }

    if (!app) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Application Not Found</h2>
                <p className="text-white/60 mb-6 text-center max-w-md">
                    We couldn't find an application with ID <span className="font-mono text-xs bg-white/10 p-1 rounded">{id || 'undefined'}</span>.
                </p>
                <div className="flex gap-4">
                    <Link to="/tracker" className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-all">
                        Go Back to Tracker
                    </Link>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-purple-500 selection:text-white pb-20 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-4 max-w-5xl mx-auto w-full relative z-10">

                {/* Back Link */}
                <Link to="/tracker" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors group">
                    <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" /> Back to Tracker
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-white/5 to-transparent p-4 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">{app.company}</h1>
                                {app.url && (
                                    <a href={app.url} target="_blank" rel="noreferrer" className="text-white/30 hover:text-blue-400 transition-colors p-2 bg-white/5 rounded-full">
                                        <FaExternalLinkAlt className="text-sm" />
                                    </a>
                                )}
                            </div>
                            <p className="text-white/60 text-xl font-medium">{app.role}</p>
                        </div>

                        <div className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider ${STATUS_COLORS[app.status] || 'bg-white/10 text-white'}`}>
                            {app.status}
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Left Column: Details */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                <h3 className="text-white/40 text-xs uppercase font-bold mb-4 tracking-widest">At a Glance</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-white/80">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400"><FaCalendar className="text-xs" /></div>
                                        <div>
                                            <div className="text-[10px] text-white/30 uppercase">Applied On</div>
                                            <div className="font-medium">{new Date(app.date_applied).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/80">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400"><FaMapMarkerAlt className="text-xs" /></div>
                                        <div>
                                            <div className="text-[10px] text-white/30 uppercase">Location</div>
                                            <div className="font-medium">{app.location || 'Remote (Unspecified)'}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-white/80">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400"><FaMoneyBillWave className="text-xs" /></div>
                                        <div>
                                            <div className="text-[10px] text-white/30 uppercase">Salary</div>
                                            <div className="font-medium">{app.salary || 'Not Disclosed'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {/* Delete Button - For simplicity in this view, we keep it minimal */}
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold text-sm transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Notes */}
                        <div className="md:col-span-2">
                            <div className="bg-white/5 rounded-2xl p-8 border border-white/5 h-full min-h-[300px]">
                                <h3 className="text-white/40 text-xs uppercase font-bold mb-6 tracking-widest flex items-center gap-2">
                                    <FaStickyNote /> Notes & Updates
                                </h3>

                                {app.notes ? (
                                    <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-wrap leading-relaxed">
                                        {app.notes}
                                    </div>
                                ) : (
                                    <div className="text-white/20 italic">No notes added for this application yet.</div>
                                )}
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </div>
    );
}
