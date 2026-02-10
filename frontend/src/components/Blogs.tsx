
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import { LuArrowUpRight } from 'react-icons/lu';

interface Blog {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    published_date: string;
    thumbnail: string;
}

export default function Blogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const result = await pb.collection('blogs').getList<Blog>(1, 3, {
                    filter: 'published = true',
                    sort: '-published_date',
                });
                setBlogs(result.items);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section className="py-32 px-6 md:px-12 bg-void text-white relative border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex items-end justify-between">
                    <h2 className="text-6xl md:text-8xl font-display font-medium leading-none tracking-tight">
                        LATEST <br /> <span className="text-white/20">THOUGHTS</span>
                    </h2>
                    <Link to="/blogs" className="hidden md:flex items-center gap-2 group border-b border-transparent hover:border-white transition-all pb-1">
                        <span className="font-mono text-xs uppercase tracking-widest text-white/60 group-hover:text-white">Read All</span>
                        <LuArrowUpRight className="text-white/60 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {blogs.length === 0 ? (
                        <div className="text-center font-mono text-sm text-white/40 py-12 border-t border-white/10">Thinking...</div>
                    ) : (
                        blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                to={`/blogs/${blog.slug || blog.id}`}
                                className="group block relative border-t border-white/10 pt-12 transition-all duration-500 hover:border-white/40"
                            >
                                <div className="flex flex-col md:flex-row gap-8 md:items-start justify-between">
                                    <div className="md:w-1/4">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-mono text-xs text-aurora-cyan uppercase tracking-wider">
                                                // {new Date(blog.published_date).toLocaleDateString()}
                                            </span>
                                            <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest border border-white/10 px-2 py-1 rounded w-fit">
                                                {blog.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="md:w-3/4 pr-12">
                                        <h3 className="text-3xl md:text-5xl font-display font-medium text-white mb-4 group-hover:text-aurora-purple transition-colors leading-tight">
                                            {blog.title}
                                        </h3>
                                        <p className="text-white/50 text-lg font-light leading-relaxed max-w-2xl group-hover:text-white/70 transition-colors">
                                            {blog.excerpt}
                                        </p>

                                        <div className="mt-8 flex items-center gap-2 text-white/40 font-mono text-xs uppercase tracking-wider group-hover:text-white transition-colors">
                                            <span>Read Article</span>
                                            <LuArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
