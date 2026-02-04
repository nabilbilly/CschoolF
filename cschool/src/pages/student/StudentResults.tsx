import {
    GraduationCap,
    FileText,
    CheckCircle2,
    XCircle,
    TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock Data Structure
interface Result {
    id: number;
    subject: string;
    classScore: number;
    examScore: number;
    totalScore: number;
    grade: string;
    remark: string;
}

interface TermResult {
    id: string;
    academicYear: string;
    class: string;
    term: string;
    results: Result[];
    summary: {
        totalSubjects: number;
        average: number;
        generalRemark: string;
    };
    status: 'PROMOTED' | 'REPEATED';
}

const mockResults: TermResult[] = [
    {
        id: 't1',
        academicYear: '2024/2025',
        class: 'JHS 2',
        term: '1',
        status: 'PROMOTED',
        summary: {
            totalSubjects: 9,
            average: 82.5,
            generalRemark: "Excellent Performance"
        },
        results: [
            { id: 1, subject: "Mathematics", classScore: 38, examScore: 52, totalScore: 90, grade: "A1", remark: "Excellent" },
            { id: 2, subject: "English Language", classScore: 35, examScore: 45, totalScore: 80, grade: "B2", remark: "Very Good" },
            { id: 3, subject: "Integrated Science", classScore: 36, examScore: 50, totalScore: 86, grade: "A1", remark: "Excellent" },
            { id: 4, subject: "Social Studies", classScore: 32, examScore: 48, totalScore: 80, grade: "B2", remark: "Very Good" },
            { id: 5, subject: "R.M.E", classScore: 39, examScore: 55, totalScore: 94, grade: "A1", remark: "Outstanding" },
            { id: 6, subject: "I.C.T", classScore: 30, examScore: 45, totalScore: 75, grade: "B2", remark: "Good" },
            { id: 7, subject: "French", classScore: 28, examScore: 40, totalScore: 68, grade: "C4", remark: "Credit" },
            { id: 8, subject: "Ghanaian Language", classScore: 35, examScore: 50, totalScore: 85, grade: "A1", remark: "Excellent" },
            { id: 9, subject: "B.D.T", classScore: 34, examScore: 48, totalScore: 82, grade: "A1", remark: "Excellent" },
        ]
    },
    {
        id: 't2',
        academicYear: '2023/2024',
        class: 'JHS 1',
        term: '3',
        status: 'PROMOTED',
        summary: {
            totalSubjects: 9,
            average: 78.4,
            generalRemark: "Very Good"
        },
        results: [
            { id: 1, subject: "Mathematics", classScore: 35, examScore: 50, totalScore: 85, grade: "A1", remark: "Excellent" },
            { id: 2, subject: "English Language", classScore: 32, examScore: 45, totalScore: 77, grade: "B2", remark: "Very Good" },
            { id: 3, subject: "Integrated Science", classScore: 30, examScore: 48, totalScore: 78, grade: "B2", remark: "Very Good" },
            { id: 4, subject: "Social Studies", classScore: 35, examScore: 40, totalScore: 75, grade: "B2", remark: "Good" },
            { id: 5, subject: "R.M.E", classScore: 38, examScore: 52, totalScore: 90, grade: "A1", remark: "Excellent" },
            { id: 6, subject: "I.C.T", classScore: 28, examScore: 42, totalScore: 70, grade: "B2", remark: "Good" },
            { id: 7, subject: "French", classScore: 25, examScore: 35, totalScore: 60, grade: "C4", remark: "Credit" },
            { id: 8, subject: "Ghanaian Language", classScore: 38, examScore: 48, totalScore: 86, grade: "A1", remark: "Excellent" },
            { id: 9, subject: "B.D.T", classScore: 32, examScore: 45, totalScore: 77, grade: "B2", remark: "Very Good" },
        ]
    }
];

export const StudentResults = () => {
    return (
        <div className="space-y-8 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="text-primary-600" />
                    Results & Performance
                </h1>
                <p className="text-slate-500 mt-1">Track your academic progress across all terms and years.</p>
            </div>

            {/* Results List */}
            <div className="space-y-12">
                {mockResults.map((termData) => (
                    <div key={termData.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Term Header */}
                        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-2 md:gap-6 text-sm font-semibold text-white">
                                    <span className="flex items-center gap-1.5 bg-white/20 border border-white/20 px-3 py-1.5 rounded-md shadow-sm backdrop-blur-sm">
                                        <TrendingUp size={16} className="text-white" />
                                        Academic Year: {termData.academicYear}
                                    </span>
                                    <span className="hidden md:inline text-white/50">|</span>
                                    <span className="bg-white/20 border border-white/20 px-3 py-1.5 rounded-md shadow-sm backdrop-blur-sm">
                                        Class: {termData.class}
                                    </span>
                                    <span className="hidden md:inline text-white/50">|</span>
                                    <span className="bg-white/20 border border-white/20 px-3 py-1.5 rounded-md shadow-sm backdrop-blur-sm">
                                        Term: {termData.term}
                                    </span>
                                </div>
                                <Button className="text-xs h-8 gap-1.5 bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-none">
                                    <FileText size={14} />
                                    Download PDF
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 w-[30%]">Subject</th>
                                        <th className="px-6 py-4 text-center">Class Score (40%)</th>
                                        <th className="px-6 py-4 text-center">Exam Score (60%)</th>
                                        <th className="px-6 py-4 text-center bg-slate-50">Total Score (100%)</th>
                                        <th className="px-6 py-4 text-center">Grade</th>
                                        <th className="px-6 py-4">Teacher's Remark</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {termData.results.map((result) => (
                                        <tr key={result.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{result.subject}</td>
                                            <td className="px-6 py-4 text-center text-slate-600">{result.classScore}</td>
                                            <td className="px-6 py-4 text-center text-slate-600">{result.examScore}</td>
                                            <td className="px-6 py-4 text-center font-bold text-slate-900 bg-slate-50/30">{result.totalScore}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn(
                                                    "inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs",
                                                    result.grade.startsWith('A') ? "bg-green-100 text-green-700" :
                                                        result.grade.startsWith('B') ? "bg-blue-100 text-blue-700" :
                                                            result.grade.startsWith('C') ? "bg-yellow-100 text-yellow-700" :
                                                                "bg-red-100 text-red-700"
                                                )}>
                                                    {result.grade}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 italic">{result.remark}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-800">
                                    <tr>
                                        <td className="px-6 py-4">Summary Performance</td>
                                        <td colSpan={2} className="px-6 py-4 text-right text-slate-500 font-medium">Average Score:</td>
                                        <td className="px-6 py-4 text-center text-primary-700 text-lg">{termData.summary.average}%</td>
                                        <td colSpan={2} className="px-6 py-4 text-right">
                                            <span className="text-slate-500 font-medium mr-2">General Remark:</span>
                                            <span className="text-primary-700">{termData.summary.generalRemark}</span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Status Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-sm text-slate-500">
                                <span className="font-semibold text-slate-900">Total Subjects:</span> {termData.summary.totalSubjects}
                            </div>

                            <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end">
                                {termData.status === 'PROMOTED' ? (
                                    <div className="flex items-center gap-3 px-8 py-3 bg-green-500 text-white rounded-xl shadow-lg shadow-green-500/20 w-full md:w-auto justify-center">
                                        <CheckCircle2 className="fill-white text-green-500" size={24} />
                                        <div className="text-left leading-none">
                                            <span className="block text-[10px] uppercase tracking-wider opacity-90 font-bold mb-0.5">Final Status</span>
                                            <span className="block font-bold text-lg tracking-wide">PROMOTED</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 px-8 py-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 w-full md:w-auto justify-center">
                                        <XCircle className="fill-white text-red-500" size={24} />
                                        <div className="text-left leading-none">
                                            <span className="block text-[10px] uppercase tracking-wider opacity-90 font-bold mb-0.5">Final Status</span>
                                            <span className="block font-bold text-lg tracking-wide">REPEATED</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

import { Button } from '../../components/common/Button';
