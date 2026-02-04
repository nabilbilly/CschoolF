import { useState } from 'react';
import {
    Book,
    Calendar,
    User,
    Clock,
    AlertCircle,
    CheckCircle2,
    FileText,
    Download,
    X,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/common/Button';

interface Attachment {
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'doc';
}

interface Assignment {
    id: number;
    subject: string;
    topic: string;
    teacher: string;
    postedDate: string;
    dueDate: string;
    status: 'New' | 'Active' | 'Expired';
    instructions: string;
    attachments?: Attachment[];
}

const mockAssignments: Assignment[] = [
    {
        id: 1,
        subject: "Mathematics",
        topic: "Algebraic Expressions",
        teacher: "Mr. Mensah",
        postedDate: "Today",
        dueDate: "Fri, 24 Nov",
        status: "New",
        instructions: "Please complete exercises 1-10 on page 45 of your textbook. Show all working steps clearly in your notebook. Also, review the attached worksheet for additional practice problems.",
        attachments: [
            { name: "Algebra_Worksheet.pdf", size: "1.5 MB", type: "pdf" }
        ]
    },
    {
        id: 2,
        subject: "Integrated Science",
        topic: "Photosynthesis Process",
        teacher: "Mrs. Osei",
        postedDate: "Yesterday",
        dueDate: "Mon, 27 Nov",
        status: "Active",
        instructions: "Draw and label the diagram of a leaf cross-section. Briefly explain the function of the stomata in the process of photosynthesis. Use the attached diagram as a reference.",
        attachments: [
            { name: "Leaf_Diagram.jpg", size: "850 KB", type: "image" }
        ]
    },
    {
        id: 3,
        subject: "English Language",
        topic: "Narrative Essay",
        teacher: "Ms. Appiah",
        postedDate: "20 Nov 2024",
        dueDate: "22 Nov 2024",
        status: "Expired",
        instructions: "Write a story ending with the phrase '...and I realized it was all a dream.' construction. Your essay should not be less than 400 words.",
    },
    {
        id: 4,
        subject: "R.M.E",
        topic: "Religious Festivals",
        teacher: "Mr. Boateng",
        postedDate: "18 Nov 2024",
        dueDate: "25 Nov 2024",
        status: "Active",
        instructions: "List five religious festivals celebrated in Ghana and the ethnic groups that celebrate them. Explain the significance of one of these festivals.",
    }
];

export const StudentAssignments = () => {
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

    return (
        <div className="space-y-6 pb-20 relative min-h-screen">

            {/* Main List View */}
            <div className={cn("transition-all duration-300", selectedAssignment ? "opacity-0 pointer-events-none hidden" : "opacity-100")}>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur pt-4 pb-4 border-b border-slate-200/50 -mx-6 px-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                <Book className="text-primary-600" />
                                Assignments
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm md:text-base">View your homework and class tasks.</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">JHS 2</span>
                            <span>•</span>
                            <span>Term 1</span>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockAssignments.map((assignment) => (
                        <div
                            key={assignment.id}
                            onClick={() => setSelectedAssignment(assignment)}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group flex flex-col h-full"
                        >
                            <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-xs font-bold border",
                                        assignment.status === 'New' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                            assignment.status === 'Active' ? "bg-green-50 text-green-600 border-green-100" :
                                                "bg-slate-100 text-slate-500 border-slate-200"
                                    )}>
                                        {assignment.status.toUpperCase()}
                                    </span>
                                    {assignment.attachments && (
                                        <div className="text-slate-400">
                                            <FileText size={18} />
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                                    {assignment.subject}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium mb-4">{assignment.topic}</p>

                                <div className="space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-slate-400" />
                                        {assignment.teacher}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-slate-400" />
                                        Due: <span className={cn(
                                            "font-medium",
                                            assignment.status === 'Expired' ? "text-red-500" : "text-slate-900"
                                        )}>{assignment.dueDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex items-center justify-between text-sm font-medium text-primary-600 group-hover:bg-primary-50/30 transition-colors">
                                <span>View Details</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail View Overlay */}
            {selectedAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={() => setSelectedAssignment(null)}
                    />
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedAssignment.subject}</h2>
                                <p className="text-sm text-slate-500">{selectedAssignment.topic}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedAssignment(null)}
                                className="rounded-full hover:bg-slate-100"
                            >
                                <X size={24} className="text-slate-500" />
                            </Button>
                        </div>

                        <div className="p-6 md:p-8 space-y-8">
                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 md:gap-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher</span>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <User size={16} className="text-primary-500" />
                                        {selectedAssignment.teacher}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Date</span>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Calendar size={16} className="text-primary-500" />
                                        {selectedAssignment.postedDate}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</span>
                                    <div className="flex items-center gap-2 font-medium text-slate-900">
                                        <Clock size={16} className="text-primary-500" />
                                        {selectedAssignment.dueDate}
                                    </div>
                                </div>
                            </div>

                            {/* Instructions */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <Book size={20} className="text-slate-400" />
                                    Instructions
                                </h3>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed bg-white p-1">
                                    {selectedAssignment.instructions}
                                </div>
                            </div>

                            {/* Attachments */}
                            {selectedAssignment.attachments && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <FileText size={20} className="text-slate-400" />
                                        Attachments
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedAssignment.attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center p-3 border border-slate-200 rounded-xl hover:border-primary-200 hover:bg-slate-50 transition-colors group cursor-pointer">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-primary-600 group-hover:bg-white transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                                                    <p className="text-xs text-slate-500">{file.size}</p>
                                                </div>
                                                <Button size="icon" variant="ghost" className="text-slate-400 group-hover:text-primary-600">
                                                    <Download size={18} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Status Banner */}
                            <div className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border",
                                selectedAssignment.status === 'New' ? "bg-blue-50 border-blue-100 text-blue-700" :
                                    selectedAssignment.status === 'Active' ? "bg-green-50 border-green-100 text-green-700" :
                                        "bg-slate-50 border-slate-200 text-slate-600"
                            )}>
                                <AlertCircle size={20} />
                                <div className="text-sm">
                                    {selectedAssignment.status === 'New' && "This assignment is new. Check the due date!"}
                                    {selectedAssignment.status === 'Active' && "This assignment is currently active."}
                                    {selectedAssignment.status === 'Expired' && "The deadline for this assignment has passed."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
