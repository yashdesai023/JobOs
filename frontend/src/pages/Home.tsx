import ScrollyCanvas from '../components/ScrollyCanvas';
import Overlay from '../components/Overlay';
import ProofSection from '../components/ProofSection';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Services from '../components/Services';
import Blogs from '../components/Blogs';
import FooterCTA from '../components/FooterCTA';
import Navbar from '../components/Navbar';
import { useRef } from 'react';

export default function Home() {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Navbar />
            {/* Scrollytelling Section */}
            <div id="about" ref={scrollRef} className="relative h-[500vh]">
                <ScrollyCanvas />
                <Overlay scrollRef={scrollRef} />
            </div>

            {/* Proof Section - Bridge between Hero and Work */}
            <ProofSection />

            {/* Following Content with Gradient Transitions */}
            <div className="relative z-30 bg-[#0a0a0a]">
                <div className="bg-gradient-to-b from-[#121212] via-[#0a0a0a] to-[#121212]">
                    <Projects />
                    <Skills />
                    <Services />
                    <Blogs />
                </div>
            </div>

            {/* Footer */}
            <FooterCTA />
        </>
    );
}
