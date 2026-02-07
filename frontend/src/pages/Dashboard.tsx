import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { pb } from '../lib/pocketbase';
import {
    LuBriefcase, LuFileText, LuRocket,
    LuTrendingUp, LuPlus, LuArrowRight, LuLayoutGrid,
    LuSearch, LuServer, LuBrain, LuActivity, LuClock
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
        <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white selection:bg-purple-500 selection:text-white pb-20">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <div className="relative z-10 pt-32 px-4 md:px-8 max-w-[1600px] mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                Good Afternoon, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Hunter</span>
                            </h1>
                            <p className="text-white/40 font-medium text-lg flex items-center gap-2">
                                <LuActivity className="text-green-400" /> Systems Operational
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full md:w-auto">
                            <Link to="/tracker" className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-md">
                                <LuPlus className="text-sm" /> Track App
                            </Link>
                            <Link to="/hunter" className="flex-1 md:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center justify-center gap-2">
                                <LuRocket /> Launch Hunter
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Stat Card 1 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LuBriefcase className="text-6xl text-white" />
                            </div>
                            <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Pipeline Volume</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.totalApplications}</div>
                            <div className="text-green-400 text-xs font-mono flex items-center gap-1 bg-green-500/10 w-fit px-2 py-1 rounded">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live Tracking
                            </div>
                        </motion.div>

                        {/* Stat Card 2 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LuTrendingUp className="text-6xl text-purple-500" />
                            </div>
                            <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Success Rate</h3>
                            <div className="text-4xl font-bold text-white mb-2">{interviewRate}%</div>
                            <div className="text-purple-400 text-xs font-mono bg-purple-500/10 w-fit px-2 py-1 rounded">
                                {stats.interviews} Interviews Secured
                            </div>
                        </motion.div>

                        {/* Stat Card 3 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LuBrain className="text-6xl text-pink-500" />
                            </div>
                            <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Skill Mastery</h3>
                            <div className="text-4xl font-bold text-white mb-2">{skillProgress}%</div>
                            <div className="text-pink-400 text-xs font-mono bg-pink-500/10 w-fit px-2 py-1 rounded">
                                {stats.nexusCompleted}/{stats.nexusSkills} Milestones
                            </div>
                        </motion.div>

                        {/* Stat Card 4 */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LuServer className="text-6xl text-blue-500" />
                            </div>
                            <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Asset Database</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.totalResumes + stats.totalProjects}</div>
                            <div className="text-blue-400 text-xs font-mono bg-blue-500/10 w-fit px-2 py-1 rounded">
                                Projects & Documents
                            </div>
                        </motion.div>

                        {/* Stat Card 5 - Blogs */}
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group backdrop-blur-xl hover:bg-white/10 transition-colors">
                            <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <LuFileText className="text-6xl text-orange-500" />
                            </div>
                            <h3 className="text-white/40 text-xs uppercase tracking-widest font-bold mb-4">Content Hub</h3>
                            <div className="text-4xl font-bold text-white mb-2">{stats.totalBlogs}</div>
                            <div className="text-orange-400 text-xs font-mono bg-orange-500/10 w-fit px-2 py-1 rounded">
                                Published Articles
                            </div>
                        </motion.div>
                    </div>

                    {/* Main Content Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Recent Activity List */}
                        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2"><LuActivity /> Recent Pipeline Activity</h3>
                                <Link to="/tracker" className="text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors">
                                    View All <LuArrowRight className="text-xs" />
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-12 text-white/30 animate-pulse">Loading activity...</div>
                                ) : recentActivity.length === 0 ? (
                                    <div className="text-center py-12 text-white/30">No activity yet. Start tracking!</div>
                                ) : (
                                    recentActivity.map((app) => (
                                        <div key={app.id} className="group bg-black/20 hover:bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg
                                                    ${app.status === 'Applied' ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white' :
                                                        app.status === 'Interview' ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' :
                                                            app.status === 'Offer' ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                                                                app.status === 'Rejected' ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white' : 'bg-white/10 text-white'}
                                                `}>
                                                    {app.company.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-lg">{app.company}</h4>
                                                    <p className="text-xs text-white/50 font-medium">{app.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border
                                                    ${app.status === 'Applied' ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' :
                                                        app.status === 'Interview' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' :
                                                            app.status === 'Offer' ? 'bg-green-500/10 border-green-500/20 text-green-300' :
                                                                app.status === 'Rejected' ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-white/5 border-white/10 text-white/60'}
                                                `}>
                                                    {app.status}
                                                </span>
                                                <span className="text-xs text-white/30 flex items-center gap-1"><LuClock size={10} /> {new Date(app.date_applied).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Actions / Shortcuts */}
                        <motion.div variants={itemVariants} className="space-y-6">

                            {/* Shortcuts Panel */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><LuLayoutGrid /> Quick Launch</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/manager/resumes" className="bg-black/20 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 rounded-xl p-3 flex items-center gap-3 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LuFileText className="text-lg text-purple-400" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80">Resumes</span>
                                    </Link>
                                    <Link to="/dashboard/blogs/new" className="bg-black/20 hover:bg-green-500/20 border border-white/5 hover:border-green-500/30 rounded-xl p-3 flex items-center gap-3 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LuFileText className="text-lg text-green-400" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80">Add Blog</span>
                                    </Link>
                                    <Link to="/nexus" className="bg-black/20 hover:bg-pink-500/20 border border-white/5 hover:border-pink-500/30 rounded-xl p-3 flex items-center gap-3 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LuBrain className="text-lg text-pink-400" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80">Nexus</span>
                                    </Link>
                                    <Link to="/hunter" className="bg-black/20 hover:bg-blue-500/20 border border-white/5 hover:border-blue-500/30 rounded-xl p-3 flex items-center gap-3 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LuSearch className="text-lg text-blue-400" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80">Hunter</span>
                                    </Link>
                                    <Link to="/playground" className="bg-black/20 hover:bg-orange-500/20 border border-white/5 hover:border-orange-500/30 rounded-xl p-3 flex items-center gap-3 transition-all group">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <LuRocket className="text-lg text-orange-400" />
                                        </div>
                                        <span className="text-xs font-bold text-white/80">Lab</span>
                                    </Link>
                                </div>
                            </div>

                            {/* System Status Visual */}
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden">
                                <h3 className="text-lg font-bold text-white mb-4 relative z-10 flex items-center gap-2"><LuServer /> System Health</h3>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-xs text-white/60 mb-1">
                                            <span>Database Capacity</span>
                                            <span className="text-green-400">Optimal</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 w-[35%] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-white/60 mb-1">
                                            <span>Hunter API Quota</span>
                                            <span className="text-blue-400">Active</span>
                                        </div>
                                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-600 w-[62%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
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
