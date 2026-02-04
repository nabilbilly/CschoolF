import {
    Users, GraduationCap, School,
    FileText, AlertTriangle, TrendingUp,
    Calendar, CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminDashboard = () => {
    const stats = [
        { label: "Total Students", value: "2,543", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Teachers", value: "128", icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Active Classes", value: "45", icon: School, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Pending Admissions", value: "12", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
    ];

    const recentActivity = [
        { id: 1, action: "New Student Admission", detail: "Kwame Asante admitted to JHS 1", time: "2 mins ago", icon: CheckCircle, color: "text-emerald-500" },
        { id: 2, action: "Fee Payment", detail: "GH₵ 1,500 received from Ama Osei", time: "15 mins ago", icon: TrendingUp, color: "text-blue-500" },
        { id: 3, action: "Term Report locked", detail: "JHS 2 Terminal Reports locked by Admin", time: "1 hour ago", icon: AlertTriangle, color: "text-amber-500" },
        { id: 4, action: "New Staff Added", detail: "Mr. John Doe added as Science Teacher", time: "3 hours ago", icon: Users, color: "text-indigo-500" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-slate-500">Overview of school performance and activities.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-slate-800">Recent Activity</h2>
                        <button className="text-sm text-primary-600 hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                                <div className={`mt-1 bg-slate-100 p-2 rounded-full ${activity.color} bg-opacity-10`}>
                                    <activity.icon size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                                    <p className="text-sm text-slate-500">{activity.detail}</p>
                                </div>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Calendar / Notices */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="font-bold text-lg text-slate-800 mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <div className="bg-primary-50 text-primary-600 rounded-lg p-3 text-center min-w-[60px]">
                                <span className="text-xs font-bold uppercase block">Jan</span>
                                <span className="text-xl font-bold block">18</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">PTA Meeting</p>
                                <p className="text-xs text-slate-500">10:00 AM - Assembly Hall</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-amber-50 text-amber-600 rounded-lg p-3 text-center min-w-[60px]">
                                <span className="text-xs font-bold uppercase block">Jan</span>
                                <span className="text-xl font-bold block">25</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">Sports Day</p>
                                <p className="text-xs text-slate-500">All Day - Sports Field</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-indigo-50 text-indigo-600 rounded-lg p-3 text-center min-w-[60px]">
                                <span className="text-xs font-bold uppercase block">Feb</span>
                                <span className="text-xl font-bold block">02</span>
                            </div>
                            <div>
                                <p className="font-medium text-slate-800">Mid-Term Break</p>
                                <p className="text-xs text-slate-500">Feb 2 - Feb 5</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
