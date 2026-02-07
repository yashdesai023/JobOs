
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

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
                // Fetch published blogs, sorted by published_date descending
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

    const getImageUrl = (collectionId: string, recordId: string, fileName: string) => {
        return pb.files.getUrl({ collectionId, id: recordId }, fileName);
    };

    return (
        <div id="blogs" className="relative z-20 bg-transparent py-20 px-4 md:px-12 w-full">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-bold text-white mb-20 text-center"
                >
                    Latest Insights
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.length === 0 ? (
                        <div className="col-span-3 text-center text-white/40">Loading latest thoughts...</div>
                    ) : (
                        blogs.map((blog, index) => (
                            <motion.article
                                key={blog.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 group cursor-pointer h-full flex flex-col"
                            >
                                <Link to={`/blogs/${blog.slug || blog.id}`} className="block h-full flex flex-col">
                                    <div className="h-48 w-full bg-gray-800 relative overflow-hidden">
                                        {blog.thumbnail ? (
                                            <img
                                                src={getImageUrl('blogs', blog.id, blog.thumbnail)}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-tr from-purple-900/40 to-blue-900/40" />
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex justify-between items-center mb-4 text-xs font-mono uppercase tracking-wider text-white/40">
                                            <span>{blog.category}</span>
                                            <span>{new Date(blog.published_date).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">{blog.title}</h3>
                                        <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3">{blog.excerpt}</p>
                                        <div className="mt-auto">
                                            <span className="text-purple-500 text-sm font-medium group-hover:underline decoration-purple-500/50 underline-offset-4">Read Article &rarr;</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
