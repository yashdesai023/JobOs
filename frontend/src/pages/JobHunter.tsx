import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import type { RecordModel } from 'pocketbase';

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
            // Don't alert here to avoid spamming if collection doesn't exist yet
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleTriggerHunt = async () => {
        setIsLoading(true);
        try {


            // ...
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

            // Refresh history
            await fetchReports();

        } catch (error) {
            console.error(error);
            alert("Error triggering hunt. Check backend console.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-purple-500 selection:text-white pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto w-full">

                {/* Header Section */}
                <div className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4"
                    >
                        JobOs Hunter
                    </motion.h1>
                    <p className="text-white/40 text-lg">
                        Configure your preferences and let the AI Agent scout 10+ platforms for you.
                    </p>
                </div>

                {/* Configuration Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 mb-16 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* Inputs */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-white/50 text-sm font-medium mb-2">Target Role</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white/50 text-sm font-medium mb-2">Experience</label>
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors [&>option]:text-black"
                                    >
                                        <option>Fresher</option>
                                        <option>0-3 years</option>
                                        <option>3-5 years</option>
                                        <option>5+ years</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/50 text-sm font-medium mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="e.g. Remote"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/50 text-sm font-medium mb-2">Key Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="Python, React, AWS..."
                                />
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="flex flex-col justify-center items-center border-l border-white/5 pl-8">
                            <button
                                onClick={handleTriggerHunt}
                                disabled={isLoading}
                                className={`
                                    w-full max-w-sm relative overflow-hidden px-8 py-6 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 group
                                    ${isLoading
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                        : 'bg-gradient-to-br from-blue-600 to-purple-700 text-white border border-white/10'
                                    }
                                `}
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Scouting the Web...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            <span>Start Job Hunt</span>
                                        </>
                                    )}
                                </div>
                            </button>
                            <p className="mt-6 text-white/30 text-sm text-center">
                                This will trigger the AI Agent to search LinkedIn, Wellfound, RemoteOK, and 8+ other platforms using Jina.ai.
                            </p>
                        </div>
                    </div>
                </motion.div>


                {/* History Section */}
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <span className="w-2 h-8 bg-purple-500 rounded-full" />
                    Briefing History
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {reports.map((report) => (
                            <motion.div
                                key={report.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-colors group relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{report.role}</h3>
                                        <p className="text-white/40 text-sm">{new Date(report.created).toLocaleDateString()} • {new Date(report.created).toLocaleTimeString()}</p>
                                    </div>
                                    <span className="bg-green-500/10 text-green-400 text-xs font-bold px-2 py-1 rounded-md border border-green-500/20">
                                        {report.jobs_found} Jobs
                                    </span>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    {/* View HTML */}
                                    {report.report_html && (
                                        <a
                                            href={`http://127.0.0.1:8090/api/files/job_reports/${report.id}/${report.report_html}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-center py-2 rounded-lg text-sm font-medium transition-colors border border-white/5"
                                        >
                                            View Report
                                        </a>
                                    )}
                                    {/* Download PDF */}
                                    {report.report_pdf && (
                                        <a
                                            href={`http://127.0.0.1:8090/api/files/job_reports/${report.id}/${report.report_pdf}`}
                                            target="_blank"
                                            className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-300 text-center py-2 rounded-lg text-sm font-medium transition-colors border border-purple-500/20"
                                        >
                                            PDF
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {reports.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                        <p className="text-white/30">No reports generated yet. Start your first hunt above.</p>
                    </div>
                )}

            </div>
        </div>
    );
}
