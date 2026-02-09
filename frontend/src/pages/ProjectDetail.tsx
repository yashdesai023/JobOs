import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { projects } from '../lib/projectData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuGithub, LuExternalLink, LuArrowLeft, LuLayers, LuCopy, LuCheck } from 'react-icons/lu';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline ? (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -2 }}
            className="relative my-8 rounded-lg overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl group z-10"
        >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>

                <span className="text-xs text-white/30 font-mono uppercase tracking-widest absolute left-1/2 transform -translate-x-1/2">
                    {match?.[1] || 'CODE'}
                </span>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-300 transition-colors"
                >
                    {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
                    <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                </button>
            </div>
            <pre className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-blue-200 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" {...props}>
                <code>{children}</code>
            </pre>
        </motion.div>
    ) : (
        <code className="bg-white/10 text-purple-300 px-1.5 py-0.5 rounded font-mono text-sm border border-white/5" {...props}>
            {children}
        </code>
    );
};

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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white pb-20">
            <Navbar />

            <div className="pt-32 px-4 md:px-12 max-w-7xl mx-auto">
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
                        className="mb-16 p-8 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <LuLayers /> Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {project.techStack.map((tech, i) => (
                                <motion.span
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white/80 font-mono cursor-default hover:border-purple-500/50 transition-colors"
                                >
                                    {tech}
                                </motion.span>
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
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-16 mb-8 text-white border-b border-white/10 pb-4 relative z-10" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mt-12 mb-6 text-purple-300 relative z-10" {...props} />,
                                p: ({ node, ...props }) => <p className="text-white/70 leading-relaxed mb-6 text-lg relative z-10" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-3 text-white/70 text-lg relative z-10" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-3 text-white/70 text-lg relative z-10" {...props} />,
                                li: ({ node, ...props }) => <li className="" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                    <motion.blockquote
                                        whileHover={{ x: 5 }}
                                        className="border-l-4 border-purple-500 pl-6 py-4 my-10 bg-purple-500/10 italic text-white/90 rounded-r-xl shadow-lg relative z-10"
                                        {...props}
                                    />
                                ),
                                code: CodeBlock,
                                table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-10 rounded-xl border border-white/10 bg-white/5 shadow-xl relative z-10">
                                        <table className="w-full text-left border-collapse" {...props} />
                                    </div>
                                ),
                                thead: ({ node, ...props }) => <thead className="bg-black/20 text-purple-300" {...props} />,
                                tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
                                tr: ({ node, ...props }) => <tr className="hover:bg-white/5 transition-colors" {...props} />,
                                th: ({ node, ...props }) => <th className="p-5 font-bold text-sm uppercase tracking-wider text-white border-b border-white/10" {...props} />,
                                td: ({ node, ...props }) => <td className="p-5 text-white/70 border-b border-white/5 text-sm md:text-base leading-relaxed" {...props} />,
                            }}
                        >
                            {project.content || "Detailed case study coming soon."}
                        </ReactMarkdown>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
