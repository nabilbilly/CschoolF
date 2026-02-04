import {
    ShieldCheck,
    Download,
    Printer,
    CheckCircle2,
    TrendingUp,
    Building2,
    Library,
    Trophy,
    GraduationCap,
    Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/common/Button';
import { useState } from 'react';

// Mock Data for Clearance Items
interface ClearanceItem {
    id: string;
    date: string;
    type: 'Bill' | 'Receipt';
    category: 'PTA' | 'Textbooks' | 'Damages' | 'Other';
    description: string;
    refNo: string;
    debit: number;
    credit: number;
    balance: number;
}

const mockClearanceItems: ClearanceItem[] = [
    {
        id: 'cl1',
        date: '10 Sep 2024',
        type: 'Bill',
        category: 'PTA',
        description: 'PTA Dues - Term 1',
        refNo: 'PTA-24-001',
        debit: 50.00,
        credit: 0,
        balance: 50.00
    },
    {
        id: 'cl2',
        date: '02 Oct 2024',
        type: 'Bill',
        category: 'Textbooks',
        description: 'Textbooks (Math & Science)',
        refNo: 'BKS-24-056',
        debit: 200.00,
        credit: 0,
        balance: 250.00
    },
    {
        id: 'cl3',
        date: '15 Oct 2024',
        type: 'Receipt',
        category: 'PTA',
        description: 'PTA Payment',
        refNo: 'RCP-24-099',
        debit: 0,
        credit: 50.00,
        balance: 200.00
    },
    {
        id: 'cl4',
        date: '05 Nov 2024',
        type: 'Bill',
        category: 'Damages',
        description: 'Laboratory Glassware Replacement',
        refNo: 'DMG-24-012',
        debit: 35.00,
        credit: 0,
        balance: 235.00
    }
];

export const StudentClearance = () => {
    const currentBalance = mockClearanceItems[mockClearanceItems.length - 1].balance;
    // Using state to simulate dynamic status and avoid TS "dead code" comparison errors for mock data
    const [studentStatus] = useState<'Active' | 'Transfer Requested' | 'Cleared' | 'Withdrawn'>('Transfer Requested');

    const clearanceSteps = [
        { id: 1, label: 'Department Head', status: 'completed', icon: Building2, date: '12 Jan 2025' },
        { id: 2, label: 'School Library', status: 'completed', icon: Library, date: '14 Jan 2025' },
        { id: 3, label: 'Sports Department', status: 'pending', icon: Trophy, date: null },
        { id: 4, label: 'Accounts Office', status: 'locked', icon: TrendingUp, date: null },
        { id: 5, label: 'Principal', status: 'locked', icon: GraduationCap, date: null },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="text-primary-600" />
                        Clearance
                    </h1>
                    <p className="text-slate-500 mt-1">Status on PTA dues, textbooks, and other obligations.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">JHS 2</span>
                    <span>•</span>
                    <span>Term 1</span>
                </div>
            </div>

            {/* Status Card - New Feature */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                Transfer / Clearance Status
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">Track your progress if you are leaving the school.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "px-3 py-1.5 rounded-lg text-sm font-bold border flex items-center gap-2",
                                studentStatus === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
                                    studentStatus === 'Transfer Requested' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                        studentStatus === 'Cleared' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                            "bg-slate-100 text-slate-700 border-slate-200"
                            )}>
                                {studentStatus === 'Active' && <CheckCircle2 size={16} />}
                                {studentStatus === 'Transfer Requested' && <Clock size={16} />}
                                {studentStatus}
                            </div>
                            {studentStatus === 'Active' && (
                                <span className="text-xs text-slate-400">No active clearance request.</span>
                            )}
                        </div>

                        {(studentStatus === 'Transfer Requested' || studentStatus === 'Cleared') && (
                            <div className="mt-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between relative">
                                    {/* Progress Line Background */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full"></div>

                                    {clearanceSteps.map((step) => (
                                        <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2 z-10">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                                                step.status === 'completed' ? "bg-green-50 border-green-500 text-green-600" :
                                                    step.status === 'pending' ? "bg-amber-50 border-amber-500 text-amber-600 animate-pulse" :
                                                        "bg-slate-50 border-slate-200 text-slate-300"
                                            )}>
                                                <step.icon size={18} />
                                            </div>
                                            <div className="text-center hidden md:block">
                                                <p className={cn(
                                                    "text-xs font-bold",
                                                    step.status === 'completed' ? "text-slate-800" :
                                                        step.status === 'pending' ? "text-amber-700" :
                                                            "text-slate-400"
                                                )}>{step.label}</p>
                                                {step.date && (
                                                    <span className="text-[10px] text-green-600 font-medium block">{step.date}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {studentStatus === 'Active' && (
                        <div className="md:w-64 bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Notice</h4>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                If you intend to transfer or withdraw, you must initiate the process at the administration office.
                            </p>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                                Request Info
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Notification</span>
                    <div className={cn(
                        "text-3xl font-bold mt-1",
                        currentBalance > 0 ? "text-red-600" : "text-green-600"
                    )}>
                        GH₵ {currentBalance.toFixed(2)}
                    </div>
                    {currentBalance > 0 ? (
                        <p className="text-sm text-red-500 font-medium mt-1 flex items-center gap-1">
                            <TrendingUp size={16} />
                            Uncleared Items
                        </p>
                    ) : (
                        <p className="text-sm text-green-500 font-medium mt-1 flex items-center gap-1">
                            <CheckCircle2 size={16} />
                            Fully Cleared
                        </p>
                    )}
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none">
                        <Printer size={16} className="mr-2" />
                        Print Report
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
                                <th className="px-6 py-4 whitespace-nowrap">Category</th>
                                <th className="px-6 py-4 w-full">Description</th>
                                <th className="px-6 py-4 whitespace-nowrap">Ref No.</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Debit (GH₵)</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap">Credit (GH₵)</th>
                                <th className="px-6 py-4 text-right whitespace-nowrap font-bold bg-slate-100/50">Balance (GH₵)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockClearanceItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">{item.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={cn(
                                            "px-2 py-1 rounded text-xs font-bold border",
                                            item.category === 'PTA' ? "bg-purple-50 text-purple-600 border-purple-100" :
                                                item.category === 'Textbooks' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                                    item.category === 'Damages' ? "bg-orange-50 text-orange-600 border-orange-100" :
                                                        "bg-slate-50 text-slate-600 border-slate-200"
                                        )}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{item.description}</td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.refNo}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">
                                        {item.debit > 0 ? item.debit.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-600">
                                        {item.credit > 0 ? item.credit.toFixed(2) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 bg-slate-50/30">
                                        {item.balance.toFixed(2)}
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
