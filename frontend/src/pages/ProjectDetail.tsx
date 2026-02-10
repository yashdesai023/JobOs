import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/PublicNavbar';
import { projects } from '../lib/projectData';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LuGithub, LuExternalLink, LuArrowLeft, LuCopy, LuCheck } from 'react-icons/lu';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline ? (
        <div className="relative my-8 rounded-lg overflow-hidden bg-void border border-white/10 group z-10 font-mono text-sm shadow-xl">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/[0.02]">
                <span className="text-xs text-white/30 uppercase tracking-widest">
                    {match?.[1] || 'CODE'}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors uppercase tracking-wider"
                >
                    {copied ? <LuCheck size={12} /> : <LuCopy size={12} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                </button>
            </div>
            <pre className="p-6 overflow-x-auto text-white/80 leading-relaxed scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" {...props}>
                <code>{children}</code>
            </pre>
        </div>
    ) : (
        <code className="bg-white/10 text-aurora-cyan px-1.5 py-0.5 rounded font-mono text-xs border border-white/5" {...props}>
            {children}
        </code>
    );
};

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projects.find(p => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-void text-white flex flex-col items-center justify-center font-body">
                <h1 className="text-4xl font-display font-medium mb-4">Project Not Found</h1>
                <Link to="/" className="text-aurora-purple hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                    <LuArrowLeft /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void text-white font-body selection:bg-aurora-purple selection:text-white pb-32">
            <PublicNavbar />

            <div className="pt-32 px-6 md:px-12 max-w-5xl mx-auto">
                {/* Back Link */}
                <Link to="/#work" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors font-mono text-xs uppercase tracking-widest group">
                    <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 border-b border-white/10 pb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-4 block">
                                // Case Study
                            </span>
                            <h1 className="text-5xl md:text-7xl font-display font-medium leading-[0.9] tracking-tight text-white mb-6">
                                {project.title}
                            </h1>
                            <div className="inline-block px-3 py-1 border border-white/20 text-white/60 text-xs font-mono uppercase tracking-widest rounded-full">
                                {project.category}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            {project.productionUrl && project.productionUrl !== '#' && (
                                <a
                                    href={project.productionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-4 py-3 bg-white text-black font-mono text-xs uppercase tracking-widest font-bold hover:bg-white/90 transition-all rounded-sm"
                                >
                                    <span>View Live</span> <LuExternalLink />
                                </a>
                            )}
                            {project.githubUrl && project.githubUrl !== '#' && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between px-4 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-sm"
                                >
                                    <span>Source Code</span> <LuGithub />
                                </a>
                            )}
                        </div>
                    </div>

                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-3xl">
                        {project.description}
                    </p>
                </motion.div>

                {/* Tech Stack */}
                {project.techStack && (
                    <div className="mb-16">
                        <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2">
                            Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-white/80 font-mono uppercase tracking-wider"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => <h1 className="text-4xl font-display font-medium text-white mt-16 mb-8" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-3xl font-display font-medium mt-20 mb-8 text-white border-t border-white/10 pt-8" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-2xl font-display font-medium mt-12 mb-6 text-white" {...props} />,
                            p: ({ node, ...props }) => <p className="text-white/70 leading-relaxed mb-8 font-light text-lg" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-8 space-y-2 text-white/70 font-light" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-8 space-y-2 text-white/70 font-light" {...props} />,
                            li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <div className="border-l-2 border-aurora-purple pl-6 py-2 my-10 italic text-white/80 text-xl font-display leading-tight">
                                    {props.children}
                                </div>
                            ),
                            code: CodeBlock,
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-12 border border-white/10">
                                    <table className="w-full text-left border-collapse" {...props} />
                                </div>
                            ),
                            thead: ({ node, ...props }) => <thead className="bg-white/5 text-white/40 font-mono text-xs uppercase tracking-wider" {...props} />,
                            tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/10" {...props} />,
                            tr: ({ node, ...props }) => <tr className="hover:bg-white/[0.02] transition-colors" {...props} />,
                            th: ({ node, ...props }) => <th className="p-4 font-normal border-b border-white/10" {...props} />,
                            td: ({ node, ...props }) => <td className="p-4 text-white/70 text-sm border-b border-white/5" {...props} />,
                            a: ({ node, ...props }) => <a className="text-white border-b border-white/40 hover:border-white transition-colors pb-px no-underline" {...props} />,
                            strong: ({ node, ...props }) => <strong className="text-white font-medium" {...props} />,
                            img: ({ node, ...props }) => (
                                <div className="my-12 border border-white/10 p-2 bg-white/[0.02]">
                                    <img className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500" {...props} />
                                </div>
                            )
                        }}
                    >
                        {project.content || "Detailed case study coming soon."}
                    </ReactMarkdown>
                </motion.div>

            </div>
        </div>
    );
}
