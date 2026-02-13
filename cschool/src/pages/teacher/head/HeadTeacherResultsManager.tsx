import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, Download, FileText, CheckCircle,
    XCircle, Lock, Eye, AlertCircle, ChevronDown,
    ChevronUp, TrendingUp, UserCheck, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

// --- Mock Data ---

const classes = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];
const examTypes = ['Mid-Term Examination', 'End-of-Term Examination'];

type StudentResult = {
    id: string;
    name: string;
    avatar?: string;
    totalScore: number;
    average: number;
    position: number;
    status: 'PENDING' | 'APPROVED' | 'LOCKED' | 'CORRECTION NEEDED';
    promotion: 'Promoted' | 'Repeated' | 'Probation';
    subjects: {
        name: string;
        classScore: number;
        examScore: number;
        total: number;
        grade: string;
        remarks: string;
    }[];
    teacherRemarks: string;
    headTeacherRemarks: string;
};

const mockStudents: StudentResult[] = Array.from({ length: 25 }).map((_, i) => ({
    id: `STU${2025001 + i} `,
    name: [
        'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Abena Boateng', 'Yaw Addo',
        'Akosua Konadu', 'Kwadwo Owusu', 'Adwoa Yeboah', 'Kwabena Antwi', 'Akua Sarpong'
    ][i % 10] + ` ${i + 1} `,
    totalScore: Math.floor(Math.random() * (900 - 400) + 400),
    average: Math.floor(Math.random() * (95 - 45) + 45),
    position: i + 1,
    status: (['PENDING', 'APPROVED', 'LOCKED', 'CORRECTION NEEDED'] as const)[Math.floor(Math.random() * 4)],
    promotion: (['Promoted', 'Promoted', 'Promoted', 'Probation', 'Repeated'] as const)[Math.floor(Math.random() * 5)],
    subjects: [
        { name: 'Mathematics', classScore: 25, examScore: 60, total: 85, grade: 'A', remarks: 'Excellent' },
        { name: 'English Language', classScore: 22, examScore: 55, total: 77, grade: 'B+', remarks: 'Very Good' },
        { name: 'Integrated Science', classScore: 20, examScore: 50, total: 70, grade: 'B', remarks: 'Good' },
        { name: 'Social Studies', classScore: 28, examScore: 65, total: 93, grade: 'A+', remarks: 'Outstanding' },
    ],
    teacherRemarks: "Has shown great improvement this term. Needs to focus more on Mathematics.",
    headTeacherRemarks: ""
})).sort((a, b) => b.totalScore - a.totalScore).map((s, i) => ({ ...s, position: i + 1 }));


