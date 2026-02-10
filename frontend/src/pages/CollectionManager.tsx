import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { collections } from '../lib/collectionConfig';
import type { FieldConfig } from '../lib/collectionConfig';
import { pb } from '../lib/pocketbase';
import { LuLayoutGrid, LuList, LuFilter, LuSearch, LuPlus, LuX, LuTrash, LuPen, LuEye, LuArrowRight, LuDownload, LuExternalLink } from 'react-icons/lu';

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
    const [sortBy] = useState<string>('created');
    const [sortOrder] = useState<SortOrder>('desc');
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

        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(item =>
                Object.values(item).some(val =>
                    String(val).toLowerCase().includes(lowerSearch)
                )
            );
        }

        if (filterCategory) {
            result = result.filter(item => item.category === filterCategory || item.domain === filterCategory);
        }

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
        setFiles({});
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
        if (!window.confirm("Delete item?")) return;
        try {
            await pb.collection(config.id).delete(id);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (!['collectionId', 'collectionName', 'created', 'updated', 'id', 'expand'].includes(key)) {
                data.append(key, formData[key] || '');
            }
        });
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
            alert("Failed to save item.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!config) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center text-white">
                <div className="text-center font-mono text-xs uppercase tracking-widest text-white/40">
                    <h1 className="text-4xl font-display text-white mb-4">404</h1>
                    <p>Collection not initialized.</p>
                    <Link to="/collections" className="text-aurora-cyan hover:underline mt-4 block">Return to Hub</Link>
                </div>
            </div>
        );
    }

    const categoryField = config.fields.find(f => f.name === 'category' || f.name === 'domain');
    const filterOptions = categoryField?.options || [];

    const renderInput = (field: FieldConfig) => {
        const commonClasses = "w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm placeholder:text-white/20";

        switch (field.type) {
            case 'select':
                return (
                    <div className="group">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">{field.label}</label>
                        <select name={field.name} required={field.required} className={commonClasses + " appearance-none cursor-pointer"} onChange={handleInputChange} value={formData[field.name] || ''}>
                            <option value="" disabled className="text-black">Select...</option>
                            {field.options?.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                        </select>
                    </div>
                );
            case 'file':
                return (
                    <div className="group">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">{field.label}</label>
                        <input type="file" name={field.name} accept={field.accept} required={modalMode === 'create' && field.required} onChange={handleFileChange} className="w-full text-xs text-white/60 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:font-mono file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20" />
                        {modalMode !== 'create' && formData[field.name] && <div className="text-[10px] text-white/30 mt-1 truncate">Current: {formData[field.name]}</div>}
                    </div>
                );
            case 'editor':
                return (
                    <div className="group h-full flex flex-col">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">{field.label}</label>
                        <textarea name={field.name} placeholder={field.placeholder} required={field.required} className="flex-1 w-full bg-white/[0.02] border border-white/10 p-4 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-sm resize-none" onChange={handleInputChange} value={formData[field.name] || ''} />
                    </div>
                );
            default:
                return (
                    <div className="group">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">{field.label}</label>
                        <input type={field.type} name={field.name} placeholder={field.placeholder} required={field.required} className={commonClasses} onChange={handleInputChange} value={formData[field.name] || ''} />
                    </div>
                );
        }
    };

    const renderDetailsView = () => {
        if (!selectedItem) return null;
        const imageField = config.fields.find(f => f.type === 'file' && f.accept?.startsWith('image'));
        const bannerUrl = imageField && selectedItem[imageField.name] ? pb.files.getUrl(selectedItem, selectedItem[imageField.name]) : null;

        return (
            <div className="space-y-8 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {bannerUrl && (
                        <div className="h-64 mb-8 overflow-hidden border border-white/10 relative">
                            <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-void to-transparent opacity-80" />
                        </div>
                    )}
                    <h2 className="text-4xl font-display font-medium text-white mb-8 border-b border-white/10 pb-4">{selectedItem[config.fields[0].name]}</h2>

                    <div className="grid grid-cols-1 gap-8">
                        {config.fields.map(field => {
                            if (field.name === config.fields[0].name) return null;
                            if (field.type === 'file' && field.accept?.startsWith('image')) return null;
                            const value = selectedItem[field.name];
                            if (!value) return null;

                            return (
                                <div key={field.name} className="flex flex-col gap-2">
                                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40">{field.label}</label>
                                    {field.type === 'url' ? (
                                        <a href={value} target="_blank" className="text-aurora-cyan hover:underline text-sm flex items-center gap-2"><LuExternalLink size={12} /> {value}</a>
                                    ) : field.type === 'file' ? (
                                        <a href={pb.files.getUrl(selectedItem, value)} target="_blank" className="text-white hover:underline text-sm flex items-center gap-2"><LuDownload size={12} /> Download File</a>
                                    ) : (
                                        <div className="text-white/80 font-light text-sm whitespace-pre-wrap leading-relaxed">{value}</div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between text-[10px] text-white/20 font-mono uppercase tracking-widest">
                    <span>ID: {selectedItem.id}</span>
                    <span>Created: {new Date(selectedItem.created).toLocaleDateString()}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-32">
            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto w-full relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">
                             // <Link to="/collections" className="hover:text-white transition-colors">Data Grid</Link> / {config.name}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white mb-2">
                            {config.name.toUpperCase()}
                        </h1>
                        <p className="text-white/60 text-lg font-light">{config.description}</p>
                    </div>

                    <div className="flex gap-4 items-center">
                        <div className="flex border border-white/10 bg-white/[0.02]">
                            <button onClick={() => setViewMode('grid')} className={`p-3 transition-colors ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}><LuLayoutGrid /></button>
                            <div className="w-px bg-white/10" />
                            <button onClick={() => setViewMode('table')} className={`p-3 transition-colors ${viewMode === 'table' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}><LuList /></button>
                        </div>
                        <button onClick={openCreateModal} className="px-6 py-3 bg-aurora-purple text-white hover:bg-aurora-purple/80 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
                            <LuPlus /> Add Record
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                    <div className="relative flex-1 group">
                        <LuSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-aurora-cyan transition-colors" />
                        <input type="text" placeholder="Search Database..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-b border-white/10 pl-8 pb-2 text-white outline-none focus:border-aurora-cyan transition-colors font-mono text-xs uppercase tracking-wider placeholder:text-white/20" />
                    </div>

                    <div className="flex gap-6 items-center">
                        {filterOptions.length > 0 && (
                            <div className="relative group">
                                <LuFilter className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20" size={12} />
                                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                                    className="appearance-none bg-transparent border-b border-white/10 pl-6 pr-8 pb-2 text-white outline-none focus:border-aurora-cyan transition-colors font-mono text-xs uppercase tracking-wider cursor-pointer text-white/60 hover:text-white">
                                    <option value="" className="text-black">All Categories</option>
                                    {filterOptions.map(opt => <option key={opt} value={opt} className="text-black">{opt}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>


                {/* CONTENT AREA */}
                <div className="min-h-[50vh]">
                    {loading ? (
                        <div className="flex items-center gap-2 text-white/40 font-mono text-xs uppercase tracking-widest pl-2">
                            <div className="w-2 h-2 bg-white animate-pulse" /> Loading Protocol...
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="text-white/20 font-mono text-xs uppercase tracking-widest border border-dashed border-white/10 p-12 text-center">
                            No records found.
                        </div>
                    ) : (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
                                    {filteredItems.map(item => (
                                        <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-void p-8 hover:bg-white/[0.02] transition-colors group relative flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-6">
                                                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5">{item.category || config.name}</span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openViewModal(item)} className="text-white/40 hover:text-white"><LuEye /></button>
                                                    <button onClick={() => openEditModal(item)} className="text-white/40 hover:text-aurora-purple"><LuPen /></button>
                                                    <button onClick={() => handleDelete(item.id)} className="text-white/40 hover:text-red-400"><LuTrash /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-display font-medium text-white mb-2 line-clamp-2">{item[config.fields[0].name] || 'Untitled'}</h3>

                                            <div className="mt-auto pt-6 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-white/30 border-t border-white/5">
                                                <span>{new Date(item.created).toLocaleDateString()}</span>
                                                <button onClick={() => openViewModal(item)} className="hover:text-white flex items-center gap-1 transition-colors">Details <LuArrowRight size={10} /></button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border border-white/10 bg-white/[0.02]">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/40">
                                                {config.fields.slice(0, 4).map(field => (
                                                    <th key={field.name} className="p-6 font-normal">{field.label}</th>
                                                ))}
                                                <th className="p-6 font-normal text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredItems.map(item => (
                                                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    {config.fields.slice(0, 4).map((field, idx) => (
                                                        <td key={field.name} className={`p-6 ${idx === 0 ? 'font-display font-medium text-white text-lg' : 'text-white/60 font-light text-sm'}`}>
                                                            <div className="truncate max-w-[300px]">
                                                                {field.type === 'file' ? (item[field.name] ? 'File Linked' : '-') : (item[field.name] || '-')}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    <td className="p-6 text-right">
                                                        <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => openViewModal(item)} className="text-white/40 hover:text-white"><LuEye /></button>
                                                            <button onClick={() => openEditModal(item)} className="text-white/40 hover:text-aurora-purple"><LuPen /></button>
                                                            <button onClick={() => handleDelete(item.id)} className="text-white/40 hover:text-red-400"><LuTrash /></button>
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

            {/* MODAL */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className={`bg-void border border-white/10 w-full ${modalMode === 'view' ? 'max-w-4xl h-[80vh]' : 'max-w-2xl max-h-[90vh]'} p-12 shadow-2xl relative overflow-hidden flex flex-col`}>

                            <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6 shrink-0">
                                <span className="text-aurora-cyan text-[10px] font-mono uppercase tracking-widest">// {modalMode} Record</span>
                                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white transition-colors"><LuX size={24} /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {modalMode === 'view' ? renderDetailsView() : (
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {config.fields.map(field => (
                                            <div key={field.name}>{renderInput(field)}</div>
                                        ))}
                                        <div className="pt-8 border-t border-white/10 flex justify-end gap-6">
                                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest">Cancel</button>
                                            <button type="submit" disabled={submitting} className="bg-white text-black hover:bg-white/90 px-8 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all">
                                                {submitting ? 'Processing...' : 'Save Database Record'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
