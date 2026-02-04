import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Trophy, Layout } from 'lucide-react';

const tabs = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'timetable', label: 'Timetable', icon: Clock },
    { id: 'results', label: 'Results', icon: Trophy },
];

export const StudentAcademicArea = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium uppercase">Current Term</p>
                    <p className="text-lg font-bold text-primary-600">Term 2</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium uppercase">Subjects</p>
                    <p className="text-lg font-bold text-primary-600">9 Enrolled</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium uppercase">Attendance</p>
                    <p className="text-lg font-bold text-green-600">98%</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                {/* Tabs */}
                <div className="flex items-center border-b border-slate-200 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors relative min-w-max ${activeTab === tab.id
                                    ? 'text-primary-600 bg-primary-50/50'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                    <h3 className="font-bold text-blue-900 text-lg mb-2">Welcome to Term 2! 🎒</h3>
                                    <p className="text-blue-700 leading-relaxed">
                                        We hope you had a restful break. This term is packed with exciting activities including the Inter-House Sports competition and Science Fair. Stay focused and do your best!
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                                        <span>Recent Notices</span>
                                        <button className="text-sm text-primary-600 font-medium hover:underline">View All</button>
                                    </h4>
                                    <div className="space-y-3">
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-primary-100 hover:shadow-sm transition-all bg-slate-50/50">
                                                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                                                    17 DEC
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-800">End of Year Party</h5>
                                                    <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                                                        The annual end of year celebration will be held this Friday. All students are expected to dress in their traditional wear.
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'subjects' && (
                            <motion.div
                                key="subjects"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-center py-20 text-slate-400">
                                    <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                    <p>Subjects list will appear here.</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'timetable' && (
                            <motion.div
                                key="timetable"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-center py-20 text-slate-400">
                                    <Clock className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                    <p>Your class timetable will load here.</p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-center py-20 text-slate-400">
                                    <Trophy className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                    <p>No new results available yet.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
