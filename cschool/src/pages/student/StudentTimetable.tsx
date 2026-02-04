import { useState } from 'react';
import {
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    User,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    X,
    ArrowRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/common/Button';

// Mock Data
const timeSlots = [
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 10:30", // Break
    "10:30 - 11:30",
    "11:30 - 12:30",
    "12:30 - 13:30", // Lunch
    "13:30 - 14:30",
    "14:30 - 15:30"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Simple mock lessons generator
const schedule = [
    { id: 1, day: "Monday", time: "08:00 - 09:00", subject: "Mathematics", teacher: "Mr. Mensah", room: "Block A - R2", color: "bg-blue-100 border-blue-200 text-blue-800" },
    { id: 2, day: "Monday", time: "09:00 - 10:00", subject: "English Lang", teacher: "Mrs. Appiah", room: "Block A - R2", color: "bg-green-100 border-green-200 text-green-800" },
    { id: 3, day: "Monday", time: "10:30 - 11:30", subject: "Science", teacher: "Mr. Osei", room: "Lab 1", color: "bg-purple-100 border-purple-200 text-purple-800" },
    { id: 4, day: "Monday", time: "11:30 - 12:30", subject: "Social Studies", teacher: "Ms. Agyemang", room: "Block A - R2", color: "bg-orange-100 border-orange-200 text-orange-800" },
    { id: 5, day: "Monday", time: "13:30 - 14:30", subject: "ICT", teacher: "Mr. Antwi", room: "Comp Lab", color: "bg-indigo-100 border-indigo-200 text-indigo-800" },

    { id: 6, day: "Tuesday", time: "08:00 - 09:00", subject: "Science", teacher: "Mr. Osei", room: "Lab 1", color: "bg-purple-100 border-purple-200 text-purple-800" },
    { id: 7, day: "Tuesday", time: "09:00 - 10:00", subject: "Mathematics", teacher: "Mr. Mensah", room: "Block A - R2", color: "bg-blue-100 border-blue-200 text-blue-800" },
    { id: 8, day: "Tuesday", time: "10:30 - 11:30", subject: "R.M.E", teacher: "Rev. Owusu", room: "Block A - R2", color: "bg-yellow-100 border-yellow-200 text-yellow-800" },
    { id: 9, day: "Tuesday", time: "11:30 - 12:30", subject: "English Lang", teacher: "Mrs. Appiah", room: "Block A - R2", color: "bg-green-100 border-green-200 text-green-800" },

    { id: 10, day: "Wednesday", time: "08:00 - 09:00", subject: "French", teacher: "Madame Yvette", room: "Block B - R5", color: "bg-pink-100 border-pink-200 text-pink-800" },
    { id: 11, day: "Wednesday", time: "09:00 - 10:00", subject: "Ghanaian Lang", teacher: "Mr. Boakye", room: "Block A - R2", color: "bg-teal-100 border-teal-200 text-teal-800" },
    { id: 12, day: "Wednesday", time: "10:30 - 11:30", subject: "Mathematics", teacher: "Mr. Mensah", room: "Block A - R2", color: "bg-blue-100 border-blue-200 text-blue-800" },
    { id: 13, day: "Wednesday", time: "11:30 - 12:30", subject: "Science", teacher: "Mr. Osei", room: "Lab 1", color: "bg-purple-100 border-purple-200 text-purple-800" },

    { id: 14, day: "Thursday", time: "08:00 - 09:00", subject: "Social Studies", teacher: "Ms. Agyemang", room: "Block A - R2", color: "bg-orange-100 border-orange-200 text-orange-800" },
    { id: 15, day: "Thursday", time: "09:00 - 10:00", subject: "ICT", teacher: "Mr. Antwi", room: "Comp Lab", color: "bg-indigo-100 border-indigo-200 text-indigo-800" },
    { id: 16, day: "Thursday", time: "10:30 - 11:30", subject: "English Lang", teacher: "Mrs. Appiah", room: "Block A - R2", color: "bg-green-100 border-green-200 text-green-800" },

    { id: 17, day: "Friday", time: "08:00 - 09:00", subject: "Physical Ed.", teacher: "Coach Kyei", room: "Field", color: "bg-red-100 border-red-200 text-red-800" },
    { id: 18, day: "Friday", time: "09:00 - 10:00", subject: "Creative Arts", teacher: "Ms. Dede", room: "Art Studio", color: "bg-rose-100 border-rose-200 text-rose-800" },
    { id: 19, day: "Friday", time: "10:30 - 12:30", subject: "Library / Reading", teacher: "Mrs. Kwarteng", room: "Library", color: "bg-sky-100 border-sky-200 text-sky-800" },
];

interface Lesson {
    id: number;
    day: string;
    time: string;
    subject: string;
    teacher: string;
    room: string;
    color: string;
}

export const StudentTimetable = () => {
    const [view, setView] = useState<'weekly' | 'daily'>('weekly');
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

    // Current time helpers (mock)
    const currentDay = "Monday"; // In real app, new Date().toLocaleDateString(...)

    const getLessonsForSlot = (day: string, time: string) => {
        return schedule.find(s => s.day === day && s.time === time);
    };

    const getLessonsForDay = (day: string) => {
        return schedule
            .filter(s => s.day === day)
            .sort((a, b) => timeSlots.indexOf(a.time) - timeSlots.indexOf(b.time));
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarIcon className="text-primary-600" />
                        My Timetable
                    </h1>
                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-sm font-medium">
                        <span className="bg-slate-100 px-2.5 py-0.5 rounded-md text-slate-600 border border-slate-200">JHS 2 - A</span>
                        <span>•</span>
                        <span>Academic Year 2024/2025</span>
                        <span>•</span>
                        <span>Term 1</span>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setView('weekly')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            view === 'weekly' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Weekly View
                    </button>
                    <button
                        onClick={() => setView('daily')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                            view === 'daily' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        Daily View
                    </button>
                </div>
            </div>

            {/* Weekly View */}
            {view === 'weekly' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                            <div className="p-4 font-semibold text-slate-500 text-sm text-center border-r border-slate-200">
                                Time
                            </div>
                            {days.map(day => (
                                <div
                                    key={day}
                                    className={cn(
                                        "p-4 font-bold text-sm text-center border-r border-slate-200 last:border-r-0",
                                        day === currentDay ? "bg-primary-50 text-primary-700" : "text-slate-700"
                                    )}
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="divide-y divide-slate-100">
                            {timeSlots.map(time => {
                                const isBreak = time.includes("10:00") || time.includes("12:30");

                                if (isBreak) {
                                    return (
                                        <div key={time} className="grid grid-cols-[100px_1fr] bg-slate-50/50">
                                            <div className="p-3 text-xs font-medium text-slate-400 text-center border-r border-slate-200 flex items-center justify-center">
                                                {time}
                                            </div>
                                            <div className="p-2 text-center text-xs font-bold tracking-widest text-slate-300 uppercase flex items-center justify-center">
                                                {time.includes("10:00") ? "Snack Break" : "Lunch Break"}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)]">
                                        <div className="p-3 text-xs font-bold text-slate-500 text-center border-r border-slate-200 flex items-center justify-center">
                                            {time}
                                        </div>
                                        {days.map(day => {
                                            const lesson = getLessonsForSlot(day, time);
                                            return (
                                                <div key={`${day}-${time}`} className="p-1 border-r border-slate-100 last:border-r-0 min-h-[100px]">
                                                    {lesson ? (
                                                        <button
                                                            onClick={() => setSelectedLesson(lesson)}
                                                            className={cn(
                                                                "w-full h-full rounded-xl p-3 text-left transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer flex flex-col justify-between group",
                                                                lesson.color
                                                            )}
                                                        >
                                                            <div>
                                                                <div className="font-bold text-sm leading-tight group-hover:underline decoration-2 underline-offset-2">
                                                                    {lesson.subject}
                                                                </div>
                                                                <div className="text-[11px] opacity-80 mt-1 font-medium truncate">
                                                                    {lesson.teacher}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-[10px] opacity-70 font-bold uppercase tracking-wider">
                                                                <MapPin size={10} />
                                                                {lesson.room}
                                                            </div>
                                                        </button>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-[10px] text-slate-300 font-medium">Free Period</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Daily View - Mobile Friendly */}
            {view === 'daily' && (
                <div className="space-y-6">
                    {/* Day Selector */}
                    <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const idx = days.indexOf(selectedDay);
                                if (idx > 0) setSelectedDay(days[idx - 1]);
                            }}
                            disabled={days.indexOf(selectedDay) === 0}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <span className="font-bold text-slate-800 text-lg w-32 text-center">{selectedDay}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const idx = days.indexOf(selectedDay);
                                if (idx < days.length - 1) setSelectedDay(days[idx + 1]);
                            }}
                            disabled={days.indexOf(selectedDay) === days.length - 1}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                        {getLessonsForDay(selectedDay).length > 0 ? (
                            getLessonsForDay(selectedDay).map((lesson, idx) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => setSelectedLesson(lesson)}
                                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 hover:border-primary-200 transition-colors cursor-pointer"
                                >
                                    <div className="flex flex-col items-center gap-2 min-w-[60px]">
                                        <div className="text-xs font-bold text-slate-400">
                                            {lesson.time.split(" - ")[0]}
                                        </div>
                                        <div className="w-0.5 h-full bg-slate-100 rounded-full"></div>
                                        <div className="text-xs font-bold text-slate-400">
                                            {lesson.time.split(" - ")[1]}
                                        </div>
                                    </div>
                                    <div className={cn("flex-1 p-4 rounded-xl border", lesson.color)}>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg">{lesson.subject}</h3>
                                            <ArrowRight size={18} className="opacity-50" />
                                        </div>
                                        <div className="flex flex-wrap gap-3 text-sm opacity-90">
                                            <div className="flex items-center gap-1.5">
                                                <User size={14} />
                                                <span>{lesson.teacher}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} />
                                                <span>{lesson.room}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                <span>60 mins</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                <p>No classes scheduled for {selectedDay}.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Lesson Details Modal */}
            {selectedLesson && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className={cn("p-6 text-center relative", selectedLesson.color)}>
                            <button
                                onClick={() => setSelectedLesson(null)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors text-slate-900"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold mb-2">{selectedLesson.subject}</h2>
                            <p className="font-medium opacity-80 text-sm">{selectedLesson.day}, {selectedLesson.time}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Teacher</p>
                                    <p className="font-bold text-slate-900">{selectedLesson.teacher}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Room / Location</p>
                                    <p className="font-bold text-slate-900">{selectedLesson.room}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Duration</p>
                                    <p className="font-bold text-slate-900">1 Hour</p>
                                </div>
                            </div>

                            <Button className="w-full mt-2" onClick={() => setSelectedLesson(null)}>
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
