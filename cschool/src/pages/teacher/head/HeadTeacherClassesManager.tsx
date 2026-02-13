import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, Users, UserX, UserCheck,
    ChevronRight, X, AlertTriangle,
    School, Calendar, Phone, MapPin, BadgeInfo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

// --- Mock Data ---

const levels = ['Primary', 'JHS', 'SHS'];
const classesData = {
    'Primary': ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6'],
    'JHS': ['JHS 1', 'JHS 2', 'JHS 3'],
    'SHS': ['SHS 1', 'SHS 2', 'SHS 3']
};

type Student = {
    id: string;
    name: string;
    gender: 'Male' | 'Female';
    status: 'Active' | 'Pending Exit' | 'Exited';
    admissionYear: string;
    dob: string;
    guardian: string;
    phone: string;
    address: string;
    class: string;
};

// Generate Mock Students
const generateStudents = (_level: string, className: string): Student[] => {
    return Array.from({ length: 30 }).map((_, i) => ({
        id: `STU${2023000 + i} `,
        name: [
            'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Abena Boateng', 'Yaw Addo',
            'Akosua Konadu', 'Kwadwo Owusu', 'Adwoa Yeboah', 'Kwabena Antwi', 'Akua Sarpong'
        ][i % 10] + ` ${i + 1} `,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        status: i === 5 ? 'Pending Exit' : i === 12 ? 'Exited' : 'Active',
        admissionYear: '2023',
        dob: '2015-05-12',
        guardian: 'Mr. Mensah',
        phone: '0244123456',
        address: 'Accra, Ghana',
        class: className
    }));
};

export const HeadTeacherClassesManager = () => {
    // State
    const [selectedYear, setSelectedYear] = useState('2025/2026');
    const [selectedLevel, setSelectedLevel] = useState('JHS');
    const [selectedClass, setSelectedClass] = useState('JHS 1');
    const [viewAll, setViewAll] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Derived Data
    const students = useMemo(() => {
        if (viewAll) {
            // Flatten all classes for the level (Mock simplified)
            return classesData[selectedLevel as keyof typeof classesData].flatMap(c => generateStudents(selectedLevel, c));
        }
        return generateStudents(selectedLevel, selectedClass);
    }, [selectedLevel, selectedClass, viewAll]);

    const filteredStudents = useMemo(() => {
        return students.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: filteredStudents.length,
            active: filteredStudents.filter(s => s.status === 'Active').length,
            pending: filteredStudents.filter(s => s.status === 'Pending Exit').length,
            exited: filteredStudents.filter(s => s.status === 'Exited').length
        };
    }, [filteredStudents]);

    // Handlers
    const handleViewProfile = (student: Student) => {
        setSelectedStudent(student);
        setIsProfileOpen(true);
    };

    const handleDismissRequest = () => {
        if (!selectedStudent) return;
        const reason = prompt("Please enter the reason for dismissal/exit request:");
        if (reason) {
            // In real app, API call here
            alert(`Exit request submitted for ${selectedStudent.name}.Waiting for Admin approval.`);
            // Optimistic update
            // setStudents(prev => prev.map(s => s.id === selectedStudent.id ? {...s, status: 'Pending Exit'} : s))
            setIsProfileOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Header & Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-2 z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Classes & Students</h1>
                            <p className="text-slate-500 text-sm">Manage class lists, view profiles, and handle exits.</p>
                        </div>
                        <div className="flex gap-2">

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            <option>2025/2026</option>
                            <option>2024/2025</option>
                        </select>
                        <select
                            value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); setSelectedClass(classesData[e.target.value as keyof typeof classesData][0]); }}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            {levels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select
                            disabled={viewAll}
                            value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none disabled:opacity-50"
                        >
                            {classesData[selectedLevel as keyof typeof classesData].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="viewAll"
                                checked={viewAll}
                                onChange={(e) => setViewAll(e.target.checked)}
                                className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label htmlFor="viewAll" className="text-sm font-medium text-slate-700">View All {selectedLevel} Classes</label>
                        </div>
                    </div>
                </div>

                {/* 2. Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Total Students</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Active</p>
                            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><UserCheck size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Pending Exit</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><AlertTriangle size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Exited</p>
                            <p className="text-2xl font-bold text-red-600">{stats.exited}</p>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg"><UserX size={20} /></div>
                    </div>
                </div>

                {/* 3. Students Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Class</th>
                                    <th className="p-4">Gender</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Admitted</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleViewProfile(student)}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{student.class}</td>
                                        <td className="p-4 text-sm text-slate-600">{student.gender}</td>
                                        <td className="p-4">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{student.admissionYear}</td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary-600">
                                                <ChevronRight size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {isProfileOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProfileOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden z-10"
                        >
                            {/* Profile Header */}
                            <div className="relative h-32 bg-gradient-to-r from-primary-600 to-indigo-700">
                                <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
                                    <X size={18} />
                                </button>
                                <div className="absolute -bottom-10 left-8 flex items-end">
                                    <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                                        <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center text-slate-400 text-3xl font-bold">
                                            {selectedStudent.name.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="mb-2 ml-4">
                                        <h2 className="text-xl font-bold text-white shadow-sm">{selectedStudent.name}</h2>
                                        <p className="text-primary-100 text-sm shadow-sm opacity-90">{selectedStudent.id} • {selectedStudent.class}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-14 p-8 pt-0 max-h-[70vh] overflow-y-auto">
                                <div className="flex justify-end mb-6">
                                    <StatusBadge status={selectedStudent.status} />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <BadgeInfo size={18} className="text-primary-500" />
                                            Personal Details
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Date of Birth</p>
                                                    <p className="text-slate-700">{format(new Date(selectedStudent.dob), 'MMMM dd, yyyy')}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Users size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Gender</p>
                                                    <p className="text-slate-700">{selectedStudent.gender}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <School size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Admission Year</p>
                                                    <p className="text-slate-700">{selectedStudent.admissionYear}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                            <Users size={18} className="text-primary-500" />
                                            Guardian Info
                                        </h4>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Users size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Guardian Name</p>
                                                    <p className="text-slate-700">{selectedStudent.guardian}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Phone Number</p>
                                                    <p className="text-slate-700">{selectedStudent.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <MapPin size={16} className="text-slate-400 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Address</p>
                                                    <p className="text-slate-700">{selectedStudent.address}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                                    {selectedStudent.status === 'Active' && (
                                        <Button onClick={handleDismissRequest} variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300">
                                            <UserX className="mr-2 h-4 w-4" />
                                            Request Dismissal / Exit
                                        </Button>
                                    )}
                                    <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                                        Close Profile
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


const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Pending Exit': 'bg-amber-50 text-amber-700 border-amber-200',
        'Exited': 'bg-red-50 text-red-700 border-red-200',
    };

    const icons = {
        'Active': UserCheck,
        'Pending Exit': AlertTriangle,
        'Exited': UserX,
    };

    const Icon = icons[status as keyof typeof icons] || UserCheck;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", styles[status as keyof typeof styles])}>
            <Icon size={12} />
            {status}
        </span>
    );
};
