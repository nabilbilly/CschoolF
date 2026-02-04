import { useState, useEffect } from 'react';
import { Button } from '../../../components/common/Button';
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Printer, History, Eye, EyeOff, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// Mock Data
const teachers = [
    { id: 't1', name: 'Mr. David Osei', subjects: ['Mathematics', 'Science'] },
    { id: 't2', name: 'Ms. Sarah Mensah', subjects: ['English', 'Social Studies'] },
    { id: 't3', name: 'Mr. Kwame Boateng', subjects: ['ICT', 'Mathematics'] },
    { id: 't4', name: 'Mrs. Abena Konadu', subjects: ['French', 'Creative Arts'] },
];

const classesList = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
const levels = ['Primary', 'JHS', 'SHS'];
const subjects = ['Mathematics', 'English Language', 'Integrated Science', 'Social Studies', 'ICT', 'Religious & Moral Education', 'Creative Arts', 'French', 'Ghanaian Language'];
const periods = ['8:00 - 8:45', '8:45 - 9:30', '9:30 - 10:15', '10:15 - 10:45 (Break)', '10:45 - 11:30', '11:30 - 12:15', '12:15 - 1:00', '1:00 - 1:45', '1:45 - 2:30'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Mock Initial Timetable Data (Flat structure for all classes)
const initialAllTimetables = [
    { id: 'l1', day: 'Monday', periodIndex: 0, subject: 'Mathematics', class: 'Primary 5', teacherId: 't1' },
    { id: 'l2', day: 'Monday', periodIndex: 1, subject: 'English', class: 'Primary 5', teacherId: 't2' },
    { id: 'l3', day: 'Tuesday', periodIndex: 0, subject: 'Science', class: 'JHS 1', teacherId: 't1' },
    { id: 'l4', day: 'Wednesday', periodIndex: 2, subject: 'ICT', class: 'JHS 1', teacherId: 't3' },
];

export const HeadTeacherClassTimetableManager = () => {
    // Top Level Filters
    const [selectedYear, setSelectedYear] = useState('2025/2026');
    const [selectedTerm, setSelectedTerm] = useState('1');
    const [selectedLevel, setSelectedLevel] = useState('Primary');
    const [selectedClass, setSelectedClass] = useState('Primary 5');
    const [viewAllClasses, setViewAllClasses] = useState(false);

    // Timetable State
    const [timetableData, setTimetableData] = useState(initialAllTimetables);
    const [publishStatus, setPublishStatus] = useState<Record<string, 'Draft' | 'Published'>>({
        'Primary 5': 'Draft',
        'JHS 1': 'Published'
    });

    // Edit Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any>(null); // null means new lesson
    const [selectedSlot, setSelectedSlot] = useState<{ day: string, periodIndex: number, className: string } | null>(null);

    // Form State inside Modal
    const [editForm, setEditForm] = useState({
        subject: '',
        teacherId: '',
        className: ''
    });

    // Loading State
    const [isLoading, setIsLoading] = useState(false);

    // Effect to reset form when modal opens
    useEffect(() => {
        if (isModalOpen) {
            if (editingLesson) {
                setEditForm({
                    subject: editingLesson.subject,
                    teacherId: editingLesson.teacherId,
                    className: editingLesson.class
                });
            } else if (selectedSlot) {
                setEditForm({
                    subject: '',
                    teacherId: '',
                    className: selectedSlot.className
                });
            }
        }
    }, [isModalOpen, editingLesson, selectedSlot]);

    const handleCellClick = (day: string, periodIndex: number, className: string) => {
        // Skip break periods or special slots if any (logic can be added here)
        if (periods[periodIndex].includes('Break')) return;

        const existingLesson = timetableData.find(l => l.day === day && l.periodIndex === periodIndex && l.class === className);

        setSelectedSlot({ day, periodIndex, className });
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
                class: editForm.className,
                teacherId: editForm.teacherId
            };

            setTimetableData(prev => {
                const filtered = prev.filter(l => !(l.day === newLesson.day && l.periodIndex === newLesson.periodIndex && l.class === newLesson.class));
                return [...filtered, newLesson];
            });

            setIsModalOpen(false);
            setIsLoading(false);
        }, 600);
    };

    const handleDeleteLesson = () => {
        if (!editingLesson) return;
        if (confirm('Are you sure you want to remove this lesson?')) {
            setIsLoading(true);
            setTimeout(() => {
                setTimetableData(prev => prev.filter(l => l.id !== editingLesson.id));
                setIsModalOpen(false);
                setIsLoading(false);
            }, 600);
        }
    };

    const togglePublishStatus = (className: string) => {
        setPublishStatus(prev => ({
            ...prev,
            [className]: prev[className] === 'Published' ? 'Draft' : 'Published'
        }));
    };

    // Filter classes based on selection
    const displayedClasses = viewAllClasses
        ? classesList.filter(c => c.startsWith(selectedLevel))
        : [selectedClass];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-20">
            <div className="max-w-full mx-auto space-y-6">

                {/* Header & Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Class Timetable Manager</h1>
                            <p className="text-slate-500 text-sm">Create, edit, and publish class schedules.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <History className="mr-2 h-4 w-4" />
                                Audit Log
                            </Button>
                            <Button variant="outline" size="sm">
                                <Printer className="mr-2 h-4 w-4" />
                                Export All
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Academic Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                            >
                                <option>2025/2026</option>
                                <option>2024/2025</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Term</label>
                            <select
                                value={selectedTerm}
                                onChange={(e) => setSelectedTerm(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                            >
                                <option value="1">First Term</option>
                                <option value="2">Second Term</option>
                                <option value="3">Third Term</option>
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Level</label>
                            <select
                                value={selectedLevel}
                                onChange={(e) => {
                                    setSelectedLevel(e.target.value);
                                    // Reset class to first of new level
                                    const firstClass = classesList.find(c => c.startsWith(e.target.value));
                                    if (firstClass) setSelectedClass(firstClass);
                                }}
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-primary-500"
                            >
                                {levels.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Class</label>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                disabled={viewAllClasses}
                                className={cn(
                                    "w-full p-2.5 bg-white border border-primary-200 rounded-lg text-sm font-bold text-primary-700 shadow-sm outline-none focus:border-primary-500 transition-opacity",
                                    viewAllClasses && "opacity-50 cursor-not-allowed bg-slate-100 text-slate-500 border-slate-200 shadow-none"
                                )}
                            >
                                {classesList.filter(c => c.startsWith(selectedLevel)).map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-1 pb-1">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={cn(
                                    "w-10 h-6 rounded-full p-1 transition-colors duration-200 relative",
                                    viewAllClasses ? "bg-primary-600" : "bg-slate-300"
                                )}>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={viewAllClasses}
                                        onChange={() => setViewAllClasses(!viewAllClasses)}
                                    />
                                    <div className={cn(
                                        "w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
                                        viewAllClasses ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </div>
                                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">View All {selectedLevel} Classes</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Timetable Grids */}
                <div className="space-y-8">
                    {displayedClasses.map(currentClass => (
                        <div key={currentClass} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            {/* Class Header Toolbar */}
                            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
                                        {currentClass.replace(/[^0-9]/g, '')}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{currentClass}</h3>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full font-bold border",
                                                publishStatus[currentClass] === 'Published'
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {publishStatus[currentClass] || 'Draft'}
                                            </span>
                                            <span className="text-slate-400">•</span>
                                            <span className="text-slate-500">Last updated today</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={publishStatus[currentClass] === 'Published' ? "outline" : "default"}
                                        onClick={() => togglePublishStatus(currentClass)}
                                        className={cn(
                                            publishStatus[currentClass] === 'Published' ? "text-slate-600" : "bg-green-600 hover:bg-green-700 text-white border-transparent"
                                        )}
                                    >
                                        {publishStatus[currentClass] === 'Published' ? (
                                            <><EyeOff className="mr-2 h-3.5 w-3.5" /> Unpublish</>
                                        ) : (
                                            <><Eye className="mr-2 h-3.5 w-3.5" /> Publish Timetable</>
                                        )}
                                    </Button>
                                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Print Class Timetable">
                                        <Printer size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1200px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-3 text-left bg-slate-100 border-b border-r border-slate-200 w-32 font-bold text-slate-600 text-xs sticky left-0 z-10">
                                                Day / Period
                                            </th>
                                            {periods.map((period, index) => (
                                                <th key={index} className={cn(
                                                    "p-3 text-center border-b border-r border-slate-200 min-w-[120px]",
                                                    period.includes('Break') ? "bg-amber-50/50" : "bg-slate-50"
                                                )}>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Period {index + 1}</div>
                                                    <div className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{period}</div>
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
                                                {periods.map((periodText, index) => {
                                                    const isBreak = periodText.includes('Break');
                                                    if (isBreak) {
                                                        return index === 0 || days.indexOf(day) === 0 ? (
                                                            // Render break cell only once logically (visual simplification handled by simple render)
                                                            <td key={`${day}-${index}`} className="p-1 border-b border-r border-amber-100 bg-amber-50/30 h-24 text-center align-middle">
                                                                <span className="text-[10px] text-amber-300 font-bold uppercase rotate-90 block">Break</span>
                                                            </td>
                                                        ) : <td key={`${day}-${index}`} className="p-1 border-b border-r border-amber-100 bg-amber-50/30 h-24"></td>;
                                                    }

                                                    const lesson = timetableData.find(l => l.day === day && l.periodIndex === index && l.class === currentClass);

                                                    // Conflict Detection (Simple): Check if teacher assigned here is assigned elsewhere at same time
                                                    const teacherConflict = lesson && timetableData.find(l =>
                                                        l.day === day &&
                                                        l.periodIndex === index &&
                                                        l.teacherId === lesson.teacherId &&
                                                        l.class !== currentClass
                                                    );

                                                    return (
                                                        <td
                                                            key={`${day}-${index}`}
                                                            className="p-1 border-b border-r border-slate-100 h-24 align-top relative group"
                                                            onClick={() => !isBreak && handleCellClick(day, index, currentClass)}
                                                        >
                                                            {!isBreak && (
                                                                <div className={cn(
                                                                    "h-full w-full rounded-lg p-2 cursor-pointer transition-all border-2 border-transparent relative",
                                                                    lesson
                                                                        ? "bg-white border-slate-100 shadow-sm group-hover:border-primary-200 group-hover:shadow-md"
                                                                        : "hover:bg-slate-100 hover:border-slate-200 border-dashed"
                                                                )}>
                                                                    {lesson ? (
                                                                        <div className="flex flex-col h-full justify-between">
                                                                            <div>
                                                                                <div className="font-bold text-xs text-slate-800 line-clamp-1">
                                                                                    {lesson.subject}
                                                                                </div>
                                                                                {teachers.find(t => t.id === lesson.teacherId) && (
                                                                                    <div className="flex items-center gap-1 mt-1">
                                                                                        <div className="w-4 h-4 rounded-full bg-slate-100 text-[8px] flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                                                                                            {teachers.find(t => t.id === lesson.teacherId)?.name.charAt(0)}
                                                                                        </div>
                                                                                        <span className="text-[10px] text-slate-500 truncate">
                                                                                            {teachers.find(t => t.id === lesson.teacherId)?.name.split(' ').pop()}
                                                                                        </span>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                            {teacherConflict && (
                                                                                <div className="absolute top-1 right-1">
                                                                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`Conflict: Teacher also in ${teacherConflict.class}`} />
                                                                                </div>
                                                                            )}

                                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity self-end">
                                                                                <Edit2 size={10} className="text-slate-300 hover:text-primary-500" />
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <Plus size={16} className="text-slate-300" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {displayedClasses.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <Layers size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No classes found for this selection.</p>
                        </div>
                    )}
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
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">
                                        {editingLesson ? 'Edit Lesson' : 'Schedule Lesson'}
                                    </h3>
                                    <p className="text-xs text-slate-500">{editForm.className} • {selectedSlot?.day}</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">

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
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Teacher</label>
                                    <select
                                        value={editForm.teacherId}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, teacherId: e.target.value }))}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.subjects.join(', ')})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mock Conflict Warning in Modal */}
                                {editForm.teacherId && timetableData.some(l =>
                                    l.day === selectedSlot?.day &&
                                    l.periodIndex === selectedSlot?.periodIndex &&
                                    l.teacherId === editForm.teacherId &&
                                    l.class !== editForm.className
                                ) && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                                            <AlertCircle size={16} className="text-red-500 mt-0.5" />
                                            <p className="text-xs text-red-600">
                                                <strong>Conflict Detected:</strong> This teacher is already assigned to {timetableData.find(l =>
                                                    l.day === selectedSlot?.day &&
                                                    l.periodIndex === selectedSlot?.periodIndex &&
                                                    l.teacherId === editForm.teacherId &&
                                                    l.class !== editForm.className
                                                )?.class} at this time.
                                            </p>
                                        </div>
                                    )}
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
                                        disabled={!editForm.subject || !editForm.teacherId || isLoading}
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
