import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, User, Users, Filter, Plus,
    Eye, XCircle,
    School, Key, Calendar,
    Shield, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

// --- Types & Mock Data ---

type TeacherStatus = 'ACTIVE' | 'ON LEAVE' | 'INACTIVE';

interface Teacher {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    status: TeacherStatus;
    joinDate: string;
    qualifications: string[];
    subjects: string[];
    classes: string[];
    permissions: {
        resultsEntry: boolean;
        attendance: boolean;
        announcements: boolean;
        reports: boolean;
    };
}

const ALL_ROLES = [
    'Administrator',
    'Head of Dept',
    'Class Teacher',
    'Teacher',
    'Bursar',
    'Secretary',
    'Librarian',
    'Security',
    'Cleaner',
    'Driver'
];

const mockTeachers: Teacher[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `STF${2020001 + i}`,
    name: ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'David Wilson',
        'Sarah Taylor', 'James Anderson', 'Laura Martinez', 'Robert Thomas', 'Linda Jackson'][i % 10] + (i > 9 ? ' Jr.' : ''),
    email: `teacher${i}@school.edu`,
    phone: '0244123456',
    role: i === 0 ? 'Head of Dept' : i < 5 ? 'Class Teacher' : 'Teacher',
    department: ['Science', 'Mathematics', 'English', 'History'][i % 4],
    status: i === 3 ? 'ON LEAVE' : i === 19 ? 'INACTIVE' : 'ACTIVE',
    joinDate: '2020-09-01',
    qualifications: ['B.Ed. Education', 'M.Sc. Subject Specialist'],
    subjects: ['Mathematics', 'Physics'],
    classes: ['JHS 1 A', 'JHS 2 B'],
    permissions: {
        resultsEntry: true,
        attendance: true,
        announcements: i < 5, // Only some have announcement rights
        reports: i === 0 // Only HOD has reports rights
    }
}));

