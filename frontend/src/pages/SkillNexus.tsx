import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import {
    LuLayoutDashboard, LuServer, LuBrain, LuCloud, LuPenTool, LuBox,
    LuCheck, LuClock, LuPlus, LuTrash, LuX,
    LuLink, LuFile, LuExternalLink,
    LuTrendingUp, LuLayoutGrid, LuList, LuMap, LuCalendar
} from 'react-icons/lu';

// Types
interface ResourceLink {
    title: string;
    url: string;
}

interface Skill {
    id: string;
    title: string;
    status: 'Backlog' | 'In Progress' | 'Completed';
    target_date: string;
    category: string;
    description: string;
    icon: string;
    resource_links: ResourceLink[];
    attachments: string[];
    collectionId: string;
    collectionName: string;
}

const CATEGORY_COLORS: any = {
    'Frontend': 'from-cyan-400 to-blue-500',
    'Backend': 'from-green-400 to-emerald-600',
    'AI': 'from-purple-400 to-violet-600',
    'DevOps': 'from-orange-400 to-red-500',
    'Design': 'from-pink-400 to-rose-500',
    'Other': 'from-gray-400 to-slate-500',
};

const CATEGORY_ICONS: any = {
    'Frontend': <LuLayoutDashboard />,
    'Backend': <LuServer />,
    'AI': <LuBrain />,
    'DevOps': <LuCloud />,
    'Design': <LuPenTool />,
    'Other': <LuBox />,
};

// --- VIEWS ---

