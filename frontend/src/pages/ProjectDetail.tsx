
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import FooterCTA from '../components/FooterCTA';
import { projects } from '../lib/projectData';
import ReactMarkdown from 'react-markdown';
import { LuGithub, LuExternalLink, LuArrowLeft, LuLayers } from 'react-icons/lu';

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projects.find(p => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                <Link to="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                    <LuArrowLeft /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
                {/* Back Link */}
                <Link to="/#work" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors">
                    <LuArrowLeft /> Back to Projects
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="inline-block px-3 py-1 bg-white/5 text-purple-300 text-xs font-mono uppercase tracking-wider rounded-full mb-6 border border-purple-500/20">
                        {project.category}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        {project.title}
                    </h1>
                    <p className="text-xl text-white/60 max-w-3xl leading-relaxed mb-8">
                        {project.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {project.productionUrl && project.productionUrl !== '#' && (
                            <a
                                href={project.productionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <LuExternalLink /> View Live
                            </a>
                        )}
                        {project.githubUrl && project.githubUrl !== '#' && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/10"
                            >
                                <LuGithub /> Source Code
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Tech Stack */}
                {project.techStack && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-16 p-8 bg-white/5 border border-white/5 rounded-3xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <LuLayers /> Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map((tech, i) => (
                                <span key={i} className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white/80 font-mono">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Content Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-12">
                        <ReactMarkdown
                            components={{
                                h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-12 mb-6 text-white" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-8 mb-4 text-purple-300" {...props} />,
                                p: ({ node, ...props }) => <p className="text-white/70 leading-relaxed mb-6" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-white/70" {...props} />,
                                li: ({ node, ...props }) => <li className="" {...props} />,
                            }}
                        >
                            {project.content || "Detailed case study coming soon."}
                        </ReactMarkdown>
                    </div>
                </motion.div>

            </div>

            <FooterCTA />
        </div>
    );
}
