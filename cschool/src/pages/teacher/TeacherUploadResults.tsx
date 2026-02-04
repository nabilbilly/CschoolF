import { useState } from 'react';
import {
    Save,
    Lock,
    AlertCircle,
    CheckCircle2,
    ChevronRight,
    Users,
    BookOpen,
    Calendar,
    Layout
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Data for Selections
const classes = ["JHS 1 A", "JHS 1 B", "JHS 2 A", "JHS 2 B", "JHS 3 A"];
const subjects = ["Mathematics", "Integrated Science", "English Language", "Social Studies", "R.M.E", "ICT"];
const assessmentTypes = ["Class Test 1", "Class Test 2", "Mid-Term Exam", "End of Term Exam"];

// Mock Student Data
const mockStudents = [
    { id: "ST001", name: "Mensah, Sarah", indexNumber: "JHS24001" },
    { id: "ST002", name: "Osei, David", indexNumber: "JHS24002" },
    { id: "ST003", name: "Appiah, Kwame", indexNumber: "JHS24003" },
    { id: "ST004", name: "Boateng, Emmanuel", indexNumber: "JHS24004" },
    { id: "ST005", name: "Danso, Grace", indexNumber: "JHS24005" },
    { id: "ST006", name: "Amoah, Samuel", indexNumber: "JHS24006" },
    { id: "ST007", name: "Owusu, Elizabeth", indexNumber: "JHS24007" },
    { id: "ST008", name: "Kwakye, Isaac", indexNumber: "JHS24008" },
];

export const TeacherUploadResults = () => {
    // Selection State
    const [selectedYear] = useState("2024/2025");
    const [selectedTerm] = useState("Term 1");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedAssessment, setSelectedAssessment] = useState("");

    // Data Entry State
    const [isLoaded, setIsLoaded] = useState(false);
    const [classScores, setClassScores] = useState<Record<string, string>>({});
    const [examScores, setExamScores] = useState<Record<string, string>>({});
    const [remarks, setRemarks] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    // Helper: Calculate Grade
    const calculateGrade = (score: number) => {
        if (score >= 80) return { grade: '1', remark: 'Highest' };
        if (score >= 70) return { grade: '2', remark: 'Higher' };
        if (score >= 60) return { grade: '3', remark: 'High' };
        if (score >= 50) return { grade: '4', remark: 'High Average' };
        if (score >= 45) return { grade: '5', remark: 'Average' };
        if (score >= 40) return { grade: '6', remark: 'Low Average' };
        if (score >= 35) return { grade: '7', remark: 'Low' };
        if (score >= 30) return { grade: '8', remark: 'Lower' };
        return { grade: '9', remark: 'Lowest' };
    };

    // Derived State
    const canLoad = selectedClass && selectedSubject && selectedAssessment;
    const filledCount = Object.keys(classScores).length; // Simplified count, realistically check both or either
    const progress = isLoaded ? (filledCount / mockStudents.length) * 100 : 0;

    const handleScoreChange = (studentId: string, value: string, type: 'class' | 'exam') => {
        const max = type === 'class' ? 40 : 60;

        if (value === "") {
            if (type === 'class') setClassScores(prev => ({ ...prev, [studentId]: "" }));
            else setExamScores(prev => ({ ...prev, [studentId]: "" }));
            return;
        }

        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= max) {
            if (type === 'class') setClassScores(prev => ({ ...prev, [studentId]: value }));
            else setExamScores(prev => ({ ...prev, [studentId]: value }));
            setSaveStatus("idle");
        }
    };

    const handleRemarkChange = (studentId: string, value: string) => {
        setRemarks(prev => ({ ...prev, [studentId]: value }));
        setSaveStatus("idle");
    };

    const handleLoadList = () => {
        if (canLoad) {
            setIsLoaded(true);
            setSaveStatus("idle");
            // Reset scores on load?? Maybe not if persisting. For now relying on state.
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setSaveStatus("saved");
        }, 1000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Upload Results</h1>
                <p className="text-slate-500 mt-2">Select class details to begin entering scores. Break down by Class (40%) and Exam (60%).</p>
            </div>

            {/* Selection Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Academic Year */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar size={16} /> Academic Year
                        </label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" disabled>
                            <option>2024/2025</option>
                        </select>
                    </div>

                    {/* Term */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar size={16} /> Term
                        </label>
                        <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed" disabled>
                            <option>Term 1</option>
                        </select>
                    </div>

                    {/* Class Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Users size={16} /> Class
                        </label>
                        <select
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                            value={selectedClass}
                            onChange={(e) => { setSelectedClass(e.target.value); setIsLoaded(false); }}
                        >
                            <option value="">Select Class...</option>
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Subject Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <BookOpen size={16} /> Subject
                        </label>
                        <select
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                            value={selectedSubject}
                            onChange={(e) => { setSelectedSubject(e.target.value); setIsLoaded(false); }}
                        >
                            <option value="">Select Subject...</option>
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Assessment Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                            <Layout size={16} /> Assessment Type
                        </label>
                        <select
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary-100 outline-none"
                            value={selectedAssessment}
                            onChange={(e) => { setSelectedAssessment(e.target.value); setIsLoaded(false); }}
                        >
                            <option value="">Select Type...</option>
                            {assessmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <Button
                            className="w-full py-2.5"
                            disabled={!canLoad || isLoaded}
                            onClick={handleLoadList}
                        >
                            Load Student List <ChevronRight size={18} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Entry Table Section */}
            {isLoaded && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                                <Users size={16} /> {mockStudents.length} Students
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="mr-2 text-sm text-slate-500 font-medium">
                                {filledCount} of {mockStudents.length} Entered
                            </div>
                            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Student Details</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-32 text-center">Class (40%)</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-32 text-center">Exam (60%)</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-24 text-center">Total (100%)</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm w-24 text-center">Grade</th>
                                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Remarks (Optional)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {mockStudents.map((student) => {
                                    const classScore = classScores[student.id] || "";
                                    const examScore = examScores[student.id] || "";
                                    const hasClass = classScore !== "";
                                    const hasExam = examScore !== "";

                                    let totalScore = 0;
                                    let hasTotal = false;

                                    if (hasClass && hasExam) {
                                        totalScore = parseFloat(classScore) + parseFloat(examScore);
                                        hasTotal = true;
                                    }

                                    const gradeDetails = hasTotal ? calculateGrade(totalScore) : null;

                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{student.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">{student.indexNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="number" min="0" max="40" placeholder="-"
                                                    className={cn(
                                                        "w-20 p-2 text-center font-bold rounded-lg border outline-none focus:ring-2 transition-all",
                                                        hasClass ? "border-slate-300 bg-white text-slate-900 focus:border-primary-500" : "border-slate-200 bg-slate-50 text-slate-400"
                                                    )}
                                                    value={classScore}
                                                    onChange={(e) => handleScoreChange(student.id, e.target.value, 'class')}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="number" min="0" max="60" placeholder="-"
                                                    className={cn(
                                                        "w-20 p-2 text-center font-bold rounded-lg border outline-none focus:ring-2 transition-all",
                                                        hasExam ? "border-slate-300 bg-white text-slate-900 focus:border-primary-500" : "border-slate-200 bg-slate-50 text-slate-400"
                                                    )}
                                                    value={examScore}
                                                    onChange={(e) => handleScoreChange(student.id, e.target.value, 'exam')}
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={cn("font-bold text-lg", hasTotal ? "text-slate-900" : "text-slate-300")}>
                                                    {hasTotal ? totalScore : "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {gradeDetails ? (
                                                    <span className={cn(
                                                        "inline-flex w-8 h-8 items-center justify-center rounded-lg text-sm font-bold",
                                                        gradeDetails.grade === '1' ? "bg-green-100 text-green-700" :
                                                            gradeDetails.grade <= '4' ? "bg-blue-50 text-blue-700" :
                                                                gradeDetails.grade <= '6' ? "bg-amber-50 text-amber-700" :
                                                                    "bg-red-50 text-red-700"
                                                    )}>
                                                        {gradeDetails.grade}
                                                    </span>
                                                ) : <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="text" placeholder="Add remark..."
                                                    className="w-full p-2 text-sm rounded-lg border border-slate-200 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-slate-400"
                                                    value={remarks[student.id] || ""}
                                                    onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between sticky bottom-0 z-10">
                        <div className="flex items-center gap-2">
                            {saveStatus === "saved" && (
                                <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-in fade-in duration-300">
                                    <CheckCircle2 size={16} /> Saved
                                </span>
                            )}
                            {saveStatus === "idle" && filledCount > 0 && (
                                <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
                                    <AlertCircle size={16} /> Unsaved changes
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleSave} disabled={isSaving || filledCount === 0} className="w-32">
                                {isSaving ? "Saving..." : <><Save size={18} /> Save Draft</>}
                            </Button>
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
                                <Lock size={18} /> Submit & Lock
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