export const HeadTeacherResultsManager = () => {
    // Component State
    const [selectedYear, setSelectedYear] = useState('2025/2026');
    const [selectedTerm, setSelectedTerm] = useState('1');
    const [selectedClass, setSelectedClass] = useState('JHS 1');
    const [selectedExam, setSelectedExam] = useState(examTypes[1]);
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);
    const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
    const [isStatsExpanded, setIsStatsExpanded] = useState(true);

    // Derived Data
    const filteredStudents = useMemo(() => {
        return mockStudents.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const stats = useMemo(() => {
        const total = mockStudents.length;
        const passed = mockStudents.filter(s => s.average >= 50).length;
        const avgScore = Math.round(mockStudents.reduce((acc, s) => acc + s.average, 0) / total);
        const topScore = Math.max(...mockStudents.map(s => s.totalScore));

        return { total, passed, avgScore, topScore };
    }, []);

    // Handlers
    const handleViewDetails = (student: StudentResult) => {
        setSelectedStudent(student);
        setIsSlideOverOpen(true);
    };

    const handleApprove = () => {
        if (!selectedStudent) return;
        // In real app, API call here
        alert(`Approved results for ${selectedStudent.name}`);
        setIsSlideOverOpen(false);
    };

    const handleRequestCorrection = () => {
        if (!selectedStudent) return;
        const reason = prompt("Enter reason for correction:");
        if (reason) {
            alert(`Correction requested for ${selectedStudent.name}: ${reason} `);
            setIsSlideOverOpen(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Header & Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-2 z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Results & Reports</h1>
                            <p className="text-slate-500 text-sm">Review, approve, and publish terminal reports.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Broadband
                            </Button>
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
                            value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            <option value="1">First Term</option>
                            <option value="2">Second Term</option>
                            <option value="3">Third Term</option>
                        </select>
                        <select
                            value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            {examTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>

                {/* 2. Performance Summary (Collapsible) */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <button
                        onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                            <TrendingUp size={18} className="text-primary-600" />
                            <span>Class Performance Summary</span>
                        </div>
                        {isStatsExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </button>

                    <AnimatePresence>
                        {isStatsExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-200"
                            >
                                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Class Average</p>
                                        <p className="text-2xl font-bold text-slate-800">{stats.avgScore}%</p>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary-500 rounded-full" style={{ width: `${stats.avgScore}% ` }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Pass Rate</p>
                                        <p className="text-2xl font-bold text-green-600">{Math.round((stats.passed / stats.total) * 100)}%</p>
                                        <p className="text-xs text-slate-400">{stats.passed} out of {stats.total} students</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Highest Score</p>
                                        <p className="text-2xl font-bold text-slate-800">{stats.topScore}</p>
                                        <p className="text-xs text-slate-400">Total Marks</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-500 uppercase">Results Status</p>
                                        <div className="flex gap-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                15 Approved
                                            </span>
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                10 Pending
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. Results Overview Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2 text-sm text-slate-500">
                            <span>Showing {filteredStudents.length} students</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4 w-16 text-center">Pos.</th>
                                    <th className="p-4">Student</th>
                                    <th className="p-4 text-center">Total Score</th>
                                    <th className="p-4 text-center">Average</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Promotion</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-4 text-center font-medium text-slate-600">
                                            {student.position}
                                        </td>
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
                                        <td className="p-4 text-center font-bold text-slate-700">{student.totalScore}</td>
                                        <td className="p-4 text-center">
                                            <span className={cn(
                                                "font-bold px-2 py-1 rounded-md text-xs",
                                                student.average >= 50 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                                            )}>
                                                {student.average}%
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "text-xs font-medium",
                                                student.promotion === 'Promoted' ? "text-green-600" :
                                                    student.promotion === 'Repeated' ? "text-red-600" : "text-amber-600"
                                            )}>
                                                {student.promotion}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student)}>
                                                <Eye className="h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                                                <span className="ml-2">View</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 4. Slide-over Review Panel */}
            <AnimatePresence>
                {isSlideOverOpen && selectedStudent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSlideOverOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">{selectedStudent.name}</h2>
                                    <p className="text-sm text-slate-500">Result Details • {selectedClass}</p>
                                </div>
                                <button onClick={() => setIsSlideOverOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Position</div>
                                        <div className="text-2xl font-bold text-slate-800">{selectedStudent.position}<span className="text-sm text-slate-400 font-normal">/{mockStudents.length}</span></div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Average</div>
                                        <div className={cn("text-2xl font-bold", selectedStudent.average >= 50 ? "text-green-600" : "text-red-600")}>
                                            {selectedStudent.average}%
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Status</div>
                                        <div className="text-sm font-bold pt-1"><StatusBadge status={selectedStudent.status} /></div>
                                    </div>
                                </div>

                                {/* Subjects List */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <FileText size={18} className="text-primary-500" />
                                        Subject Results
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedStudent.subjects.map((subject, index) => (
                                            <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-primary-200 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-slate-700">{subject.name}</span>
                                                    <span className={cn(
                                                        "text-sm font-bold px-2 py-0.5 rounded",
                                                        ["A", "A+", "B+"].includes(subject.grade) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                                                    )}>{subject.grade}</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm text-slate-600 mb-2">
                                                    <div>Class: <span className="font-semibold">{subject.classScore}</span></div>
                                                    <div>Exam: <span className="font-semibold">{subject.examScore}</span></div>
                                                    <div>Total: <span className="font-semibold">{subject.total}</span></div>
                                                </div>
                                                <div className="text-xs text-slate-500 italic border-t border-slate-100 pt-2 mt-2">
                                                    "{subject.remarks}"
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Remarks */}
                                <div className="space-y-4">
                                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                        <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                                            <UserCheck size={16} /> Teacher's Remarks
                                        </h4>
                                        <p className="text-sm text-blue-800">{selectedStudent.teacherRemarks}</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Head Teacher's Remarks</label>
                                        <textarea
                                            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
                                            placeholder="Enter approval comments or special remarks..."
                                            defaultValue={selectedStudent.headTeacherRemarks}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Footer Actions */}
                            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-3">
                                {selectedStudent.status !== 'Approved' && (
                                    <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve Result
                                    </Button>
                                )}
                                <Button variant="outline" onClick={handleRequestCorrection} className="flex-1">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Request Correction
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Bottom Floating Action Bar for Bulk Actions */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white p-2 pl-6 pr-2 rounded-full shadow-xl shadow-slate-900/20 z-30 flex items-center gap-6 max-w-2xl w-[90%] md:w-auto">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Actions</span>
                    <span className="font-bold text-sm">Reviewing {selectedClass}</span>
                </div>
                <div className="h-8 w-px bg-slate-700"></div>
                <div className="flex gap-2">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-200">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Publish All Approved
                    </Button>
                    <Button size="sm" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                        <Download className="mr-2 h-4 w-4" />
                        Export Reports
                    </Button>
                </div>
            </div>
        </div>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        'APPROVED': 'bg-green-100 text-green-700 border-green-200',
        'PENDING': 'bg-amber-50 text-amber-700 border-amber-200',
        'LOCKED': 'bg-slate-100 text-slate-700 border-slate-200',
        'CORRECTION NEEDED': 'bg-red-50 text-red-700 border-red-200'
    };

    const icons = {
        'APPROVED': CheckCircle,
        'PENDING': AlertCircle,
        'LOCKED': Lock,
        'CORRECTION NEEDED': XCircle
    };

    const Icon = icons[status as keyof typeof icons] || AlertCircle;

    return (
        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border", styles[status as keyof typeof styles])}>
            <Icon size={12} />
            {status}
        </span>
    );
};
