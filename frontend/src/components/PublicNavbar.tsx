import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { LuTerminal, LuUser, LuBriefcase, LuCpu, LuZap, LuBookOpen, LuMail, LuLogIn, LuMenu, LuX } from 'react-icons/lu';

export default function PublicNavbar() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'About', path: '/#about', icon: <LuUser /> },
        { name: 'Work', path: '/#work', icon: <LuBriefcase /> },
        { name: 'Skills', path: '/#skills', icon: <LuCpu /> },
        { name: 'Services', path: '/#services', icon: <LuZap /> },
        { name: 'Blogs', path: '/#blogs', icon: <LuBookOpen /> },
        { name: 'Contact', path: '/#contact', icon: <LuMail /> },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/5"
        >
            <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <Link to="/" className="group flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white font-display font-bold text-xl relative overflow-hidden rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <span className="relative z-10 group-hover:-translate-y-full transition-transform duration-300 block">Y</span>
                        <span className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-black">
                            <LuTerminal size={18} />
                        </span>
                    </div>
                    <div>
                        <h1 className="text-white font-display font-medium tracking-tight leading-none group-hover:text-aurora-cyan transition-colors">
                            YASH DESAI
                        </h1>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 leading-none mt-1 group-hover:text-white transition-colors">
                            Portfolio
                        </p>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = location.hash === link.path.substring(1);
                        return (
                            <a
                                key={link.name}
                                href={link.path}
                                className={`
                                    relative px-5 py-2 text-xs font-mono uppercase tracking-widest transition-all group overflow-hidden
                                    ${isActive ? 'text-white' : 'text-white/40 hover:text-white'}
                                `}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isActive && <span className="w-1.5 h-1.5 bg-aurora-purple animate-pulse rounded-full" />}
                                    {link.name}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="public-navbar-active"
                                        className="absolute inset-0 bg-white/[0.05] border border-white/10 skew-x-12"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </a>
                        );
                    })}
                </div>

                {/* Desktop Right Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        to="/login"
                        className="group flex items-center gap-2 px-6 py-2 border border-white/10 bg-white/5 text-white font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all rounded-full"
                    >
                        <span>Access System</span>
                        <LuLogIn className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-white/60 hover:text-white transition-colors"
                >
                    {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-void border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-4 text-white/60 hover:text-white transition-colors font-mono text-sm uppercase tracking-widest p-2"
                                >
                                    {link.icon} {link.name}
                                </a>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-4 text-aurora-cyan font-mono text-sm uppercase tracking-widest p-2"
                            >
                                <LuLogIn /> Access System
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
