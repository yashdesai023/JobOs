import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { LuMail, LuMapPin, LuPhone, LuSend } from 'react-icons/lu';
import { useState } from 'react';

export default function FooterCTA() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate sending
        setTimeout(() => setFormState('success'), 2000);
    };

    return (
        <footer id="contact" className="relative z-20 bg-black pt-32 pb-10 px-4 md:px-12 border-t border-white/5 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
                    {/* Left Column: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
                            Let's Build Something <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Extraordinary.</span>
                        </h2>
                        <p className="text-white/60 text-lg mb-12 max-w-md leading-relaxed">
                            Currently open for GenAI, MLOps, and Backend Engineering roles. Ready to architect scalable solutions?
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-purple-500/10 transition-colors">
                                    <LuMail className="text-2xl text-purple-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Email Me</h4>
                                    <a href="mailto:yashdesai.eng@gmail.com" className="text-white/60 hover:text-white transition-colors">yashdesai.eng@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-500/10 transition-colors">
                                    <LuPhone className="text-2xl text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Call Me</h4>
                                    <a href="tel:+919860639222" className="text-white/60 hover:text-white transition-colors">+91 98606 39222</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-green-500/10 transition-colors">
                                    <LuMapPin className="text-2xl text-green-400" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium mb-1">Location</h4>
                                    <p className="text-white/60">Pune, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-12">
                            {[
                                { icon: FaGithub, href: "https://github.com/yashdesai023", color: "hover:text-white" },
                                { icon: FaLinkedin, href: "https://linkedin.com/in/yash-desai", color: "hover:text-blue-400" },
                                { icon: FaTwitter, href: "https://twitter.com", color: "hover:text-sky-400" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`p-3 bg-white/5 rounded-xl text-white/50 ${social.color} hover:bg-white/10 transition-all transform hover:scale-110`}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-10 relative"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70 ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/70 ml-1">Your Email</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Subject</label>
                                <input
                                    type="text"
                                    placeholder="Project Collaboration"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/70 ml-1">Message</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell me about your project..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formState === 'submitting' || formState === 'success'}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${formState === 'success'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg hover:shadow-purple-500/25'
                                    }`}
                            >
                                {formState === 'idle' && (
                                    <>
                                        Send Message <LuSend />
                                    </>
                                )}
                                {formState === 'submitting' && (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                )}
                                {formState === 'success' && (
                                    <>
                                        Message Sent!
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
                    <p>© 2026 Yash Desai. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                    <p className="font-mono">Constructed with React & PocketBase</p>
                </div>
            </div>
        </footer>
    );
}
