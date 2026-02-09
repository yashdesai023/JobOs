import { motion } from 'framer-motion';
import { projects } from '../lib/projectData';
import { Link } from 'react-router-dom';

export default function Projects() {
    return (
        <div id="work" className="relative z-20 bg-transparent py-20 px-4 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white mb-20 text-center"
                >
                    Selected Work
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[500px] rounded-2xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Image (Placeholder for now, using gradient) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black transition-transform duration-700 group-hover:scale-105">
                                {/* Ideally we would use an img tag here with project.image */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono uppercase tracking-wider rounded-full mb-4 border border-purple-500/30">
                                        {project.category}
                                    </span>
                                    <h3 className="text-3xl font-bold text-white mb-3">{project.title}</h3>
                                    <p className="text-white/70 mb-6 max-w-md line-clamp-2">
                                        {project.description}
                                    </p>

                                    <Link to={`/work/${project.slug}`}>
                                        <button className="flex items-center gap-2 text-white font-medium group/btn">
                                            Deep Dive
                                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="mt-20 text-center">
                    <a
                        href="https://github.com/yashdesai023?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all group"
                    >
                        <span>Explore Full Engineering Vault (30+ Repos)</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