export const AdminTeacherManager = () => {
    // State
    const [selectedStatus, setSelectedStatus] = useState<TeacherStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'assignments' | 'permissions' | 'timetable'>('profile');

    // Filtering
    const filteredTeachers = useMemo(() => {
        return mockTeachers.filter(t => {
            const matchesSearch =
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, selectedStatus]);

    // Handlers
    const handleViewTeacher = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setActiveTab('profile');
        setIsModalOpen(true);
    };

    const handleStatusChange = (newStatus: TeacherStatus) => {
        if (!selectedTeacher) return;
        if (window.confirm(`Change status to ${newStatus}?`)) {
            // API call here
            alert(`Status updated to ${newStatus}`);
            setIsModalOpen(false);
        }
    };

    const togglePermission = (key: keyof Teacher['permissions']) => {
        if (!selectedTeacher) return;
        // Optimistic update for UI demo
        setSelectedTeacher(prev => prev ? ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [key]: !prev.permissions[key]
            }
        }) : null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Teacher Management</h1>
                    <p className="text-slate-500 text-sm">Manage teaching staff, assignments, and access control.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button className="gap-2">
                        <Plus size={16} /> Add Teacher
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search by name, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>

                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="All">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON LEAVE">On Leave</option>
                    <option value="INACTIVE">Inactive</option>
                </select>
            </div>

            {/* Teachers Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Teacher</th>
                                <th className="p-4 font-semibold text-slate-600">Role & Dept</th>
                                <th className="p-4 font-semibold text-slate-600">Assignments</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                {teacher.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{teacher.name}</div>
                                                <div className="text-xs text-slate-500">{teacher.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-900">{teacher.role}</div>
                                        <div className="text-xs text-slate-500">{teacher.department}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-xs">
                                        <div className="flex flex-col gap-1">
                                            <span>{teacher.subjects.join(', ')}</span>
                                            <span className="text-slate-400">{teacher.classes.join(', ')}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={teacher.status} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewTeacher(teacher)}>
                                            <Eye size={16} className="text-slate-400 hover:text-primary-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Teacher Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTeacher && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-sm">
                                        {selectedTeacher.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">{selectedTeacher.name}</h2>
                                        <p className="text-slate-500 text-sm flex items-center gap-2">
                                            {selectedTeacher.id} • {selectedTeacher.role}
                                            <StatusBadge status={selectedTeacher.status} size="sm" />
                                        </p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Sidebar Tabs */}
                                <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 hidden md:block">
                                    <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile & Info" />
                                    <TabButton active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')} icon={Briefcase} label="Assignments" />
                                    <TabButton active={activeTab === 'permissions'} onClick={() => setActiveTab('permissions')} icon={Shield} label="Access Control" />
                                    <TabButton active={activeTab === 'timetable'} onClick={() => setActiveTab('timetable')} icon={Calendar} label="Timetable" />
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Basic Information" icon={User} />
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <InfoItem label="Full Name" value={selectedTeacher.name} />
                                                <InfoItem label="Email" value={selectedTeacher.email} />
                                                <InfoItem label="Phone" value={selectedTeacher.phone} />
                                                <InfoItem label="Joined" value={format(new Date(selectedTeacher.joinDate), 'MMMM yyyy')} />
                                                <div className="col-span-2">
                                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Qualifications</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTeacher.qualifications.map((q, i) => (
                                                            <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs border border-slate-200">{q}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Key size={16} className="text-slate-500" /> Account Actions
                                                </h4>
                                                <div className="flex gap-3">
                                                    <Button variant="outline" size="sm">Reset Password</Button>
                                                    {selectedTeacher.status === 'ACTIVE' ? (
                                                        <Button variant="outline" size="sm" onClick={() => handleStatusChange('INACTIVE')} className="text-red-600 border-red-200 hover:bg-red-50">
                                                            Deactivate Account
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" size="sm" onClick={() => handleStatusChange('ACTIVE')} className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                                                            Activate Account
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'assignments' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Role & Department" icon={Users} />
                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 mr-4">
                                                        <h4 className="font-bold text-blue-800 text-lg mb-1">{selectedTeacher.role}</h4>
                                                        <p className="text-sm text-blue-600 mb-3">The teacher's current role determines their system dashboard.</p>

                                                        <div className="flex items-center gap-2">
                                                            <label className="text-sm font-medium text-blue-800 whitespace-nowrap">Change Role:</label>
                                                            <select
                                                                className="bg-white border border-blue-300 text-blue-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 max-w-xs"
                                                                value={selectedTeacher.role}
                                                                onChange={(e) => {
                                                                    // Optimistic update
                                                                    setSelectedTeacher({ ...selectedTeacher, role: e.target.value });
                                                                    // In real app: call API to update role
                                                                    alert(`Role updated to ${e.target.value}`);
                                                                }}
                                                            >
                                                                {ALL_ROLES.map(role => (
                                                                    <option key={role} value={role}>{role}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-blue-200">
                                                    <InfoItem label="Department" value={selectedTeacher.department} />
                                                </div>
                                            </div>

                                            <SectionHeader title="Academic Assignments" icon={School} />
                                            <div className="space-y-4">
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-bold text-slate-700 text-sm">Classes Taught</h4>
                                                        <Button variant="ghost" size="sm" className="h-6 text-primary-600 text-xs">Edit</Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTeacher.classes.map(c => (
                                                            <span key={c} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <h4 className="font-bold text-slate-700 text-sm">Subjects Taught</h4>
                                                        <Button variant="ghost" size="sm" className="h-6 text-primary-600 text-xs">Edit</Button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTeacher.subjects.map(s => (
                                                            <span key={s} className="bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600">
                                                                {s}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'permissions' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Access Control & Permissions" icon={Shield} />
                                            <div className="space-y-3">
                                                {[
                                                    { key: 'resultsEntry', label: 'Results Entry & Editing', desc: 'Allows teacher to enter and edit student marks.' },
                                                    { key: 'attendance', label: 'Attendance Management', desc: 'Can mark class and student attendance.' },
                                                    { key: 'announcements', label: 'Post Announcements', desc: 'Permission to post notices to students/parents.' },
                                                    { key: 'reports', label: 'Generate Reports', desc: 'Can generate and download terminal reports.' },
                                                ].map((perm) => (
                                                    <div key={perm.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                        <div>
                                                            <p className="font-medium text-slate-800 text-sm">{perm.label}</p>
                                                            <p className="text-xs text-slate-500">{perm.desc}</p>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => togglePermission(perm.key as keyof Teacher['permissions'])}
                                                                className={cn(
                                                                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                                                                    selectedTeacher.permissions[perm.key as keyof Teacher['permissions']] ? "bg-primary-600" : "bg-slate-200"
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                                        selectedTeacher.permissions[perm.key as keyof Teacher['permissions']] ? "translate-x-6" : "translate-x-1"
                                                                    )}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'timetable' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Weekly Schedule Summary" icon={Calendar} />
                                            <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-500 border border-slate-200 border-dashed">
                                                <Calendar size={48} className="mx-auto text-slate-300 mb-2" />
                                                <p>Timetable view will be integrated here.</p>
                                                <p className="text-xs mt-1">Shows assigned periods for {selectedTeacher.classes.join(', ')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
                                <Button onClick={() => setIsModalOpen(false)}>Save Changes</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Helper Components ---

const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4">
        <Icon size={18} className="text-primary-500" />
        <h3 className="font-bold text-slate-800">{title}</h3>
    </div>
);

const InfoItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <p className="text-xs text-slate-400 uppercase font-bold mb-1">{label}</p>
        <p className="text-slate-800 font-medium">{value}</p>
    </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            active ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        )}
    >
        <Icon size={18} />
        {label}
    </button>
);

const StatusBadge = ({ status, size = 'md' }: { status: TeacherStatus, size?: 'sm' | 'md' }) => {
    const styles = {
        'ACTIVE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'ON LEAVE': 'bg-amber-50 text-amber-700 border-amber-200',
        'INACTIVE': 'bg-slate-100 text-slate-500 border-slate-200',
    };

    return (
        <span className={cn(
            "inline-flex items-center rounded-full font-medium border",
            styles[status],
            size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
        )}>
            {status}
        </span>
    );
};
