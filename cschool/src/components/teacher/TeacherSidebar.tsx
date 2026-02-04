import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    ClipboardList,
    Trophy,
    Bell,
    User,
    LogOut,
    ChevronDown,
    ChevronRight,
    School,
    CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Teacher Data
const teacher = {
    name: "Mr. David Osei",
    role: "Senior Instructor",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=150&auto=format&fit=crop"
};

// Mock Data for Dropdowns
const assignedClasses = [
    { name: "Primary 6 - A", role: "Subject Teacher" }
];

interface TeacherSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TeacherSidebar = ({ isOpen, onClose }: TeacherSidebarProps) => {
    // State for expanded menus
    const [expanded, setExpanded] = useState<string | null>(null);
    const [registrationExpanded, setRegistrationExpanded] = useState(false);

    const toggleMenu = (menu: string) => {
        setExpanded(expanded === menu ? null : menu);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-50 transition-transform duration-300 ease-in-out overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Identity Panel */}
                    <div className="mb-8 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-500/20">
                            <School size={24} />
                        </div>
                        <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-slate-600 mx-auto mb-3"
                        />
                        <h3 className="font-bold text-white text-lg">{teacher.name}</h3>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{teacher.role}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        <NavLink
                            to="/teacher/dashboard"
                            end
                            onClick={() => window.innerWidth < 768 && onClose()}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <LayoutDashboard size={20} />
                            <span className="font-medium text-sm">Dashboard</span>
                        </NavLink>

                        {/* My Classes Dropdown */}
                        <div>
                            <button
                                onClick={() => toggleMenu('classes')}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-slate-300 hover:bg-slate-800 hover:text-white",
                                    expanded === 'classes' && "bg-slate-800 text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Users size={20} />
                                    <span className="font-medium text-sm">My Classes</span>
                                </div>
                                {expanded === 'classes' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <AnimatePresence>
                                {expanded === 'classes' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 py-1">
                                            {assignedClasses.map((cls) => (
                                                <NavLink
                                                    key={cls.name}
                                                    to={`/teacher/classes/${cls.name.replace(/\s+/g, '-').toLowerCase()}`}
                                                    className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors group/item"
                                                >
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>{cls.name}</span>
                                                        <span className={cn(
                                                            "text-[10px] uppercase tracking-wider font-bold w-fit px-1.5 py-0.5 rounded",
                                                            cls.role === "Class Teacher"
                                                                ? "bg-primary-500/20 text-primary-300 border border-primary-500/30"
                                                                : "bg-slate-700 text-slate-500"
                                                        )}>
                                                            {cls.role}
                                                        </span>
                                                    </div>
                                                </NavLink>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <NavLink
                            to="/teacher/timetable"
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <CalendarCheck size={20} />
                            <span className="font-medium text-sm">My Timetable</span>
                        </NavLink>

                        <NavLink
                            to="/teacher/assignments"
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <ClipboardList size={20} />
                            <span className="font-medium text-sm">Assignments</span>
                        </NavLink>

                        <NavLink
                            to="/teacher/attendance"
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <CalendarCheck size={20} />
                            <span className="font-medium text-sm">Attendance</span>
                        </NavLink>


                        {/* Results Dropdown */}
                        <div>
                            <button
                                onClick={() => toggleMenu('results')}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-slate-300 hover:bg-slate-800 hover:text-white",
                                    expanded === 'results' && "bg-slate-800 text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Trophy size={20} />
                                    <span className="font-medium text-sm">Results</span>
                                </div>
                                {expanded === 'results' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <AnimatePresence>
                                {expanded === 'results' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 py-1">
                                            <NavLink
                                                to="/teacher/results/upload"
                                                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                                            >
                                                Upload Result
                                            </NavLink>
                                            <NavLink
                                                to="/teacher/results/view"
                                                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                                            >
                                                Display Result
                                            </NavLink>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <NavLink
                            to="/teacher/announcements"
                            className={({ isActive }) => cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Bell size={20} />
                                <span className="font-medium text-sm">Staff Notices</span>
                            </div>
                            <span className="flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                                1
                            </span>
                        </NavLink>

                        <NavLink
                            to="/teacher/payments"
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/20"
                                    : "hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <CreditCard size={20} />
                            <span className="font-medium text-sm">Payment Logs</span>
                        </NavLink>

                        {/* Head Teacher Dropdown */}
                        <div>
                            <button
                                onClick={() => toggleMenu('head-teacher')}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-slate-300 hover:bg-slate-800 hover:text-white",
                                    expanded === 'head-teacher' && "bg-slate-800 text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <School size={20} />
                                    <span className="font-medium text-sm">Head Teacher</span>
                                </div>
                                {expanded === 'head-teacher' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>
                            <AnimatePresence>
                                {expanded === 'head-teacher' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 py-1">
                                            {/* Nested Registration Dropdown */}
                                            <div>
                                                <button
                                                    onClick={() => setRegistrationExpanded(!registrationExpanded)}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors group"
                                                >
                                                    <span>Registration</span>
                                                    {registrationExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                </button>
                                                <AnimatePresence>
                                                    {registrationExpanded && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="ml-2 pl-2 border-l border-slate-700 space-y-1 mt-1">
                                                                <NavLink
                                                                    to="/admission/verification"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                                                                >
                                                                    Student Registration
                                                                </NavLink>
                                                                <NavLink
                                                                    to="/staff/apply"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                                                                >
                                                                    Staff Registration
                                                                </NavLink>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {[
                                                { label: "Teacher Timetable", href: "/teacher/head/teacher-timetables" },
                                                { label: "Class Timetables", href: "/teacher/head/class-timetables" },
                                                { label: "Results & Reports", href: "/teacher/head/results" },
                                                { label: "Fees Overview", href: "/teacher/head/fees" },
                                                { label: "Class List", href: "/teacher/head/classes" },
                                                { label: "Teachers List", href: "/teacher/head/teachers" },
                                                { label: "Profile & Settings", href: "/teacher/head/profile" },
                                            ].map((item) => (
                                                <NavLink
                                                    key={item.label}
                                                    to={item.href}
                                                    className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                                                >
                                                    {item.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-4 pt-4 border-t border-slate-800 space-y-1">
                        <NavLink
                            to="/teacher/profile"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium text-sm"
                        >
                            <User size={20} />
                            Profile
                        </NavLink>
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-medium text-sm mt-1"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
};
