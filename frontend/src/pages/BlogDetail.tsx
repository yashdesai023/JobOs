
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FooterCTA from '../components/FooterCTA';
import { pb } from '../lib/pocketbase';
import { LuArrowLeft, LuCalendar, LuTag } from 'react-icons/lu';

interface Blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    published_date: string;
    thumbnail: string;
}

export default function BlogDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!slug) return;
            try {
                // Try to find by slug first
                const record = await pb.collection('blogs').getFirstListItem(`slug="${slug}"`);
                setBlog(record as unknown as Blog);
            } catch (error) {
                console.error("Error fetching blog:", error);

                // Fallback: try by ID if slug not found (handling legacy links if any)
                try {
                    const recordById = await pb.collection('blogs').getOne(slug);
                    setBlog(recordById as unknown as Blog);
                } catch (err2) {
                    console.error("Also failed by ID:", err2);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const getImageUrl = (collectionId: string, recordId: string, fileName: string) => {
        return pb.files.getUrl({ collectionId, id: recordId }, fileName);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
                <div className="animate-pulse text-xl font-mono text-purple-400">Loading Article...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                <Link to="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2">
                    <LuArrowLeft /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white">
            <Navbar />

            {/* Hero Section with Thumbnail Background */}
            <div className="relative w-full h-[60vh] min-h-[400px]">
                {blog.thumbnail ? (
                    <div className="absolute inset-0">
                        <img
                            src={getImageUrl('blogs', blog.id, blog.thumbnail)}
                            alt={blog.title}
                            className="w-full h-full object-cover opacity-40 mask-image-gradient"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                )}

                <div className="relative z-10 h-full max-w-4xl mx-auto px-4 flex flex-col justify-end pb-12">
                    <Link to="/#blogs" className="text-white/60 hover:text-white inline-flex items-center gap-2 mb-6 transition-colors w-fit group">
                        <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Insights
                    </Link>

                    <div className="flex items-center gap-4 text-sm font-mono text-purple-300 mb-4">
                        <span className="flex items-center gap-1 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                            <LuTag size={12} /> {blog.category}
                        </span>
                        <span className="flex items-center gap-1 text-white/50">
                            <LuCalendar size={12} /> {new Date(blog.published_date).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-2xl">
                        {blog.title}
                    </h1>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-3xl mx-auto px-4 py-12 pb-32">
                <div className="prose prose-invert prose-lg max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
            </div>

            <FooterCTA />
        </div>
    );
}
