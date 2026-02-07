import { motion } from 'framer-motion';
import { LuBrainCircuit, LuLayoutTemplate, LuRocket, LuCheck } from 'react-icons/lu';

const services = [
    {
        title: "AI & Agentic Systems",
        description: "Designing autonomous intelligent agents and RAG pipelines that solve complex reasoning tasks with high precision.",
        icon: <LuBrainCircuit className="text-purple-400" />,
        features: [
            "Custom LLM Fine-tuning & Orchestration",
            "Multi-Agent Workflow Design (LangGraph)",
            "High-Scale RAG Architectures",
            "Vector Database Optimization"
        ]
    },
    {
        title: "Full-Stack Architecture",
        description: "Building end-to-end applications that are secure, scalable, and responsive, using modern frameworks and cloud-native patterns.",
        icon: <LuLayoutTemplate className="text-blue-400" />,
        features: [
            "React / Next.js Enterprise Apps",
            "Microservices & Serverless Backends",
            "Real-time Systems (WebSockets)",
            "API Design & Standardization"
        ]
    },
    {
        title: "Performance Engineering",
        description: "Optimizing systems for milliseconds of latency, creating high-throughput data pipelines and robust infrastructure.",
        icon: <LuRocket className="text-orange-400" />,
        features: [
            "Low-Latency API Optimization",
            "Database Indexing & Sharding",
            "Rust/C++ Systems Integration",
            "Cloud Infrastructure (AWS/Docker)"
        ]
    }
];

export default function Services() {
    return (
        <div id="services" className="relative z-20 bg-transparent py-32 px-4 md:px-12 w-full overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Engineering Solutions
                    </h2>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto">
                        I don't just write code; I architect systems that drive business value through intelligence and performance.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-zinc-800/40 hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden"
                        >
                            {/* Hover Gradient Blob */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[80px] group-hover:bg-purple-500/30 transition-colors duration-500" />

                            <div className="mb-8 p-4 bg-white/5 w-fit rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                                <span className="text-4xl">{service.icon}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-white/60 leading-relaxed mb-8 h-20">
                                {service.description}
                            </p>

                            <ul className="space-y-3">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-white/80 text-sm">
                                        <LuCheck className="text-purple-500/80 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
