import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';


import { API_BASE_URL } from '../lib/api';

export default function ResumeGenerator() {
    const [jobDescription, setJobDescription] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [style, setStyle] = useState('harvard'); // 'harvard' or 'creative'
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);

    const fetchHistory = async () => {
        try {
            const records = await pb.collection('resume_generated').getList(1, 10, {
                sort: '-created',
            });
            setHistory(records.items);
        } catch (e) {
            console.log("Error fetching resume history:", e);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleGenerate = async () => {
        if (!jobDescription || !jobTitle) return;

        setIsGenerating(true);
        try {


            // ... (inside the component)
            const response = await fetch(`${API_BASE_URL}/api/generate-resume`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_description: jobDescription,
                    job_title: jobTitle,
                    style: style
                })
            });

            if (!response.ok) throw new Error('Generation failed');

            const data = await response.json();
            setResult(data);
            fetchHistory(); // Refresh history
        } catch (error) {
            console.error(error);
            alert("Failed to generate resume. See console.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-green-500 selection:text-white pb-20 relative overflow-hidden">
            {/* Background Gradient Blurs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] -mt-20 -ml-20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -mb-20 -mr-20 pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-4 max-w-6xl mx-auto w-full relative z-10">

                <div className="mb-16 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 mb-6 drop-shadow-2xl"
                    >
                        ATS Resume Architect
                    </motion.h1>
                    <p className="text-white/40 text-xl font-light tracking-wide">
                        Tailor your portfolio to any Job Description with AI precision.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* INPUT COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 h-fit shadow-2xl hover:border-green-500/30 transition-all duration-500"
                    >
                        <div className="space-y-8">
                            {/* Style Selector */}
                            <div className="p-1 bg-black/20 rounded-2xl flex gap-1">
                                <button
                                    onClick={() => setStyle('harvard')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${style === 'harvard' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    🏛️ Harvard (ATS)
                                </button>
                                <button
                                    onClick={() => setStyle('creative')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${style === 'creative' ? 'bg-purple-500/20 text-purple-200 shadow-lg border border-purple-500/30' : 'text-white/40 hover:text-white/60'}`}
                                >
                                    🎨 Creative (Modern)
                                </button>
                            </div>

                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-3 pl-1">Target Job Title</label>
                                <input
                                    type="text"
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white text-lg focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-white/10"
                                    placeholder="e.g. Senior Python Engineer"
                                />
                            </div>

                            <div>
                                <label className="block text-white/50 text-xs uppercase tracking-widest font-bold mb-3 pl-1">Job Description</label>
                                <textarea
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="w-full h-80 bg-black/20 border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-green-500/50 transition-colors font-mono text-sm leading-relaxed placeholder:text-white/10 resize-none"
                                    placeholder="Paste the full job description here..."
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !jobDescription}
                                className={`
                                    w-full relative overflow-hidden px-8 py-5 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-green-500/20 group
                                    ${isGenerating
                                        ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                        : 'bg-gradient-to-br from-green-600 to-emerald-700 text-white border border-white/10'
                                    }
                                `}
                            >
                                {isGenerating ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Designing Resume...</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Generate {style === 'harvard' ? 'Professional' : 'Creative'} Resume
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* OUTPUT COLUMN */}
                    <div className="relative">
                        <AnimatePresence mode='wait'>
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: "spring", bounce: 0.3 }}
                                    className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-green-500/30 rounded-[2rem] p-10 h-full relative overflow-hidden shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 px-6 py-3 bg-green-500/10 text-green-400 text-xs font-bold rounded-bl-3xl border-l border-b border-green-500/20">
                                        READY FOR REVIEW
                                    </div>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30 text-2xl">
                                            ✨
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white">Analysis Complete</h3>
                                            <p className="text-green-400/60 text-sm">Matched top skills & projects</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-white/40 text-xs uppercase tracking-widest mb-4 font-bold">Executive Summary</h4>
                                            <p className="text-white/80 leading-loose text-sm p-6 bg-white/5 rounded-2xl border border-white/5 italic relative">
                                                <span className="absolute top-4 left-4 text-4xl text-white/5 font-serif">"</span>
                                                {result.preview.summary}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-white/40 text-xs uppercase tracking-widest mb-4 font-bold">Highlighted Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.preview.skills.map((skill: string, idx: number) => (
                                                    <motion.span
                                                        key={idx}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="bg-green-500/5 hover:bg-green-500/10 text-green-300 px-4 py-2 rounded-xl text-xs font-medium border border-green-500/20 transition-colors"
                                                    >
                                                        {skill}
                                                    </motion.span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-8 mt-auto">
                                            <a
                                                href={`http://127.0.0.1:8090/api/files/${result.data.collectionId}/${result.data.id}/${result.data.resume_pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block w-full bg-white text-black text-center py-5 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                                            >
                                                <span className="flex items-center justify-center gap-2">
                                                    View Generated PDF
                                                    <svg className="w-5 h-5 group-hover:-rotate-45 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                </span>
                                            </a>
                                            <p className="text-center text-white/30 text-xs mt-4">
                                                Saved to History
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] p-12 text-center"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                        <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    </div>
                                    <h3 className="text-white text-2xl font-bold mb-2">Awaiting Data</h3>
                                    <p className="text-white/30 max-w-sm mx-auto">
                                        Paste a Job Description on the left to activate the Resume Architect engine.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* HISTORY SECTION */}
                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-20"
                    >
                        <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Resume History</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {history.map((item) => (
                                <div key={item.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-green-500/30 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                                            {item.style === 'creative' ? 'Creative' : 'ATS / Harvard'}
                                        </div>
                                        <span className="text-white/30 text-xs">{new Date(item.created).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1 truncate">{item.job_title}</h3>
                                    <p className="text-white/40 text-sm mb-6">Automated Architect Build</p>

                                    <a
                                        href={`http://127.0.0.1:8090/api/files/${item.collectionId}/${item.id}/${item.resume_pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-green-400 font-bold text-sm hover:underline"
                                    >
                                        View Resume PDF
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
