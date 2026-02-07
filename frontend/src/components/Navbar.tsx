import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        return pb.authStore.onChange((token) => {
            setIsAuthenticated(!!token);
        });
    }, []);

    const handleLogout = () => {
        pb.authStore.clear();
        navigate('/');
    };

    // Separate links for separate contexts
    const publicLinks = [
        { name: "About", path: "/#about", type: "scroll" },
        { name: "Work", path: "/#work", type: "scroll" },
        { name: "Skills", path: "/#skills", type: "scroll" },
        { name: "Services", path: "/#services", type: "scroll" },
    ];

    const privateLinks = [
        { name: "Home", path: "/", type: "router" },
        { name: "Dashboard", path: "/dashboard", type: "router" },
        { name: "Manager", path: "/collections", type: "router" },
        { name: "Hunter", path: "/hunter", type: "router" },
        { name: "Tracker", path: "/tracker", type: "router" },
        { name: "Nexus", path: "/nexus", type: "router" },
        { name: "Resume", path: "/resume", type: "router" },
        { name: "Playground", path: "/playground", type: "router" },
    ];

    const activeLinks = isAuthenticated ? privateLinks : publicLinks;

    return (
        <>
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center px-4 pointer-events-none"
            >
                <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2 md:px-2 md:pl-6 md:pr-2 shadow-2xl pointer-events-auto">

                    {/* Desktop Navigation Links */}
                    <ul className="hidden md:flex items-center gap-8 mr-2">
                        {activeLinks.map((link) => (
                            <li key={link.name}>
                                {link.type === 'router' ? (
                                    <Link
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors relative group ${location.pathname === link.path ? 'text-white' : 'text-white/70 hover:text-white'}`}
                                    >
                                        {link.name}
                                        <span className={`absolute -bottom-1 left-0 h-[1px] bg-white transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                    </Link>
                                ) : (
                                    <a
                                        href={link.path}
                                        className="text-sm font-medium text-white/70 hover:text-white transition-colors relative group"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* Login Button - Only show if NOT authenticated */}
                    {!isAuthenticated && (
                        <Link to="/login" className="ml-6 hidden md:block">
                            <button className="bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-6 py-2 rounded-full border border-white/5 transition-all duration-300 backdrop-blur-sm">
                                Login
                            </button>
                        </Link>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden text-white/70 hover:text-white transition-colors flex items-center justify-center w-8 h-8"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>

                </div>
            </motion.nav>

            {/* Mobile Menu Overlay - Moved outside the pill for proper width */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 left-4 right-4 z-40 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 p-6 shadow-2xl md:hidden rounded-2xl flex flex-col gap-4 text-center"
                    >
                        <ul className="flex flex-col gap-4">
                            {activeLinks.map((link) => (
                                <li key={link.name}>
                                    {link.type === 'router' ? (
                                        <Link
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block text-lg font-medium transition-colors ${location.pathname === link.path ? 'text-white font-bold' : 'text-white/60 hover:text-white'}`}
                                        >
                                            {link.name}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block text-lg font-medium text-white/60 hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    )}
                                </li>
                            ))}
                            {!isAuthenticated && (
                                <li>
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/5 transition-all mt-2">
                                            Login
                                        </button>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fixed Logout Button - Top Right Corner */}
            <AnimatePresence>
                {isAuthenticated && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={handleLogout}
                        className="fixed top-6 right-4 md:right-6 z-50 py-2.5 px-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full backdrop-blur-md transition-all shadow-lg group flex items-center gap-2"
                        title="Logout"
                    >
                        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Logout</span>
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </>
    );
}
