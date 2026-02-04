import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Calendar,
    FileText,
    Download,
    ChevronDown,
    AlertCircle,
    Clock,
    CheckCircle2,
    Info,
    Megaphone
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Announcements Data
const announcements = [
    {
        id: "ANN-001",
        title: "Emergency Staff Meeting",
        sender: "Headmaster",
        role: "Administration",
        date: "2024-12-18",
        time: "08:30 AM",
        priority: "Urgent",
        isRead: false,
        preview: "There will be an emergency staff meeting today at 2:00 PM in the Staff Common Room regarding...",
        content: "There will be an emergency staff meeting today at 2:00 PM in the Staff Common Room regarding the upcoming district inspection. All teaching and non-teaching staff are required to attend. Please ensure your lesson notes are up to date.",
        attachment: null
    },
    {
        id: "ANN-002",
        title: "End of Term Examination Schedule",
        sender: "Mrs. Sarah Mensah",
        role: "Academic Overseer",
        date: "2024-12-15",
        time: "10:15 AM",
        priority: "Important",
        isRead: true,
        preview: "The final timetable for the end of term examinations has been released. Please review...",
        content: "The final timetable for the end of term examinations has been released. Please review the attached document and inform your students accordingly. Invigilation rosters will be circulated by Friday.",
        attachment: {
            name: "Exam_Timetable_Term1_2024.pdf",
            size: "1.2 MB"
        }
    },
    {
        id: "ANN-003",
        title: "Christmas Break Departure",
        sender: "Administration",
        role: "Management",
        date: "2024-12-10",
        time: "09:00 AM",
        priority: "Normal",
        isRead: true,
        preview: "School closes for the Christmas break on Friday, 20th December. Departure protocols are as follows...",
        content: "School closes for the Christmas break on Friday, 20th December. Departure protocols are as follows: 1. Ensure all class registers are marked and submitted. 2. Secure all teaching materials in your lockers. 3. Submit term reports to the main office before 4:00 PM.",
        attachment: {
            name: "Departure_Checklist.pdf",
            size: "450 KB"
        }
    },
    {
        id: "ANN-004",
        title: "New Syllalus Updates",
        sender: "Ghana Education Service",
        role: "External",
        date: "2024-11-28",
        time: "02:00 PM",
        priority: "Normal",
        isRead: true,
        preview: "The new curriculum updates for Basic 7-9 have been received. Workshop dates to be announced...",
        content: "The new curriculum updates for Basic 7-9 have been received. Workshop dates to be announced soon. Teachers are encouraged to download the new syllabus guide from the portal.",
        attachment: null
    }
];

export const TeacherAnnouncements = () => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [localAnnouncements, setLocalAnnouncements] = useState(announcements);

    const unreadCount = localAnnouncements.filter(a => !a.isRead).length;

    const toggleExpand = (id: string) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            // Mark as read when opening
            setLocalAnnouncements(prev => prev.map(a =>
                a.id === id ? { ...a, isRead: true } : a
            ));
        }
    };

    const getPriorityStyles = (priority: string) => {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'Important':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'Urgent':
                return <AlertCircle size={14} className="text-red-600" />;
            case 'Important':
                return <Info size={14} className="text-amber-600" />;
            default:
                return <Bell size={14} className="text-blue-600" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 relative">
            {/* Header Section */}
            <div className="sticky top-0 z-20 bg-slate-100/95 backdrop-blur-sm pt-4 pb-6 border-b border-slate-200 flex flex-col md:flex-row md:items-end justify-between gap-4 -mx-4 px-4 md:-mx-8 md:px-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                            <Megaphone size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Staff Notices</h1>
                    </div>
                    <p className="text-slate-500 font-medium">
                        CSchool • 2024/2025 Academic Year • Term 1
                    </p>
                </div>

                {unreadCount > 0 && (
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg shadow-slate-200">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-bold">{unreadCount} Unread Notice{unreadCount !== 1 && 's'}</span>
                    </div>
                )}
            </div>

            {/* Announcements List */}
            <div className="space-y-4">
                {localAnnouncements.map((announcement) => (
                    <motion.div
                        key={announcement.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "bg-white rounded-xl border transition-all duration-200 overflow-hidden",
                            !announcement.isRead ? "border-primary-200 shadow-md shadow-primary-50 ring-1 ring-primary-100" : "border-slate-200 shadow-sm hover:border-slate-300"
                        )}
                    >
                        {/* Card Header (Always Visible) */}
                        <div
                            onClick={() => toggleExpand(announcement.id)}
                            className="p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border flex items-center gap-1.5", getPriorityStyles(announcement.priority))}>
                                            {getPriorityIcon(announcement.priority)}
                                            {announcement.priority}
                                        </span>
                                        {!announcement.isRead && (
                                            <span className="px-2 py-0.5 bg-primary-600 text-white text-[10px] uppercase font-bold tracking-wider rounded-sm">
                                                New
                                            </span>
                                        )}
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(announcement.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1 border-l border-slate-200 pl-2">
                                            <Clock size={12} />
                                            {announcement.time}
                                        </span>
                                    </div>
                                    <h3 className={cn("text-lg font-bold", !announcement.isRead ? "text-slate-900" : "text-slate-700")}>
                                        {announcement.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-1">
                                        <span className="font-semibold text-slate-700">{announcement.sender} ({announcement.role}): </span>
                                        {announcement.preview}
                                    </p>
                                </div>
                                <div className="text-slate-400">
                                    <ChevronDown
                                        size={20}
                                        className={cn("transition-transform duration-200", expandedId === announcement.id && "rotate-180")}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                            {expandedId === announcement.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-slate-100 bg-slate-50/30"
                                >
                                    <div className="p-6 pt-2 space-y-6">
                                        <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed">
                                            <p>{announcement.content}</p>
                                        </div>

                                        {announcement.attachment && (
                                            <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg max-w-md hover:border-primary-200 transition-colors group cursor-pointer">
                                                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                                    <FileText size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary-700">
                                                        {announcement.attachment.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        PDF Document • {announcement.attachment.size}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary-600">
                                                    <Download size={18} />
                                                </Button>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                                            <span className="text-xs text-slate-400 italic">
                                                Released by {announcement.sender}
                                            </span>
                                            <Button size="sm" variant="outline" className="ml-auto gap-2">
                                                <CheckCircle2 size={16} />
                                                Acknowledge Read
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
