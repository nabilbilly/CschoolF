import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Users, GraduationCap, Calendar,
    FileBarChart, ClipboardList, Megaphone, Settings,
    ShieldAlert, User, LogOut, ChevronDown, ChevronRight,
    School
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Button } from '../common/Button';

type MenuItem = {
    label: string;
    href?: string;
    icon: any;
    subItems?: { label: string; href: string }[];
};

const menuItems: MenuItem[] = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        label: "Users Management",
        icon: Users,
        subItems: [
            { label: "Students", href: "/admin/users/students" },
            { label: "Teachers", href: "/admin/users/teachers" },
            { label: "Non-Teaching Staff", href: "/admin/users/staff" }
        ]
    },
    {
        label: "Academics",
        icon: GraduationCap,
        subItems: [
            { label: "Academic Years & Terms", href: "/admin/academics/years" },
            { label: "Classes & Streams", href: "/admin/academics/classes" },
            { label: "Subjects", href: "/admin/academics/subjects" },
            { label: "Grading & Promotion", href: "/admin/academics/grading" }
        ]
    },
    {
        label: "Timetables",
        icon: Calendar,
        subItems: [
            { label: "Class Timetables", href: "/admin/timetables/class" },
            { label: "Teacher Assignments", href: "/admin/timetables/teacher" }
        ]
    },
    {
        label: "Results & Reports",
        icon: FileBarChart,
        subItems: [
            { label: "Submitted Results", href: "/admin/results/submitted" },
            { label: "Approve / Lock Results", href: "/admin/results/approve" },
            { label: "Terminal Reports", href: "/admin/results/reports" },
            { label: "Promotion Management", href: "/admin/results/promotion" }
        ]
    },
    {
        label: "Admissions",
        icon: ClipboardList,
        subItems: [
            { label: "Admission Applications", href: "/admin/admissions/applications" },
            { label: "E-Vouchers", href: "/admin/admissions/vouchers" },
            { label: "Enrollment Approval", href: "/admin/admissions/enrollment" }
        ]
    },
    {
        label: "Announcements",
        icon: Megaphone,
        subItems: [
            { label: "School Notices", href: "/admin/announcements/notices" },
            { label: "Message Templates", href: "/admin/announcements/templates" }
        ]
    },
    {
        label: "School Settings",
        icon: Settings,
        subItems: [
            { label: "School Profile", href: "/admin/settings/profile" },
            { label: "Module Controls", href: "/admin/settings/modules" },
            { label: "SMS / Email Settings", href: "/admin/settings/communications" }
        ]
    },
    {
        label: "Security & Audit",
        icon: ShieldAlert,
        subItems: [
            { label: "Activity Logs", href: "/admin/security/logs" },
            { label: "Access Control", href: "/admin/security/access" }
        ]
    }
];

export const AdminSidebar = () => {
    const [openSubmenus, setOpenSubmenus] = useState<string[]>(['Users Management']); // Default open for better UX
    const navigate = useNavigate();

    const toggleSubmenu = (label: string) => {
        setOpenSubmenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/');
    };

    return (
        <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed left-0 top-0 overflow-y-auto flex flex-col border-r border-slate-800">
            {/* Header */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3 text-white">
                    <div className="bg-primary-600 p-2 rounded-lg">
                        <School size={24} />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Admin Portal</h1>
                        <p className="text-xs text-slate-400">School Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => (
                    <div key={item.label}>
                        {item.subItems ? (
                            <button
                                onClick={() => toggleSubmenu(item.label)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    openSubmenus.includes(item.label)
                                        ? "text-white bg-slate-800"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon size={18} />
                                    {item.label}
                                </div>
                                {openSubmenus.includes(item.label) ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                        ) : (
                            <NavLink
                                to={item.href!}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-600 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        )}

                        {/* Submenu Items */}
                        <AnimatePresence>
                            {item.subItems && openSubmenus.includes(item.label) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="ml-9 mt-1 space-y-0.5 border-l border-slate-800 pl-2">
                                        {item.subItems.map((subItem) => (
                                            <NavLink
                                                key={subItem.label}
                                                to={subItem.href}
                                                className={({ isActive }) => cn(
                                                    "block px-3 py-2 rounded-md text-sm transition-colors",
                                                    isActive
                                                        ? "text-primary-400 bg-primary-900/10 font-medium"
                                                        : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                                )}
                                            >
                                                {subItem.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center mb-4 px-2">
                    <User size={32} className="p-1.5 bg-slate-800 rounded-full text-slate-400" />
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">Administrator</p>
                        <NavLink to="/admin/profile" className="text-xs text-primary-400 hover:text-primary-300">
                            View Profile
                        </NavLink>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start text-slate-400 border-slate-700 hover:text-white hover:bg-slate-800"
                    onClick={handleLogout}
                >
                    <LogOut size={16} className="mr-2" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};
