import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const frameCount = 120;


export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const { scrollYProgress } = useScroll();

    // Map scroll progress (0 to 1) to frame index (0 to frameCount - 1)
    const renderIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises: Promise<void>[] = [];

            for (let i = 0; i < frameCount; i++) {
                const promise = new Promise<void>((resolve) => {
                    const img = new Image();
                    // We need to fetch the real filenames if we can't rename them.
                    // Since I am in agent mode, I can write a script to rename them in the public folder to frame_000.png, frame_001.png etc.
                    // This will make the frontend logic much cleaner.
                    // I will presume they are renamed to frame_000.png ... frame_119.png for this code to work.
                    img.src = `/sequence/frame_${i.toString().padStart(3, '0')}.png`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = (e) => {
                        console.error(`Failed to load image ${i}`, e);
                        // Resolve anyway to avoid blocking everything, but might show gaps
                        resolve();
                    };
                });
                promises.push(promise);
            }

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || !images[index]) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to window size to handle high DPI
        // In a real scenario we might want to debounce resize or use ResizeObserver
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const img = images[index];

        // Calculate aspect ratio for object-fit: cover
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear only if transparency needed, but we cover everything
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useMotionValueEvent(renderIndex, "change", (latest) => {
        if (!isLoaded) return;
        const frameIndex = Math.round(latest);
        requestAnimationFrame(() => renderFrame(frameIndex));
    });

    // Initial draw
    useEffect(() => {
        if (isLoaded) renderFrame(0);
    }, [isLoaded]);

    return (
        <div className="h-[500vh] w-full relative bg-[#060608]">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full block object-cover"
                />
                {!isLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                        <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <span className="text-white/30 text-sm font-mono tracking-wider">Loading...</span>
                    </div>
                )}
            </div>
        </div>
    );
}
