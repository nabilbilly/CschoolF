import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, User, Users, Filter, Plus,
    Eye, XCircle, Briefcase, Shield,
    Key, Lock, CheckCircle, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

// --- Types & Mock Data ---

type StaffStatus = 'ACTIVE' | 'ON LEAVE' | 'INACTIVE';
type StaffRole = 'Bursar' | 'Secretary' | 'Librarian' | 'Security' | 'Cleaner' | 'Driver' | 'Administrator';

interface Staff {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: StaffRole;
    department: string;
    status: StaffStatus;
    joinDate: string;
    permissions: string[]; // List of modules they can access
}

const mockStaff: Staff[] = Array.from({ length: 15 }).map((_, i) => {
    const roles: StaffRole[] = ['Bursar', 'Secretary', 'Librarian', 'Security', 'Cleaner', 'Driver', 'Administrator'];
    const role = roles[i % roles.length];

    return {
        id: `STF${5050001 + i}`,
        name: ['Alice Johnson', 'Robert Smith', 'Carol White', 'David Brown', 'Eva Green',
            'Frank Black', 'Grace Hall', 'Henry Ford', 'Ivy Rose', 'Jack King'][i % 10],
        email: `staff${i}@school.edu`,
        phone: '0244000000',
        role: role,
        department: ['Accounts', 'Administration', 'Library', 'Security', 'Maintenance', 'Transport', 'Administration'][i % 7],
        status: i === 2 ? 'ON LEAVE' : i === 8 ? 'INACTIVE' : 'ACTIVE',
        joinDate: '2021-02-15',
        permissions: role === 'Bursar' ? ['Fees', 'Expenses'] :
            role === 'Secretary' ? ['Admissions', 'Communications'] :
                role === 'Librarian' ? ['Libary System'] :
                    role === 'Administrator' ? ['All'] : []
    };
});

export const AdminStaffManager = () => {
    // State
    const [selectedRole, setSelectedRole] = useState<StaffRole | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'access' | 'activity'>('profile');

    // Filtering
    const filteredStaff = useMemo(() => {
        return mockStaff.filter(s => {
            const matchesSearch =
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.id.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = selectedRole === 'All' || s.role === selectedRole;

            return matchesSearch && matchesRole;
        });
    }, [searchQuery, selectedRole]);

    // Handlers
    const handleViewStaff = (staff: Staff) => {
        setSelectedStaff(staff);
        setActiveTab('profile');
        setIsModalOpen(true);
    };

    const handleStatusChange = (newStatus: StaffStatus) => {
        if (!selectedStaff) return;
        if (window.confirm(`Change status to ${newStatus}?`)) {
            alert(`Status updated to ${newStatus}`);
            setIsModalOpen(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Non-Teaching Staff</h1>
                    <p className="text-slate-500 text-sm">Manage support staff roles and system access.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button className="gap-2">
                        <Plus size={16} /> Add Staff
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
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="All">All Roles</option>
                    <option value="Bursar">Bursar</option>
                    <option value="Secretary">Secretary</option>
                    <option value="Librarian">Librarian</option>
                    <option value="Security">Security</option>
                    <option value="Cleaner">Cleaner</option>
                </select>
            </div>

            {/* Staff Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Staff Member</th>
                                <th className="p-4 font-semibold text-slate-600">Role & Department</th>
                                <th className="p-4 font-semibold text-slate-600">System Access</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStaff.map((staff) => (
                                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{staff.name}</div>
                                                <div className="text-xs text-slate-500">{staff.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-slate-900 font-medium">{staff.role}</div>
                                        <div className="text-xs text-slate-500">{staff.department}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-xs">
                                        {staff.permissions.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {staff.permissions.map(p => (
                                                    <span key={p} className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">No access</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={staff.status} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewStaff(staff)}>
                                            <Eye size={16} className="text-slate-400 hover:text-primary-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Staff Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedStaff && (
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
                                    <div className="h-16 w-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-600 shadow-sm">
                                        {selectedStaff.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">{selectedStaff.name}</h2>
                                        <p className="text-slate-500 text-sm flex items-center gap-2">
                                            {selectedStaff.id} • {selectedStaff.role}
                                            <StatusBadge status={selectedStaff.status} size="sm" />
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
                                    <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Profile & Employment" />
                                    <TabButton active={activeTab === 'access'} onClick={() => setActiveTab('access')} icon={Shield} label="Role & Access" />
                                    <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} icon={Activity} label="Activity Logs" />
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Staff Information" icon={User} />
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <InfoItem label="Full Name" value={selectedStaff.name} />
                                                <InfoItem label="Email" value={selectedStaff.email} />
                                                <InfoItem label="Phone" value={selectedStaff.phone} />
                                                <InfoItem label="Address" value="Accra, Ghana" />
                                            </div>

                                            <SectionHeader title="Employment Details" icon={Briefcase} />
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <InfoItem label="Position / Role" value={selectedStaff.role} />
                                                <InfoItem label="Department" value={selectedStaff.department} />
                                                <InfoItem label="Employment Type" value="Full-Time" />
                                                <InfoItem label="Join Date" value={format(new Date(selectedStaff.joinDate), 'MMMM yyyy')} />
                                            </div>

                                            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                                    <Key size={16} className="text-slate-500" /> Account Actions
                                                </h4>
                                                <div className="flex gap-3">
                                                    <Button variant="outline" size="sm">Reset Password</Button>
                                                    {selectedStaff.status === 'ACTIVE' ? (
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

                                    {activeTab === 'access' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Assigned System Role" icon={Lock} />

                                            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-blue-800 text-lg mb-1">{selectedStaff.role}</h4>
                                                        <p className="text-sm text-blue-600">
                                                            This user has the default permissions for the {selectedStaff.role} role.
                                                        </p>
                                                    </div>
                                                    <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 bg-white hover:bg-blue-50">
                                                        Change Role
                                                    </Button>
                                                </div>
                                            </div>

                                            <SectionHeader title="Module Access" icon={Shield} />
                                            <div className="space-y-3">
                                                <p className="text-sm text-slate-500 mb-2">Modules accessible by this role:</p>
                                                {selectedStaff.permissions.length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {selectedStaff.permissions.map((perm) => (
                                                            <div key={perm} className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                                <CheckCircle size={16} className="text-emerald-500" />
                                                                <span className="text-sm font-medium text-slate-700">{perm}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-sm italic text-center">
                                                        No specific system modules assigned.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'activity' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Recent Activity" icon={Activity} />
                                            <div className="space-y-4">
                                                {[
                                                    { action: 'Login', time: '2 hours ago', details: 'Logged in from System Terminal' },
                                                    { action: 'Profile View', time: 'Yesterday', details: 'Viewed student profile STU2024005' },
                                                    { action: 'Report Generated', time: '3 days ago', details: 'Generated Fees Report for JHS 1' },
                                                ].map((log, i) => (
                                                    <div key={i} className="flex gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                                                        <div className="mt-1">
                                                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-800">{log.action}</p>
                                                            <p className="text-xs text-slate-500">{log.details}</p>
                                                            <p className="text-xs text-slate-400 mt-1">{log.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
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

const StatusBadge = ({ status, size = 'md' }: { status: StaffStatus, size?: 'sm' | 'md' }) => {
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
