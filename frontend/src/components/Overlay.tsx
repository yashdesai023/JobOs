import { motion, useScroll, useTransform } from 'framer-motion';
import type { RefObject } from 'react';

interface OverlayProps {
    scrollRef: RefObject<HTMLElement | null>;
}

export default function Overlay({ scrollRef }: OverlayProps) {
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start start", "end end"]
    });

    // Parallax effects
    // Section 1: 0-30%
    const opacity1 = useTransform(scrollYProgress, [0, 0.1, 0.25], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

    // Section 2: 30-50%
    const opacity2 = useTransform(scrollYProgress, [0.25, 0.35, 0.5, 0.6], [0, 1, 1, 0]);
    const x2 = useTransform(scrollYProgress, [0.25, 0.6], [-50, 0]);

    // Section 3: 60-80%
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.85, 0.95], [0, 1, 1, 0]);
    const x3 = useTransform(scrollYProgress, [0.6, 0.9], [50, 0]);

    return (
        <div className="absolute top-0 left-0 w-full h-[500vh] pointer-events-none z-10">
            {/* Section 1 */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center p-4 md:p-12"
            >
                <div className="text-center mb-12">
                    <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Yash Desai
                    </h1>
                    <p className="text-xl md:text-2xl mt-4 text-white/80">Gen AI Engineer</p>
                </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, x: x2 }}
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-start pl-[10%] md:pl-[15%]"
            >
                <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-4xl">
                    Architecting <br /> High-Performance <br /> GenAI Systems.
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, x: x3 }}
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-end pr-[10%] md:pr-[15%]"
            >
                <div className="text-right max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
                        Optimizing RAG Retrieval to 18.4ms (p50)
                    </h2>
                    <p className="text-xl md:text-2xl text-white/70">
                        and building autonomous multi-agent pipelines for enterprise scale.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
