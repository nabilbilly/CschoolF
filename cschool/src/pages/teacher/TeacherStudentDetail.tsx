import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    User,
    BookOpen
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Student Full Results
const mockStudentResults = {
    id: "ST001",
    name: "Mensah, Sarah",
    indexNumber: "JHS24001",
    class: "JHS 2 - A",
    term: "Term 1, 2024/2025",
    subjects: [
        { name: "Mathematics", classScore: 42, examScore: 48, total: 90, grade: "1", remark: "Excellent performance." },
        { name: "Integrated Science", classScore: 35, examScore: 45, total: 80, grade: "1", remark: "Very good work." },
        { name: "English Language", classScore: 38, examScore: 40, total: 78, grade: "2", remark: "Good display of vocabulary." },
        { name: "Social Studies", classScore: 40, examScore: 45, total: 85, grade: "1", remark: "Keep it up." },
        { name: "R.M.E", classScore: 45, examScore: 50, total: 95, grade: "1", remark: "Outstanding." },
        { name: "ICT", classScore: 30, examScore: 35, total: 65, grade: "3", remark: "Can do better." },
        { name: "French", classScore: 25, examScore: 30, total: 55, grade: "4", remark: "More effort needed." },
    ]
};

export const TeacherStudentDetail = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();

    // In a real app, fetch student details using studentId

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header & Nav */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:pl-2 transition-all">
                    <ArrowLeft size={20} /> Back to Class
                </Button>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-200">
                        <User size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{mockStudentResults.name}</h1>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{mockStudentResults.indexNumber}</span>
                            <span>•</span>
                            <span>{mockStudentResults.class}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer size={18} /> Print Report
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download size={18} /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Result Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={20} className="text-primary-600" />
                        <h2 className="text-lg font-bold text-slate-900">Academic Performance</h2>
                    </div>
                    <p className="text-sm text-slate-500">{mockStudentResults.term}</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Subject</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-center">Class (50%)</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-center">Exam (50%)</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-center">Total (100%)</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-center">Grade</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Teacher's Remark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockStudentResults.subjects.map((sub, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{sub.name}</td>
                                    <td className="px-6 py-4 text-center text-slate-500">{sub.classScore}</td>
                                    <td className="px-6 py-4 text-center text-slate-500">{sub.examScore}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "font-bold",
                                            sub.total >= 50 ? "text-slate-900" : "text-red-500"
                                        )}>
                                            {sub.total}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "inline-flex w-8 h-8 items-center justify-center rounded-lg text-sm font-bold",
                                            sub.grade === '1' ? "bg-green-100 text-green-700" :
                                                sub.grade <= '4' ? "bg-blue-50 text-blue-700" :
                                                    sub.grade <= '6' ? "bg-amber-50 text-amber-700" :
                                                        "bg-red-50 text-red-700"
                                        )}>
                                            {sub.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{sub.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50/50 border-t border-slate-200 font-bold">
                            <tr>
                                <td className="px-6 py-4 text-slate-900">Overall Average</td>
                                <td colSpan={2} />
                                <td className="px-6 py-4 text-center text-primary-700 text-lg">78.4</td>
                                <td colSpan={2} />
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};
