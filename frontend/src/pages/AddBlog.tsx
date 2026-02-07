import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { pb } from '../lib/pocketbase';
import {
    LuSave, LuImage, LuType, LuAlignLeft, LuCalendar, LuTag, LuFileText,
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
    const [isEditing, setIsEditing] = useState(false); // If true, we show the form
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
            // Removing sort for now to debug 400 error
            const records = await pb.collection('blogs').getList<BlogPost>(1, 50, {
                requestKey: null
            });
            setBlogs(records.items);
            // set error to null on success
        } catch (error: any) {
            console.error("Error fetching blogs:", error);
            alert(`Failed to fetch blogs: ${error.message || 'Unknown error'}`);
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, published: e.target.checked }));
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
            setPreviewUrl(pb.files.getURL(blog, blog.thumbnail));
        }
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await pb.collection('blogs').delete(id);
                fetchBlogs(); // Refresh list
            } catch (error) {
                console.error("Error deleting blog:", error);
                alert("Failed to delete blog.");
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

            alert(`Blog post ${editId ? 'updated' : 'created'} successfully!`);
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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500 selection:text-white pb-20">
            <Navbar />

            <div className="pt-32 px-4 max-w-7xl mx-auto">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                            Blog Management
                        </h1>
                        <p className="text-white/40">Manage your content, analytics, and publication workflow.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10">
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-3 rounded-lg transition-all ${viewMode === 'table' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-white/60'}`}
                                    title="Table View"
                                >
                                    <LuLayoutList size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('gallery')}
                                    className={`p-3 rounded-lg transition-all ${viewMode === 'gallery' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-white/60'}`}
                                    title="Gallery View"
                                >
                                    <LuLayoutGrid size={20} />
                                </button>
                                <button
                                    onClick={() => setViewMode('analytics')}
                                    className={`p-3 rounded-lg transition-all ${viewMode === 'analytics' ? 'bg-purple-500/20 text-purple-400' : 'hover:bg-white/10 text-white/60'}`}
                                    title="Analytics View"
                                >
                                    <LuChartPie size={20} />
                                </button>
                                <div className="w-px h-8 bg-white/10 mx-2" />
                            </>
                        )}

                        <button
                            onClick={() => isEditing ? resetForm() : setIsEditing(true)}
                            className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${isEditing ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {isEditing ? <><LuX /> Cancel</> : <><LuPlus /> New Post</>}
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
                            className="max-w-4xl mx-auto"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
                                <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit Post' : 'Create New Post'}</h2>

                                {/* Existing Form Fields (Simplified for Brevity - fully mirrored from original) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuType /> Title</label>
                                        <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuType /> Slug</label>
                                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors font-mono text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuTag /> Category</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500">
                                            <option value="GenAI">GenAI</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Tutorial">Tutorial</option>
                                            <option value="Career">Career</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuCalendar /> Date</label>
                                        <input type="date" name="published_date" value={formData.published_date} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuAlignLeft /> Excerpt</label>
                                    <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuFileText /> Content</label>
                                    <textarea name="content" value={formData.content} onChange={handleChange} rows={15} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 font-mono text-sm" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-white/70 flex items-center gap-2"><LuImage /> Thumbnail</label>
                                    <div className="relative border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors">
                                        <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                        {previewUrl ? (
                                            <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                                        ) : (
                                            <div className="text-white/40">Drop image here or click to upload</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 gap-4">
                                    <button type="button" onClick={resetForm} className="px-6 py-3 text-white/60 hover:text-white">Cancel</button>
                                    <button type="submit" disabled={loading} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2">
                                        {loading ? 'Saving...' : <><LuSave /> Save Post</>}
                                    </button>
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
                                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 bg-white/5">
                                                <th className="p-6 font-semibold text-white/60">Title</th>
                                                <th className="p-6 font-semibold text-white/60">Category</th>
                                                <th className="p-6 font-semibold text-white/60">Status</th>
                                                <th className="p-6 font-semibold text-white/60 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogs.map(blog => (
                                                <tr key={blog.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-medium text-white">{blog.title}</td>
                                                    <td className="p-6"><span className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10">{blog.category}</span></td>
                                                    <td className="p-6">
                                                        {blog.published ? <span className="text-green-400 text-sm">● Published</span> : <span className="text-yellow-400 text-sm">● Draft</span>}
                                                    </td>
                                                    <td className="p-6 flex justify-end gap-3">
                                                        <button onClick={() => navigate(`/blogs/${blog.slug}`)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="View"><LuEye /></button>
                                                        <button onClick={() => handleEdit(blog)} className="p-2 hover:bg-white/10 rounded-lg text-orange-400" title="Edit"><LuPen /></button>
                                                        <button onClick={() => handleDelete(blog.id)} className="p-2 hover:bg-white/10 rounded-lg text-red-400" title="Delete"><LuTrash /></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {blogs.length === 0 && <div className="p-12 text-center text-white/40">No blogs found. Create your first one!</div>}
                                </div>
                            )}

                            {/* GALLERY VIEW */}
                            {viewMode === 'gallery' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {blogs.map(blog => (
                                        <div key={blog.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all group">
                                            <div className="h-48 bg-black/50 overflow-hidden relative">
                                                {blog.thumbnail ? (
                                                    <img
                                                        src={pb.files.getURL(blog, blog.thumbnail)}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/20"><LuImage size={40} /></div>
                                                )}
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(blog)} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-purple-600 transition-colors"><LuPen size={14} /></button>
                                                    <button onClick={() => handleDelete(blog.id)} className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-600 transition-colors"><LuTrash size={14} /></button>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 line-clamp-1">{blog.title}</h3>
                                                <p className="text-white/50 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                                                <button onClick={() => navigate(`/blogs/${blog.slug}`)} className="text-purple-400 text-sm font-medium hover:text-purple-300">Read Article &rarr;</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ANALYTICS VIEW */}
                            {viewMode === 'analytics' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 p-8 rounded-3xl">
                                        <h3 className="text-white/60 mb-2">Total Posts</h3>
                                        <p className="text-5xl font-bold text-white">{blogs.length}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 p-8 rounded-3xl">
                                        <h3 className="text-white/60 mb-2">Total Word Count</h3>
                                        <p className="text-5xl font-bold text-white">{blogs.reduce((acc, blog) => acc + blog.content.split(' ').length, 0).toLocaleString()}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 p-8 rounded-3xl">
                                        <h3 className="text-white/60 mb-2">Published</h3>
                                        <p className="text-5xl font-bold text-white">{blogs.filter(b => b.published).length}</p>
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
