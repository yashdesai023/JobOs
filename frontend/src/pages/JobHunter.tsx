import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import type { RecordModel } from 'pocketbase';
import { LuSearch, LuFileText, LuDownload, LuCpu, LuMapPin, LuBriefcase, LuClock } from 'react-icons/lu';
import { API_BASE_URL } from '../lib/api';

export default function JobHunter() {
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState<RecordModel[]>([]);

    // Form State
    const [role, setRole] = useState('Generative AI Engineer');
    const [experience, setExperience] = useState('0-3 years');
    const [location, setLocation] = useState('Remote');
    const [skills, setSkills] = useState('Python, LangChain, React');

    // Fetch History on Mount
    const fetchReports = async () => {
        try {
            const records = await pb.collection('job_reports').getList(1, 10, {
                sort: '-created',
            });
            setReports(records.items);
        } catch (error) {
            console.error("Error fetching reports:", error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleTriggerHunt = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/trigger-hunt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    experience,
                    location,
                    skills: skills.split(',').map(s => s.trim())
                })
            });

            if (!response.ok) throw new Error('Failed to trigger hunt');

            await fetchReports();

        } catch (error) {
            console.error(error);
            alert("Error triggering hunt. Check backend console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-32">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-6xl mx-auto w-full">

                {/* Header Section */}
                <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">
                            // AI Agent Scout
                        </span>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white mb-4"
                        >
                            JOB <span className="text-white/40">HUNTER</span>
                        </motion.h1>
                        <p className="text-white/60 text-lg font-light max-w-xl">
                            Deploy autonomous agents to scout LinkedIn, Wellfound, and RemoteOK based on your criteria.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        SYSTEM ONLINE
                    </div>
                </div>

                {/* Configuration Console */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-purple/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                        {/* Inputs */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Target Role</label>
                                <div className="relative">
                                    <LuBriefcase className="absolute left-0 top-3 text-white/20" />
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/20 pl-8 pb-3 text-white outline-none focus:border-aurora-purple transition-colors font-display text-xl placeholder:text-white/10"
                                        placeholder="e.g. Frontend Developer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="group">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Experience</label>
                                    <div className="relative">
                                        <LuClock className="absolute left-0 top-3 text-white/20" />
                                        <select
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/20 pl-8 pb-3 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm uppercase [&>option]:text-black appearance-none cursor-pointer"
                                        >
                                            <option>Fresher</option>
                                            <option>0-3 years</option>
                                            <option>3-5 years</option>
                                            <option>5+ years</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="group">
                                    <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Location</label>
                                    <div className="relative">
                                        <LuMapPin className="absolute left-0 top-3 text-white/20" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/20 pl-8 pb-3 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm"
                                            placeholder="e.g. Remote"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-aurora-purple transition-colors">Key Keywords</label>
                                <div className="relative">
                                    <LuCpu className="absolute left-0 top-3 text-white/20" />
                                    <input
                                        type="text"
                                        value={skills}
                                        onChange={(e) => setSkills(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/20 pl-8 pb-3 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm"
                                        placeholder="Python, React, AWS..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col justify-center items-center lg:border-l border-white/10 lg:pl-12">
                            <button
                                onClick={handleTriggerHunt}
                                disabled={isLoading}
                                className={`
                                    w-full py-6 font-mono text-sm uppercase tracking-widest font-bold transition-all duration-300 group relative overflow-hidden
                                    ${isLoading
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                        : 'bg-white text-black hover:bg-white/90 border border-white'
                                    }
                                `}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                            <span>Initializing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Initialise Hunt</span>
                                            <LuSearch />
                                        </>
                                    )}
                                </div>
                            </button>
                            <p className="mt-6 text-white/30 text-[10px] font-mono uppercase tracking-widest text-center">
                                Awaiting Command. <br /> Targeting 10+ Data Sources.
                            </p>
                        </div>
                    </div>
                </motion.div>


                {/* History Section */}
                <div className="flex items-center gap-4 mb-8">
                    <span className="w-8 h-px bg-white/20"></span>
                    <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">
                        Mission Logs
                    </h2>
                    <span className="flex-1 h-px bg-white/20"></span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                    <AnimatePresence>
                        {reports.map((report) => (
                            <motion.div
                                key={report.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-void p-8 hover:bg-white/[0.02] transition-colors group relative border border-transparent hover:border-white/5"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-lg font-display font-medium text-white mb-1 group-hover:text-aurora-cyan transition-colors">{report.role}</h3>
                                        <p className="text-white/40 text-xs font-mono uppercase tracking-wider">{new Date(report.created).toLocaleDateString()}</p>
                                    </div>
                                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold px-2 py-1 rounded-sm border border-emerald-500/20 uppercase tracking-wider">
                                        {report.jobs_found} Matches
                                    </span>
                                </div>

                                <div className="flex gap-px bg-white/10 border border-white/10 mt-4">
                                    {/* View HTML */}
                                    {report.report_html && (
                                        <a
                                            href={`http://127.0.0.1:8090/api/files/job_reports/${report.id}/${report.report_html}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-void hover:bg-white/5 text-white/60 hover:text-white text-center py-3 text-[10px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                        >
                                            <LuFileText size={12} /> View
                                        </a>
                                    )}
                                    {/* Download PDF */}
                                    {report.report_pdf && (
                                        <a
                                            href={`http://127.0.0.1:8090/api/files/job_reports/${report.id}/${report.report_pdf}`}
                                            target="_blank"
                                            className="flex-1 bg-void hover:bg-white/5 text-white/60 hover:text-aurora-purple text-center py-3 text-[10px] font-mono uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                                        >
                                            <LuDownload size={12} /> PDF
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {reports.length === 0 && (
                    <div className="text-center py-20 border border-white/10 bg-white/[0.02]">
                        <p className="text-white/30 font-mono text-xs uppercase tracking-widest">No missions executed.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
