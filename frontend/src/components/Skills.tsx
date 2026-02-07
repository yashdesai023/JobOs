import { motion } from 'framer-motion';
import {
    SiReact, SiTypescript, SiNextdotjs, SiTailwindcss, SiFramer, SiThreedotjs,
    SiNodedotjs, SiPython, SiFastapi, SiPostgresql, SiPocketbase, SiGraphql,
    SiPytorch, SiTensorflow, SiOpenai, SiHuggingface,
    SiDocker, SiKubernetes, SiAmazon, SiTerraform, SiGit, SiGithubactions
} from 'react-icons/si';
import { LuBrain, LuServer, LuLayers, LuContainer } from 'react-icons/lu';

const skillCategories = [
    {
        title: "Frontend Experience",
        icon: <LuLayers className="text-blue-400" />,
        skills: [
            { name: "React", icon: <SiReact className="text-[#61DAFB]" /> },
            { name: "TypeScript", icon: <SiTypescript className="text-[#3178C6]" /> },
            { name: "Next.js", icon: <SiNextdotjs className="text-white" /> },
            { name: "Tailwind", icon: <SiTailwindcss className="text-[#06B6D4]" /> },
            { name: "Framer Motion", icon: <SiFramer className="text-white" /> },
            { name: "Three.js", icon: <SiThreedotjs className="text-white" /> },
        ]
    },
    {
        title: "Backend & Systems",
        icon: <LuServer className="text-green-400" />,
        skills: [
            { name: "Node.js", icon: <SiNodedotjs className="text-[#339933]" /> },
            { name: "Python", icon: <SiPython className="text-[#3776AB]" /> },
            { name: "FastAPI", icon: <SiFastapi className="text-[#009688]" /> },
            { name: "PostgreSQL", icon: <SiPostgresql className="text-[#4169E1]" /> },
            { name: "PocketBase", icon: <SiPocketbase className="text-[#B8DBE4]" /> },
            { name: "GraphQL", icon: <SiGraphql className="text-[#E10098]" /> },
        ]
    },
    {
        title: "AI & Intelligence",
        icon: <LuBrain className="text-purple-400" />,
        skills: [
            { name: "PyTorch", icon: <SiPytorch className="text-[#EE4C2C]" /> },
            { name: "TensorFlow", icon: <SiTensorflow className="text-[#FF6F00]" /> },
            { name: "LangChain", icon: <span className="text-2xl">🦜🔗</span> }, // Emoji for LangChain as icon might not be in Si yet or use generic
            { name: "OpenAI API", icon: <SiOpenai className="text-white" /> },
            { name: "Hugging Face", icon: <SiHuggingface className="text-[#FFD21E]" /> },
            { name: "RAG Systems", icon: <LuBrain className="text-pink-400" /> },
        ]
    },
    {
        title: "DevOps & Cloud",
        icon: <LuContainer className="text-orange-400" />,
        skills: [
            { name: "Docker", icon: <SiDocker className="text-[#2496ED]" /> },
            { name: "Kubernetes", icon: <SiKubernetes className="text-[#326CE5]" /> },
            { name: "AWS", icon: <SiAmazon className="text-[#FF9900]" /> },
            { name: "CI/CD", icon: <SiGithubactions className="text-[#2088FF]" /> },
            { name: "Terraform", icon: <SiTerraform className="text-[#7B42BC]" /> },
            { name: "Git", icon: <SiGit className="text-[#F05032]" /> },
        ]
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Skills() {
    return (
        <div id="skills" className="relative z-20 bg-transparent py-32 px-4 md:px-12 w-full overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative content-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Technical Arsenal
                    </h2>
                    <p className="text-white/50 text-xl max-w-2xl mx-auto">
                        A curated stack of technologies I use to build scalable, intelligent, and performant systems.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skillCategories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={container}
                            className="bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:bg-white/10 transition-colors">
                                    <span className="text-2xl">{category.icon}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                    {category.title}
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {category.skills.map((skill, skillIdx) => (
                                    <motion.div
                                        key={skillIdx}
                                        variants={item}
                                        className="flex flex-col items-center justify-center p-4 bg-black/20 rounded-xl border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default group/skill"
                                    >
                                        <div className="text-3xl mb-3 opacity-70 group-hover/skill:opacity-100 group-hover/skill:scale-110 transition-all duration-300 filter grayscale group-hover/skill:grayscale-0">
                                            {skill.icon}
                                        </div>
                                        <span className="text-sm text-white/60 group-hover/skill:text-white font-medium">
                                            {skill.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