// 1. COSMIC ROADMAP VIEW
const CosmicRoadmap = ({ skills, onNodeClick }: { skills: Skill[], onNodeClick: (s: Skill) => void }) => {
    // Sort by date
    const sorted = [...skills].sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());

    if (sorted.length === 0) return <div className="text-white/30 text-center py-20">No milestones yet.</div>;

    // Organic Path Logic
    const gap = 350;
    const height = 600;
    const width = Math.max(window.innerWidth, (sorted.length + 1) * gap);

    // Generate organic sine wave with varying amplitude
    const points = sorted.map((_, i) => ({
        x: (i + 1) * gap,
        y: height / 2 + Math.sin(i * 0.8) * 150 * (i % 2 === 0 ? 1 : -1) // Meandering path
    }));

    const pathD = `M 0,${height / 2} ` + points.map((p, i) => {
        const prev = points[i - 1] || { x: 0, y: height / 2 };
        const cp1x = prev.x + (p.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = p.x - (p.x - prev.x) * 0.5;
        const cp2y = p.y;
        return `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p.x},${p.y}`;
    }).join(' ');

    return (
        <div className="relative w-full h-[600px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl cursor-grab active:cursor-grabbing shadow-2xl">
            <div style={{ width: `${width}px`, height: '600px' }} className="relative flex items-center">
                <svg width={width} height="600" className="absolute top-0 left-0 pointer-events-none">
                    <defs>
                        <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#d946ef" stopOpacity="1" /> {/* Fuchsia */}
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" /> {/* Violet */}
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" /> {/* Blue */}
                        </linearGradient>
                        <filter id="ribbonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="15" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Glow Layer */}
                    <path d={pathD} stroke="url(#ribbonGradient)" strokeWidth="12" fill="none" filter="url(#ribbonGlow)" opacity="0.6" />

                    {/* Main Line */}
                    <path d={pathD} stroke="url(#ribbonGradient)" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>

                {points.map((p, i) => {
                    const skill = sorted[i];
                    const isCompleted = skill.status === 'Completed';
                    const isProgress = skill.status === 'In Progress';

                    return (
                        <motion.button
                            key={skill.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 }}
                            onClick={() => onNodeClick(skill)}
                            className="absolute group z-10"
                            style={{ left: p.x - 32, top: p.y - 32 }}
                        >
                            {/* Node Halo */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl relative transition-all duration-300 bg-[#1a1a1a] border-4
                                ${isCompleted ? 'border-pink-500 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]' :
                                    isProgress ? 'border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-125 z-20' :
                                        'border-white/10 text-white/20'}
                            `}>
                                {CATEGORY_ICONS[skill.category] || <LuBox />}

                                {isProgress && (
                                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping opacity-20" />
                                )}
                            </div>

                            {/* Label */}
                            <div className={`absolute top-20 left-1/2 -translate-x-1/2 whitespace-nowrap text-center transition-opacity ${isProgress ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                <p className="font-bold text-white mb-2 text-lg shadow-black drop-shadow-md">{skill.title}</p>
                                <span className="text-xs font-bold font-mono text-white/60 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                                    {new Date(skill.target_date).getFullYear()}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

// 2. ANALYTICAL VIEW
const AnalyticalView = ({ skills }: { skills: Skill[] }) => {
    const total = skills.length;
    const completed = skills.filter(s => s.status === 'Completed').length;
    const progress = skills.filter(s => s.status === 'In Progress').length;
    const backlog = skills.filter(s => s.status === 'Backlog').length;

    // Categories Breakdown
    const categories: any = {};
    skills.forEach(s => { categories[s.category] = (categories[s.category] || 0) + 1 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-300">
            {/* Progress Circle */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" className="text-white/5" strokeWidth="16" fill="none" stroke="currentColor" />
                        <circle cx="96" cy="96" r="88" className="text-green-500" strokeWidth="16" fill="none" stroke="currentColor"
                            strokeDasharray={2 * Math.PI * 88}
                            strokeDashoffset={2 * Math.PI * 88 * (1 - completed / total || 0)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{Math.round((completed / total || 0) * 100)}%</span>
                        <span className="text-sm text-white/40 uppercase tracking-widest">Mastery</span>
                    </div>
                </div>
            </div>

            {/* Status Cards */}
            <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-purple-300 text-xs font-bold uppercase">In Focus</p>
                        <h3 className="text-3xl font-bold text-white">{progress}</h3>
                    </div>
                    <LuBrain className="text-4xl text-purple-400 opacity-50" />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-blue-300 text-xs font-bold uppercase">Backlog</p>
                        <h3 className="text-3xl font-bold text-white">{backlog}</h3>
                    </div>
                    <LuClock className="text-4xl text-blue-400 opacity-50" />
                </div>
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-green-300 text-xs font-bold uppercase">Completed</p>
                        <h3 className="text-3xl font-bold text-white">{completed}</h3>
                    </div>
                    <LuCheck className="text-4xl text-green-400 opacity-50" />
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2"><LuTrendingUp /> Distribution</h3>
                <div className="space-y-4">
                    {Object.entries(categories).map(([cat, count]: any) => (
                        <div key={cat}>
                            <div className="flex justify-between text-xs text-white/60 mb-1">
                                <span>{cat}</span>
                                <span>{count}</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full bg-gradient-to-r ${CATEGORY_COLORS[cat] || 'bg-white'}`} style={{ width: `${(count / total) * 100}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. GALLERY GRID VIEW
const GalleryView = ({ skills, onNodeClick }: { skills: Skill[], onNodeClick: (s: Skill) => void }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            {skills.map(skill => (
                <div key={skill.id} onClick={() => onNodeClick(skill)}
                    className="bg-[#111] hover:bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer group transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORY_COLORS[skill.category]} flex items-center justify-center text-white shadow-lg`}>
                            {CATEGORY_ICONS[skill.category]}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded border 
                            ${skill.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                skill.status === 'In Progress' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    'text-white/40 border-white/10'}`}>
                            {skill.status}
                        </span>
                    </div>
                    <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{skill.title}</h3>
                    <div className="text-xs text-white/40 flex items-center gap-2">
                        <LuCalendar size={12} /> {new Date(skill.target_date).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

// 4. TABLE VIEW
const TableView = ({ skills, onNodeClick }: { skills: Skill[], onNodeClick: (s: Skill) => void }) => {
    return (
        <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden animate-in fade-in duration-300">
            <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-white/40 text-xs uppercase font-bold">
                    <tr>
                        <th className="p-4">Title</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                    {skills.map(skill => (
                        <tr key={skill.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold">{skill.title}</td>
                            <td className="p-4">
                                <span className={`flex items-center gap-2`}>
                                    {CATEGORY_ICONS[skill.category]} {skill.category}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs border ${skill.status === 'Completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                    skill.status === 'In Progress' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                                        'bg-white/5 border-white/10 text-white/40'
                                    }`}>{skill.status}</span>
                            </td>
                            <td className="p-4 text-white/50">{new Date(skill.target_date).toLocaleDateString()}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => onNodeClick(skill)} className="text-blue-400 hover:underline">Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


// --- MAIN PAGE ---
export default function SkillNexus() {
    const [view, setView] = useState<'roadmap' | 'gallery' | 'table' | 'analytics'>('roadmap');
    const [skills, setSkills] = useState<Skill[]>([]);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'detail'>('create');
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form Fields
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('Backlog');
    const [category, setCategory] = useState('Frontend');
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState('');
    const [resourceLinks, setResourceLinks] = useState<ResourceLink[]>([]);
    const [attachments, setAttachments] = useState<FileList | null>(null);

    // Dynamic Link Inputs
    const [newLinkTitle, setNewLinkTitle] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');

    const fetchSkills = async () => {
        try {
            const records = await pb.collection('skills').getFullList({ sort: 'target_date' });
            // @ts-ignore
            setSkills(records);
        } catch (e) {
            console.log("Error loading skills:", e);
        }
    };

    useEffect(() => { fetchSkills(); }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('status', status);
        formData.append('category', category);
        formData.append('target_date', targetDate);
        formData.append('description', description);
        formData.append('icon', icon);
        formData.append('resource_links', JSON.stringify(resourceLinks));

        if (attachments) {
            for (let i = 0; i < attachments.length; i++) formData.append('attachments', attachments[i]);
        }

        try {
            if (modalMode === 'edit' && selectedSkill) {
                await pb.collection('skills').update(selectedSkill.id, formData);
                setModalMode('detail'); // Return to detail view after save
            } else {
                await pb.collection('skills').create(formData);
                setIsModalOpen(false);
            }
            fetchSkills();
        } catch (e) {
            console.error(e);
            alert("Save failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete milestone?")) return;
        await pb.collection('skills').delete(id);
        setIsModalOpen(false);
        fetchSkills();
    };

    const openCreate = () => {
        setTitle(''); setStatus('Backlog'); setCategory('Frontend');
        setTargetDate(new Date().toISOString().split('T')[0]); setDescription('');
        setIcon(''); setResourceLinks([]); setAttachments(null);
        setModalMode('create'); setIsModalOpen(true);
    };

    const openDetail = (skill: Skill) => {
        setTitle(skill.title); setStatus(skill.status); setCategory(skill.category);
        setTargetDate(skill.target_date.split('T')[0]); setDescription(skill.description);
        setIcon(skill.icon); setResourceLinks(skill.resource_links || []); setAttachments(null);
        setSelectedSkill(skill); setModalMode('detail'); setIsModalOpen(true);
    };

    const switchToEdit = () => {
        setModalMode('edit');
    };

    const addLink = () => {
        if (newLinkTitle && newLinkUrl) {
            setResourceLinks([...resourceLinks, { title: newLinkTitle, url: newLinkUrl }]);
            setNewLinkTitle(''); setNewLinkUrl('');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] font-sans selection:bg-purple-500 selection:text-white pb-20 relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-4 max-w-[1600px] mx-auto w-full relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                            Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Nexus</span>
                        </h1>
                        <p className="text-white/40 text-lg">Mastery is a journey, not a destination.</p>
                    </div>

                    <div className="flex bg-[#111] p-1 rounded-xl border border-white/10">
                        {[
                            { id: 'roadmap', icon: <LuMap />, label: 'Roadmap' },
                            { id: 'analytics', icon: <LuTrendingUp />, label: 'Analytics' },
                            { id: 'gallery', icon: <LuLayoutGrid />, label: 'Gallery' },
                            { id: 'table', icon: <LuList />, label: 'Table' },
                        ].map((v) => (
                            <button key={v.id} onClick={() => setView(v.id as any)}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${view === v.id ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>
                                {v.icon} {v.label}
                            </button>
                        ))}
                        <div className="w-[1px] h-6 bg-white/10 mx-2 self-center" />
                        <button onClick={openCreate} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">
                            <LuPlus /> Add
                        </button>
                    </div>
                </div>

                {/* VIEW PORT */}
                <AnimatePresence mode="wait">
                    <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        {view === 'roadmap' && <CosmicRoadmap skills={skills} onNodeClick={openDetail} />}
                        {view === 'analytics' && <AnalyticalView skills={skills} />}
                        {view === 'gallery' && <GalleryView skills={skills} onNodeClick={openDetail} />}
                        {view === 'table' && <TableView skills={skills} onNodeClick={openDetail} />}
                    </motion.div>
                </AnimatePresence>

                {/* --- MODAL --- */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-5xl p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/40 hover:text-white"><LuX size={24} /></button>

                                {modalMode === 'detail' && selectedSkill ? (
                                    // DETAIL READ-ONLY VIEW
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-6">
                                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[selectedSkill.category]} flex items-center justify-center text-5xl text-white shadow-2xl`}>
                                                {CATEGORY_ICONS[selectedSkill.category]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedSkill.status === 'Completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}>
                                                        {selectedSkill.status}
                                                    </span>
                                                    <span className="text-white/40 text-sm flex items-center gap-1"><LuCalendar size={14} /> {new Date(selectedSkill.target_date).toLocaleDateString()}</span>
                                                </div>
                                                <h2 className="text-4xl font-bold text-white mb-2">{selectedSkill.title}</h2>
                                                <p className="text-white/50 text-lg">{selectedSkill.category}</p>
                                            </div>
                                            <button onClick={switchToEdit} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold flex items-center gap-2 transition-colors">
                                                <LuPenTool size={16} /> Edit
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* Left: Notes */}
                                            <div className="md:col-span-2 space-y-4">
                                                <h3 className="text-xl font-bold text-white border-b border-white/10 pb-4">Deep Dive Notes</h3>
                                                <div className="prose prose-invert max-w-none text-white/70 bg-white/5 p-6 rounded-2xl border border-white/5">
                                                    {selectedSkill.description ? (
                                                        <div className="whitespace-pre-wrap">{selectedSkill.description}</div>
                                                    ) : (
                                                        <span className="italic opacity-50">No notes added yet.</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Resources & Meta */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h3 className="text-sm font-bold text-white/50 uppercase mb-4">Resources</h3>
                                                    {selectedSkill.resource_links?.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedSkill.resource_links.map((link, i) => (
                                                                <a key={i} href={link.url} target="_blank" className="block bg-white/5 hover:bg-blue-600/20 border border-white/10 rounded-xl p-3 transition-colors group">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300 truncate">{link.title}</span>
                                                                        <LuExternalLink className="text-white/20 group-hover:text-white/60" size={14} />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : <div className="text-white/20 text-sm">No links attached.</div>}
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-bold text-white/50 uppercase mb-4">Attachments</h3>
                                                    {selectedSkill.attachments?.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedSkill.attachments.map((file, i) => (
                                                                <a key={i} href={pb.files.getUrl(selectedSkill, file)} target="_blank" className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-3 py-2 rounded-lg border border-purple-500/20 text-xs transition-colors">
                                                                    <LuFile size={14} /> {file.substring(0, 15)}...
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : <div className="text-white/20 text-sm">No files uploaded.</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // EDIT / CREATE FORM
                                    <>
                                        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                                            {modalMode === 'create' ? <LuPlus className="text-purple-400" /> : <LuPenTool className="text-blue-400" />}
                                            {modalMode === 'create' ? 'New Milestone' : 'Edit Milestone'}
                                        </h2>

                                        <form onSubmit={handleSave} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                    {/* Left Column Inputs */}
                                                    <div><label className="label">Title</label><input required className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" /></div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><label className="label">Category</label><select className="input" value={category} onChange={e => setCategory(e.target.value)}>{Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                                        <div><label className="label">Target Date</label><input type="date" className="input" value={targetDate} onChange={e => setTargetDate(e.target.value)} /></div>
                                                    </div>
                                                    <div>
                                                        <label className="label">Status</label>
                                                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                                            {['Backlog', 'In Progress', 'Completed'].map(s => (
                                                                <button key={s} type="button" onClick={() => setStatus(s)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${status === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>{s}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="label">Deep Dive Notes</label>
                                                    <textarea className="input flex-1 resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Notes..." />
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-8">
                                                <div>
                                                    <label className="label">Links</label>
                                                    <div className="space-y-2 mb-3">
                                                        {resourceLinks.map((l, i) => (
                                                            <div key={i} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5 text-sm text-blue-400">
                                                                <LuExternalLink size={14} /> <a href={l.url} target="_blank" className="truncate flex-1 hover:underline">{l.title}</a>
                                                                <button type="button" onClick={() => setResourceLinks(resourceLinks.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400 p-1"><LuX size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <input className="input text-sm py-2" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} placeholder="Title" />
                                                        <input className="input text-sm py-2" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="URL" />
                                                        <button type="button" onClick={addLink} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white"><LuPlus /></button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="label">Attachments</label>
                                                    <div className="border-2 border-dashed border-white/10 hover:border-purple-500/50 rounded-xl p-6 text-center relative hover:bg-white/5 transition-all">
                                                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setAttachments(e.target.files)} />
                                                        <LuFile className="mx-auto text-2xl text-white/30 mb-2" />
                                                        <p className="text-xs text-white/50">{attachments ? `${attachments.length} files` : 'Upload Files'}</p>
                                                    </div>
                                                    {modalMode === 'edit' && selectedSkill?.attachments?.map((f, i) => (
                                                        <a key={i} href={pb.files.getUrl(selectedSkill, f)} target="_blank" className="inline-flex items-center gap-1 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded mt-2 mr-2 border border-purple-500/20 hover:bg-purple-500/20"><LuLink size={10} /> {f}</a>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                {modalMode === 'edit' && <button type="button" onClick={() => handleDelete(selectedSkill!.id)} className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold mr-auto"><LuTrash /></button>}
                                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl hover:bg-white/5 border border-white/10 text-white transition-colors">Cancel</button>
                                                <button type="submit" disabled={isLoading} className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40">{isLoading ? 'Saving...' : 'Save'}</button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <style>{`
                .label { display: block; color: rgba(255,255,255,0.4); font-size: 0.75rem; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .input { width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.75rem; padding: 0.75rem; color: white; outline: none; transition: all; }
                .input:focus { border-color: #a855f7; }
            `}</style>
        </div>
    );
}
