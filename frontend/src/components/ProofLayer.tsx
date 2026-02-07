
import { motion } from 'framer-motion';

export default function ProofLayer() {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 mt-12 md:mt-24 pointer-events-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Card A */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-black/60 transition-colors"
                >
                    <div className="text-4xl md:text-5xl font-bold font-mono text-purple-400 mb-2">
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
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-black/60 transition-colors"
                >
                    <div className="text-4xl md:text-5xl font-bold font-mono text-blue-400 mb-2">
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
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-black/60 transition-colors"
                >
                    <div className="text-4xl md:text-5xl font-bold font-mono text-green-400 mb-2">
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
    );
}
