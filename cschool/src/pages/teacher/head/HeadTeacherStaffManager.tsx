import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, User, Users,
    Phone, Mail, X,
    CheckCircle, Clock, BookOpen,
    GraduationCap, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

// --- Mock Data ---

type Staff = {
    id: string;
    name: string;
    role: 'Teacher' | 'Administrator' | 'Support Staff' | 'Security';
    department: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    email: string;
    phone: string;
    joinDate: string;
    qualifications: string[];
    subjects?: string[]; // For teachers
    classes?: string[]; // For teachers
};

const mockStaff: Staff[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `STF${2020000 + i} `,
    name: ['John Doe', 'Jane Smith', 'Michael Brown', 'Emily Davis', 'David Wilson',
        'Sarah Taylor', 'James Anderson', 'Laura Martinez', 'Robert Thomas', 'Linda Jackson',
        'William White', 'Elizabeth Harris', 'Joseph Martin', 'Patricia Thompson', 'Charles Garcia'][i],
    role: i < 10 ? 'Teacher' : i < 12 ? 'Administrator' : 'Support Staff',
    department: i < 10 ? ['Science', 'Mathematics', 'English', 'History'][i % 4] : 'Administration',
    status: i === 3 ? 'On Leave' : i === 14 ? 'Inactive' : 'Active',
    email: `staff${i} @school.edu`,
    phone: '0244556677',
    joinDate: '2020-09-01',
    qualifications: ['B.Ed. Education', 'M.Sc. Mathematics'],
    subjects: i < 10 ? ['Mathematics', 'Physics'] : [],
    classes: i < 10 ? ['JHS 1', 'JHS 2'] : [],
}));

export const HeadTeacherStaffManager = () => {
    // State
    const [filterRole, setFilterRole] = useState<'All' | 'Teaching' | 'Non-Teaching'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Derived Data
    const filteredStaff = useMemo(() => {
        return mockStaff.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            if (filterRole === 'Teaching') return s.role === 'Teacher';
            if (filterRole === 'Non-Teaching') return s.role !== 'Teacher';
            return true;
        });
    }, [filterRole, searchQuery]);

    const stats = useMemo(() => {
        return {
            total: mockStaff.length,
            active: mockStaff.filter(s => s.status === 'Active').length,
            onLeave: mockStaff.filter(s => s.status === 'On Leave').length,
        };
    }, []);

    // Handlers
    const handleViewProfile = (staff: Staff) => {
        setSelectedStaff(staff);
        setIsPanelOpen(true);
    };

    const handleRecommendChange = () => {
        if (!selectedStaff) return;
        const recommendation = prompt(`Enter recommendation for ${selectedStaff.name}(e.g., Change subject assignment): `);
        if (recommendation) {
            alert(`Recommendation submitted for Admin review: \n"${recommendation}"`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Staff Management</h1>
                        <p className="text-slate-500 text-sm">Overview of teaching and non-teaching staff.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Total Staff</p>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                        </div>
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Users size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Active Now</p>
                            <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={20} /></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">On Leave</p>
                            <p className="text-2xl font-bold text-amber-600">{stats.onLeave}</p>
                        </div>
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20} /></div>
                    </div>
                </div>

                {/* 2. Filters & List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            {(['All', 'Teaching', 'Non-Teaching'] as const).map(role => (
                                <button
                                    key={role}
                                    onClick={() => setFilterRole(role)}
                                    className={cn(
                                        "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                        filterRole === role ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                    )}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Staff Member</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Department</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Assignments</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStaff.map((staff) => (
                                    <tr key={staff.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => handleViewProfile(staff)}>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {staff.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">{staff.name}</div>
                                                    <div className="text-xs text-slate-500">{staff.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            <span className={cn(
                                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border",
                                                staff.role === 'Teacher' ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-slate-100 text-slate-600 border-slate-200"
                                            )}>
                                                {staff.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{staff.department}</td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                                                staff.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    staff.status === 'Inactive' ? "bg-red-50 text-red-700 border-red-200" :
                                                        "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {staff.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 max-w-[200px] truncate">
                                            {staff.role === 'Teacher' ? staff.subjects?.join(', ') : '-'}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Slide-over Profile Panel */}
            <AnimatePresence>
                {isPanelOpen && selectedStaff && (
                    <div className="fixed inset-0 z-50 overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsPanelOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="w-screen max-w-md pointer-events-auto"
                            >
                                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl">
                                    {/* Panel Header */}
                                    <div className="px-6 py-6 bg-slate-900 text-white">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold">
                                                    {selectedStaff.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-white leading-6">{selectedStaff.name}</h2>
                                                    <p className="text-slate-400 text-sm mt-1">{selectedStaff.role} • {selectedStaff.id}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setIsPanelOpen(false)}
                                                className="rounded-full p-2 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Panel Content */}
                                    <div className="flex-1 px-6 py-6 space-y-8">

                                        {/* Quick Stats/Status */}
                                        <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                selectedStaff.status === 'Active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    selectedStaff.status === 'Inactive' ? "bg-red-50 text-red-700 border-red-200" :
                                                        "bg-amber-50 text-amber-700 border-amber-200"
                                            )}>
                                                {selectedStaff.status}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium">Joined {format(new Date(selectedStaff.joinDate), 'MMM yyyy')}</span>
                                        </div>

                                        {/* Contact */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                                <User size={16} className="text-primary-500" />
                                                Contact Information
                                            </h3>
                                            <div className="grid grid-cols-1 gap-4 text-sm">
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <Mail size={16} className="text-slate-400" />
                                                    {selectedStaff.email}
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <Phone size={16} className="text-slate-400" />
                                                    {selectedStaff.phone}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Profile (Teachers only) */}
                                        {selectedStaff.role === 'Teacher' && (
                                            <div className="space-y-4">
                                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                                    <BookOpen size={16} className="text-primary-500" />
                                                    Teaching Profile
                                                </h3>
                                                <div className="bg-slate-50 rounded-lg p-4 space-y-3 border border-slate-100">
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Subjects</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedStaff.subjects?.map(s => (
                                                                <span key={s} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-semibold text-slate-500 uppercase block mb-1">Classes</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {selectedStaff.classes?.map(c => (
                                                                <span key={c} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700">
                                                                    {c}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Qualifications */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                                <GraduationCap size={16} className="text-primary-500" />
                                                Qualifications
                                            </h3>
                                            <ul className="space-y-2">
                                                {selectedStaff.qualifications.map((q, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                                        {q}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>

                                    {/* Footer Actions */}
                                    <div className="p-6 bg-slate-50 border-t border-slate-200">
                                        <Button className="w-full" onClick={handleRecommendChange}>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Recommend Change
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};
