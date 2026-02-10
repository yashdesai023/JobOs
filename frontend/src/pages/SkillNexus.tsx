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
    'Backend': 'from-emerald-400 to-green-600',
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
    const sorted = [...skills].sort((a, b) => new Date(a.target_date).getTime() - new Date(b.target_date).getTime());

    if (sorted.length === 0) return <div className="text-white/30 text-center py-20 font-mono text-xs uppercase tracking-widest bg-white/[0.02] border border-white/10 rounded-sm">No milestones yet.</div>;

    const gap = 300;
    const height = 500;
    const width = Math.max(window.innerWidth, (sorted.length + 1) * gap);

    const points = sorted.map((_, i) => ({
        x: (i + 1) * gap,
        y: height / 2 + Math.sin(i * 0.8) * 100 * (i % 2 === 0 ? 1 : -1)
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
        <div className="relative w-full h-[500px] overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden bg-void border border-white/10 cursor-grab active:cursor-grabbing">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

            <div style={{ width: `${width}px`, height: '500px' }} className="relative flex items-center">
                <svg width={width} height="500" className="absolute top-0 left-0 pointer-events-none">
                    <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <path d={pathD} stroke="url(#lineGradient)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                </svg>

                {points.map((p, i) => {
                    const skill = sorted[i];
                    const isCompleted = skill.status === 'Completed';

                    return (
                        <motion.button
                            key={skill.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: i * 0.1 }}
                            onClick={() => onNodeClick(skill)}
                            className="absolute group z-10"
                            style={{ left: p.x - 24, top: p.y - 24 }}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl relative transition-all duration-300 bg-void border
                                ${isCompleted ? 'border-emerald-500 text-emerald-400' : 'border-white/20 text-white/40 group-hover:border-white group-hover:text-white'}
                            `}>
                                {CATEGORY_ICONS[skill.category]}
                            </div>

                            <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
                                <p className="font-mono text-xs uppercase tracking-wider text-white mb-1 group-hover:text-aurora-cyan transition-colors">{skill.title}</p>
                                <span className="text-[10px] font-mono text-white/30">
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

    const categories: any = {};
    skills.forEach(s => { categories[s.category] = (categories[s.category] || 0) + 1 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {/* Progress Circle */}
            <div className="bg-void p-12 flex flex-col items-center justify-center relative hover:bg-white/[0.02] transition-colors">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="80" cy="80" r="70" className="text-white/5" strokeWidth="8" fill="none" stroke="currentColor" />
                        <circle cx="80" cy="80" r="70" className="text-emerald-500" strokeWidth="8" fill="none" stroke="currentColor"
                            strokeDasharray={2 * Math.PI * 70}
                            strokeDashoffset={2 * Math.PI * 70 * (1 - completed / total || 0)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-display font-medium text-white">{Math.round((completed / total || 0) * 100)}%</span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Mastery</span>
                    </div>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-rows-3 divide-y divide-white/10">
                <div className="bg-void p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                        <p className="text-aurora-purple text-[10px] font-mono uppercase tracking-widest mb-1">In Focus</p>
                        <h3 className="text-3xl font-display font-medium text-white">{progress}</h3>
                    </div>
                    <LuBrain className="text-2xl text-white/20" />
                </div>
                <div className="bg-void p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                        <p className="text-blue-400 text-[10px] font-mono uppercase tracking-widest mb-1">Backlog</p>
                        <h3 className="text-3xl font-display font-medium text-white">{backlog}</h3>
                    </div>
                    <LuClock className="text-2xl text-white/20" />
                </div>
                <div className="bg-void p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div>
                        <p className="text-emerald-400 text-[10px] font-mono uppercase tracking-widest mb-1">Completed</p>
                        <h3 className="text-3xl font-display font-medium text-white">{completed}</h3>
                    </div>
                    <LuCheck className="text-2xl text-white/20" />
                </div>
            </div>

            {/* Categories Bar */}
            <div className="bg-void p-8 hover:bg-white/[0.02] transition-colors">
                <h3 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-8 flex items-center gap-2"><LuTrendingUp /> Distribution</h3>
                <div className="space-y-6">
                    {Object.entries(categories).map(([cat, count]: any) => (
                        <div key={cat}>
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                                <span>{cat}</span>
                                <span>{count}</span>
                            </div>
                            <div className="h-px bg-white/10 w-full">
                                <div className={`h-full bg-white opacity-80`} style={{ width: `${(count / total) * 100}%` }} />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {skills.map(skill => (
                <div key={skill.id} onClick={() => onNodeClick(skill)}
                    className="bg-void p-8 cursor-pointer group hover:bg-white/[0.02] transition-colors relative">
                    <div className="flex justify-between items-start mb-6">
                        <div className="text-white/40 group-hover:text-aurora-cyan transition-colors">
                            {CATEGORY_ICONS[skill.category]}
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 border font-mono uppercase tracking-widest
                            ${skill.status === 'Completed' ? 'text-emerald-400 border-emerald-500/20' :
                                skill.status === 'In Progress' ? 'text-aurora-purple border-aurora-purple/20' :
                                    'text-white/40 border-white/10'}`}>
                            {skill.status}
                        </span>
                    </div>
                    <h3 className="font-display font-medium text-lg text-white mb-2 group-hover:translate-x-1 transition-transform">{skill.title}</h3>
                    <div className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                        Target: {new Date(skill.target_date).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
};

// 4. TABLE VIEW
const TableView = ({ skills, onNodeClick }: { skills: Skill[], onNodeClick: (s: Skill) => void }) => {
    return (
        <div className="border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="text-[10px] uppercase font-mono tracking-widest text-white/40 border-b border-white/10">
                        <th className="p-6 font-normal">Title</th>
                        <th className="p-6 font-normal">Category</th>
                        <th className="p-6 font-normal">Status</th>
                        <th className="p-6 font-normal">Date</th>
                        <th className="p-6 font-normal text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                    {skills.map(skill => (
                        <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 font-display font-medium text-white">{skill.title}</td>
                            <td className="p-6 font-mono text-xs uppercase tracking-wider text-white/60">
                                {skill.category}
                            </td>
                            <td className="p-6">
                                <span className={`text-[10px] px-2 py-0.5 border font-mono uppercase tracking-widest
                                    ${skill.status === 'Completed' ? 'text-emerald-400 border-emerald-500/20' :
                                        skill.status === 'In Progress' ? 'text-aurora-purple border-aurora-purple/20' :
                                            'text-white/40 border-white/10'
                                    }`}>{skill.status}</span>
                            </td>
                            <td className="p-6 text-white/40 font-mono text-xs">{new Date(skill.target_date).toLocaleDateString()}</td>
                            <td className="p-6 text-right">
                                <button onClick={() => onNodeClick(skill)} className="text-white/20 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-colors">Edit</button>
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
                setModalMode('detail');
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
        <div className="min-h-screen bg-void font-body text-white selection:bg-aurora-purple selection:text-white pb-32 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-aurora-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="pt-32 px-6 md:px-12 max-w-[1600px] mx-auto w-full relative z-10">

                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">
                            // Skill Tree
                        </span>
                        <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight text-white mb-2">
                            SKILL <span className="text-white/40">NEXUS</span>
                        </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {[
                            { id: 'roadmap', icon: <LuMap />, label: 'Path' },
                            { id: 'analytics', icon: <LuTrendingUp />, label: 'Data' },
                            { id: 'gallery', icon: <LuLayoutGrid />, label: 'Grid' },
                            { id: 'table', icon: <LuList />, label: 'List' },
                        ].map((v) => (
                            <button key={v.id} onClick={() => setView(v.id as any)}
                                className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all flex items-center gap-2
                                ${view === v.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:text-white'}`}>
                                {v.icon} {v.label}
                            </button>
                        ))}
                        <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />
                        <button onClick={openCreate} className="px-6 py-2 bg-aurora-purple text-white hover:bg-aurora-purple/80 font-mono text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
                            <LuPlus /> Add Node
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
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-void/90 backdrop-blur-sm">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-void border border-white/10 w-full max-w-5xl p-12 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
                                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><LuX size={24} /></button>

                                {modalMode === 'detail' && selectedSkill ? (
                                    // DETAIL READ-ONLY VIEW
                                    <div className="space-y-12">
                                        <div className="flex flex-col md:flex-row items-start gap-8 border-b border-white/10 pb-8">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className={`px-3 py-1 border text-[10px] font-mono uppercase tracking-widest
                                                        ${selectedSkill.status === 'Completed' ? 'border-emerald-500/20 text-emerald-400' : 'border-white/10 text-white/40'}`}>
                                                        {selectedSkill.status}
                                                    </span>
                                                    <span className="text-white/40 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                                                        <LuCalendar size={12} /> {new Date(selectedSkill.target_date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-2">{selectedSkill.title}</h2>
                                                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">// {selectedSkill.category}</p>
                                            </div>
                                            <button onClick={switchToEdit} className="px-6 py-2 border border-white/10 hover:bg-white hover:text-black text-white text-xs font-mono uppercase tracking-widest transition-all flex items-center gap-2">
                                                <LuPenTool size={14} /> Edit Mode
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                            {/* Left: Notes */}
                                            <div className="md:col-span-2 space-y-8">
                                                <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest">Deep Dive Notes</h3>
                                                <div className="prose prose-invert max-w-none text-white/70 font-light leading-relaxed">
                                                    {selectedSkill.description ? (
                                                        <div className="whitespace-pre-wrap">{selectedSkill.description}</div>
                                                    ) : (
                                                        <span className="italic opacity-50 font-mono text-xs">No notes added.</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Right: Resources & Meta */}
                                            <div className="space-y-8 border-l border-white/10 pl-8">
                                                <div>
                                                    <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Resources</h3>
                                                    {selectedSkill.resource_links?.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {selectedSkill.resource_links.map((link, i) => (
                                                                <a key={i} href={link.url} target="_blank" className="block text-sm text-white/60 hover:text-white border-b border-white/10 pb-2 transition-colors group">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="truncate flex-1">{link.title}</span>
                                                                        <LuExternalLink className="text-white/20 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all" size={12} />
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : <div className="text-white/20 text-xs font-mono">No links attached.</div>}
                                                </div>

                                                <div>
                                                    <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-widest mb-4">Attachments</h3>
                                                    {selectedSkill.attachments?.length > 0 ? (
                                                        <div className="flex flex-col gap-2">
                                                            {selectedSkill.attachments.map((file, i) => (
                                                                <a key={i} href={pb.files.getUrl(selectedSkill, file)} target="_blank" className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
                                                                    <LuFile size={12} /> {file.substring(0, 20)}...
                                                                </a>
                                                            ))}
                                                        </div>
                                                    ) : <div className="text-white/20 text-xs font-mono">No files uploaded.</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // EDIT / CREATE FORM
                                    <>
                                        <div className="mb-12 border-b border-white/10 pb-6">
                                            <span className="text-aurora-cyan text-[10px] font-mono uppercase tracking-widest mb-2 block">// {modalMode === 'create' ? 'Initialize' : 'Modify'} Node</span>
                                            <h2 className="text-3xl font-display font-medium text-white">
                                                {modalMode === 'create' ? 'New Milestone' : 'Edit Milestone'}
                                            </h2>
                                        </div>

                                        <form onSubmit={handleSave} className="space-y-12">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    {/* Left Column Inputs */}
                                                    <div className="group">
                                                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Title</label>
                                                        <input required className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-display text-xl placeholder:text-white/10" value={title} onChange={e => setTitle(e.target.value)} placeholder="Node Title" />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-8">
                                                        <div className="group">
                                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Category</label>
                                                            <select className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-xs uppercase appearance-none cursor-pointer" value={category} onChange={e => setCategory(e.target.value)}>{Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c} className="text-black">{c}</option>)}</select>
                                                        </div>
                                                        <div className="group">
                                                            <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Target Date</label>
                                                            <input type="date" className="w-full bg-transparent border-b border-white/20 pb-2 text-white outline-none focus:border-aurora-purple transition-colors font-mono text-xs uppercase" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
                                                        </div>
                                                    </div>

                                                    <div className="group">
                                                        <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 block">Status</label>
                                                        <div className="flex gap-4">
                                                            {['Backlog', 'In Progress', 'Completed'].map(s => (
                                                                <button key={s} type="button" onClick={() => setStatus(s)}
                                                                    className={`px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all
                                                                    ${status === s ? 'text-white border-white' : 'text-white/40 border-white/10 hover:border-white/40'}`}>
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="group h-full flex flex-col">
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-2 block group-focus-within:text-white">Deep Dive Notes</label>
                                                    <textarea className="flex-1 w-full bg-white/[0.02] border border-white/10 p-4 text-white outline-none focus:border-aurora-purple transition-colors font-body text-sm resize-none" value={description} onChange={e => setDescription(e.target.value)} placeholder="Technical details..." />
                                                </div>
                                            </div>

                                            {/* Resources */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-12">
                                                <div>
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 block">Links Library</label>
                                                    <div className="space-y-4 mb-6">
                                                        {resourceLinks.map((l, i) => (
                                                            <div key={i} className="flex items-center gap-4 text-sm text-white/80 border-b border-white/5 pb-2">
                                                                <a href={l.url} target="_blank" className="truncate flex-1 hover:text-aurora-cyan transition-colors">{l.title}</a>
                                                                <button type="button" onClick={() => setResourceLinks(resourceLinks.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400"><LuX size={14} /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <input className="bg-transparent border-b border-white/10 pb-1 text-white text-xs font-mono placeholder:text-white/20 w-1/3" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} placeholder="Title" />
                                                        <input className="bg-transparent border-b border-white/10 pb-1 text-white text-xs font-mono placeholder:text-white/20 flex-1" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="URL" />
                                                        <button type="button" onClick={addLink} className="text-white/40 hover:text-white"><LuPlus /></button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-4 block">File Attachments</label>
                                                    <div className="border border-dashed border-white/20 hover:border-white/50 p-8 text-center relative transition-all group cursor-pointer">
                                                        <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setAttachments(e.target.files)} />
                                                        <LuFile className="mx-auto text-2xl text-white/20 group-hover:text-white/60 mb-2 transition-colors" />
                                                        <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white/60">{attachments ? `${attachments.length} files selected` : 'Drop files or click to upload'}</p>
                                                    </div>
                                                    {modalMode === 'edit' && selectedSkill?.attachments?.map((f, i) => (
                                                        <div key={i} className="text-[10px] font-mono text-white/40 mt-2 flex items-center gap-2">
                                                            <LuLink size={10} /> {f}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-8 border-t border-white/10">
                                                {modalMode === 'edit' ? (
                                                    <button type="button" onClick={() => handleDelete(selectedSkill!.id)} className="text-white/20 hover:text-red-500 font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2"><LuTrash /> Delete Node</button>
                                                ) : <div />}

                                                <div className="flex gap-6">
                                                    <button type="button" onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">Cancel</button>
                                                    <button type="submit" disabled={isLoading} className="bg-white text-black hover:bg-white/90 px-8 py-3 font-mono text-xs uppercase tracking-widest font-bold transition-all">
                                                        {isLoading ? 'Processing...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
