import ScrollyCanvas from '../components/ScrollyCanvas';
import Overlay from '../components/Overlay';
import Projects from '../components/Projects';
import Navbar from '../components/Navbar';

export default function Home() {
    return (
        <>
            <Navbar />
            {/* Scrollytelling Section */}
            <div className="relative">
                <ScrollyCanvas />
                <Overlay />
            </div>

            {/* Following Content */}
            <Projects />

            {/* Footer */}
            <footer className="py-12 text-center text-white/40 border-t border-white/5">
                <p>© 2026 Yash Desai. All Rights Reserved.</p>
            </footer>
        </>
    );
}
