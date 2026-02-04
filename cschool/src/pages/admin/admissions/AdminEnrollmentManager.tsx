import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    ChevronRight,
    Eye,
    Download,
    Printer,
    Calendar,
    Layers,
    ExternalLink,
    X,
    AlertCircle,
    Edit
} from 'lucide-react';
import { admissionsService } from '../../../services/admissionsService';
import type { AdmissionResponse, AdmissionFilters } from '../../../services/admissionsService';
import { academicsService } from '../../../services/academicsService';
import type { AcademicYear, ClassRoom } from '../../../services/academicsService';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const AdminEnrollmentManager: React.FC = () => {
    // State
    const [admissions, setAdmissions] = useState<AdmissionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<AdmissionFilters>({
        status: '',
        class_id: '',
        academic_year_id: '',
        term_id: '',
        search: ''
    });

    // Metadata
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [selectedAdmission, setSelectedAdmission] = useState<AdmissionResponse | null>(null);
    const [showDetailPanel, setShowDetailPanel] = useState(false);

    // Filter bar state
    const [isFilterExpanded, setIsFilterExpanded] = useState(true);

    // Initial Load
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [years, classList] = await Promise.all([
                    academicsService.getAcademicYears(),
                    academicsService.getClasses()
                ]);
                setAcademicYears(years);
                setClasses(classList);

                // Set default academic year if any
                const activeYear = years.find(y => y.status === 'Active');
                if (activeYear) {
                    setFilters(prev => ({ ...prev, academic_year_id: activeYear.id }));
                }
            } catch (err) {
                console.error("Failed to fetch initial data", err);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch Admissions when filters change
    useEffect(() => {
        fetchAdmissions();
    }, [filters]);

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const data = await admissionsService.listAdmissions(filters);
            setAdmissions(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load admissions");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        if (!window.confirm("Are you sure you want to APPROVE this enrollment? This will generate an index number and activate the student account.")) return;

        try {
            await admissionsService.approveAdmission(id);
            fetchAdmissions();
            if (selectedAdmission?.id === id) {
                setSelectedAdmission(prev => prev ? { ...prev, status: 'Approved' } : null);
            }
        } catch (err: any) {
            alert("Approval failed: " + err.message);
        }
    };

    const handleReject = async (id: number) => {
        if (!window.confirm("Are you sure you want to REJECT this enrollment? The voucher will be released.")) return;

        try {
            await admissionsService.rejectAdmission(id);
            fetchAdmissions();
            if (selectedAdmission?.id === id) {
                setSelectedAdmission(prev => prev ? { ...prev, status: 'Rejected' } : null);
            }
        } catch (err: any) {
            alert("Rejection failed: " + err.message);
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const normalizedStatus = status?.toUpperCase();
        switch (normalizedStatus) {
            case 'APPROVED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Approved
                    </span>
                );
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                        <XCircle className="w-3 h-3 mr-1" /> Rejected
                    </span>
                );
            default:
                // Pending is default, covers 'PENDING', 'Pending', or null
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 mr-1" /> Pending
                    </span>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-6">
            {/* Error Banner */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto p-1 hover:bg-rose-100 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admissions & Enrollment</h1>
                    <p className="text-slate-500">Review and approve new student admissions before they are added to class lists.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                        <Calendar className="w-4 h-4 text-indigo-500 mr-2" />
                        <span className="text-sm font-medium text-slate-700">
                            {academicYears.find(y => y.id === Number(filters.academic_year_id))?.name || "Loading Year..."}
                        </span>
                    </div>
                    <Link
                        to="/admission/verification"
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium text-sm"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        New Admission Flow
                    </Link>
                </div>
            </header>

            {/* Filter & Control Bar */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700">Filter Controls</span>
                    </div>
                    <button
                        onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                        className="text-indigo-600 text-xs font-medium hover:underline"
                    >
                        {isFilterExpanded ? 'Simple View' : 'Show Advanced Filters'}
                    </button>
                </div>

                <div className={`p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all ${isFilterExpanded ? 'opacity-100 h-auto' : 'hidden'}`}>
                    {/* Search */}
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search name or voucher..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    {/* Class Filter */}
                    <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={filters.class_id}
                        onChange={(e) => setFilters(prev => ({ ...prev, class_id: e.target.value }))}
                    >
                        <option value="">All Classes</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {/* Academic Year Filter */}
                    <select
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={filters.academic_year_id}
                        onChange={(e) => setFilters(prev => ({ ...prev, academic_year_id: e.target.value }))}
                    >
                        <option value="">Academic Year</option>
                        {academicYears.map(y => (
                            <option key={y.id} value={y.id}>{y.name}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Admissions List (Main Table) */}
            <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Index Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Voucher Number</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class Applied For</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Submitted</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4 px-6 py-8 h-16">
                                            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : admissions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                                        <p className="font-medium text-lg text-slate-600">No admissions found</p>
                                        <p className="text-sm">Try adjusting your filters or search query.</p>
                                    </td>
                                </tr>
                            ) : (
                                admissions.map((admission) => (
                                    <tr
                                        key={admission.id}
                                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        onClick={() => {
                                            setSelectedAdmission(admission);
                                            setShowDetailPanel(true);
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{admission.student_name}</div>
                                            <div className="text-xs text-slate-500">ID: ADM-{admission.id.toString().padStart(4, '0')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(admission.status === 'Approved' || admission.status === 'APPROVED') ? (
                                                <div className="font-mono text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block">
                                                    {admission.student_index_number || 'PENDING'}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 text-xs italic">N/A</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono italic">
                                                {admission.voucher_number}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700">{admission.class_name}</div>
                                            <div className="text-xs text-slate-400">{admission.academic_year_name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {format(new Date(admission.created_at), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={admission.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAdmission(admission);
                                                        setShowDetailPanel(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {(admission.status === 'Pending' || admission.status === 'PENDING') && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(admission.id)}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(admission.id)}
                                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {(admission.status === 'Rejected' || admission.status === 'REJECTED') && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Do you want to reconsider and APPROVE this previously rejected admission?")) {
                                                                handleApprove(admission.id);
                                                            }
                                                        }}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                        title="Re-Approve (Edit)"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Admission Detail View (Slide-in Panel) */}
            <div className={`fixed inset-0 z-50 overflow-hidden transition-all ${showDetailPanel ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${showDetailPanel ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setShowDetailPanel(false)}
                />

                <div className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${showDetailPanel ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Panel Header */}
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowDetailPanel(false)}
                                className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Admission Details</h2>
                                <p className="text-sm text-slate-500">Ref: ADM-{selectedAdmission?.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedAdmission && <StatusBadge status={selectedAdmission.status} />}
                            <button
                                onClick={() => setShowDetailPanel(false)}
                                className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all text-slate-400"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Panel Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
                        {selectedAdmission ? (
                            <>
                                { /* Quick Actions for Pending */}
                                {(selectedAdmission.status === 'Pending' || selectedAdmission.status === 'PENDING') && (
                                    <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 text-indigo-700">
                                            <AlertCircle className="w-5 h-5" />
                                            <span className="text-sm font-semibold">Decision Required</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleReject(selectedAdmission.id)}
                                                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                                            >
                                                Reject Application
                                            </button>
                                            <button
                                                onClick={() => handleApprove(selectedAdmission.id)}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md text-sm font-medium"
                                            >
                                                Approve Enrollment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions for Rejected (Re-Approve) */}
                                {(selectedAdmission.status === 'Rejected' || selectedAdmission.status === 'REJECTED') && (
                                    <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 text-rose-700">
                                            <XCircle className="w-5 h-5" />
                                            <span className="text-sm font-semibold">Application Rejected</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Do you want to reconsider and APPROVE this previously rejected admission?")) {
                                                    handleApprove(selectedAdmission.id);
                                                }
                                            }}
                                            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Reconsider & Approve
                                        </button>
                                    </div>
                                )}

                                {/* Bio Data */}
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Users className="w-4 h-4 mr-2" /> Student Bio Data
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Full Name</label>
                                            <p className="text-slate-900 font-medium">{selectedAdmission.student_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Gender</label>
                                            <p className="text-slate-900 font-medium capitalize">Student Link Needed</p>
                                        </div>
                                        {(selectedAdmission.status === 'Approved' || selectedAdmission.status === 'APPROVED') && (
                                            <div>
                                                <label className="text-xs text-slate-400 uppercase font-bold text-indigo-600">Index Number</label>
                                                <p className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 rounded w-fit">
                                                    {selectedAdmission.student_index_number || 'GENERATING...'}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Voucher Linked</label>
                                            <p className="text-slate-900 font-mono text-sm">{selectedAdmission.voucher_number}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Applied On</label>
                                            <p className="text-slate-900 font-medium">{format(new Date(selectedAdmission.created_at), 'PPPp')}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Placement Details */}
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Layers className="w-4 h-4 mr-2" /> Academic Placement
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Academic Year</label>
                                            <p className="text-indigo-600 font-semibold">{selectedAdmission.academic_year_name}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 uppercase font-bold">Intake Term</label>
                                            <p className="text-slate-900 font-medium">{selectedAdmission.term_name}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs text-slate-400 uppercase font-bold">Class & Stream</label>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-bold text-lg">
                                                    {selectedAdmission.class_name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Audit & Metadata */}
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Clock className="w-4 h-4 mr-2" /> Processing Info
                                    </h3>
                                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                                        <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                                            <span className="text-slate-500">Submission Timestamp</span>
                                            <span className="font-medium text-slate-700">{format(new Date(selectedAdmission.created_at), 'PPpp')}</span>
                                        </div>
                                        {(selectedAdmission.status === 'Approved' || selectedAdmission.status === 'APPROVED') && (
                                            <>
                                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                                                    <span className="text-slate-500">Approval Timestamp</span>
                                                    <span className="font-medium text-emerald-600">
                                                        {selectedAdmission.approved_at ? format(new Date(selectedAdmission.approved_at), 'PPpp') : 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm py-2 border-b border-slate-50">
                                                    <span className="text-slate-500">Approved By</span>
                                                    <span className="font-medium text-slate-700">Administrator</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </section>

                                {/* Document Downloads (Static for now) */}
                                <section>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                                        <Printer className="w-4 h-4 mr-2" /> Documents & Printing
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                                            <Download className="w-4 h-4 mr-2 text-slate-400 group-hover:text-indigo-500" />
                                            Download Application PDF
                                        </button>
                                        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm group">
                                            <Printer className="w-4 h-4 mr-2 text-slate-400 group-hover:text-amber-500" />
                                            Print Enrollment Slip
                                        </button>
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
                                Select an admission to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEnrollmentManager;
