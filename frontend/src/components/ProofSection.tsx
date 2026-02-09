
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';

import { LuZap, LuLayers, LuBox, LuServer } from 'react-icons/lu';

export default function ProofSection() {
    return (
        <div className="relative z-20 bg-gradient-to-b from-[#0a0a0a] to-[#121212] py-20 px-4 md:px-12 w-full -mt-20">
            <div className="max-w-7xl mx-auto flex flex-col items-center">

                {/* Dossier Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center max-w-4xl"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Engineering Dossier</h2>
                    <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                        Beyond the resume, I have compiled a comprehensive Technical Dossier. This 10-page document provides a deep dive into my architectural decisions, production benchmarks, and the specific engineering challenges I solved while building high-performance GenAI systems.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-lg text-white">
                                <LuZap />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Performance Proof</h4>
                                <p className="text-sm text-white/50">Verified retrieval benchmarks (18.4ms p50) for large-scale RAG.</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-lg text-white">
                                <LuLayers />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Architectural Depth</h4>
                                <p className="text-sm text-white/50">Full-system diagrams for autonomous agentic workflows.</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-lg text-white">
                                <LuBox />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Package Logic</h4>
                                <p className="text-sm text-white/50">A detailed breakdown of the vectorDBpipe PyPI framework.</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 hover:bg-white/10 transition-colors">
                            <div className="mt-1 bg-white/10 p-2 rounded-lg text-white">
                                <LuServer />
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Full Stack Context</h4>
                                <p className="text-sm text-white/50">Deep dives into MLOps pipelines and multithreaded backends.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                        <a
                            href="https://db.jobos.online/api/files/pbc_2471947077/gcbz3elpm2gnu42/yash_desai_ultimate_dossier_final_1o58dn4ntr.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.1)] pointer-events-auto"
                        >
                            <FaDownload className="text-lg" />
                            <span>Download Technical Dossier</span>
                        </a>
                        <span className="text-xs text-white/30 uppercase tracking-widest font-medium">Includes Benchmarks & Architecture Deep-Dives (PDF)</span>
                    </div>
                </motion.div>

                {/* Proof Layer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {/* Card A */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="text-4xl md:text-5xl font-bold font-mono text-white/90 mb-2">
                            18.4ms
                        </div>
                        <div className="text-sm text-white/60 font-medium uppercase tracking-wider">
                            p50 RAG Retrieval Latency
                        </div>
                        <div className="text-xs text-white/30 mt-2">
                            Optimized Vector Search
                        </div>
                    </motion.div>

                    {/* Card B */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="text-4xl md:text-5xl font-bold font-mono text-white/90 mb-2">
                            PyPI
                        </div>
                        <div className="text-sm text-white/60 font-medium uppercase tracking-wider">
                            Modular Vector Pipeline
                        </div>
                        <div className="text-xs text-white/30 mt-2">
                            Open Source Contribution
                        </div>
                    </motion.div>

                    {/* Card C */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors duration-300"
                    >
                        <div className="text-4xl md:text-5xl font-bold font-mono text-white/90 mb-2">
                            80%
                        </div>
                        <div className="text-sm text-white/60 font-medium uppercase tracking-wider">
                            Manual Ops Reduction
                        </div>
                        <div className="text-xs text-white/30 mt-2">
                            Agentic Automation
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}

