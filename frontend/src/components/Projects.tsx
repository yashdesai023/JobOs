import { motion } from 'framer-motion';

const projects = [
    {
        title: "EcoMind AI",
        category: "LLM Orchestration",
        description: "Multi-agent system allowing disparate LLMs to collaborate on sustainability research.",
    },
    {
        title: "Neural Canvas",
        category: "Generative Art",
        description: "Real-time diffusion model integration for interactive creative tools.",
    },
    {
        title: "Syntax Sentinel",
        category: "Code Intelligence",
        description: "Self-healing code agent that detects and patches vulnerabilities autonomously.",
    },
    {
        title: "VoiceForge",
        category: "Audio Synthesis",
        description: "Zero-shot voice cloning pipeline optimized for edge devices.",
    }
];

export default function Projects() {
    return (
        <div className="relative z-20 bg-[#121212] py-32 px-4 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white mb-20 text-center"
                >
                    Selected Work
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative rounded-2xl p-[1px] bg-gradient-to-r from-white/10 to-white/5 hover:from-white/30 hover:to-white/10 transition-colors duration-500"
                        >
                            {/* Glass Card Content */}
                            <div className="relative h-full bg-[#1e1e1e]/80 backdrop-blur-md rounded-2xl p-8 border border-white/5 overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">

                                {/* Glow Effect */}
                                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] group-hover:bg-purple-500/30 transition-all duration-500" />

                                <p className="text-sm font-mono text-purple-400 mb-2 uppercase tracking-wider">{project.category}</p>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{project.title}</h3>
                                <p className="text-white/60 leading-relaxed max-w-sm">{project.description}</p>

                                <div className="mt-8 flex items-center gap-4">
                                    <span className="text-white/40 group-hover:text-white transition-colors text-sm font-medium">View Case Study</span>
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
