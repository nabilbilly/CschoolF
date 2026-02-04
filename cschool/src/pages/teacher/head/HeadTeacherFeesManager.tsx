import { useState, useMemo } from 'react';
import { Button } from '../../../components/common/Button';
import {
    Search, Download, Printer,
    CreditCard, AlertCircle, CheckCircle,
    X, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { format } from 'date-fns';

// --- Mock Data ---

const classes = ['Primary 1', 'Primary 2', 'Primary 3', 'Primary 4', 'Primary 5', 'Primary 6', 'JHS 1', 'JHS 2', 'JHS 3'];

type PaymentHistoryItem = {
    id: string;
    date: string;
    amount: number;
    method: 'Cash' | 'Mobile Money' | 'Bank Deposit';
    reference: string;
};

type BillItem = {
    description: string;
    amount: number;
};

type StudentFeeRecord = {
    id: string;
    name: string;
    class: string;
    totalBill: number;
    paid: number;
    balance: number;
    status: 'Cleared' | 'Part-paid' | 'Uncleared';
    history: PaymentHistoryItem[];
    billItems: BillItem[];
};

// Generate some mock data
const generateMockData = (className: string): StudentFeeRecord[] => {
    return Array.from({ length: 20 }).map((_, i) => {
        const totalBill = 1500;
        const paid = Math.floor(Math.random() * 16) * 100; // 0 to 1500
        const balance = totalBill - paid;
        let status: StudentFeeRecord['status'] = 'Part-paid';
        if (balance === 0) status = 'Cleared';
        if (paid === 0) status = 'Uncleared';

        return {
            id: `STU${2025000 + i} `,
            name: [
                'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Abena Boateng', 'Yaw Addo',
                'Akosua Konadu', 'Kwadwo Owusu', 'Adwoa Yeboah', 'Kwabena Antwi', 'Akua Sarpong'
            ][i % 10] + ` ${i + 1} `,
            class: className,
            totalBill,
            paid,
            balance,
            status,
            billItems: [
                { description: 'Tuition Fees', amount: 1000 },
                { description: 'PTA Dues', amount: 200 },
                { description: 'Feeding', amount: 300 }
            ],
            history: status === 'Uncleared' ? [] : [
                { id: `TXN${i} 1`, date: '2025-01-10', amount: paid > 500 ? 500 : paid, method: 'Mobile Money' as const, reference: 'MM839202' },
                ...(paid > 500 ? [{ id: `TXN${i} 2`, date: '2025-02-15', amount: paid - 500, method: 'Bank Deposit' as const, reference: 'BD22910' }] : [])
            ]
        };
    });
};

export const HeadTeacherFeesManager = () => {
    // State
    const [selectedYear, setSelectedYear] = useState('2025/2026');
    const [selectedTerm, setSelectedTerm] = useState('1');
    const [selectedClass, setSelectedClass] = useState('Primary 5');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedStudent, setSelectedStudent] = useState<StudentFeeRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data based on selection
    const studentData = useMemo(() => generateMockData(selectedClass), [selectedClass]);

    // Derived Stats
    const stats = useMemo(() => {
        const totalExpected = studentData.reduce((acc, s) => acc + s.totalBill, 0);
        const totalPaid = studentData.reduce((acc, s) => acc + s.paid, 0);
        const totalBalance = totalExpected - totalPaid;
        const clearedCount = studentData.filter(s => s.status === 'Cleared').length;
        const partPaidCount = studentData.filter(s => s.status === 'Part-paid').length;
        const unclearedCount = studentData.filter(s => s.status === 'Uncleared').length;
        const collectionRate = Math.round((totalPaid / totalExpected) * 100) || 0;

        return { totalExpected, totalPaid, totalBalance, clearedCount, partPaidCount, unclearedCount, collectionRate };
    }, [studentData]);

    const filteredStudents = useMemo(() => {
        return studentData.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [studentData, searchQuery]);

    const handleViewDetails = (student: StudentFeeRecord) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 pb-24">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 1. Header & Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-2 z-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Fees Overview</h1>
                            <p className="text-slate-500 text-sm">Monitor class-level fee collection and student balances.</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Printer className="mr-2 h-4 w-4" />
                                Print Report
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            <option>2025/2026</option>
                            <option>2024/2025</option>
                        </select>
                        <select
                            value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            <option value="1">First Term</option>
                            <option value="2">Second Term</option>
                            <option value="3">Third Term</option>
                        </select>
                        <select
                            value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-sm rounded-lg p-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        >
                            {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>

                {/* 2. Fees Summary Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Expected */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <div className="p-2 bg-slate-100 rounded-lg"><Wallet size={18} /></div>
                            <span className="text-xs font-bold uppercase tracking-wide">Total Expected</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-slate-800">GH₵{stats.totalExpected.toLocaleString()}</span>
                            <p className="text-xs text-slate-400 mt-1">For {studentData.length} students</p>
                        </div>
                    </div>

                    {/* Total Paid */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-3 text-emerald-600 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle size={18} /></div>
                            <span className="text-xs font-bold uppercase tracking-wide">Total Paid</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-emerald-600">GH₵{stats.totalPaid.toLocaleString()}</span>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.collectionRate}% ` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Outstanding Balance */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
                        <div className="flex items-center gap-3 text-red-600 mb-2">
                            <div className="p-2 bg-red-50 rounded-lg"><AlertCircle size={18} /></div>
                            <span className="text-xs font-bold uppercase tracking-wide">Outstanding</span>
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-red-600">GH₵{stats.totalBalance.toLocaleString()}</span>
                            <p className="text-xs text-red-400 mt-1">{100 - stats.collectionRate}% Remaining</p>
                        </div>
                    </div>

                    {/* Status Breakdown */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center gap-3 h-32">
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Cleared</span>
                            <span className="font-bold">{stats.clearedCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Part-paid</span>
                            <span className="font-bold">{stats.partPaidCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Uncleared</span>
                            <span className="font-bold">{stats.unclearedCount}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Student Fees Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search student name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-slate-600">
                                <Download className="mr-2 h-4 w-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Total Bill</th>
                                    <th className="p-4">Amount Paid</th>
                                    <th className="p-4">Balance</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800 text-sm">{student.name}</div>
                                                    <div className="text-xs text-slate-500">{student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-600">GH₵{student.totalBill}</td>
                                        <td className="p-4 text-sm font-bold text-emerald-600">GH₵{student.paid}</td>
                                        <td className="p-4 text-sm font-bold text-red-600">GH₵{student.balance}</td>
                                        <td className="p-4">
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                                student.status === 'Cleared' ? "bg-green-100 text-green-700 border-green-200" :
                                                    student.status === 'Part-paid' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                        "bg-red-50 text-red-700 border-red-200"
                                            )}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student)}>
                                                <CreditCard className="h-4 w-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                                                <span className="ml-2">Details</span>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Student Details Modal */}
            <AnimatePresence>
                {isModalOpen && selectedStudent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden z-10"
                        >
                            <div className="bg-slate-900 text-white p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                                        <p className="text-slate-400 text-sm mt-1">{selectedStudent.id} • {selectedStudent.class}</p>
                                    </div>
                                    <button onClick={() => setIsModalOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white/10 rounded-lg p-3">
                                        <div className="text-slate-400 text-xs uppercase font-bold mb-1">Total Due</div>
                                        <div className="text-lg font-bold">GH₵{selectedStudent.totalBill}</div>
                                    </div>
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3">
                                        <div className="text-emerald-300 text-xs uppercase font-bold mb-1">Paid</div>
                                        <div className="text-lg font-bold text-emerald-300">GH₵{selectedStudent.paid}</div>
                                    </div>
                                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                                        <div className="text-red-300 text-xs uppercase font-bold mb-1">Balance</div>
                                        <div className="text-lg font-bold text-red-300">GH₵{selectedStudent.balance}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-6">
                                    {/* Bill Breakdown */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <FileText size={16} className="text-primary-500" />
                                            Bill Breakdown
                                        </h4>
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                                            {selectedStudent.billItems.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-slate-600">{item.description}</span>
                                                    <span className="font-medium text-slate-800">GH₵{item.amount}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-slate-200 my-2 pt-2 flex justify-between font-bold text-slate-800">
                                                <span>Total</span>
                                                <span>GH₵{selectedStudent.totalBill}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <History size={16} className="text-primary-500" />
                                            Payment History
                                        </h4>
                                        {selectedStudent.history.length > 0 ? (
                                            <div className="space-y-3">
                                                {selectedStudent.history.map((txn) => (
                                                    <div key={txn.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:border-slate-300 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                                <CheckCircle size={14} />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800">GH₵{txn.amount}</div>
                                                                <div className="text-xs text-slate-500">{format(new Date(txn.date), 'MMM dd, yyyy')} • {txn.method}</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                                            {txn.reference}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                                <p>No payments recorded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Missing Imports Fix
function FileText({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
    )
}

function History({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 3v5h5"></path>
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
            <path d="M12 7v5l4 2"></path>
        </svg>
    )
}
