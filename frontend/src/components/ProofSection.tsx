import { FaDownload } from 'react-icons/fa';
import { LuZap, LuLayers, LuBox, LuServer } from 'react-icons/lu';

const dossierFeatures = [
    {
        icon: <LuZap />,
        title: "18.4ms Latency",
        desc: "Optimized vector retrieval (p50) for RAG systems.",
    },
    {
        icon: <LuLayers />,
        title: "Agentic Flows",
        desc: "Autonomous multi-agent architectures.",
    },
    {
        icon: <LuBox />,
        title: "PyPI Package",
        desc: "Author of vectorDBpipe framework.",
    },
    {
        icon: <LuServer />,
        title: "MLOps Scale",
        desc: "End-to-end pipelines & deployment.",
    },
];

export default function ProofSection() {
    return (
        <section className="bg-void text-white relative border-t border-white/5 py-32 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">

                {/* Left: Unapologetic Statement */}
                <div className="md:w-1/2 sticky top-32">
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-8 block">
                        // The Engineering Dossier
                    </span>
                    <h2 className="text-5xl md:text-7xl font-display font-medium leading-[0.95] tracking-tight mb-8">
                        BEYOND THE <br /> <span className="text-white/20">RESUME.</span>
                    </h2>
                    <p className="text-xl font-light leading-relaxed text-white/60 mb-12 max-w-md">
                        I've compiled a technical deep-dive into my architectural decisions, benchmarks, and production code.
                    </p>

                    <a
                        href="https://db.jobos.online/api/files/pbc_2471947077/gcbz3elpm2gnu42/yash_desai_ultimate_dossier_final_1o58dn4ntr.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-4 border-b border-white pb-1 hover:border-aurora-purple transition-all"
                    >
                        <span className="font-mono text-sm uppercase tracking-widest group-hover:text-aurora-purple transition-colors">Download PDF</span>
                        <FaDownload className="text-sm group-hover:translate-y-1 transition-transform" />
                    </a>
                </div>

                {/* Right: Grid of Proofs */}
                <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-16">
                    {dossierFeatures.map((feat, i) => (
                        <div key={i} className="group border-l border-white/10 pl-8 hover:border-aurora-purple transition-colors duration-500">
                            <div className="text-3xl mb-4 text-white/20 group-hover:text-white transition-colors">
                                {feat.icon}
                            </div>
                            <h3 className="text-xl font-display font-medium mb-2 group-hover:text-aurora-purple transition-colors">
                                {feat.title}
                            </h3>
                            <p className="text-sm font-light text-white/50 leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
