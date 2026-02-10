import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuDatabase, LuArrowRight } from 'react-icons/lu';

// Start Definitions since import fails
const collections = [
    { id: '../tracker', name: 'Applications', description: 'Track job applications and statuses.' },
    { id: 'projects', name: 'Projects', description: 'Manage portfolio projects and case studies.' },
    { id: 'blogs', name: 'Blogs', description: 'Write and publish technical articles.' },
    { id: 'skills', name: 'Skills', description: 'Update technical skill proficiency.' },
    { id: 'resumes', name: 'Resumes', description: 'Store and manage resume versions.' },
    { id: 'job_reports', name: 'Job Reports', description: 'Scraped job data from Hunter.' },
];

export default function CollectionsHub() {
    return (
        <div className="min-h-screen bg-void relative text-white font-body selection:bg-aurora-purple selection:text-white">
            <Navbar />

            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aurora-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aurora-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 pt-32 px-6 md:px-12 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-16 border-b border-white/10 pb-8">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">// Database Manager</span>
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight">
                            COLLECTIONS <br /> <span className="text-white/40">INDEX</span>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                        {collections.map((col, index) => (
                            <Link key={col.id} to={`/collections/${col.id}`} className="block h-full">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-void p-8 h-full hover:bg-white/[0.02] transition-colors group relative"
                                >
                                    <div className="flex justify-between items-start mb-12">
                                        <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/40 group-hover:text-aurora-purple group-hover:border-aurora-purple/30 transition-all">
                                            <LuDatabase size={18} />
                                        </div>
                                        <LuArrowRight className="text-white/20 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-display font-medium text-white mb-2 group-hover:text-aurora-purple transition-colors">
                                            {col.name}
                                        </h3>
                                        <p className="text-sm text-white/40 font-light leading-relaxed">
                                            {col.description}
                                        </p>
                                    </div>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
