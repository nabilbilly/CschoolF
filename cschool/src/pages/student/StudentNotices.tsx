import { useState } from 'react';
import {
    Bell,
    Calendar,
    User,
    ChevronDown,
    ChevronUp,
    Download,
    FileText,
    AlertCircle,
    Check
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/common/Button';

// Mock Data
interface Attachment {
    name: string;
    size: string;
    type: 'pdf' | 'image' | 'doc';
}

interface Notice {
    id: number;
    title: string;
    sender: string;
    role: string;
    date: string;
    preview: string;
    content: string;
    isImportant: boolean;
    isRead: boolean;
    attachments?: Attachment[];
}

const mockNotices: Notice[] = [
    {
        id: 1,
        title: "Mid-Term Examination Schedule",
        sender: "Mr. Mensah",
        role: "Head Teacher",
        date: "Today, 08:30 AM",
        preview: "The timetable for the upcoming mid-term examinations has been finalized. Please review the attached schedule carefully...",
        content: "The timetable for the upcoming mid-term examinations has been finalized. Please review the attached schedule carefully to ensure you are prepared. Exams will begin on Monday, 25th November. All students must be seated 30 minutes before each paper. Good luck!",
        isImportant: true,
        isRead: false,
        attachments: [
            { name: "MidTerm_Timetable_JHS2.pdf", size: "1.2 MB", type: "pdf" }
        ]
    },
    {
        id: 2,
        title: "ICT Lab Maintenance",
        sender: "Mr. Antwi",
        role: "ICT Teacher",
        date: "Yesterday, 02:15 PM",
        preview: "The ICT Laboratory will be closed for maintenance this Friday. All practical sessions will be rescheduled...",
        content: "The ICT Laboratory will be closed for maintenance this Friday. All practical sessions will be rescheduled to next week Tuesday. Please bring your textbooks for a theory session in the classroom instead.",
        isImportant: false,
        isRead: false
    },
    {
        id: 3,
        title: "Speech and Prize Giving Day",
        sender: "School Administration",
        role: "Admin",
        date: "12 Oct 2024",
        preview: "We are excited to announce our annual Speech and Prize Giving Day scheduled for next month...",
        content: "We are excited to announce our annual Speech and Prize Giving Day scheduled for next month. Parents are cordially invited to attend. We will be awarding students for excellence in academics, sports, and character. Rehearsals for the cultural troop begin this Wednesday.",
        isImportant: true,
        isRead: true
    },
    {
        id: 4,
        title: "New Library Books Arrival",
        sender: "Mrs. Kwarteng",
        role: "Librarian",
        date: "10 Oct 2024",
        preview: "A new collection of science fiction and history books has arrived in the library...",
        content: "A new collection of science fiction and history books has arrived in the library. Students are encouraged to visit during break times to borrow books. Remember, reading broadens the mind!",
        isImportant: false,
        isRead: true
    }
];

export const StudentNotices = () => {
    const [notices, setNotices] = useState<Notice[]>(mockNotices);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const unreadCount = notices.filter(n => !n.isRead).length;

    const toggleExpand = (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            // Mark as read when opened
            setNotices(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur pt-4 pb-4 border-b border-slate-200/50 -mx-6 px-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <Bell className="text-primary-600" />
                            Notices
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                                    {unreadCount} NEW
                                </span>
                            )}
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm md:text-base">Stay updated with the latest announcements from school.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">JHS 2</span>
                        <span>•</span>
                        <span>Term 1</span>
                    </div>
                </div>
            </div>

            {/* Notices List */}
            <div className="space-y-4">
                {notices.map((notice) => (
                    <div
                        key={notice.id}
                        className={cn(
                            "bg-white rounded-2xl border transition-all duration-200 overflow-hidden",
                            expandedId === notice.id ? "shadow-md border-primary-100 ring-1 ring-primary-50" : "shadow-sm border-slate-200 hover:border-primary-200",
                            !notice.isRead && expandedId !== notice.id && "bg-slate-50/50"
                        )}
                    >
                        {/* Card Header / Preview */}
                        <div
                            onClick={() => toggleExpand(notice.id)}
                            className="p-5 cursor-pointer flex gap-4"
                        >
                            {/* Icon / Status */}
                            <div className="flex-shrink-0 mt-1">
                                {notice.isImportant ? (
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                        <AlertCircle size={20} />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Bell size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-1">
                                    <div className="space-y-1">
                                        <h3 className={cn(
                                            "text-lg font-bold truncate pr-4",
                                            !notice.isRead ? "text-slate-900" : "text-slate-700"
                                        )}>
                                            {notice.title}
                                            {!notice.isRead && (
                                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 align-middle" />
                                            )}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <User size={12} />
                                                {notice.sender} <span className="text-slate-300">|</span> {notice.role}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                {notice.date}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-slate-400">
                                        {expandedId === notice.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>

                                {/* Preview Text (only if not expanded) */}
                                {expandedId !== notice.id && (
                                    <p className="text-slate-600 text-sm line-clamp-2 mt-2 leading-relaxed">
                                        {notice.preview}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedId === notice.id && (
                            <div className="px-5 pb-6 pl-[4.5rem] animate-in slide-in-from-top-2 duration-200">
                                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                                    {notice.content}
                                </p>

                                {notice.attachments && (
                                    <div className="mt-4 space-y-2">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Attachments</h4>
                                        {notice.attachments.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-700 group-hover:text-primary-700 transition-colors">{file.name}</p>
                                                        <p className="text-xs text-slate-400">{file.size}</p>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="ghost" className="text-primary-600 hover:bg-white hover:shadow-sm">
                                                    <Download size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                        <Check size={12} />
                                        Marked as Read
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {notices.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Bell className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-600">No Notices Yet</h3>
                    <p className="text-slate-400">You're all caught up! Check back later for announcements.</p>
                </div>
            )}
        </div>
    );
};
