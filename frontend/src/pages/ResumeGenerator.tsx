import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import { API_BASE_URL } from '../lib/api';
import { LuFileText, LuPenTool, LuDownload, LuHistory, LuLoader, LuArrowRight, LuSparkles } from 'react-icons/lu';

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
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-20 relative">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-aurora-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-aurora-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto w-full relative z-10">

                <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">
                            // Document Architect
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white mb-2">
                            RESUME <span className="text-white/40">GENERATOR</span>
                        </h1>
                        <p className="text-white/60 text-lg font-light max-w-xl">
                            AI-driven resume tailoring engine optimized for ATS compliance.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* INPUT COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-12"
                    >
                        <div className="bg-void border border-white/10 p-8 md:p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-50">
                                <LuPenTool size={24} className="text-white/20" />
                            </div>

                            <div className="space-y-8">
                                {/* Style Selector */}
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setStyle('harvard')}
                                        className={`py-4 px-6 border text-xs font-mono uppercase tracking-widest transition-all
                                        ${style === 'harvard' ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:text-white'}`}
                                    >
                                        Harvard (Standard)
                                    </button>
                                    <button
                                        onClick={() => setStyle('creative')}
                                        className={`py-4 px-6 border text-xs font-mono uppercase tracking-widest transition-all
                                        ${style === 'creative' ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:text-white'}`}
                                    >
                                        Modern (Creative)
                                    </button>
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Target Job Title</label>
                                    <input
                                        type="text"
                                        value={jobTitle}
                                        onChange={(e) => setJobTitle(e.target.value)}
                                        className="w-full bg-transparent border-b border-white/20 pb-3 text-white text-xl font-display focus:outline-none focus:border-aurora-purple transition-colors placeholder:text-white/10"
                                        placeholder="e.g. Senior Product Engineer"
                                    />
                                </div>

                                <div className="group h-80 flex flex-col">
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 group-focus-within:text-white transition-colors">Job Description</label>
                                    <textarea
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        className="flex-1 w-full bg-white/[0.02] border border-white/10 p-6 text-white focus:outline-none focus:border-aurora-purple transition-colors font-mono text-sm leading-relaxed placeholder:text-white/10 resize-none"
                                        placeholder="Paste the full job description here..."
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !jobDescription}
                                    className={`
                                        w-full py-6 font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 relative overflow-hidden group
                                        ${isGenerating
                                            ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                                            : 'bg-aurora-purple text-white hover:bg-aurora-purple/90 border border-transparent'
                                        }
                                    `}
                                >
                                    {isGenerating ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <LuLoader className="animate-spin" />
                                            <span>Processing...</span>
                                        </div>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Generate Document <LuArrowRight />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* OUTPUT COLUMN */}
                    <div className="relative">
                        <AnimatePresence mode='wait'>
                            {result ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-void border border-white/10 p-8 md:p-12 h-full relative overflow-hidden flex flex-col"
                                >
                                    <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                            <div className="flex items-center gap-3">
                                                <LuSparkles className="text-aurora-cyan" />
                                                <h3 className="text-2xl font-display font-medium text-white">Analysis Complete</h3>
                                            </div>
                                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 font-mono uppercase tracking-widest">
                                                Ready for Review
                                            </span>
                                        </div>

                                        <div className="space-y-12 flex-1">
                                            <div>
                                                <h4 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Executive Summary</h4>
                                                <p className="text-white/80 leading-loose text-lg font-light border-l-2 border-aurora-purple pl-6 py-2">
                                                    {result.preview.summary}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Matched Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.preview.skills.map((skill: string, idx: number) => (
                                                        <motion.span
                                                            key={idx}
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: idx * 0.05 }}
                                                            className="text-white bg-white/5 border border-white/10 px-3 py-1 text-xs font-mono uppercase tracking-wider"
                                                        >
                                                            {skill}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-12 mt-auto">
                                            <a
                                                href={`http://127.0.0.1:8090/api/files/${result.data.collectionId}/${result.data.id}/${result.data.resume_pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group w-full bg-white text-black hover:bg-white/90 text-center py-5 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <LuDownload /> Download PDF
                                            </a>
                                            <p className="text-center text-white/20 text-[10px] font-mono uppercase tracking-widest mt-4">
                                                Document ID: {result.data.id}
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
                                    className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.01] p-12 text-center"
                                >
                                    <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center mb-6 text-white/20">
                                        <LuFileText size={32} />
                                    </div>
                                    <h3 className="text-white font-display font-medium text-xl mb-2">Awaiting Input</h3>
                                    <p className="text-white/30 max-w-xs mx-auto font-mono text-xs uppercase tracking-widest">
                                        Provide job details to initialize the Resume Architect engine.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* HISTORY SECTION */}
                {history.length > 0 && (
                    <div className="mb-20 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-4 mb-8">
                            <LuHistory className="text-white/40" />
                            <h2 className="text-sm font-mono uppercase tracking-widest text-white/40">Generation Logs</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
                            {history.map((item) => (
                                <div key={item.id} className="bg-void p-6 hover:bg-white/[0.02] transition-colors group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 border
                                            ${item.style === 'creative' ? 'text-aurora-purple border-aurora-purple/20' : 'text-white/40 border-white/10'}`}>
                                            {item.style === 'creative' ? 'Modern' : 'Standard'}
                                        </span>
                                        <span className="text-white/20 text-[10px] font-mono">{new Date(item.created).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-display font-medium text-white mb-1 truncate">{item.job_title}</h3>
                                    <a
                                        href={`http://127.0.0.1:8090/api/files/${item.collectionId}/${item.id}/${item.resume_pdf}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-white/40 group-hover:text-white font-mono text-[10px] uppercase tracking-widest mt-4 transition-colors"
                                    >
                                        <LuFileText size={12} /> View Document
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
