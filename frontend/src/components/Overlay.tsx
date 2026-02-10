
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

    const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-center">
            {/* Massive Hero Typography - Sticky feel */}
            <motion.div
                style={{ opacity, scale, y }}
                className="text-center relative z-20"
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-[12vw] leading-[0.85] font-display font-bold tracking-tighter text-white mix-blend-difference">
                        YASH DESAI
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="flex items-center justify-center gap-6 mt-6 mix-blend-difference"
                >
                    <span className="h-[1px] w-12 bg-white/50" />
                    <p className="font-mono text-sm tracking-widest uppercase text-white/80">
                        Gen AI Engineer & Architect
                    </p>
                    <span className="h-[1px] w-12 bg-white/50" />
                </motion.div>
            </motion.div>

            {/* Abstract Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden mix-blend-screen pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-aurora-purple/30 to-aurora-fuchsia/20 blur-[120px]"
                />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                    Scroll to Explore
                </span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/40 to-white/0 animate-pulse" />
            </motion.div>
        </div>
    );
}
