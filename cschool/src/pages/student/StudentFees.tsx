import {
    Wallet,
    Download,
    FileText,
    TrendingUp,
    TrendingDown,
    Printer,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/common/Button';

// Mock Data
interface Transaction {
    id: string;
    date: string;
    type: 'Bill' | 'Receipt';
    description: string;
    refNo: string;
    debit: number; // Cost / Charge
    credit: number; // Payment
    balance: number;
}

const mockTransactions: Transaction[] = [
    {
        id: 'tx1',
        date: '10 Sep 2024',
        type: 'Bill',
        description: 'First Term Tuition Fees',
        refNo: 'BILL-24-001',
        debit: 1500.00,
        credit: 0,
        balance: 1500.00
    },
    {
        id: 'tx3',
        date: '15 Sep 2024',
        type: 'Receipt',
        description: 'Part Payment (Cash)',
        refNo: 'RCP-24-089',
        debit: 0,
        credit: 1000.00,
        balance: 500.00
    }
];

export const StudentFees = () => {
    // Current Balance is the balance of the last transaction
    const currentBalance = mockTransactions[mockTransactions.length - 1].balance;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Wallet className="text-primary-600" />
                        School Fees
                    </h1>
                    <p className="text-slate-500 mt-1">View your fee statement and payment history.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">JHS 2</span>
                    <span>•</span>
                    <span>Term 1</span>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Outstanding Balance</span>
                    <div className={cn(
                        "text-3xl font-bold mt-1",
                        currentBalance > 0 ? "text-red-600" : "text-green-600"
                    )}>
                        GH₵ {currentBalance.toFixed(2)}
                    </div>
                    {currentBalance > 0 ? (
                        <p className="text-sm text-red-500 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp size={16} />
                            Payment Due
                        </p>
                    ) : (
                        <p className="text-sm text-green-500 font-medium mt-1 flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            Fully Paid
                        </p>
                    )}
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Printer size={16} className="mr-2" />
                        Print Statement
                    </Button>
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Download size={16} className="mr-2" />
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* Statement Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                                <th className="px-6 py-4 w-full">Description</th>
                                <th className="px-6 py-4 whitespace-nowrap">Ref No.</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Debit (GH₵)</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Credit (GH₵)</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap font-bold bg-slate-100/50">Balance (GH₵)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">{tx.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-xs font-bold",
                                            tx.type === 'Bill' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                                        )}>
                                            {tx.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{tx.description}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{tx.refNo}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">
                                        {tx.debit > 0 ? tx.debit.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600">
                                        {tx.credit > 0 ? tx.credit.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 bg-slate-50/30">
                                        {tx.balance.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
