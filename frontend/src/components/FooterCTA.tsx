
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { LuMail, LuMapPin, LuSend } from 'react-icons/lu';
import { useState } from 'react';

export default function FooterCTA() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        setTimeout(() => setFormState('success'), 2000);
    };

    return (
        <section className="bg-void text-white relative border-t border-white/5 pt-32 pb-12 px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-24 items-start">

                {/* Left: Huge "Let's Talk" */}
                <div className="md:w-1/2">
                    <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-8 block">
                        // Reach Out
                    </span>
                    <h2 className="text-6xl md:text-9xl font-display font-medium leading-[0.85] tracking-tighter mb-12">
                        LET'S <br /> <span className="text-white/20">TALK.</span>
                    </h2>

                    <div className="flex flex-col gap-6 text-xl font-light">
                        <a href="mailto:yashdesai.eng@gmail.com" className="group flex items-center gap-4 hover:text-aurora-purple transition-colors">
                            <LuMail className="text-white/40 group-hover:text-aurora-purple transition-colors" />
                            <span>yashdesai.eng@gmail.com</span>
                        </a>
                        <div className="flex items-center gap-4 text-white/40">
                            <LuMapPin />
                            <span>Pune, India</span>
                        </div>
                    </div>

                    <div className="flex gap-6 mt-16 pb-12 md:pb-0">
                        {[
                            { icon: <FaGithub />, href: "https://github.com/yashdesai023" },
                            { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/yash-s-desai-/" },
                            { icon: <FaTwitter />, href: "https://twitter.com/yashdesaieng" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.href}
                                target="_blank"
                                className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:border-white hover:bg-white/5 transition-all duration-300"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: Minimal Line Form */}
                <div className="md:w-1/2 w-full pt-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                        {[
                            { label: "Your Name", placeholder: "John Doe" },
                            { label: "Your Email", placeholder: "john@example.com" },
                            { label: "Subject", placeholder: "Collaboration..." },
                        ].map((field, i) => (
                            <div key={i} className="group relative">
                                <label className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-aurora-purple transition-colors">
                                    {field.label}
                                </label>
                                <input
                                    type="text"
                                    placeholder={field.placeholder}
                                    className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-display placeholder-white/10 focus:outline-none focus:border-white transition-colors"
                                />
                            </div>
                        ))}

                        <div className="group relative">
                            <label className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-aurora-purple transition-colors">
                                Message
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Tell me about your project..."
                                className="w-full bg-transparent border-b border-white/10 pb-4 text-xl font-display placeholder-white/10 focus:outline-none focus:border-white transition-colors resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={formState !== 'idle'}
                            className="w-full py-6 mt-4 border border-white/10 hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-4 font-mono uppercase tracking-widest text-sm group"
                        >
                            {formState === 'idle' ? (
                                <>
                                    Send Message <LuSend className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                </>
                            ) : (
                                "Sending..."
                            )}
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-24 pt-8 flex justify-between text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/20">
                <p>© 2026 Yash Desai.</p>
                <p>Engineered with React & PocketBase.</p>
            </div>
        </section>
    );
}
