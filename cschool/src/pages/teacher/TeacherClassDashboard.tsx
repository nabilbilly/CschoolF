import { useNavigate, useParams } from 'react-router-dom';
import {
    Users,
    GraduationCap,
    CalendarCheck,
    ArrowRight,
    Search,
    ShieldCheck
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';
import { useState } from 'react';

// Mock Data
const mockClassStudents = [
    { id: "ST001", name: "Mensah, Sarah", indexNumber: "JHS24001", average: 85, attendance: "98%", status: "Excellent" },
    { id: "ST002", name: "Osei, David", indexNumber: "JHS24002", average: 72, attendance: "92%", status: "Good" },
    { id: "ST003", name: "Appiah, Kwame", indexNumber: "JHS24003", average: 65, attendance: "85%", status: "Average" },
    { id: "ST004", name: "Boateng, Emmanuel", indexNumber: "JHS24004", average: 92, attendance: "100%", status: "Excellent" },
    { id: "ST005", name: "Danso, Grace", indexNumber: "JHS24005", average: 55, attendance: "75%", status: "Warning" },
    { id: "ST006", name: "Amoah, Samuel", indexNumber: "JHS24006", average: 45, attendance: "60%", status: "Critical" },
    { id: "ST007", name: "Owusu, Elizabeth", indexNumber: "JHS24007", average: 78, attendance: "95%", status: "Good" },
    { id: "ST008", name: "Kwakye, Isaac", indexNumber: "JHS24008", average: 35, attendance: "50%", status: "Critical" },
];

export const TeacherClassDashboard = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    // Format class name from ID (e.g., jhs-2-aa -> JHS 2 - A)
    const formattedClassName = classId?.split('-').map(word => word.toUpperCase()).join(' ') || "Class View";

    // Filter logic
    const filteredStudents = mockClassStudents.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.indexNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header Section */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">{formattedClassName}</h1>
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider rounded-full border border-primary-100">
                        Class Teacher View
                    </span>
                </div>

                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3 max-w-2xl">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-bold text-emerald-800">Full Academic Results Enabled</p>
                        <p className="text-sm text-emerald-700 mt-1">
                            As the Class Teacher, you have full access to view all subject results, attendance records, and performance trends for students in this class.
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Students</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">{mockClassStudents.length}</h3>
                    <p className="text-sm text-slate-500 mt-1">Active this term</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <CalendarCheck size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Avg Attendance</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">88%</h3>
                    <p className="text-sm text-slate-500 mt-1">+2% from last week</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <GraduationCap size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Class Performance</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">68%</h3>
                    <p className="text-sm text-slate-500 mt-1">Average across all subjects</p>
                </div>
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900">Student Directory</h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find student..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Student Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Overall Average</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Attendance</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`${student.id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{student.name}</div>
                                        <div className="text-xs text-slate-500 font-mono mt-0.5">{student.indexNumber}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "font-bold",
                                            student.average >= 50 ? "text-slate-900" : "text-red-500"
                                        )}>
                                            {student.average}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {student.attendance}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                                            student.status === "Excellent" ? "bg-green-100 text-green-700" :
                                                student.status === "Good" ? "bg-blue-50 text-blue-700" :
                                                    student.status === "Average" ? "bg-amber-50 text-amber-700" :
                                                        student.status === "Warning" ? "bg-orange-50 text-orange-700" :
                                                            "bg-red-50 text-red-700"
                                        )}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-primary-600">
                                            <ArrowRight size={18} />
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
