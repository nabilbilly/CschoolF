import { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    CreditCard,
    CheckCircle2,
    Clock,
    DollarSign,
    TrendingUp,
    Eye,
    EyeOff
} from 'lucide-react';
import { Button } from '../../components/common/Button';

// Mock Data
const paymentLogs = [
    {
        id: "PAY-2024-001",
        period: "December 2024",
        type: "Salary",
        amount: 3500.00,
        status: "Paid",
        date: "2024-12-25",
        method: "Bank Transfer",
        reference: "TXN-77889900",
        academicYear: "2024/2025"
    },
    {
        id: "PAY-2024-002",
        period: "December 2024",
        type: "Bonus",
        amount: 500.00,
        status: "Pending",
        date: "2024-12-28",
        method: "Mobile Money",
        reference: "Pending",
        academicYear: "2024/2025"
    },
    {
        id: "PAY-2024-003",
        period: "November 2024",
        type: "Salary",
        amount: 3500.00,
        status: "Paid",
        date: "2024-11-25",
        method: "Bank Transfer",
        reference: "TXN-66778899",
        academicYear: "2024/2025"
    },
    {
        id: "PAY-2024-004",
        period: "November 2024",
        type: "Extra Classes",
        amount: 450.00,
        status: "Paid",
        date: "2024-11-15",
        method: "Mobile Money",
        reference: "MM-12345678",
        academicYear: "2024/2025"
    },
    {
        id: "PAY-2024-005",
        period: "October 2024",
        type: "Salary",
        amount: 3500.00,
        status: "Paid",
        date: "2024-10-25",
        method: "Bank Transfer",
        reference: "TXN-55667788",
        academicYear: "2024/2025"
    },
    {
        id: "PAY-2024-006",
        period: "Term 1 Allowance",
        type: "Allowance",
        amount: 1200.00,
        status: "On Hold",
        date: "2024-09-30",
        method: "Bank Transfer",
        reference: "-",
        academicYear: "2024/2025"
    }
];

interface ObscurableValueProps {
    value: React.ReactNode;
    isHidden?: boolean;
    className?: string;
}

const ObscurableValue = ({ value, className = "", isHidden = true }: ObscurableValueProps) => {
    const [visible, setVisible] = useState(!isHidden);

    return (
        <div className="flex items-center gap-2">
            <span className={className}>
                {visible ? value : "••••••"}
            </span>
            <button
                onClick={() => setVisible(!visible)}
                className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                aria-label={visible ? "Hide value" : "Show value"}
            >
                {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
        </div>
    );
};

export const TeacherPayments = () => {
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    // Filter Logic
    const filteredLogs = paymentLogs.filter(log => {
        const statusMatch = statusFilter === 'All' || log.status === statusFilter;
        const typeMatch = typeFilter === 'All' || log.type === typeFilter;
        return statusMatch && typeMatch;
    });

    // Summary Calculations
    const totalPaid = paymentLogs
        .filter(log => log.status === 'Paid')
        .reduce((sum, log) => sum + log.amount, 0);

    const nextPayment = paymentLogs.find(log => log.status === 'Pending');

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm py-4 border-b border-slate-200/60 -mx-6 px-6 mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Payment History</h1>
                <p className="text-slate-500 mt-1">View and track your salary, allowances, and other payments.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Total Paid (YTD)</p>
                        <div className="h-9 flex items-center">
                            <ObscurableValue
                                value={`GH₵ ${totalPaid.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`}
                                className="text-xl font-bold text-slate-900"
                            />
                        </div>
                        <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                            <TrendingUp size={14} />
                            +12% from last term
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <DollarSign size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Last Payment</p>
                        <div className="h-9 flex items-center">
                            <ObscurableValue
                                value="GH₵ 3,500.00"
                                className="text-xl font-bold text-slate-900"
                            />
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-2">
                            25th Dec, 2024 • Salary
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <CheckCircle2 size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Next Expected</p>
                        <div className="h-9 flex items-center">
                            <ObscurableValue
                                value={nextPayment ? `GH₵ ${nextPayment.amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}` : 'N/A'}
                                className="text-xl font-bold text-slate-900"
                            />
                        </div>
                        <p className="text-xs text-amber-600 font-medium mt-2">
                            Est. {nextPayment ? new Date(nextPayment.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '-'}
                        </p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                        <Clock size={24} />
                    </div>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Pending">Pending</option>
                            <option value="On Hold">On Hold</option>
                        </select>
                    </div>
                    <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Salary">Salary</option>
                            <option value="Allowance">Allowance</option>
                            <option value="Bonus">Bonus</option>
                            <option value="Extra Classes">Extra Classes</option>
                        </select>
                    </div>
                </div>

                <Button variant="outline" className="gap-2">
                    <Download size={18} />
                    Export stament
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Payment Period</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Description/Info</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Amount</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{log.period}</div>
                                        <div className="text-xs text-slate-500">{log.academicYear}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                            {log.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600">{log.method}</div>
                                        <div className="text-xs text-slate-400 font-mono tracking-wider">{log.reference}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {log.status === 'Paid' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                Paid
                                            </span>
                                        )}
                                        {log.status === 'Pending' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                Pending
                                            </span>
                                        )}
                                        {log.status === 'On Hold' && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                On Hold
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">
                                            GH₵ {log.amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredLogs.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No payment records found</h3>
                        <p>Try adjusting your filters to see more results.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
