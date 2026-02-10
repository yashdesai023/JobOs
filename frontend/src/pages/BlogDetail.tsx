
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import FooterCTA from '../components/FooterCTA';
import { pb } from '../lib/pocketbase';
import { LuArrowLeft } from 'react-icons/lu';

interface Blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    published_date: string;
    thumbnail: string;
    collectionId: string;
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

                // Fallback: try by ID if slug not found
                try {
                    if (slug) {
                        const recordById = await pb.collection('blogs').getOne(slug);
                        setBlog(recordById as unknown as Blog);
                    }
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
            <div className="min-h-screen bg-void text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">
                <div className="animate-pulse text-aurora-cyan">Loading Article...</div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-void text-white flex flex-col items-center justify-center font-body">
                <h1 className="text-4xl font-display font-medium mb-4">Article Not Found</h1>
                <Link to="/" className="text-aurora-purple hover:text-white flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                    <LuArrowLeft /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void text-white font-body selection:bg-aurora-purple selection:text-white">
            <PublicNavbar />

            {/* Back Link */}
            <div className="pt-32 px-6 md:px-12 max-w-4xl mx-auto">
                <Link to="/#blogs" className="text-white/40 hover:text-white inline-flex items-center gap-2 mb-12 transition-colors w-fit group font-mono text-xs uppercase tracking-widest">
                    <LuArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Insights
                </Link>
            </div>

            {/* Article Header */}
            <article className="max-w-4xl mx-auto px-6 md:px-12 pb-32">
                <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-6 mb-8 border-b border-white/10 pb-4">
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan">
                            // {new Date(blog.published_date).toLocaleDateString()}
                        </span>
                        <span className="px-2 py-1 border border-white/20 text-[10px] font-mono uppercase tracking-widest rounded-full text-white/60">
                            {blog.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-display font-medium leading-[1.1] tracking-tight mb-8 text-white">
                        {blog.title}
                    </h1>

                    <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl">
                        {blog.excerpt}
                    </p>
                </div>

                {/* Thumbnail Image */}
                {blog.thumbnail && (
                    <div className="w-full h-[400px] md:h-[500px] overflow-hidden rounded-sm mb-16 border border-white/10 relative">
                        <img
                            src={getImageUrl(blog.collectionId, blog.id, blog.thumbnail)}
                            alt={blog.title}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-20" />
                    </div>
                )}

                {/* Content Body */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-medium prose-p:font-light prose-p:text-white/80 prose-a:text-white prose-a:no-underline prose-a:border-b prose-a:border-white/40 hover:prose-a:border-white prose-blockquote:border-aurora-purple prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-code:text-aurora-cyan prose-code:bg-white/5 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </div>
            </article>

            <FooterCTA />
        </div>
    );
}
