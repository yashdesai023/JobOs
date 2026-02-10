import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LuLayoutGrid, LuTerminal, LuCpu, LuFileText, LuLogOut, LuSearch, LuDatabase, LuBrain } from 'react-icons/lu';
import { pb } from '../lib/pocketbase';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);

    useEffect(() => {
        return pb.authStore.onChange(() => {
            setIsAuthenticated(pb.authStore.isValid);
        });
    }, []);

    const handleLogout = () => {
        pb.authStore.clear();
        navigate('/');
    };

    const internalLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LuLayoutGrid /> },
        { name: 'Tracker', path: '/tracker', icon: <LuFileText /> },
        { name: 'Hunter', path: '/hunter', icon: <LuSearch /> },
        { name: 'Nexus', path: '/nexus', icon: <LuBrain /> },
        { name: 'Manager', path: '/collections', icon: <LuDatabase /> },
        { name: 'Terminal', path: '/playground', icon: <LuTerminal /> },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-white/5"
        >
            <div className="max-w-[1800px] mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand - Links back to Dashboard if internal */}
                <Link to="/dashboard" className="group flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 flex items-center justify-center text-white font-display font-bold text-xl relative overflow-hidden rounded-md border border-white/10 group-hover:bg-aurora-purple group-hover:text-white transition-all duration-300">
                        <LuCpu size={20} />
                    </div>
                    <div>
                        <h1 className="text-white font-display font-medium tracking-tight leading-none group-hover:text-aurora-cyan transition-colors">
                            JOB OS
                        </h1>
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 leading-none mt-1 group-hover:text-white transition-colors">
                            System v2.4
                        </p>
                    </div>
                </Link>

                {/* Internal Navigation Links */}
                <div className="hidden lg:flex items-center gap-1">
                    {internalLinks.map((link) => {
                        const isActive = location.pathname.startsWith(link.path);
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`
                                    relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all group overflow-hidden flex items-center gap-2 rounded-sm
                                    ${isActive ? 'text-white bg-white/5' : 'text-white/40 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <span className={isActive ? 'text-aurora-cyan' : 'text-white/40 group-hover:text-white'}>
                                    {link.icon}
                                </span>
                                <span>{link.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="internal-nav"
                                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-aurora-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Online
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="group flex items-center gap-2 px-4 py-2 border border-red-500/20 bg-red-500/5 text-red-300 font-mono text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all rounded-sm"
                        title="Disconnect"
                    >
                        <LuLogOut className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
