import { useState, useEffect } from 'react';
import {
    Plus, CheckCircle2, AlertCircle, Edit2, Archive, Search, Filter, X, Trash2, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/common/Button';
import { CreateAcademicYearModal } from './CreateAcademicYearModal';
import { academicsService } from '../../../services/academicsService';
import type { AcademicYear } from '../../../services/academicsService';

export const AdminAcademicYears = () => {
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Draft' | 'Archived'>('All');
    const [showModal, setShowModal] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const [showActivationAlert, setShowActivationAlert] = useState<{ show: boolean, year: AcademicYear | null, currentActive: AcademicYear | null }>({
        show: false,
        year: null,
        currentActive: null
    });

    const activeYear = years.find(y => y.status === 'Active');

    const fetchYears = async () => {
        setIsLoading(true);
        try {
            const data = await academicsService.getAcademicYears();
            setYears(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch academic years');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchYears();
    }, []);

    const handleSave = async () => {
        await fetchYears();
    };

    const handleActivate = async (year: AcademicYear) => {
        if (!year.start_date || !year.end_date) {
            setEditingYear(year);
            setShowModal(true);
            return;
        }

        if (activeYear && activeYear.id !== year.id) {
            setShowActivationAlert({ show: true, year, currentActive: activeYear });
            return;
        }

        try {
            await academicsService.updateAcademicYear(year.id, { status: 'Active' });
            await fetchYears();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleArchive = async (year: AcademicYear) => {
        if (!window.confirm(`Are you sure you want to archive ${year.name}? This will close the current academic session.`)) return;

        try {
            await academicsService.updateAcademicYear(year.id, { status: 'Archived' });
            await fetchYears();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDelete = async (year: AcademicYear) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${year.name}? This action cannot be undone.`)) return;

        try {
            await academicsService.deleteAcademicYear(year.id);
            await fetchYears();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const filteredYears = years.filter(year => {
        const matchesSearch = year.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || year.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Archived': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'Draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Academic Years</h2>
                    <div className="flex items-center gap-2 mt-1">
                        {activeYear ? (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                <CheckCircle2 size={12} />
                                {activeYear.name} is Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                                <AlertCircle size={12} />
                                No Active Academic Year
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    {/* {activeYear && (
                        <Button
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
                            onClick={() => { setEditingYear(activeYear); setShowModal(true); }}
                        >
                            <Calendar size={20} className="mr-2 text-primary-600" />
                            Manage Term
                        </Button>
                    )} */}
                    <Button onClick={() => { setEditingYear(null); setShowModal(true); }} className="shadow-lg shadow-primary-200">
                        <Plus size={20} className="mr-2" />
                        New Academic Year
                    </Button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-3 shadow-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="ml-auto h-7 w-7 p-0" onClick={() => setError(null)}>
                        <X size={16} />
                    </Button>
                </div>
            )}

            {!activeYear && !isLoading && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4 text-amber-800"
                >
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold">System Warning</p>
                        <p className="text-sm opacity-90">No academic year is currently active. Students cannot be admitted until you activate a year.</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100" onClick={() => { setEditingYear(null); setShowModal(true); }}>
                        Set Up Now
                    </Button>
                </motion.div>
            )}

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by year name..."
                        className="w-full pl-10 pr-4 py-2 border-slate-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={18} className="text-slate-500" />
                    <select
                        className="flex-1 md:flex-none border-slate-200 rounded-lg py-2 pl-3 pr-8 focus:ring-primary-500 focus:border-primary-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : filteredYears.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                        No academic years found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredYears.map((year) => (
                                    <tr
                                        key={year.id}
                                        className={cn(
                                            "hover:bg-slate-50/50 transition-colors group",
                                            year.status === 'Active' && "bg-green-50/30 ring-1 ring-inset ring-green-100"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-900">{year.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {year.start_date || <span className="text-slate-300 italic">Not set</span>}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {year.end_date || <span className="text-slate-300 italic">Not set</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border", getStatusBadge(year.status))}>
                                                {year.status}
                                            </span>
                                            {/* ***************************************Edit Button  AdminAcademicYears super admin permissions *********************************************************************************************************
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600"
                                                onClick={() => { setEditingYear(year); setShowModal(true); }}
                                            >
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(year); }}
                                            >
                                                <Trash2 size={16} />
                                            </Button> ************************************************************************************************************************** */}

                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {year.status !== 'Archived' && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {year.status === 'Draft' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-3 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                                            onClick={(e) => { e.stopPropagation(); handleActivate(year); }}
                                                        >
                                                            Activate
                                                        </Button>
                                                    )}
                                                    {year.status === 'Active' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-8 px-3 text-xs bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                            onClick={(e) => { e.stopPropagation(); handleArchive(year); }}
                                                        >
                                                            <Archive size={14} className="mr-1" />
                                                            Archive
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600"
                                                        onClick={() => { setEditingYear(year); setShowModal(true); }}
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(year); }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>

                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Activation Alert Modal/Toast logic could go here */}
            {showActivationAlert.show && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6"
                    >
                        <div className="flex items-center gap-3 text-amber-600 mb-4">
                            <AlertCircle size={28} />
                            <h3 className="text-xl font-bold">Action Required</h3>
                        </div>
                        <p className="text-slate-600 mb-6">
                            Year <span className="font-bold text-slate-900">{showActivationAlert.currentActive?.name}</span> is currently Active.
                            You must Archive it before activating <span className="font-bold text-slate-900">{showActivationAlert.year?.name}</span>.
                        </p>
                        <div className="flex gap-3">
                            <Button className="flex-1" variant="outline" onClick={() => setShowActivationAlert({ show: false, year: null, currentActive: null })}>
                                Dismiss
                            </Button>
                            <Button className="flex-1 bg-slate-800 hover:bg-slate-900" onClick={() => {
                                setEditingYear(showActivationAlert.currentActive);
                                setShowModal(true);
                                setShowActivationAlert({ show: false, year: null, currentActive: null });
                            }}>
                                Go to {showActivationAlert.currentActive?.name}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            <CreateAcademicYearModal
                isOpen={showModal}
                year={editingYear}
                onClose={() => { setShowModal(false); setEditingYear(null); }}
                onSave={handleSave}
            />
        </div>
    );
};
