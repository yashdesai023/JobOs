import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pb } from '../lib/pocketbase';
import {
    LuSave, LuImage,
    LuLayoutList, LuLayoutGrid, LuChartPie, LuPlus, LuTrash, LuEye, LuPen, LuX
} from 'react-icons/lu';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    content: string;
    published: boolean;
    published_date: string;
    thumbnail?: string;
    collectionId: string;
    collectionName: string;
}

export default function BlogManager() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'gallery' | 'analytics'>('table');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Engineering',
        excerpt: '',
        content: '',
        published: true,
        published_date: new Date().toISOString().split('T')[0]
    });
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Fetch Blogs
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const records = await pb.collection('blogs').getList<BlogPost>(1, 50, {
                sort: '-published_date'
            });
            setBlogs(records.items);
        } catch (error: any) {
            console.error("Error fetching blogs:", error);
        }
    };

    // Form Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'title' && !formData.slug && !editId) {
            setFormData(prev => ({
                ...prev,
                title: value,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            category: 'Engineering',
            excerpt: '',
            content: '',
            published: true,
            published_date: new Date().toISOString().split('T')[0]
        });
        setThumbnail(null);
        setPreviewUrl(null);
        setEditId(null);
        setIsEditing(false);
    };

    const handleEdit = (blog: BlogPost) => {
        setFormData({
            title: blog.title,
            slug: blog.slug,
            category: blog.category,
            excerpt: blog.excerpt,
            content: blog.content,
            published: blog.published,
            published_date: blog.published_date.split('T')[0]
        });
        setEditId(blog.id);
        if (blog.thumbnail) {
            // Updated to use correct SDK function if needed, or stick to getUrl
            setPreviewUrl(pb.files.getUrl(blog, blog.thumbnail));
        }
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await pb.collection('blogs').delete(id);
                fetchBlogs();
            } catch (error) {
                console.error("Error deleting blog:", error);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString());
            });
            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            if (editId) {
                await pb.collection('blogs').update(editId, data);
            } else {
                await pb.collection('blogs').create(data);
            }

            fetchBlogs();
            resetForm();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog post.");
        } finally {
            setLoading(false);
        }
    };

    // Render Logic
    return (
        <div className="min-h-screen bg-void text-white font-body selection:bg-aurora-purple selection:text-white pb-32">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">
                            // CMS Console
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white mb-2">
                            BLOG <span className="text-white/40">MANAGER</span>
                        </h1>
                        <p className="text-white/60 text-lg font-light">
                            Editorial control center for insights and publications.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isEditing && (
                            <>
                                {[
                                    { id: 'table', icon: <LuLayoutList />, label: 'List' },
                                    { id: 'gallery', icon: <LuLayoutGrid />, label: 'Grid' },
                                    { id: 'analytics', icon: <LuChartPie />, label: 'Data' },
                                ].map((v) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setViewMode(v.id as any)}
                                        className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all flex items-center gap-2
                                        ${viewMode === v.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:text-white'}`}
                                    >
                                        {v.icon} {v.label}
                                    </button>
                                ))}
                                <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
                            </>
                        )}

                        <button
                            onClick={() => isEditing ? resetForm() : setIsEditing(true)}
                            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest border transition-all flex items-center gap-2
                             ${isEditing ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'bg-aurora-purple text-white border-transparent hover:bg-aurora-purple/90'}`}
                        >
                            {isEditing ? <><LuX /> Cancel</> : <><LuPlus /> New Article</>}
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <AnimatePresence mode="wait">
                    {/* EDIT/CREATE FORM */}
                    {isEditing ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-5xl mx-auto"
                        >
                            <form onSubmit={handleSubmit} className="space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Title</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-display text-2xl placeholder:text-white/10" placeholder="Article Headline" />
                                        </div>
                                        <div className="group">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Slug</label>
                                            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-transparent border-b border-white/20 pb-2 text-white/60 outline-none focus:border-aurora-purple transition-colors font-mono text-xs" placeholder="article-slug" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="group">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Category</label>
                                                <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-xs uppercase appearance-none cursor-pointer">
                                                    <option value="GenAI" className="text-black">GenAI</option>
                                                    <option value="Engineering" className="text-black">Engineering</option>
                                                    <option value="Tutorial" className="text-black">Tutorial</option>
                                                    <option value="Career" className="text-black">Career</option>
                                                </select>
                                            </div>
                                            <div className="group">
                                                <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Publish Date</label>
                                                <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-xs uppercase" />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Excerpt</label>
                                            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full bg-white/[0.02] border border-white/10 p-4 text-white focus:outline-none focus:border-aurora-purple transition-colors font-body text-sm resize-none" placeholder="Brief summary..." />
                                        </div>

                                        <div className="group">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Thumbnail</label>
                                            <div className="relative border border-dashed border-white/20 p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group-hover:border-white/40">
                                                <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto shadow-lg" />
                                                ) : (
                                                    <div className="text-white/40 text-xs font-mono uppercase tracking-widest">
                                                        <LuImage className="mx-auto mb-2 text-2xl" />
                                                        Upload Cover Image
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-white/10">
                                            <button type="submit" disabled={loading} className="w-full py-4 bg-white text-black hover:bg-white/90 font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2">
                                                {loading ? 'Publishing...' : <><LuSave /> Publish Article</>}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="h-full flex flex-col group">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Content (Markdown)</label>
                                        <textarea name="content" value={formData.content} onChange={handleChange} className="flex-1 w-full bg-white/[0.02] border border-white/10 p-6 text-white focus:outline-none focus:border-aurora-purple transition-colors font-mono text-sm leading-relaxed resize-none h-[800px]" placeholder="# Write your masterpiece..." />
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        // MANAGE VIEWS
                        <motion.div
                            key="manage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* TABLE VIEW */}
                            {viewMode === 'table' && (
                                <div className="border border-white/10 bg-white/[0.02]">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
                                                <th className="p-6 font-normal">Title</th>
                                                <th className="p-6 font-normal">Category</th>
                                                <th className="p-6 font-normal">Status</th>
                                                <th className="p-6 font-normal text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {blogs.map(blog => (
                                                <tr key={blog.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="p-6 font-display font-medium text-white text-lg">{blog.title}</td>
                                                    <td className="p-6"><span className="text-white/60 font-mono text-xs uppercase tracking-wider">{blog.category}</span></td>
                                                    <td className="p-6">
                                                        {blog.published ?
                                                            <span className="text-[10px] text-emerald-400 border border-emerald-500/20 px-2 py-0.5 font-mono uppercase tracking-widest bg-emerald-500/10">Published</span> :
                                                            <span className="text-[10px] text-yellow-400 border border-yellow-500/20 px-2 py-0.5 font-mono uppercase tracking-widest bg-yellow-500/10">Draft</span>
                                                        }
                                                    </td>
                                                    <td className="p-6 flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => navigate(`/blogs/${blog.slug}`)} className="text-white/40 hover:text-white transition-colors"><LuEye size={18} /></button>
                                                        <button onClick={() => handleEdit(blog)} className="text-white/40 hover:text-aurora-purple transition-colors"><LuPen size={18} /></button>
                                                        <button onClick={() => handleDelete(blog.id)} className="text-white/40 hover:text-red-400 transition-colors"><LuTrash size={18} /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {blogs.length === 0 && <div className="p-12 text-center text-white/40 font-mono text-xs uppercase tracking-widest">No articles found.</div>}
                                </div>
                            )}

                            {/* GALLERY VIEW */}
                            {viewMode === 'gallery' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                                    {blogs.map(blog => (
                                        <div key={blog.id} className="bg-void p-0 hover:bg-white/[0.02] transition-colors group relative flex flex-col h-full">
                                            <div className="h-48 overflow-hidden relative border-b border-white/10">
                                                {blog.thumbnail ? (
                                                    <img
                                                        src={pb.files.getUrl(blog, blog.thumbnail)}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/10"><LuImage size={32} /></div>
                                                )}
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(blog)} className="p-2 bg-black text-white hover:text-aurora-purple transition-colors border border-white/10"><LuPen size={12} /></button>
                                                    <button onClick={() => handleDelete(blog.id)} className="p-2 bg-black text-white hover:text-red-400 transition-colors border border-white/10"><LuTrash size={12} /></button>
                                                </div>
                                            </div>
                                            <div className="p-8 flex flex-col flex-1">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-aurora-cyan mb-2">{blog.category}</span>
                                                <h3 className="text-xl font-display font-medium text-white mb-4 line-clamp-2">{blog.title}</h3>
                                                <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                                                    <span className="text-[10px] text-white/30 font-mono">{new Date(blog.published_date).toLocaleDateString()}</span>
                                                    <button onClick={() => navigate(`/blogs/${blog.slug}`)} className="text-[10px] font-mono uppercase tracking-widest text-white hover:text-aurora-purple transition-colors">Read &rarr;</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ANALYTICS VIEW */}
                            {viewMode === 'analytics' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                                    <div className="bg-void p-12 text-center">
                                        <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Total Articles</h3>
                                        <p className="text-6xl font-display font-medium text-white">{blogs.length}</p>
                                    </div>
                                    <div className="bg-void p-12 text-center">
                                        <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Word Volume</h3>
                                        <p className="text-6xl font-display font-medium text-white">{blogs.reduce((acc, blog) => acc + blog.content.split(' ').length, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-void p-12 text-center">
                                        <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Publication Rate</h3>
                                        <p className="text-6xl font-display font-medium text-white">{blogs.filter(b => b.published).length}<span className="text-2xl text-white/40">/{blogs.length}</span></p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
