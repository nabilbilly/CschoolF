import { useState } from 'react';
import {
    Filter,
    Download,
    Printer,
    Search,
    TrendingUp,
    TrendingDown,
    Users,
    Award
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Data
const classes = ["JHS 2 A", "JHS 2 B", "JHS 3 A"];
const subjects = ["Mathematics", "Science", "English"];
const terms = ["Term 1", "Term 2", "Term 3"];

const mockResults = [
    { id: "1", name: "Mensah, Sarah", score: 88, grade: "1", remark: "Highest" },
    { id: "2", name: "Osei, David", score: 72, grade: "2", remark: "Higher" },
    { id: "3", name: "Appiah, Kwame", score: 65, grade: "3", remark: "High" },
    { id: "4", name: "Boateng, Emmanuel", score: 92, grade: "1", remark: "Highest" },
    { id: "5", name: "Danso, Grace", score: 55, grade: "4", remark: "Average" },
    { id: "6", name: "Amoah, Samuel", score: 45, grade: "5", remark: "Pass" },
    { id: "7", name: "Owusu, Elizabeth", score: 78, grade: "2", remark: "Higher" },
    { id: "8", name: "Kwakye, Isaac", score: 35, grade: "7", remark: "Low" },
];

export const TeacherViewResults = () => {
    const [selectedClass, setSelectedClass] = useState("JHS 2 A");
    const [selectedSubject, setSelectedSubject] = useState("Mathematics");
    const [searchTerm, setSearchTerm] = useState("");

    // Calculate Stats
    const scores = mockResults.map(r => r.score);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passCount = scores.filter(s => s >= 50).length;
    const passRate = Math.round((passCount / scores.length) * 100);

    // Filter Logic
    const filteredResults = mockResults.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Display Results</h1>
                    <p className="text-slate-500 mt-1">Review class performance and generate reports.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => window.print()}>
                        <Printer size={18} /> Print
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Download size={18} /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-400">
                    <Filter size={20} />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100">
                    <option>2024/2025</option>
                </select>

                <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100">
                    {terms.map(t => <option key={t}>{t}</option>)}
                </select>

                <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                >
                    {classes.map(c => <option key={c}>{c}</option>)}
                </select>

                <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    {subjects.map(s => <option key={s}>{s}</option>)}
                </select>

                <div className="md:ml-auto relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-100"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Analytics Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Class Average</p>
                        <h3 className="text-2xl font-bold text-slate-900">{average}</h3>
                        <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> +2.5 from last term
                        </p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Users size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Pass Rate</p>
                        <h3 className="text-2xl font-bold text-slate-900">{passRate}%</h3>
                        <p className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
                            <TrendingUp size={12} /> Outstanding
                        </p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <Award size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Highest Score</p>
                        <h3 className="text-2xl font-bold text-slate-900">{highest}</h3>
                        <p className="text-xs text-slate-400 mt-1">Boateng, Emmanuel</p>
                    </div>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Lowest Score</p>
                        <h3 className="text-2xl font-bold text-slate-900">{lowest}</h3>
                        <p className="text-xs text-slate-400 mt-1">Needs Improvement</p>
                    </div>
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <TrendingDown size={20} />
                    </div>
                </div>
            </div>

            {/* Simple Performance Chart (Visual only mockup using CSS gradients/width) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Grade Distribution</h3>
                <div className="flex items-end gap-4 h-40 border-b border-slate-100 pb-4">
                    {[
                        { label: '1 (A)', height: '80%', count: 8 },
                        { label: '2 (B)', height: '60%', count: 6 },
                        { label: '3 (C)', height: '40%', count: 4 },
                        { label: '4 (D)', height: '30%', count: 3 },
                        { label: '5-9 (F)', height: '15%', count: 2 },
                    ].map((bar, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                            <div className="text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">{bar.count}</div>
                            <div
                                className="w-full bg-slate-100 rounded-t-lg relative group-hover:bg-primary-100 transition-colors duration-300"
                                style={{ height: bar.height }}
                            >
                                <div
                                    className="absolute bottom-0 left-0 right-0 bg-primary-500 rounded-t-lg opacity-80"
                                    style={{ height: '100%' }} // Assuming full fill for this simple viz
                                ></div>
                            </div>
                            <div className="text-xs font-medium text-slate-500">{bar.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Student Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Score</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Grade</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Remarks</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredResults.map((result) => (
                                <tr key={result.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        {result.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "font-bold",
                                            result.score >= 50 ? "text-slate-900" : "text-red-500"
                                        )}>
                                            {result.score}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex w-8 h-8 items-center justify-center rounded-lg text-sm font-bold",
                                            result.grade === '1' ? "bg-green-100 text-green-700" :
                                                result.grade <= '4' ? "bg-blue-50 text-blue-700" :
                                                    result.grade <= '6' ? "bg-amber-50 text-amber-700" :
                                                        "bg-red-50 text-red-700"
                                        )}>
                                            {result.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {result.remark}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" className="h-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            Details
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
