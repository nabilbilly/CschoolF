import { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, Filter, Edit2, Trash2,
    GraduationCap, ShieldAlert
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/common/Button';
import type { ClassRoom } from '../../../services/academicsService';
import { academicsService } from '../../../services/academicsService';
import { ClassManageModal } from './ClassManageModal';

export const AdminClassManager = () => {
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string | 'All'>('All');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const data = await academicsService.getClasses();
            setClasses(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch classes');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const filteredClasses = useMemo(() => {
        return classes.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
            return matchesSearch && matchesLevel;
        });
    }, [classes, searchQuery, selectedLevel]);

    const handleEdit = (classRoom: ClassRoom) => {
        setSelectedClass(classRoom);
        setIsModalOpen(true);
    };

    const handleDelete = async (classRoom: ClassRoom) => {
        const confirmMsg = `Are you sure you want to delete ${classRoom.name}? This will remove all associated streams.`;
        if (window.confirm(confirmMsg)) {
            try {
                await academicsService.deleteClass(classRoom.id);
                fetchClasses();
            } catch (err: any) {
                alert(err.message || 'Failed to delete class. If students are attached, consider archiving instead.');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <GraduationCap className="text-primary-600" />
                        Classes & Streams
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                        Create classes, set level, and manage streams (A, B, C) used in admissions, timetables, and results.
                    </p>
                </div>
                <Button onClick={() => { setSelectedClass(null); setIsModalOpen(true); }} className="shadow-lg shadow-primary-200">
                    <Plus size={20} className="mr-2" />
                    New Class
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-3 shadow-sm">
                    <ShieldAlert size={20} className="shrink-0" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Action & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by class name (e.g. JHS 2)..."
                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[120px]"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Primary">Primary</option>
                        <option value="JHS">JHS</option>
                        <option value="SHS">SHS</option>
                    </select>
                </div>
            </div>

            {/* Main Content: Class Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-separate border-spacing-0">
                        <thead className="bg-slate-50/80 border-b border-slate-200 backdrop-blur-sm sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Class Name</th>
                                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Level</th>
                                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Streams</th>
                                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-5">
                                            <div className="h-4 bg-slate-100 rounded-md w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredClasses.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="max-w-[200px] mx-auto text-slate-400 flex flex-col items-center gap-3">
                                            <Search size={40} className="opacity-20" />
                                            <p className="italic">No classes found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredClasses.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-default"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border",
                                                item.level === 'Primary' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                    item.level === 'JHS' ? "bg-purple-50 text-purple-700 border-purple-100" :
                                                        "bg-indigo-50 text-indigo-700 border-indigo-100"
                                            )}>
                                                {item.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.streams && item.streams.length > 0 ? (
                                                    item.streams.map(stream => (
                                                        <span
                                                            key={stream.id}
                                                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[11px] font-medium border border-slate-200"
                                                        >
                                                            {stream.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">No streams</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Safety Hint */}
            <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-4 flex items-start gap-4 text-primary-900 shadow-sm">
                <div className="p-2 bg-primary-100 rounded-lg text-primary-600 shrink-0">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold">Management Rules</p>
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">
                        Classes cannot be deleted if they have active students attached.
                        Stream names must be unique within a class. Duplicate classes in the same level are prevented.
                    </p>
                </div>
            </div>

            <ClassManageModal
                isOpen={isModalOpen}
                classRoom={selectedClass}
                onClose={() => { setIsModalOpen(false); setSelectedClass(null); }}
                onSave={fetchClasses}
            />
        </div>
    );
};
