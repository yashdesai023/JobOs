import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import {
    LuBriefcase, LuFileText, LuRocket,
    LuTrendingUp, LuPlus, LuArrowRight, LuLayoutGrid,
    LuSearch, LuServer, LuBrain
} from 'react-icons/lu';

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalApplications: 0,
        interviews: 0,
        offers: 0,
        rejected: 0,
        totalJobsScouted: 0,
        totalResumes: 0,
        totalProjects: 0,
        nexusSkills: 0,
        nexusCompleted: 0,
        totalBlogs: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetch for speed
                const [
                    appsResult,
                    jobsResult,
                    resumesResult,
                    projectsResult,
                    skillsResult,
                    blogsResult
                ] = await Promise.all([
                    pb.collection('applications').getFullList({ sort: '-created', requestKey: null }),
                    pb.collection('job_reports').getList(1, 1, { requestKey: null }),
                    pb.collection('resumes').getList(1, 1, { requestKey: null }),
                    pb.collection('projects').getList(1, 1, { requestKey: null }),
                    pb.collection('skills').getFullList({ requestKey: null }),
                    pb.collection('blogs').getList(1, 1, { requestKey: null })
                ]);

                const apps = appsResult;
                const skills = skillsResult;

                setStats({
                    totalApplications: apps.length,
                    interviews: apps.filter(a => a.status === 'Interview').length,
                    offers: apps.filter(a => a.status === 'Offer').length,
                    rejected: apps.filter(a => a.status === 'Rejected').length,
                    totalJobsScouted: jobsResult.totalItems,
                    totalResumes: resumesResult.totalItems,
                    totalProjects: projectsResult.totalItems,
                    nexusSkills: skills.length,
                    nexusCompleted: skills.filter(s => s.status === 'Completed').length,
                    totalBlogs: blogsResult.totalItems
                });

                setRecentActivity(apps.slice(0, 5));

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const interviewRate = stats.totalApplications > 0
        ? Math.round((stats.interviews / stats.totalApplications) * 100)
        : 0;

    const skillProgress = stats.nexusSkills > 0
        ? Math.round((stats.nexusCompleted / stats.nexusSkills) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-void relative text-white font-body selection:bg-aurora-purple selection:text-white pb-32">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-aurora-purple/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aurora-cyan/5 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="relative z-10 pt-32 px-6 md:px-12 max-w-[1600px] mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-[0.3em] text-aurora-cyan mb-2 block">// Command Center</span>
                            <h1 className="text-4xl md:text-6xl font-display font-medium tracking-tight">
                                WELCOME BACK, <span className="text-white/40">HUNTER.</span>
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <Link to="/tracker" className="flex-1 md:flex-none px-6 py-3 border border-white/10 hover:bg-white hover:text-black rounded-lg font-mono text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <LuPlus className="text-sm" /> Track App
                            </Link>
                            <Link to="/hunter" className="flex-1 md:flex-none px-6 py-3 bg-white text-black hover:bg-white/90 rounded-lg font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                <LuRocket /> Launch Hunter
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {/* Stat Card 1 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-aurora-purple/50 transition-colors duration-500">
                            <div className="absolute right-[-20px] top-[-20px] p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <LuBriefcase className="text-9xl text-white" />
                            </div>
                            <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Pipeline Volume</h3>
                            <div className="text-5xl font-display font-medium text-white mb-2">{stats.totalApplications}</div>
                            <div className="text-aurora-cyan text-xs font-mono flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-aurora-cyan rounded-full animate-pulse" /> Live Tracking
                            </div>
                        </motion.div>

                        {/* Stat Card 2 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-aurora-fuchsia/50 transition-colors duration-500">
                            <div className="absolute right-[-20px] top-[-20px] p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <LuTrendingUp className="text-9xl text-aurora-fuchsia" />
                            </div>
                            <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Success Rate</h3>
                            <div className="text-5xl font-display font-medium text-white mb-2">{interviewRate}%</div>
                            <div className="text-aurora-fuchsia text-xs font-mono">
                                {stats.interviews} Interviews Secured
                            </div>
                        </motion.div>

                        {/* Stat Card 3 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-aurora-purple/50 transition-colors duration-500">
                            <div className="absolute right-[-20px] top-[-20px] p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <LuBrain className="text-9xl text-aurora-purple" />
                            </div>
                            <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Skill Mastery</h3>
                            <div className="text-5xl font-display font-medium text-white mb-2">{skillProgress}%</div>
                            <div className="text-aurora-purple text-xs font-mono">
                                {stats.nexusCompleted}/{stats.nexusSkills} Milestones
                            </div>
                        </motion.div>

                        {/* Stat Card 4 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-xl p-8 relative overflow-hidden group hover:border-emerald-500/50 transition-colors duration-500">
                            <div className="absolute right-[-20px] top-[-20px] p-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <LuServer className="text-9xl text-emerald-500" />
                            </div>
                            <h3 className="text-white/40 text-[10px] font-mono uppercase tracking-[0.2em] mb-4">Asset Database</h3>
                            <div className="text-5xl font-display font-medium text-white mb-2">{stats.totalResumes + stats.totalProjects}</div>
                            <div className="text-emerald-500 text-xs font-mono">
                                Projects & Documents
                            </div>
                        </motion.div>

                        {/* Stat Card 5 - Blogs */}
                        {/* Adding grid-col-span or hiding content hub if 4 col grid. Let's keep it consistent or remove. Removed to keep 4-col balance. Or add as extra. */}
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Recent Activity List */}
                        <motion.div variants={itemVariants} className="lg:col-span-2">
                            <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                                <h3 className="text-xl font-display font-medium text-white flex items-center gap-2">Recent Activity</h3>
                                <Link to="/tracker" className="text-white/40 hover:text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-colors group">
                                    View All <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="space-y-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
                                {loading ? (
                                    <div className="text-center py-12 text-white/30 animate-pulse font-mono text-xs bg-void">Loading activity...</div>
                                ) : recentActivity.length === 0 ? (
                                    <div className="text-center py-12 text-white/30 font-mono text-xs bg-void">No activity yet. Start tracking!</div>
                                ) : (
                                    recentActivity.map((app) => (
                                        <div key={app.id} className="group bg-void hover:bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center font-display font-bold text-lg text-white/60 group-hover:text-white group-hover:border-white/40 transition-all">
                                                    {app.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-display font-medium text-white text-lg">{app.company}</h4>
                                                    <p className="text-xs text-white/40 font-mono uppercase tracking-wider">{app.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border
                                                    ${app.status === 'Applied' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                                                        app.status === 'Interview' ? 'bg-aurora-purple/10 border-aurora-purple/20 text-aurora-purple' :
                                                            app.status === 'Offer' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                                                                app.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-white/5 border-white/10 text-white/60'}
                                                `}>
                                                    {app.status}
                                                </span>
                                                <span className="text-[10px] text-white/20 font-mono">{new Date(app.date_applied).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Actions / Shortcuts */}
                        <motion.div variants={itemVariants} className="space-y-8">

                            {/* Shortcuts Panel */}
                            <div className="border border-white/10 rounded-xl p-8 bg-white/[0.02]">
                                <h3 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6 flex items-center gap-2"><LuLayoutGrid /> Quick Launch</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <Link to="/manager/resumes" className="hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-lg p-4 flex items-center gap-4 transition-all group">
                                        <LuFileText className="text-white/40 group-hover:text-aurora-purple transition-colors" />
                                        <span className="text-sm font-body text-white/80 group-hover:text-white">Resumes Database</span>
                                    </Link>
                                    <Link to="/dashboard/blogs/new" className="hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-lg p-4 flex items-center gap-4 transition-all group">
                                        <LuFileText className="text-white/40 group-hover:text-aurora-purple transition-colors" />
                                        <span className="text-sm font-body text-white/80 group-hover:text-white">New Blog Draft</span>
                                    </Link>
                                    <Link to="/nexus" className="hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-lg p-4 flex items-center gap-4 transition-all group">
                                        <LuBrain className="text-white/40 group-hover:text-aurora-purple transition-colors" />
                                        <span className="text-sm font-body text-white/80 group-hover:text-white">Skill Nexus</span>
                                    </Link>
                                    <Link to="/hunter" className="hover:bg-white/5 border border-white/5 hover:border-white/20 rounded-lg p-4 flex items-center gap-4 transition-all group">
                                        <LuSearch className="text-white/40 group-hover:text-aurora-purple transition-colors" />
                                        <span className="text-sm font-body text-white/80 group-hover:text-white">Job Hunter</span>
                                    </Link>
                                </div>
                            </div>

                            {/* System Status Visual */}
                            <div className="border border-white/10 rounded-xl p-8 bg-white/[0.02] relative overflow-hidden">
                                <h3 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6 relative z-10 flex items-center gap-2"><LuServer /> System Health</h3>
                                <div className="space-y-6 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                                            <span>DB Capacity</span>
                                            <span className="text-emerald-400">Optimal</span>
                                        </div>
                                        <div className="h-1 bg-white/10 w-full">
                                            <div className="h-full bg-emerald-500 w-[35%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2">
                                            <span>Hunter API</span>
                                            <span className="text-blue-400">Active</span>
                                        </div>
                                        <div className="h-1 bg-white/10 w-full">
                                            <div className="h-full bg-blue-500 w-[62%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
