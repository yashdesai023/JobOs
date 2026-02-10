import { useRef } from 'react';
import { motion } from 'framer-motion';
import { LuBrain, LuServer, LuContainer, LuTestTube } from 'react-icons/lu';

const skillCategories = [
    {
        title: "Intelligence & Agents",
        icon: <LuBrain className="text-4xl mb-6 text-aurora-purple" />,
        description: "Architecting autonomous systems and cognitive pipelines.",
        skills: [
            { name: "LangChain", level: 90 },
            { name: "RAG Arch", level: 85 },
            { name: "OpenAI API", level: 95 },
            { name: "Agentic Flows", level: 80 }
        ]
    },
    {
        title: "Enterprise Backend",
        icon: <LuServer className="text-4xl mb-6 text-aurora-cyan" />,
        description: "Building resilient, high-throughput server-side infrastructure.",
        skills: [
            { name: "Python / FastAPI", level: 95 },
            { name: "Spring Boot", level: 85 },
            { name: "PostgreSQL", level: 90 },
            { name: "Redis / Kafka", level: 80 }
        ]
    },
    {
        title: "Quality Engineering",
        icon: <LuTestTube className="text-4xl mb-6 text-emerald-400" />,
        description: "Ensuring flawless execution through automated rigor.",
        skills: [
            { name: "Playwright", level: 95 },
            { name: "Selenium", level: 90 },
            { name: "API Testing", level: 95 },
            { name: "CI/CD Pipelines", level: 85 }
        ]
    },
    {
        title: "DevOps & Cloud",
        icon: <LuContainer className="text-4xl mb-6 text-orange-400" />,
        description: "Orchestrating scalable deployments and resource management.",
        skills: [
            { name: "Docker & K8s", level: 80 },
            { name: "AWS Core", level: 75 },
            { name: "Terraform", level: 70 },
            { name: "GitHub Actions", level: 90 }
        ]
    }
];

export default function Skills() {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section ref={containerRef} className="py-32 px-6 md:px-12 bg-void text-white relative border-t border-white/5 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24 text-center md:text-left">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-4 block"
                    >
                        // Technical Arsenal
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-display font-medium leading-none tracking-tight"
                    >
                        CORE <span className="text-white/20">CAPABILITIES</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 shadow-2xl">
                    {skillCategories.map((category, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-void p-12 hover:bg-white/[0.02] transition-colors duration-500 relative overflow-hidden"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors mb-8 inline-block">
                                        {category.icon}
                                    </div>
                                    <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest group-hover:text-white/40 transition-colors">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-display font-medium text-white mb-3 group-hover:text-aurora-cyan transition-colors">
                                    {category.title}
                                </h3>
                                <p className="text-white/40 font-light leading-relaxed mb-8 h-12">
                                    {category.description}
                                </p>

                                <div className="space-y-4">
                                    {category.skills.map((skill, i) => (
                                        <div key={i} className="group/skill">
                                            <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-white/60 mb-1 group-hover/skill:text-white transition-colors">
                                                <span>{skill.name}</span>
                                                <span className="opacity-0 group-hover/skill:opacity-100 transition-opacity text-aurora-cyan">{skill.level}%</span>
                                            </div>
                                            <div className="h-0.5 w-full bg-white/10 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${skill.level}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                                                    className={`h-full ${index === 0 ? 'bg-aurora-purple' :
                                                        index === 1 ? 'bg-aurora-cyan' :
                                                            index === 2 ? 'bg-emerald-400' :
                                                                'bg-orange-400'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
