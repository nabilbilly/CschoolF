import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Calendar, Filter, Plus, Edit2, Trash2, X, Check, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// Mock Data
const teachers = [
    { id: 't1', name: 'Mr. David Osei', subjects: ['Mathematics', 'Science'] },
    { id: 't2', name: 'Ms. Sarah Mensah', subjects: ['English', 'Social Studies'] },
    { id: 't3', name: 'Mr. Kwame Boateng', subjects: ['ICT', 'Mathematics'] },
];

const classes = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
const subjects = ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT', 'Religious & Moral Education', 'Creative Arts', 'French', 'Ghanaian Language'];
const periods = ['8:00 - 8:45', '8:45 - 9:30', '9:30 - 10:15', '10:45 - 11:30', '11:30 - 12:15', '12:15 - 1:00', '1:00 - 1:45', '1:45 - 2:30'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mock Initial Timetable
const initialTimetable = [
    { id: 'l1', day: 'Monday', periodIndex: 0, subject: 'Mathematics', class: 'Primary 5', teacherId: 't1' },
    { id: 'l2', day: 'Monday', periodIndex: 1, subject: 'Science', class: 'JHS 1', teacherId: 't1' },
    { id: 'l3', day: 'Tuesday', periodIndex: 2, subject: 'Mathematics', class: 'Primary 6', teacherId: 't1' },
    { id: 'l4', day: 'Wednesday', periodIndex: 0, subject: 'Science', class: 'JHS 2', teacherId: 't1' },
];

export const HeadTeacherTimetableManager = () => {
    // Top Level Filters
    const [selectedYear, setSelectedYear] = useState('2025/2026');
    const [selectedTerm, setSelectedTerm] = useState('1');
    const [selectedTeacherId, setSelectedTeacherId] = useState('t1');

    // Timetable State
    const [timetable, setTimetable] = useState(initialTimetable);

    // Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any>(null); // null means new lesson
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, periodIndex: number } | null>(null);

    // Form State inside Modal
    const [editForm, setEditForm] = useState({
        subject: '',
        class: '',
        teacherId: ''
    });

    // Loading State
    const [isLoading, setIsLoading] = useState(false);

    // Effect to reset form when modal opens
    useEffect(() => {
        if (isModalOpen) {
            if (editingLesson) {
                setEditForm({
                    subject: editingLesson.subject,
                    class: editingLesson.class,
                    teacherId: editingLesson.teacherId || selectedTeacherId
                });
            } else {
                setEditForm({
                    subject: '',
                    class: '',
                    teacherId: selectedTeacherId
                });
            }
        }
    }, [isModalOpen, editingLesson, selectedTeacherId]);

    const handleCellClick = (day: string, periodIndex: number) => {
        const existingLesson = timetable.find(l => l.day === day && l.periodIndex === periodIndex && l.teacherId === selectedTeacherId);

        setSelectedSlot({ day, periodIndex });
        setEditingLesson(existingLesson || null);
        setIsModalOpen(true);
    };

    const handleSaveLesson = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            const newLesson = {
                id: editingLesson ? editingLesson.id : Date.now().toString(),
                day: selectedSlot!.day,
                periodIndex: selectedSlot!.periodIndex,
                subject: editForm.subject,
                class: editForm.class,
                teacherId: editForm.teacherId
            };

            setTimetable(prev => {
                // Remove existing mock lesson if any at this slot for this teacher (to avoid duplicates if just editing)
                // In a real app, complex validation for clashes across ALL teachers would happen here
                const filtered = prev.filter(l => !(l.id === newLesson.id));
                return [...filtered, newLesson];
            });

            setIsModalOpen(false);
            setIsLoading(false);
        }, 800);
    };

    const handleDeleteLesson = () => {
        if (!editingLesson) return;
        if (confirm('Are you sure you want to remove this lesson?')) {
            setIsLoading(true);
            setTimeout(() => {
                setTimetable(prev => prev.filter(l => l.id !== editingLesson.id));
                setIsModalOpen(false);
                setIsLoading(false);
            }, 600);
        }
    };

    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header & Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Timetable Management</h1>
                            <p className="text-slate-500 text-sm">Manage and assign teaching schedules</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Calendar className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Academic Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            >
                                <option>2025/2026</option>
                                <option>2024/2025</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Term</label>
                            <select
                                value={selectedTerm}
                                onChange={(e) => setSelectedTerm(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            >
                                <option value="1">First Term</option>
                                <option value="2">Second Term</option>
                                <option value="3">Third Term</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Select Teacher</label>
                            <select
                                value={selectedTeacherId}
                                onChange={(e) => setSelectedTeacherId(e.target.value)}
                                className="w-full p-2.5 bg-white border border-primary-200 rounded-lg text-sm font-bold text-primary-700 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                            >
                                {teachers.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Timetable Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                {selectedTeacher?.name.charAt(0)}
                            </div>
                            <h3 className="font-bold text-slate-800">{selectedTeacher?.name}'s Timetable</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <AlertCircle size={14} />
                            <span>Click on a slot to assign or edit a lesson</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 text-left bg-slate-100 border-b border-r border-slate-200 w-32 font-bold text-slate-600 text-sm sticky left-0 z-10">
                                        Day / Period
                                    </th>
                                    {periods.map((period, index) => (
                                        <th key={index} className="p-3 text-center bg-slate-50 border-b border-r border-slate-200 min-w-[120px]">
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Period {index + 1}</div>
                                            <div className="text-xs font-medium text-slate-400">{period}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {days.map((day) => (
                                    <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 bg-slate-50 border-b border-r border-slate-200 font-bold text-slate-700 text-sm sticky left-0 z-10">
                                            {day}
                                        </td>
                                        {periods.map((_, index) => {
                                            const lesson = timetable.find(l => l.day === day && l.periodIndex === index && l.teacherId === selectedTeacherId);

                                            return (
                                                <td
                                                    key={`${day}-${index}`}
                                                    className="p-1 border-b border-r border-slate-100 h-24 align-top relative group"
                                                    onClick={() => handleCellClick(day, index)}
                                                >
                                                    <div className={cn(
                                                        "h-full w-full rounded-lg p-2 cursor-pointer transition-all border-2 border-transparent",
                                                        lesson
                                                            ? "bg-primary-50 hover:bg-primary-100 hover:border-primary-200"
                                                            : "hover:bg-slate-100 hover:border-slate-200 border-dashed"
                                                    )}>
                                                        {lesson ? (
                                                            <div className="flex flex-col h-full justify-between">
                                                                <div>
                                                                    <div className="font-bold text-sm text-primary-800 line-clamp-2 leading-tight">
                                                                        {lesson.subject}
                                                                    </div>
                                                                    <div className="text-xs font-medium text-primary-600 mt-1">
                                                                        {lesson.class}
                                                                    </div>
                                                                </div>
                                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-end bg-white rounded-full p-1 shadow-sm">
                                                                    <Edit2 size={12} className="text-slate-400" />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Plus size={20} className="text-slate-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden z-10"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-800">
                                    {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-3 rounded-lg flex items-center justify-between text-sm text-slate-600 border border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span className="font-medium">{selectedSlot?.day}</span>
                                    </div>
                                    <span className="font-medium">{selectedSlot && periods[selectedSlot.periodIndex]}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                    <select
                                        value={editForm.subject}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="">Select Subject</option>
                                        {subjects.map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                                    <select
                                        value={editForm.class}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, class: e.target.value }))}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Teacher</label>
                                    <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm">
                                        {teachers.find(t => t.id === editForm.teacherId)?.name}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">To change teacher, use the filter on main page.</p>
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                {editingLesson ? (
                                    <button
                                        onClick={handleDeleteLesson}
                                        disabled={isLoading}
                                        className="flex items-center text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                                    >
                                        <Trash2 size={16} className="mr-1.5" />
                                        Remove
                                    </button>
                                ) : (
                                    <div></div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="default"
                                        onClick={handleSaveLesson}
                                        disabled={!editForm.subject || !editForm.class || isLoading}
                                        isLoading={isLoading}
                                    >
                                        <Save size={16} className="mr-2" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
