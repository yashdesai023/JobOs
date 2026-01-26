import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { collections } from '../lib/collectionConfig';
import type { FieldConfig } from '../lib/collectionConfig';
import { pb } from '../lib/pocketbase';

type ViewMode = 'grid' | 'table';
type SortOrder = 'asc' | 'desc';

export default function CollectionManager() {
    const { collectionName } = useParams();
    const config = collections[collectionName || ''];

    // Data State
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // UI View State
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [sortBy, setSortBy] = useState<string>('created');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filterCategory, setFilterCategory] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [files, setFiles] = useState<Record<string, File>>({});

    useEffect(() => {
        if (config) {
            loadItems();
        }
    }, [config, refreshTrigger]);

    const loadItems = async () => {
        setLoading(true);
        try {
            const result = await pb.collection(config.id).getList(1, 200, { sort: '-created' });
            setItems(result.items);
        } catch (error) {
            console.error("Error loading items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and Sort Logic
    const filteredItems = useMemo(() => {
        let result = [...items];

        // Search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(lowerSearch)
                )
            );
        }

        // Category/Domain Filter (if applicable)
        if (filterCategory) {
            result = result.filter(item => item.category === filterCategory || item.domain === filterCategory);
        }

        // Sorting
        result.sort((a, b) => {
            const fieldA = a[sortBy] || '';
            const fieldB = b[sortBy] || '';

            if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
            if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [items, searchTerm, filterCategory, sortBy, sortOrder]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({});
        setFiles({});
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item: any) => {
        setModalMode('edit');
        setFormData(item);
        setFiles({}); // Files typically not pre-filled in same way for update
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const openViewModal = (item: any) => {
        setModalMode('view');
        setFormData(item);
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) return;

        try {
            await pb.collection(config.id).delete(id);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Failed to delete item.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        // Append all text fields
        Object.keys(formData).forEach(key => {
            // Exclude system fields if creating new, or standard exclusions
            if (!['collectionId', 'collectionName', 'created', 'updated', 'id', 'expand'].includes(key)) {
                data.append(key, formData[key] || '');
            }
        });
        // Append new files
        Object.keys(files).forEach(key => data.append(key, files[key]));

        try {
            if (modalMode === 'edit' && selectedItem) {
                await pb.collection(config.id).update(selectedItem.id, data);
            } else {
                await pb.collection(config.id).create(data);
            }
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Failed to save item. Check console for details.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!config) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-white/50 mb-8">Collection not found.</p>
                    <Link to="/collections" className="text-purple-400 hover:text-purple-300">Back to Collections</Link>
                </div>
            </div>
        );
    }

    // Determine filter options based on collection fields
    const categoryField = config.fields.find(f => f.name === 'category' || f.name === 'domain');
    const filterOptions = categoryField?.options || [];

    const renderInput = (field: FieldConfig) => {
        const commonClasses = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500/50 focus:bg-white/10 text-white placeholder-white/20 transition-all font-mono mb-4 disabled:opacity-50 disabled:cursor-not-allowed";

        switch (field.type) {
            case 'select':
                return (
                    <select
                        name={field.name}
                        required={field.required}
                        className={commonClasses}
                        onChange={handleInputChange}
                        value={formData[field.name] || ''}
                    >
                        <option value="" disabled>Select {field.label}</option>
                        {field.options?.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
                    </select>
                );
            case 'file':
                return (
                    <div className="mb-4">
                        {modalMode !== 'create' && formData[field.name] && (
                            <div className="text-sm text-white/50 mb-2">
                                Current file: <span className="text-white">{formData[field.name]}</span>
                            </div>
                        )}
                        <input
                            type="file"
                            name={field.name}
                            accept={field.accept}
                            required={modalMode === 'create' && field.required} // Only required on create
                            onChange={handleFileChange}
                            className={`${commonClasses} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600/20 file:text-purple-400 hover:file:bg-purple-600/30`}
                        />
                    </div>
                );
            case 'editor': // Fallback to textarea
                return (
                    <textarea
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                        className={commonClasses}
                        onChange={handleInputChange}
                        value={formData[field.name] || ''}
                    />
                );
            default:
                return (
                    <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={commonClasses}
                        onChange={handleInputChange}
                        value={formData[field.name] || ''}
                    />
                );
        }
    };

    // New Beautiful View Renderer
    const renderDetailsView = () => {
        if (!selectedItem) return null;

        // Try to identify an image field for the banner
        const imageField = config.fields.find(f => f.type === 'file' && f.accept?.startsWith('image'));
        const bannerUrl = imageField && selectedItem[imageField.name]
            ? pb.files.getUrl(selectedItem, selectedItem[imageField.name])
            : null;

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header Section */}
                <div className="relative">
                    {bannerUrl ? (
                        <div className="h-64 rounded-2xl overflow-hidden mb-6 relative group">
                            <img src={bannerUrl} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                            <h2 className="absolute bottom-4 left-6 text-4xl font-bold text-white drop-shadow-lg">
                                {selectedItem[config.fields[0].name]}
                            </h2>
                        </div>
                    ) : (
                        <div className="mb-8 border-b border-white/10 pb-6">
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                {selectedItem[config.fields[0].name]}
                            </h2>
                        </div>
                    )}
                </div>

                {/* Meta Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {config.fields.map(field => {
                        // Skip title field (already shown) and file images (shown as banner)
                        if (field.name === config.fields[0].name) return null;
                        if (field.type === 'file' && field.accept?.startsWith('image')) return null;

                        const value = selectedItem[field.name];
                        if (!value) return null;

                        // Special Renderers
                        if (field.type === 'url') {
                            return (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">{field.label}</label>
                                    <a
                                        href={value}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors w-fit px-4 py-2 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:border-purple-500/40"
                                    >
                                        Visit Link
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                            );
                        }

                        if (field.type === 'file') {
                            const fileUrl = pb.files.getUrl(selectedItem, value);
                            return (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">{field.label}</label>
                                    <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors w-fit px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:border-blue-500/40"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Download File
                                    </a>
                                </div>
                            );
                        }

                        if (field.name === 'tech_stack' || field.name === 'skills') {
                            const tags = value.split(',').map((t: string) => t.trim());
                            return (
                                <div key={field.name} className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">{field.label}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-white/80">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        }

                        if (field.type === 'editor') {
                            return (
                                <div key={field.name} className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs uppercase tracking-widest text-white/40 font-bold">{field.label}</label>
                                    <div className="text-white/80 leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 whitespace-pre-wrap">
                                        {value}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={field.name} className="flex flex-col gap-1">
                                <label className="text-xs uppercase tracking-widest text-white/40 font-bold">{field.label}</label>
                                <p className="text-lg text-white font-light">{value}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="pt-8 border-t border-white/5 flex justify-between text-xs text-white/30 font-mono">
                    <span>ID: {selectedItem.id}</span>
                    <span>Created: {new Date(selectedItem.created).toLocaleString()}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#121212] relative text-white selection:bg-purple-500 selection:text-white">
            <Navbar />

            <div className="relative z-10 pt-32 px-4 md:px-12 max-w-7xl mx-auto pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <Link to="/collections" className="text-white/40 hover:text-white text-sm mb-2 block flex items-center gap-1 w-fit">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Collections
                        </Link>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">{config.name}</h1>
                        <p className="text-white/50 mt-1">{config.description}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-xl border transition-colors ${viewMode === 'grid' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2.5 rounded-xl border transition-colors ${viewMode === 'table' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New
                        </button>
                    </div>
                </div>

                {/* Filters & Toolbar */}
                <div className="flex flex-wrap items-center gap-4 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                    <div className="flex-1 min-w-[200px] relative">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {filterOptions.length > 0 && (
                        <div className="relative">
                            <select
                                className="appearance-none pl-4 pr-10 py-2 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 cursor-pointer min-w-[150px]"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {filterOptions.map(opt => <option key={opt} value={opt} className="bg-gray-900">{opt}</option>)}
                            </select>
                            <svg className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    )}

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                        <span className="text-sm text-white/40">Sort by:</span>
                        <select
                            className="bg-transparent text-sm text-white focus:outline-none cursor-pointer"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="created" className="bg-gray-900">Date Created</option>
                            <option value={config.fields[0].name} className="bg-gray-900">Name</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="p-1 hover:bg-white/10 rounded"
                        >
                            <svg className={`w-4 h-4 text-white/60 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 min-h-[50vh]">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-center py-20 text-white/30">
                            <p>No items found.</p>
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="bg-black/20 hover:bg-black/40 border border-white/5 rounded-xl p-5 transition-all group relative"
                                        >
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openViewModal(item)} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/40" title="View Details">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                <button onClick={() => openEditModal(item)} className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/40" title="Edit">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/40" title="Delete">
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>

                                            <div className="flex justify-between items-start mb-2 pr-20">
                                                <h3 className="font-bold truncate text-lg text-purple-100">{item[config.fields[0].name] || 'Untitled'}</h3>
                                            </div>
                                            <div className="space-y-2 text-sm text-white/50 mt-4">
                                                {config.fields.slice(1, 4).map(field => {
                                                    if (field.type === 'file') return null;
                                                    const val = item[field.name];
                                                    return val ? (
                                                        <div key={field.name} className="flex gap-2">
                                                            <span className="text-white/30 text-xs uppercase tracking-wider min-w-[60px]">{field.label}:</span>
                                                            <span className="truncate">{val}</span>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-xs text-white/30">
                                                <span>{new Date(item.created).toLocaleDateString()}</span>
                                                <button onClick={() => openViewModal(item)} className="text-purple-400 hover:text-purple-300 flex items-center gap-1">
                                                    Details
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-white/40 text-sm uppercase tracking-wider">
                                                {config.fields.slice(0, 5).map(field => (
                                                    <th key={field.name} className="py-4 px-4 font-medium">{field.label}</th>
                                                ))}
                                                <th className="py-4 px-4 font-medium text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredItems.map(item => (
                                                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-white/70">
                                                    {config.fields.slice(0, 5).map(field => {
                                                        const val = item[field.name];
                                                        return (
                                                            <td key={field.name} className="py-4 px-4 max-w-[200px] truncate">
                                                                {field.type === 'file' ? (val ? 'File Attached' : '-') : (val || '-')}
                                                            </td>
                                                        );
                                                    })}
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => openViewModal(item)} className="p-2 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                            </button>
                                                            <button onClick={() => openEditModal(item)} className="p-2 text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            </button>
                                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`relative bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 w-full ${modalMode === 'view' ? 'max-w-4xl' : 'max-w-2xl'} max-h-[90vh] overflow-y-auto shadow-2xl`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {modalMode === 'create' ? `Add ${config.name.slice(0, -1)}` :
                                        modalMode === 'edit' ? `Edit ${config.name.slice(0, -1)}` :
                                            ''}
                                    {/* Title hidden for view mode as it is in the layout */}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white z-50 p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {modalMode === 'view' ? renderDetailsView() : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {config.fields.map(field => (
                                        <div key={field.name}>
                                            <label className="block text-sm font-medium text-white/70 mb-2">{field.label}</label>
                                            {renderInput(field)}
                                        </div>
                                    ))}

                                    <div className="flex justify-end gap-4 pt-4 border-t border-white/10 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-50"
                                        >
                                            {submitting ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
