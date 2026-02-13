import { useState, useEffect, useCallback } from 'react';
import { NewAdmissionModal } from './NewAdmissionModal';
import { Button } from '../../../components/common/Button';
import {
    Search, User, Users, Filter, Plus,
    Eye, XCircle, AlertCircle,
    School, CreditCard,
    Stethoscope, Activity, Loader2,
    Edit2, Save, Settings, Key, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';
import { studentsService } from '../../../services/studentsService';
import type { StudentResponse } from '../../../services/studentsService';
import { academicsService } from '../../../services/academicsService';
import { StudentAvatar } from '../../../components/common/StudentAvatar';
import type { ClassRoom, AcademicYear } from '../../../services/academicsService';
import { admissionsService } from '../../../services/admissionsService';

// --- Types & Mock Data ---

// --- Constants ---
const STUDENT_STATUSES = ['ACTIVE', 'PENDING APPROVAL', 'INACTIVE'] as const;
type StudentStatus = typeof STUDENT_STATUSES[number];

export const AdminStudentManager = () => {
    // State
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter Data
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>('All');

    // Modal State
    const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'fees' | 'health' | 'account'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState<Partial<StudentResponse>>({});
    const [resetPwd, setResetPwd] = useState("");

    // Fetch Initial Data (Classes/Years)
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [clsData, yrData] = await Promise.all([
                    academicsService.getClasses(),
                    academicsService.getAcademicYears()
                ]);
                setClasses(clsData);
                setYears(yrData);
            } catch (err) {
                console.error("Failed to fetch filters:", err);
            }
        };
        fetchFilters();
    }, []);

    // Fetch Students
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await studentsService.listStudents({
                search: searchQuery || undefined,
                status: selectedStatus === 'All' ? undefined : selectedStatus,
                academic_year_id: selectedYear === 'All' ? undefined : Number(selectedYear),
                class_id: selectedClassId === 'All' ? undefined : Number(selectedClassId)
            });
            setStudents(data);
            setError(null);
        } catch (err) {
            setError("Failed to load students. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedStatus, selectedYear, selectedClassId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchStudents();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchStudents]);

    // Filtering handled by backend now, but we keep this for sorting or local adjustments if needed
    const filteredStudents = students;

    // Handlers
    const handleViewStudent = (student: StudentResponse) => {
        setSelectedStudent(student);
        setEditData(student);
        setIsEditing(false);
        setActiveTab('profile');
        setIsModalOpen(true);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            setEditData(selectedStudent || {});
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: string, value: any) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = async () => {
        if (!selectedStudent) return;
        setIsSaving(true);
        try {
            const updatedStudent = await studentsService.updateStudent(selectedStudent.id, editData);
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            setSelectedStudent(updatedStudent);
            setIsEditing(false);
            alert("Student details updated successfully!");
        } catch (err) {
            console.error("Failed to update student:", err);
            alert("Failed to update student details. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetPassword = async () => {
        if (!selectedStudent || !resetPwd) return;
        if (resetPwd.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        setIsSaving(true);
        try {
            await studentsService.resetPassword(selectedStudent.id, resetPwd);
            alert("Password reset successfully!");
            setResetPwd("");
        } catch (err) {
            console.error("Failed to reset password:", err);
            alert("Failed to reset password. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: StudentStatus) => {
        if (!selectedStudent) return;

        const confirmMsg = `Are you sure you want to change status to ${newStatus}?`;
        if (window.confirm(confirmMsg)) {
            setIsSaving(true);
            try {
                const updatedStudent = await studentsService.updateStudent(selectedStudent.id, { status: newStatus });
                setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
                setSelectedStudent(updatedStudent);
                alert(`Status updated to ${newStatus}`);
                setIsModalOpen(false);
            } catch (err) {
                console.error("Failed to update status:", err);
                alert("Failed to update status. Please try again.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleApproveAdmission = async () => {
        if (!selectedStudent || !selectedStudent.pending_admission_id) {
            alert("No pending admission found for this student.");
            return;
        }

        if (window.confirm(`Are you sure you want to APPROVE admission for ${selectedStudent.first_name} ${selectedStudent.last_name}?`)) {
            setIsSaving(true);
            try {
                await admissionsService.approveAdmission(selectedStudent.pending_admission_id);
                alert("Admission approved successfully!");
                setIsModalOpen(false);
                fetchStudents(); // Refresh complete list
            } catch (err: any) {
                console.error("Failed to approve admission:", err);
                alert(`Approval failed: ${err.message || "Server Error"}`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleRejectAdmission = async () => {
        if (!selectedStudent || !selectedStudent.pending_admission_id) {
            alert("No pending admission found for this student.");
            return;
        }

        if (window.confirm(`Are you sure you want to REJECT admission for ${selectedStudent.first_name} ${selectedStudent.last_name}?`)) {
            setIsSaving(true);
            try {
                await admissionsService.rejectAdmission(selectedStudent.pending_admission_id);
                alert("Admission rejected successfully.");
                setIsModalOpen(false);
                fetchStudents(); // Refresh complete list
            } catch (err: any) {
                console.error("Failed to reject admission:", err);
                alert(`Rejection failed: ${err.message || "Server Error"}`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Student Management</h1>
                    <p className="text-slate-500 text-sm">Manage admissions, enrollment, and student records.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Filter size={16} /> Filter
                    </Button>
                    <Button className="gap-2" onClick={() => setIsAdmissionModalOpen(true)}>
                        <Plus size={16} /> New Admission
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
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="All">All Status</option>
                    {STUDENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="All">All Classes</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>

                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="All">All Academic Years</option>
                    {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                </select>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-600">Student</th>
                                <th className="p-4 font-semibold text-slate-600">Class & Stream</th>
                                <th className="p-4 font-semibold text-slate-600">Gender</th>
                                <th className="p-4 font-semibold text-slate-600">Admission Year</th>
                                <th className="p-4 font-semibold text-slate-600">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-500">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                                            <p>Loading students...</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!loading && filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <StudentAvatar
                                                firstName={student.first_name}
                                                lastName={student.last_name}
                                                photo={student.photo}
                                                size="sm"
                                            />
                                            <div>
                                                <div className="font-medium text-slate-900">{student.first_name} {student.last_name}</div>
                                                <div className="text-xs text-indigo-600 font-mono font-bold">{student.index_number || 'PENDING'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {student.current_class}
                                        {student.current_stream !== 'N/A' && <span className="ml-1 text-slate-400">({student.current_stream})</span>}
                                    </td>
                                    <td className="p-4 text-slate-600">{student.gender}</td>
                                    <td className="p-4 text-slate-600">{student.admission_year}</td>
                                    <td className="p-4">
                                        <StatusBadge status={student.status as any} />
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleViewStudent(student)}>
                                            <Eye size={16} className="text-slate-400 hover:text-primary-600" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        {error ? (
                                            <p className="text-red-500">{error}</p>
                                        ) : (
                                            "No students found matching filters."
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Student Detail Modal */}
            <AnimatePresence>
                {isModalOpen && selectedStudent && (
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
                                    <StudentAvatar
                                        firstName={selectedStudent.first_name}
                                        lastName={selectedStudent.last_name}
                                        photo={selectedStudent.photo}
                                        size="xl"
                                        className="bg-white"
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-800">{selectedStudent.first_name} {selectedStudent.last_name}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-slate-500 text-sm">{selectedStudent.index_number || 'NO INDEX'} • {selectedStudent.current_class}</span>
                                            <StatusBadge status={selectedStudent.status as any} size="sm" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={isEditing ? "ghost" : "outline"}
                                        size="sm"
                                        onClick={handleEditToggle}
                                        className="gap-2"
                                        disabled={isSaving}
                                    >
                                        {isEditing ? <XCircle size={16} /> : <Edit2 size={16} />}
                                        {isEditing ? "Cancel" : "Edit Profile"}
                                    </Button>
                                    <button onClick={() => setIsModalOpen(false)} className="ml-2 text-slate-400 hover:text-slate-600">
                                        <XCircle size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Sidebar Tabs */}
                                <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 space-y-2 hidden md:block">
                                    <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={User} label="Personal Profile" />
                                    <TabButton active={activeTab === 'academic'} onClick={() => setActiveTab('academic')} icon={School} label="Academic Records" />
                                    <TabButton active={activeTab === 'fees'} onClick={() => setActiveTab('fees')} icon={CreditCard} label="Fees & Payments" />
                                    <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} icon={Stethoscope} label="Health & Medical" />
                                    <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={Settings} label="Account Settings" />
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 p-6 overflow-y-auto">
                                    {activeTab === 'profile' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Basic Information" icon={User} />
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                <EditInput
                                                    isEditing={isEditing}
                                                    label="First Name"
                                                    value={editData.first_name || ''}
                                                    onChange={(val: string) => handleInputChange('first_name', val)}
                                                />
                                                <EditInput
                                                    isEditing={isEditing}
                                                    label="Last Name"
                                                    value={editData.last_name || ''}
                                                    onChange={(val: string) => handleInputChange('last_name', val)}
                                                />
                                                <div className="col-span-1">
                                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Gender</p>
                                                    {isEditing ? (
                                                        <select
                                                            value={editData.gender}
                                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                                        >
                                                            <option value="Male">Male</option>
                                                            <option value="Female">Female</option>
                                                        </select>
                                                    ) : (
                                                        <p className="text-slate-800 font-medium">{selectedStudent.gender}</p>
                                                    )}
                                                </div>
                                                <EditInput
                                                    isEditing={isEditing}
                                                    label="Date of Birth"
                                                    type="date"
                                                    value={editData.date_of_birth?.split('T')[0] || ''}
                                                    onChange={(val: string) => handleInputChange('date_of_birth', val)}
                                                    displayValue={selectedStudent.date_of_birth ? format(new Date(selectedStudent.date_of_birth), 'MMMM dd, yyyy') : 'N/A'}
                                                />
                                                <EditInput
                                                    isEditing={isEditing}
                                                    label="Nationality"
                                                    value={editData.nationality || ''}
                                                    onChange={(val: string) => handleInputChange('nationality', val)}
                                                />
                                                <EditInput
                                                    isEditing={false}
                                                    label="Index Number"
                                                    value={selectedStudent.index_number || ''}
                                                    onChange={() => { }}
                                                />
                                            </div>

                                            <SectionHeader title="Contact & Address" icon={Users} />
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                <div className="col-span-2">
                                                    <EditInput
                                                        isEditing={isEditing}
                                                        label="Residential Address"
                                                        value={editData.address || ''}
                                                        onChange={(val: string) => handleInputChange('address', val)}
                                                    />
                                                </div>
                                                <EditInput
                                                    isEditing={isEditing}
                                                    label="City"
                                                    value={editData.city || ''}
                                                    onChange={(val: string) => handleInputChange('city', val)}
                                                />
                                            </div>

                                            {/* Status Actions */}
                                            {!isEditing && selectedStudent.status === 'Pending Approval' && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                                                    <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-2">
                                                        <AlertCircle size={18} /> Admission Approval
                                                    </h4>
                                                    <p className="text-sm text-blue-600 mb-4">This student is waiting for admission approval. Activate to enroll them in the system.</p>
                                                    <div className="flex gap-3">
                                                        <Button
                                                            onClick={handleApproveAdmission}
                                                            disabled={isSaving}
                                                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                                                        >
                                                            {isSaving && activeTab === 'profile' ? <Loader2 size={16} className="animate-spin" /> : null}
                                                            Approve Admission
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={handleRejectAdmission}
                                                            disabled={isSaving}
                                                            className="border-blue-200 text-blue-700 hover:bg-blue-100"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Status Actions: Pending Exit */}
                                            {selectedStudent.status === 'Pending Exit' && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
                                                    <h4 className="font-bold text-amber-800 flex items-center gap-2 mb-2">
                                                        <AlertCircle size={18} /> Exit Request
                                                    </h4>
                                                    <p className="text-sm text-amber-700 mb-4">A request has been made to exit/transfer this student.</p>
                                                    <div className="flex gap-3">
                                                        <Button onClick={() => handleStatusChange('Active' as any)} className="bg-amber-600 hover:bg-amber-700">
                                                            Approve Exit
                                                        </Button>
                                                        <Button variant="outline" onClick={() => handleStatusChange('Active' as any)} className="border-amber-200 text-amber-700 hover:bg-amber-100">
                                                            Reject & Reactivate
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'academic' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Current Enrollment" icon={School} />
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                <div className="col-span-1">
                                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Current Class</p>
                                                    {isEditing ? (
                                                        <select
                                                            value={editData.class_id || ''}
                                                            onChange={(e) => {
                                                                const newClsId = Number(e.target.value);
                                                                handleInputChange('class_id', newClsId);
                                                                handleInputChange('stream_id', null); // Reset stream when class changes
                                                            }}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                                        >
                                                            <option value="">Select Class</option>
                                                            {classes.map(c => (
                                                                <option key={c.id} value={c.id}>{c.name}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <p className="text-slate-800 font-medium">{selectedStudent.current_class}</p>
                                                    )}
                                                </div>
                                                <div className="col-span-1">
                                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Stream</p>
                                                    {isEditing ? (
                                                        <select
                                                            value={editData.stream_id || ''}
                                                            onChange={(e) => handleInputChange('stream_id', e.target.value ? Number(e.target.value) : null)}
                                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                                            disabled={!editData.class_id}
                                                        >
                                                            <option value="">No Stream (Standard)</option>
                                                            {classes.find(c => c.id === editData.class_id)?.streams?.map(s => (
                                                                <option key={s.id} value={s.id}>{s.name}</option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <p className="text-slate-800 font-medium">{selectedStudent.current_stream}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-8 rounded-lg text-center text-slate-500">
                                                Academic history and results will appear here.
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'fees' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Financial Status" icon={CreditCard} />
                                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <div className="p-3 bg-red-100 text-red-600 rounded-full">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-slate-500">Outstanding Balance</p>
                                                    <p className="text-2xl font-bold text-emerald-600 font-mono">GH₵ 0.00</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'health' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Medical Information" icon={Stethoscope} />
                                            {selectedStudent.medical ? (
                                                <div className="bg-red-50 border border-red-100 p-4 rounded-lg text-red-800 flex gap-3 text-sm">
                                                    <Activity size={20} className="shrink-0" />
                                                    <div>
                                                        {selectedStudent.medical.health_conditions && <p><strong>Conditions:</strong> {selectedStudent.medical.health_conditions}</p>}
                                                        {selectedStudent.medical.allergies && <p><strong>Allergies:</strong> {selectedStudent.medical.allergies}</p>}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 italic">No medical notes recorded.</p>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'account' && (
                                        <div className="space-y-6">
                                            <SectionHeader title="Account Details" icon={Settings} />
                                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                                <InfoItem label="System Username" value={selectedStudent.account?.username || 'NOT CREATED'} />
                                                <div className="col-span-1">
                                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Account Status</p>
                                                    <div className="flex items-center gap-2">
                                                        <ShieldCheck size={16} className={selectedStudent.account?.is_active ? "text-emerald-500" : "text-slate-300"} />
                                                        <span className={cn("font-medium", selectedStudent.account?.is_active ? "text-emerald-600" : "text-slate-500")}>
                                                            {selectedStudent.account?.is_active ? 'Active' : 'Disabled'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <SectionHeader title="Security Controls" icon={Key} />
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <h4 className="font-bold text-slate-800 text-sm mb-2">Reset Student Password</h4>
                                                <p className="text-xs text-slate-500 mb-4">Enter a new password for this student. They will be required to change it upon their next login.</p>

                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        placeholder="New temporary password"
                                                        value={resetPwd}
                                                        onChange={(e) => setResetPwd(e.target.value)}
                                                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500"
                                                    />
                                                    <Button
                                                        onClick={handleResetPassword}
                                                        disabled={isSaving || !resetPwd}
                                                        className="gap-2"
                                                    >
                                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                                                        Reset Password
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Close</Button>
                                {isEditing ? (
                                    <Button onClick={handleSaveChanges} disabled={isSaving} className="gap-2">
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button onClick={() => setIsModalOpen(false)}>Done</Button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <NewAdmissionModal
                isOpen={isAdmissionModalOpen}
                onClose={() => setIsAdmissionModalOpen(false)}
                onSave={(data) => {
                    console.log('New Student Data:', data);
                    // In real app: Add to list / API call
                    alert('New Student Admission Processed Successfully!');
                }}
            />
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

const EditInput = ({ label, value, onChange, isEditing, type = "text", displayValue }: any) => (
    <div className="col-span-1">
        <p className="text-xs text-slate-400 uppercase font-bold mb-1">{label}</p>
        {isEditing ? (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
        ) : (
            <p className="text-slate-800 font-medium">{displayValue || value || 'N/A'}</p>
        )}
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

const StatusBadge = ({ status, size = 'md' }: { status: StudentStatus, size?: 'sm' | 'md' }) => {
    const styles: Record<string, string> = {
        'ACTIVE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'PENDING APPROVAL': 'bg-blue-50 text-blue-700 border-blue-200',
        'INACTIVE': 'bg-slate-50 text-slate-500 border-slate-200',
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
