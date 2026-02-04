import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Users,
    MoreHorizontal,
    Filter
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';

// Mock Timetable Data
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

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Simple Mock Schedule Structure
// Key: "Day-Index" (e.g., "Monday-0" for Mon 8-9)
const scheduleData: Record<string, { subject: string; class: string; room?: string; color: string; type?: 'break' }> = {
    // Monday
    "Monday-0": { subject: "Mathematics", class: "JHS 2 A", room: "Block A, Rm 4", color: "bg-blue-100 text-blue-800 border-blue-200" },
    "Monday-1": { subject: "Mathematics", class: "JHS 2 B", room: "Block A, Rm 5", color: "bg-blue-100 text-blue-800 border-blue-200" },
    "Monday-2": { subject: "Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Monday-3": { subject: "General Science", class: "JHS 3 A", room: "Lab 1", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    "Monday-5": { subject: "Lunch Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Monday-6": { subject: "ICT", class: "Primary 6 A", room: "Comp Lab", color: "bg-purple-100 text-purple-800 border-purple-200" },

    // Tuesday
    "Tuesday-0": { subject: "General Science", class: "JHS 3 B", room: "Lab 2", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    "Tuesday-2": { subject: "Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Tuesday-3": { subject: "Mathematics", class: "JHS 2 A", room: "Block A, Rm 4", color: "bg-blue-100 text-blue-800 border-blue-200" },
    "Tuesday-5": { subject: "Lunch Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },

    // ... add more for full effect ...
    "Wednesday-1": { subject: "Staff Meeting", class: "Staff Room", color: "bg-amber-100 text-amber-800 border-amber-200" },
    "Wednesday-2": { subject: "Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Wednesday-5": { subject: "Lunch Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Thursday-2": { subject: "Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Thursday-5": { subject: "Lunch Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Friday-2": { subject: "Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
    "Friday-5": { subject: "Lunch Break", class: "", color: "bg-slate-100 text-slate-500", type: 'break' },
};

export const TeacherTimetable = () => {
    const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
    const [currentDay, setCurrentDay] = useState("Monday");

    // Helper to get lesson for cell
    const getLesson = (day: string, timeIndex: number) => {
        return scheduleData[`${day}-${timeIndex}`];
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        My Timetable
                        <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                            2024/2025 • Term 1
                        </span>
                    </h1>
                    <p className="text-slate-500 mt-1">Manage your weekly schedule and lesson plans.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('daily')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            viewMode === 'daily' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        Daily View
                    </button>
                    <button
                        onClick={() => setViewMode('weekly')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            viewMode === 'weekly' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                        )}
                    >
                        Weekly View
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-1" />
                    <Button variant="ghost" className="h-9 px-3 text-slate-500">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            {/* Weekly Grid View */}
            {viewMode === 'weekly' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Header Row */}
                        <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-slate-50 border-b border-slate-200">
                            <div className="p-4 text-center font-bold text-slate-400 text-xs uppercase tracking-wider border-r border-slate-200">
                                Time
                            </div>
                            {weekDays.map(day => (
                                <div key={day} className={cn(
                                    "p-4 text-center font-bold text-sm border-r border-slate-200 last:border-r-0",
                                    day === currentDay ? "text-primary-600 bg-primary-50/50" : "text-slate-700"
                                )}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        {timeSlots.map((time, index) => (
                            <div key={index} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-slate-100 last:border-b-0">
                                <div className="p-3 text-xs font-medium text-slate-400 border-r border-slate-200 flex items-center justify-center text-center">
                                    {time}
                                </div>
                                {weekDays.map(day => {
                                    const lesson = getLesson(day, index);
                                    if (!lesson) return <div key={day} className="border-r border-slate-100 last:border-r-0 p-2" />;

                                    // Check for breaks spanning full width? 
                                    // For simple grid, we duplicate breaks or just visually style them.
                                    // Here distinct cells.

                                    return (
                                        <div key={day} className="border-r border-slate-100 last:border-r-0 p-2">
                                            <div className={cn(
                                                "h-full w-full rounded-xl p-3 border transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between min-h-[100px]",
                                                lesson.color,
                                                lesson.type === 'break' && "min-h-[40px] justify-center items-center opacity-70"
                                            )}>
                                                {lesson.type === 'break' ? (
                                                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{lesson.subject}</span>
                                                ) : (
                                                    <>
                                                        <div>
                                                            <h4 className="font-bold text-sm mb-1 line-clamp-2">{lesson.subject}</h4>
                                                            <div className="flex items-center gap-1.5 text-xs opacity-80 mb-1">
                                                                <Users size={12} /> {lesson.class}
                                                            </div>
                                                            {lesson.room && (
                                                                <div className="flex items-center gap-1.5 text-xs opacity-80">
                                                                    <MapPin size={12} /> {lesson.room}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button className="p-1 hover:bg-black/10 rounded-full">
                                                                <MoreHorizontal size={16} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Daily List View (Mobile Optimized) */}
            {viewMode === 'daily' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                    {/* Day Navigation */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                        <Button variant="ghost" onClick={() => setCurrentDay("Monday")}> <ChevronLeft /> </Button>
                        <h2 className="text-xl font-bold text-slate-900">{currentDay}</h2>
                        <Button variant="ghost" onClick={() => setCurrentDay("Tuesday")}> <ChevronRight /> </Button>
                    </div>

                    {timeSlots.map((time, index) => {
                        const lesson = getLesson(currentDay, index);
                        if (!lesson && lesson !== undefined) return null; // Skip empty slots? Or show "Free"

                        return (
                            <div key={index} className="flex gap-4 group">
                                <div className="w-16 pt-2 text-right">
                                    <div className="text-sm font-bold text-slate-700">{time.split(" - ")[0]}</div>
                                    <div className="text-xs text-slate-400">{time.split(" - ")[1]}</div>
                                </div>

                                <div className="relative flex-1 pb-8 border-l-2 border-slate-200 pl-6 last:border-l-0">
                                    <div className={cn(
                                        "absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-200 bg-slate-400",
                                        lesson && !lesson.type ? "bg-primary-500 ring-primary-200" : "bg-slate-200"
                                    )} />

                                    {!lesson ? (
                                        <div className="h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm italic">
                                            Free Period
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "rounded-xl p-4 border shadow-sm transition-all hover:shadow-md",
                                            lesson.color
                                        )}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg">{lesson.subject}</h3>
                                                {lesson.type !== 'break' && <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal size={16} /></Button>}
                                            </div>
                                            {lesson.type !== 'break' && (
                                                <div className="flex items-center gap-4 text-sm opacity-90">
                                                    <span className="flex items-center gap-1.5"><Users size={14} /> {lesson.class}</span>
                                                    {lesson.room && <span className="flex items-center gap-1.5"><MapPin size={14} /> {lesson.room}</span>}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
