import { motion, useMotionValue, useSpring } from 'framer-motion';
import { projects } from '../lib/projectData';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { LuArrowUpRight } from 'react-icons/lu';

export default function Projects() {
    const [hoveredProject, setHoveredProject] = useState<number | null>(null);
    const cursorX = useMotionValue(0);
    const cursorY = useMotionValue(0);

    // Spring physics for smooth cursor follow
    const springConfig = { stiffness: 150, damping: 15 };
    const x = useSpring(cursorX, springConfig);
    const y = useSpring(cursorY, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        cursorX.set(e.clientX - rect.left);
        cursorY.set(e.clientY - rect.top);
    };

    return (
        <div
            className="py-32 px-4 md:px-12 w-full relative overflow-hidden bg-void"
            onMouseMove={handleMouseMove}
        >
            <div className="max-w-7xl mx-auto z-10 relative">
                <div className="mb-24 flex items-end justify-between border-b border-white/10 pb-8">
                    <h2 className="text-[10vw] md:text-[5vw] font-display font-medium leading-[0.9] text-white tracking-tighter">
                        SELECTED <br /> <span className="text-white/20">WORKS</span>
                    </h2>
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-mono text-white/40 uppercase tracking-widest">
                            [ {projects.length} Case Studies ]
                        </p>
                    </div>
                </div>

                <div className="flex flex-col">
                    {projects.map((project, index) => (
                        <Link
                            key={index}
                            to={`/work/${project.slug}`}
                            className="group relative border-b border-white/10 py-12 md:py-16 transition-all duration-300 hover:px-4"
                            onMouseEnter={() => setHoveredProject(index)}
                            onMouseLeave={() => setHoveredProject(null)}
                        >
                            <div className="flex items-center justify-between relative z-20">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-3xl md:text-5xl font-display font-medium text-white group-hover:text-aurora-purple transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="font-mono text-xs md:text-sm text-white/40 uppercase tracking-wider group-hover:text-white/60 transition-colors">
                                        {project.category}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-10 group-hover:translate-x-0">
                                    <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-white/40">Read Case Study</span>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white text-black">
                                        <LuArrowUpRight size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Hover Background Reveal Effect */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: hoveredProject === index ? "100%" : "0%" }}
                                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute top-0 left-0 w-full bg-white/5 -z-10 mix-blend-overlay pointer-events-none"
                            />
                        </Link>
                    ))}
                </div>

                {/* Floating Image Preview - Desktop Only */}
                <div className="hidden lg:block pointer-events-none fixed top-0 left-0 w-full h-full z-0 opacity-20 mix-blend-screen isolate pr-12">
                    {projects.map((project, index) => (
                        <motion.img
                            key={index}
                            src={project.image}
                            alt={project.title}
                            className="absolute object-cover w-[400px] h-[500px] rounded-lg brightness-75 grayscale contrast-125"
                            style={{
                                x,
                                y,
                                top: -250,
                                left: -200,
                                opacity: hoveredProject === index ? 0.6 : 0,
                                scale: hoveredProject === index ? 1 : 0.8,
                                rotate: hoveredProject === index ? 5 : 0
                            }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                        />
                    ))}
                </div>

                <div className="mt-24 flex justify-center">
                    <a
                        href="https://github.com/yashdesai023"
                        target="_blank"
                        className="group flex items-center gap-3 px-8 py-4 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                    >
                        <span className="font-mono text-xs uppercase tracking-widest">View Full Archive</span>
                        <LuArrowUpRight className="group-hover:rotate-45 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
}
