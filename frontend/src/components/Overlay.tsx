import { motion, useScroll, useTransform } from 'framer-motion';

export default function Overlay() {
    const { scrollYProgress } = useScroll();

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
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-center"
            >
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Yash Desai
                    </h1>
                    <p className="text-xl md:text-2xl mt-4 text-white/80">Gen AI Engineer</p>
                </div>
            </motion.div>

            {/* Section 2 */}
            <motion.div
                style={{ opacity: opacity2, x: x2 }}
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-start pl-[10%] md:pl-[20%]"
            >
                <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    Architecting <br /> Intelligent <br /> Systems.
                </h2>
            </motion.div>

            {/* Section 3 */}
            <motion.div
                style={{ opacity: opacity3, x: x3 }}
                className="fixed top-0 left-0 w-full h-screen flex items-center justify-end pr-[10%] md:pr-[20%]"
            >
                <h2 className="text-5xl md:text-7xl font-bold text-right text-white leading-tight">
                    Redefining <br /> Human-AI <br /> Interaction.
                </h2>
            </motion.div>
        </div>
    );
}
