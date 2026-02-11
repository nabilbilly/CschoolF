import {
    LayoutDashboard,
    Calendar,
    GraduationCap,
    Bell,
    Book,
    User,
    HelpCircle,
    LogOut,
    School,
    Wallet,
    ChevronDown,
    Settings
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../../lib/utils';

import { authService } from '../../services/authService';
import { studentsService, type StudentResponse } from '../../services/studentsService';
import { mediaService } from '../../services/mediaService';
import { StudentAvatar } from '../common/StudentAvatar';
import { useEffect } from 'react';

// Initial mock data
const initialStudent = {
    first_name: "Student",
    last_name: "",
    class: "Loading...",
    photo: null as string | null
};

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashboard" },
    { icon: Calendar, label: "Timetable", href: "/student/timetable" },
    { icon: GraduationCap, label: "Results & Performance", href: "/student/results" },
    { icon: Bell, label: "Notices", href: "/student/notices", hasBadge: true },
];

const optionalItems = [
    { icon: Book, label: "Assignments", href: "/student/assignments" },
];

interface StudentSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const StudentSidebar = ({ isOpen, onClose }: StudentSidebarProps) => {
    const [isFeesOpen, setIsFeesOpen] = useState(false);
    const [student, setStudent] = useState(initialStudent);
    const [isUpdating, setIsUpdating] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await studentsService.getProfile();
                setStudent({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    class: `${profile.current_class} ${profile.current_stream !== 'N/A' ? profile.current_stream : ''}`,
                    photo: profile.photo
                });
            } catch (err) {
                const session = authService.getSession();
                const sessionName = session.name;
                if (sessionName) {
                    setStudent(prev => ({ ...prev, name: sessionName }));
                }
            }
        };
        fetchProfile();
    }, []);

    const handlePhotoUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation (1MB limit)
        if (file.size > 1 * 1024 * 1024) {
            alert('Image size must be 1MB or less');
            return;
        }

        setIsUpdating(true);
        try {
            // 1. Upload the image
            const uploadRes = await mediaService.uploadImage(file);

            // 2. Update the student profile
            const updatedProfile = await studentsService.updateProfile({ photo: uploadRes.url });

            // 3. Update local state
            setStudent(prev => ({
                ...prev,
                photo: updatedProfile.photo
            }));

        } catch (err: any) {
            console.error("Failed to update sidebar photo:", err);
            alert(err.message || 'Failed to update photo');
        } finally {
            setIsUpdating(false);
            if (e.target) e.target.value = '';
        }
    };

    // Check if any fees sub-route is active to auto-expand or highlight parent
    const isFeesActive = location.pathname.includes('/student/fees') || location.pathname.includes('/student/clearance');

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-64 bg-slate-50 border-r border-slate-200 z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex flex-col h-full p-4">

                    {/* Identity Panel */}
                    <div className="mb-8 text-center pt-4">
                        <div className="mx-auto w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-primary-500/30">
                            <School size={24} />
                        </div>
                        <div className="relative inline-block mb-2">
                            <StudentAvatar
                                firstName={student.first_name}
                                lastName={student.last_name}
                                photo={student.photo}
                                size="lg"
                                isUpdating={isUpdating}
                                showCameraOverlay={true}
                                onClick={() => !isUpdating && document.getElementById('sidebar-photo-upload')?.click()}
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            <input
                                id="sidebar-photo-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handlePhotoUpdate}
                                disabled={isUpdating}
                            />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">{student.first_name} {student.last_name}</h3>
                        <p className="text-primary-600 font-medium text-sm bg-primary-50 inline-block px-3 py-1 rounded-full mt-1">
                            {student.class}
                        </p>
                    </div>

                    {/* Main Navigation */}
                    <nav className="flex-1 space-y-1">
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                onClick={() => window.innerWidth < 768 && onClose()}
                                className={({ isActive }) => cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-white text-primary-600 shadow-sm"
                                        : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                                )}
                            >
                                <item.icon size={20} className="stroke-[1.5]" />
                                <span className="font-medium text-sm">{item.label}</span>
                                {item.hasBadge && (
                                    <span className="absolute right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </NavLink>
                        ))}

                        {/* Fees Dropdown */}
                        <div>
                            <button
                                onClick={() => setIsFeesOpen(!isFeesOpen)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                    isFeesActive ? "text-primary-600 bg-white/60" : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Wallet size={20} className="stroke-[1.5]" />
                                    <span className="font-medium text-sm">Fees</span>
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={cn("transition-transform duration-200", isFeesOpen && "rotate-180")}
                                />
                            </button>

                            {/* Dropdown Items */}
                            <div className={cn(
                                "overflow-hidden transition-all duration-200 space-y-1 pl-4",
                                isFeesOpen || isFeesActive ? "max-h-40 mt-1 opacity-100" : "max-h-0 opacity-0"
                            )}>
                                <NavLink
                                    to="/student/fees"
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                                        isActive
                                            ? "text-primary-600 bg-primary-50 font-medium"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <span>School Fees</span>
                                </NavLink>
                                <NavLink
                                    to="/student/clearance"
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm",
                                        isActive
                                            ? "text-primary-600 bg-primary-50 font-medium"
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    )}
                                >
                                    <span>Clearance</span>
                                </NavLink>
                            </div>
                        </div>

                        {/* Optional Section */}
                        <div className="pt-4 mt-4 border-t border-slate-200/60">
                            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Extras</p>
                            {optionalItems.map((item) => (
                                <NavLink
                                    key={item.href}
                                    to={item.href}
                                    onClick={() => window.innerWidth < 768 && onClose()}
                                    className={({ isActive }) => cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                                        isActive
                                            ? "bg-white text-primary-600 shadow-sm"
                                            : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
                                    )}
                                >
                                    <item.icon size={20} className="stroke-[1.5]" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-6 pt-4 border-t border-slate-200 space-y-1">
                        <NavLink
                            to="/student/profile"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/60 hover:text-slate-900 transition-all font-medium text-sm"
                        >
                            <User size={20} className="stroke-[1.5]" />
                            Profile
                        </NavLink>
                        <NavLink
                            to="/student/help"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/60 hover:text-slate-900 transition-all font-medium text-sm"
                        >
                            <HelpCircle size={20} className="stroke-[1.5]" />
                            Help & Support
                        </NavLink>
                        <NavLink
                            to="/student/account"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-white/60 hover:text-slate-900 transition-all font-medium text-sm"
                        >
                            <Settings size={20} className="stroke-[1.5]" />
                            Account Settings
                        </NavLink>
                        <button
                            onClick={() => {
                                authService.logout();
                                window.location.href = '/student/login';
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all font-medium text-sm mt-1"
                        >
                            <LogOut size={20} className="stroke-[1.5]" />
                            Logout
                        </button>
                    </div>

                </div>
            </aside>
        </>
    );
};
