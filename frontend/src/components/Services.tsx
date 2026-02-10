import { motion } from 'framer-motion';
import { useState } from 'react';


const services = [
    {
        title: "Agentic Systems",
        id: "01",
        desc: "Autonomous intelligent agents and RAG pipelines solving complex reasoning tasks.",
        tags: ["LLM Orchestration", "LangGraph", "Vector DBs"]
    },
    {
        title: "Full-Stack Arch",
        id: "02",
        desc: "Secure, scalable enterprise applications using modern frameworks and cloud-native patterns.",
        tags: ["Next.js Enterprise", "Microservices", "Real-time API"]
    },
    {
        title: "Performance Eng",
        id: "03",
        desc: "Optimizing systems for milliseconds of latency. High-throughput data pipelines.",
        tags: ["Low-Latency", "Rust Integration", "AWS Scale"]
    }
];

export default function Services() {
    const [activeService, setActiveService] = useState<number | null>(null);

    return (
        <section className="py-32 px-6 md:px-12 bg-panel text-white relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex items-end justify-between">
                    <h2 className="text-6xl md:text-8xl font-display font-medium leading-none tracking-tight">
                        CORE <br /> <span className="text-white/20">OFFERINGS</span>
                    </h2>
                    <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-white/40 mb-2">
                        [ Solutions ]
                    </span>
                </div>

                <div className="flex flex-col border-t border-white/10">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative border-b border-white/10 py-12 md:py-16 cursor-pointer transition-all duration-500 hover:bg-white/5"
                            onMouseEnter={() => setActiveService(index)}
                            onMouseLeave={() => setActiveService(null)}
                        >
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-8 relative z-10 px-4">
                                <div className="flex items-baseline gap-8 md:w-1/2">
                                    <span className="font-mono text-aurora-purple text-sm md:text-base">
                                        / {service.id}
                                    </span>
                                    <h3 className="text-3xl md:text-5xl font-display font-medium text-white group-hover:pl-4 transition-all duration-300">
                                        {service.title}
                                    </h3>
                                </div>

                                <div className="md:w-1/2 flex flex-col items-start md:items-end gap-6 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-lg font-light max-w-md md:text-right leading-relaxed text-white/80">
                                        {service.desc}
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        {service.tags.map((tag, t) => (
                                            <span key={t} className="px-3 py-1 text-xs font-mono border border-white/20 rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: activeService === index ? 1 : 0 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="absolute bottom-0 left-0 h-[1px] w-full bg-aurora-purple origin-left"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
