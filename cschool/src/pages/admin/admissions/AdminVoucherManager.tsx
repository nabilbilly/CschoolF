import { useState, useEffect } from 'react';
import { Plus, Search, Filter, RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { evoucherService, type EVoucher, type AcademicYear } from '../../../services/evoucherService';
import { GenerateVoucherModal } from '../../../components/modals/GenerateVoucherModal';

export const AdminVoucherManager = () => {
    const [vouchers, setVouchers] = useState<EVoucher[]>([]);
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Pagination State
    const [page, setPage] = useState(1);
    const [pageSize] = useState(50);
    const [totalItems, setTotalItems] = useState(0);

    // Filters
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            loadVouchers(selectedYear, page);
        }
    }, [page, statusFilter]);

    const loadInitialData = async () => {
        try {
            const yearsData = await evoucherService.getAcademicYears();
            setYears(yearsData);
            if (yearsData.length > 0) {
                setSelectedYear(yearsData[0].id.toString());
                loadVouchers(yearsData[0].id.toString(), 1);
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Failed to load initial data', error);
            setLoading(false);
        }
    };

    const loadVouchers = async (yearId: string, pageNum: number) => {
        setLoading(true);
        try {
            const data = await evoucherService.getVouchers(
                parseInt(yearId),
                statusFilter || undefined,
                pageNum,
                pageSize
            );
            setVouchers(data.items);
            setTotalItems(data.total);
        } catch (error) {
            console.error('Failed to load vouchers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (selectedYear) loadVouchers(selectedYear, page);
    };

    const handleCleanup = async () => {
        if (confirm('Are you sure you want to clean up expired reservations? This will release any vouchers that have been reserved for more than 15 minutes.')) {
            try {
                const result = await evoucherService.cleanupReservations();
                if (result.success) {
                    alert(result.message);
                    handleRefresh();
                }
            } catch (error) {
                alert('Failed to cleanup reservations');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Unused': return 'bg-green-100 text-green-800';
            case 'Reserved': return 'bg-yellow-100 text-yellow-800';
            case 'Used': return 'bg-blue-100 text-blue-800';
            case 'Expired': return 'bg-gray-100 text-gray-800';
            case 'Revoked': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredVouchers = vouchers.filter(v =>
        v.voucher_number.includes(searchQuery)
    );

    const totalPages = Math.ceil(totalItems / pageSize);

    return (
        <div className="p-6">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admission E-Vouchers</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage admission access codes for {years.find(y => y.id.toString() === selectedYear)?.name}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCleanup}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                        title="Release expired reservations"
                    >
                        <RefreshCw size={20} />
                        Cleanup
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
                    >
                        <Plus size={20} />
                        Generate Vouchers
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border mb-6">
                <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Filters:</span>
                    </div>

                    <select
                        value={selectedYear}
                        onChange={(e) => {
                            setSelectedYear(e.target.value);
                            setPage(1); // Reset to page 1
                            loadVouchers(e.target.value, 1);
                        }}
                        className="border rounded-md px-3 py-1.5 text-sm bg-gray-50"
                    >
                        <option value="">Select Year</option>
                        {years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1); // Reset to page 1
                        }}
                        className="border rounded-md px-3 py-1.5 text-sm bg-gray-50"
                    >
                        <option value="">All Statuses</option>
                        <option value="Unused">Unused</option>
                        <option value="Reserved">Reserved</option>
                        <option value="Used">Used</option>
                        <option value="Expired">Expired</option>
                        <option value="Revoked">Revoked</option>
                    </select>

                    <div className="ml-auto relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search voucher #"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-1.5 border rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="px-6 py-3">Voucher Number</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Expires At</th>
                                <th className="px-6 py-3">Reserved At</th>
                                <th className="px-6 py-3">Created At</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading vouchers...</td>
                                </tr>
                            ) : filteredVouchers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No vouchers found on this page</td>
                                </tr>
                            ) : (
                                filteredVouchers.map((v) => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-mono">{v.voucher_number}</td>
                                        <td className="px-6 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(v.status)}`}>
                                                {v.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {new Date(v.expires_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {v.reserved_at ? new Date(v.reserved_at).toLocaleTimeString() : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-gray-500">
                                            {new Date(v.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {v.status !== 'Revoked' && v.status !== 'Used' && (
                                                <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50" title="Revoke">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="p-4 border-t flex items-center justify-between bg-gray-50 rounded-b-xl">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to <span className="font-medium">{Math.min(page * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || loading}
                            className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center px-4 font-medium text-sm">
                            Page {page} of {totalPages || 1}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages || loading}
                            className="p-2 border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <GenerateVoucherModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    handleRefresh();
                }}
            />
        </div>
    );
};
