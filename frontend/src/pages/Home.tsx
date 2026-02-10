
import Overlay from '../components/Overlay';
import ProofSection from '../components/ProofSection';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Services from '../components/Services';
import Blogs from '../components/Blogs';
import FooterCTA from '../components/FooterCTA';
import PublicNavbar from '../components/PublicNavbar';
import { useRef } from 'react';

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="bg-void selection:bg-aurora-purple selection:text-white font-body overflow-x-hidden">
            <PublicNavbar />

            {/* HEROLAYER: Sticky Abstract Background + Typo */}
            <div id="hero" ref={scrollRef} className="relative h-[120vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <div className="absolute inset-0 bg-void z-0" />
                    {/* Gradient Mesh Overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-aurora-purple/20 via-void to-transparent opacity-60 mix-blend-screen" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-void to-transparent z-10" />

                    <Overlay scrollRef={scrollRef} />
                </div>
            </div>

            {/* MAIN CONTENT FLOW - Removed opacity fade */}
            <div
                className="relative z-20 -mt-[20vh] bg-void rounded-t-[3rem] shadow-[0_-20px_60px_rgba(0,0,0,0.8)] border-t border-white/5"
            >
                {/* 1. PROOF — The "Why Me" Section */}
                <div id="about" className="pt-24 pb-12">
                    <ProofSection />
                </div>

                {/* 2. WORKS — The "What I Built" Section (Horizontal Scroll Feel) */}
                <div id="work" className="border-t border-white/5 bg-panel/30 backdrop-blur-3xl">
                    <Projects />
                </div>

                {/* 3. SKILLS — The "How I Do It" Section (Grid) */}
                <div id="skills" className="border-t border-white/5">
                    <Skills />
                </div>

                {/* 4. SERVICES — The "What I Offer" Section */}
                <div id="services" className="border-t border-white/5 bg-panel/30 backdrop-blur-3xl">
                    <Services />
                </div>

                {/* 5. BLOGS — The "Thoughts" Section */}
                <div id="blogs" className="border-t border-white/5">
                    <Blogs />
                </div>
            </div>

            {/* FOOTER */}
            <div id="contact" className="relative z-30 bg-black">
                <FooterCTA />
            </div>
        </div>
    );
}
