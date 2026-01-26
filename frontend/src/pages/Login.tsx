import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Mouse tracking logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the background blobs
    const springX = useSpring(x, { stiffness: 50, damping: 20 });
    const springY = useSpring(y, { stiffness: 50, damping: 20 });

    // Parallax effect strength
    const moveX = useTransform(springX, [0, window.innerWidth], [-50, 50]);
    const moveY = useTransform(springY, [0, window.innerHeight], [-50, 50]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            x.set(e.clientX);
            y.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [x, y]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Authenticate against the 'admin' collection
            await pb.collection('admin').authWithPassword(email, password);

            // Redirect on success (usually to dashboard, but for now just back home or alert)
            // Since user didn't specify a dashboard, we'll redirect home but show we are logged in? 
            // Or just assume success.
            navigate('/dashboard');

            // Ideally we would update some global auth state here.
        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials. Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center relative overflow-hidden">

            {/* Animated Gradient Background with Mouse Tracking */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <motion.div
                    style={{ x: moveX, y: moveY }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="absolute inset-0"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-[20%] left-[20%] w-[500px] h-[500px] rounded-full bg-purple-600 blur-[128px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, -45, 0],
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] rounded-full bg-blue-600 blur-[128px]"
                    />
                </motion.div>
            </div>

            {/* Glassmorphism Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Developer Access</h2>
                    <p className="text-white/60 text-sm">Restricted Area. Authorized Personnel Only.</p>

                    <div className="mt-4 py-2 px-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg inline-block">
                        <p className="text-yellow-400 text-xs font-mono">⚠ NOTE: This page is only for the Developer.</p>
                    </div>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@jobos.ai"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 text-white placeholder-white/20 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/70 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 text-white placeholder-white/20 transition-all font-mono"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </motion.button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <Link to="/">
                        <button className="text-sm text-white/40 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto group">
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Return Home
                        </button>
                    </Link>
                </div>

            </motion.div>
        </div>
    );
}
