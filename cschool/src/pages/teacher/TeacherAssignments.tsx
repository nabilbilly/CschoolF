import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Calendar,
    Users,
    BookOpen,
    FileText,
    Image as ImageIcon,
    Paperclip,
    X
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Data
const assignmentsMock = [
    {
        id: 1,
        title: "Algebraic Expressions Practice",
        class: "JHS 2 A",
        subject: "Mathematics",
        datePosted: "Oct 24, 2024",
        dueDate: "Oct 28, 2024",
        status: "Active",
        attachments: 2
    },
    {
        id: 2,
        title: "Photosynthesis Diagram Labeling",
        class: "JHS 3 B",
        subject: "Integrated Science",
        datePosted: "Oct 22, 2024",
        dueDate: "Oct 25, 2024",
        status: "Active",
        attachments: 1
    },
    {
        id: 3,
        title: "Essay: My memorable day",
        class: "Primary 6 A",
        subject: "English Language",
        datePosted: "Oct 15, 2024",
        dueDate: "Oct 18, 2024",
        status: "Expired",
        attachments: 0
    }
];

const assignedClasses = ["JHS 2 A", "JHS 3 B", "Primary 6 A"];
const subjects = ["Mathematics", "Integrated Science", "English Language", "Social Studies", "ICT"];

export const TeacherAssignments = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [assignments, setAssignments] = useState(assignmentsMock);

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newClass, setNewClass] = useState("");
    const [newSubject, setNewSubject] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [newContent, setNewContent] = useState("");
    const [attachmentType, setAttachmentType] = useState<'none' | 'image' | 'file'>('none');

    const handlePost = () => {
        // Logic to add assignment
        const newAssignment = {
            id: assignments.length + 1,
            title: newTitle,
            class: newClass,
            subject: newSubject,
            datePosted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            dueDate: newDueDate ? new Date(newDueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "No Due Date",
            status: "Active",
            attachments: attachmentType !== 'none' ? 1 : 0
        };

        setAssignments([newAssignment, ...assignments]);
        setIsCreating(false);
        // Reset form
        setNewTitle("");
        setNewClass("");
        setNewSubject("");
        setNewDueDate("");
        setNewContent("");
        setAttachmentType('none');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm pt-4 pb-2 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Assignments</h1>
                        <p className="text-slate-500 mt-1">Post homework and manage class tasks.</p>
                    </div>
                    {!isCreating && (
                        <Button onClick={() => setIsCreating(true)} className="bg-slate-900 text-white gap-2 shadow-lg shadow-slate-900/20">
                            <Plus size={20} /> Post Assignment
                        </Button>
                    )}
                </div>

                {!isCreating && (
                    /* Filters - Sticky with Header */
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-slate-200/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-primary-500 w-64"
                            />
                        </div>
                        <Button variant="ghost" className="bg-white border border-slate-200 text-slate-600 gap-2">
                            <Filter size={16} /> Filter
                        </Button>
                    </div>
                )}
            </div>

            {/* Create Mode */}
            {isCreating ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">New Assignment</h2>
                        <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
                            <X size={20} />
                        </Button>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Class</label>
                                <select
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                                    value={newClass}
                                    onChange={(e) => setNewClass(e.target.value)}
                                >
                                    <option value="">Select Class...</option>
                                    {assignedClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Subject</label>
                                <select
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                                    value={newSubject}
                                    onChange={(e) => setNewSubject(e.target.value)}
                                >
                                    <option value="">Select Subject...</option>
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Title</label>
                            <input
                                type="text"
                                placeholder="E.g., Chapter 4 Review Questions"
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Instructions / Content</label>
                            <textarea
                                rows={4}
                                placeholder="Type the assignment details here..."
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all resize-none"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Due Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-100 transition-all"
                                    value={newDueDate}
                                    onChange={(e) => setNewDueDate(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Attachments</label>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setAttachmentType(attachmentType === 'image' ? 'none' : 'image')}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all w-full justify-center",
                                            attachmentType === 'image' ? "bg-primary-50 text-primary-700 border-primary-200 ring-2 ring-primary-100" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <ImageIcon size={18} /> Image
                                    </button>
                                    <button
                                        onClick={() => setAttachmentType(attachmentType === 'file' ? 'none' : 'file')}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all w-full justify-center",
                                            attachmentType === 'file' ? "bg-primary-50 text-primary-700 border-primary-200 ring-2 ring-primary-100" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                        )}
                                    >
                                        <Paperclip size={18} /> File
                                    </button>
                                </div>
                            </div>
                        </div>

                        {attachmentType !== 'none' && (
                            <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                {attachmentType === 'image' ? <ImageIcon size={32} className="mb-2 opacity-50" /> : <Paperclip size={32} className="mb-2 opacity-50" />}
                                <span className="text-sm font-medium">Click to upload {attachmentType}</span>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button
                                onClick={handlePost}
                                disabled={!newTitle || !newClass || !newSubject}
                                className="bg-slate-900 text-white"
                            >
                                Post Assignment
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                /* List View */
                <div className="grid grid-cols-1 gap-4">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            assignment.status === 'Active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                                        )}>
                                            {assignment.status}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                            <Calendar size={12} /> Posted {assignment.datePosted}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">
                                        {assignment.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mt-2">
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                            <Users size={14} className="text-slate-400" /> {assignment.class}
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                                            <BookOpen size={14} className="text-slate-400" /> {assignment.subject}
                                        </span>
                                        {assignment.dueDate && (
                                            <span className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-md border border-orange-100">
                                                <Calendar size={14} /> Due {assignment.dueDate}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                    <MoreVertical size={18} />
                                </Button>
                            </div>

                            {assignment.attachments > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
                                    <Paperclip size={14} /> {assignment.attachments} Attachment{assignment.attachments > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
