
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { pb } from '../lib/pocketbase';
import { LuArrowLeft } from 'react-icons/lu';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Try standard user login first
            try {
                await pb.collection('users').authWithPassword(email, password);
            } catch (err) {
                // Fallback to admin login
                await pb.admins.authWithPassword(email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError('Access Denied. Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void flex flex-col items-center justify-center relative overflow-hidden text-white font-body selection:bg-aurora-purple selection:text-white">

            {/* Subtle Aurora Background */}
            <div className="absolute inset-0 bg-aurora-gradient opacity-[0.03] blur-[150px] pointer-events-none" />

            <div className="z-10 w-full max-w-md p-8">
                <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors font-mono text-xs uppercase tracking-widest group">
                    <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-display font-medium tracking-tight mb-2">
                        System Access
                    </h1>
                    <p className="text-white/40 font-light">
                        Authorized personnel only.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-3 group-focus-within:text-aurora-purple transition-colors">
                            Identifier / Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
                            placeholder="user@domain.com"
                        />
                    </div>

                    <div className="group">
                        <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-3 group-focus-within:text-aurora-purple transition-colors">
                            Passkey
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all duration-300 font-mono text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs font-mono bg-red-500/10 border border-red-500/20 p-3 rounded">
                            ERROR: {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-mono font-bold uppercase tracking-widest text-xs py-5 rounded-lg hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Verifying...' : 'Authenticate'}
                    </button>
                </form>
            </div>

            <div className="absolute bottom-8 text-[10px] font-mono uppercase tracking-widest text-white/20">
                Secured by JobOs Identity
            </div>
        </div>
    );
}
