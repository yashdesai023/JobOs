import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { collections } from '../lib/collectionConfig';
import { Link } from 'react-router-dom';

export default function CollectionsHub() {
    return (
        <div className="min-h-screen bg-[#121212] relative overflow-hidden text-white selection:bg-purple-500 selection:text-white">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10 pt-32 px-4 md:px-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-xl min-h-[60vh]"
                >
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                        Collection Manager
                    </h1>
                    <p className="text-white/40 mb-12">Select a database to view or manage records.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(collections).map((col, index) => (
                            <Link key={col.id} to={`/collections/${col.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-full p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:border-purple-500/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-purple-500/20 transition-colors">
                                            <svg className="w-6 h-6 text-white/70 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                        </div>
                                        <svg className="w-5 h-5 text-white/20 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{col.name}</h3>
                                    <p className="text-sm text-white/50">{col.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
