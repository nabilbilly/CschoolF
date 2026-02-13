import { useState, useEffect } from 'react';
import { AlertCircle, Save, Check, Plus, Trash2, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import type { AcademicYear, YearStatus, TermStatus } from '../../../services/academicsService';
import { academicsService } from '../../../services/academicsService';

interface TermFormData {
    id?: number;
    name: string;
    start_date: string;
    end_date: string;
    status: TermStatus;
    sequence: number;
    result_open_date: string;
    result_close_date: string;
    isExpanded?: boolean;
    errors?: { [key: string]: string };
}

interface CreateAcademicYearModalProps {
    isOpen: boolean;
    year: AcademicYear | null;
    onClose: () => void;
    onSave: (yearData: any) => Promise<void>;
}

export const CreateAcademicYearModal = ({ isOpen, year, onClose, onSave }: CreateAcademicYearModalProps) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState<YearStatus>('Draft');
    const [terms, setTerms] = useState<TermFormData[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [apiError, setApiError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (year) {
                setName(year.name);
                setStartDate(year.start_date || '');
                setEndDate(year.end_date || '');
                setStatus(year.status);

                const fetchTerms = async () => {
                    try {
                        const data = await academicsService.getTerms(year.id);
                        setTerms(data.map(t => ({
                            id: t.id,
                            name: t.name,
                            start_date: t.start_date || '',
                            end_date: t.end_date || '',
                            status: t.status,
                            sequence: t.sequence,
                            result_open_date: t.result_open_date || '',
                            result_close_date: t.result_close_date || '',
                            isExpanded: false,
                            errors: {}
                        })));
                    } catch (err) {
                        console.error('Failed to fetch terms:', err);
                    }
                };
                fetchTerms();
            } else {
                setName('');
                setStartDate('');
                setEndDate('');
                setStatus('Draft');
                setTerms([{
                    name: 'Term 1',
                    start_date: '',
                    end_date: '',
                    status: 'Draft',
                    sequence: 1,
                    result_open_date: '',
                    result_close_date: '',
                    isExpanded: true,
                    errors: {}
                }]);
            }
            setErrors({});
            setApiError(null);
        }
    }, [isOpen, year]);

    const handleAddTerm = () => {
        const nextNum = terms.length + 1;
        setTerms([...terms, {
            name: `Term ${nextNum}`,
            start_date: '',
            end_date: '',
            status: 'Draft',
            sequence: nextNum,
            result_open_date: '',
            result_close_date: '',
            isExpanded: true,
            errors: {}
        }]);
    };

    const handleRemoveTerm = (index: number) => {
        if (terms.length <= 1) return;
        setTerms(terms.filter((_, i) => i !== index));
    };

    const handleUpdateTerm = (index: number, updates: Partial<TermFormData>) => {
        const newTerms = [...terms];
        newTerms[index] = { ...newTerms[index], ...updates };
        setTerms(newTerms);
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!name) newErrors.name = "Name is required.";

        const yearStart = startDate ? new Date(startDate) : null;
        const yearEnd = endDate ? new Date(endDate) : null;

        if (status === 'Active') {
            if (!startDate) newErrors.startDate = "Start date required.";
            if (!endDate) newErrors.endDate = "End date required.";
        }

        if (startDate && endDate && startDate >= endDate) {
            newErrors.endDate = "End date must be after start date.";
        }

        // Count active terms
        const activeTermCount = terms.filter(t => t.status === 'Active').length;
        if (activeTermCount > 1) {
            setApiError("You can not set two or more active term or year");
            return false;
        }

        // Term Validations
        const updatedTerms = terms.map((term, index) => {
            const termErrors: { [key: string]: string } = {};
            const termStart = term.start_date ? new Date(term.start_date) : null;
            const termEnd = term.end_date ? new Date(term.end_date) : null;

            if (!term.name) termErrors.name = "Required.";

            if (termStart && termEnd) {
                if (termStart >= termEnd) termErrors.end_date = "Must be after start.";
                if (yearStart && termStart < yearStart) termErrors.start_date = "Outside Year range.";
                if (yearEnd && termEnd > yearEnd) termErrors.end_date = "Outside Year range.";

                // Overlap check
                terms.forEach((other, otherIdx) => {
                    if (index === otherIdx) return;
                    const otherStart = other.start_date ? new Date(other.start_date) : null;
                    const otherEnd = other.end_date ? new Date(other.end_date) : null;
                    if (otherStart && otherEnd && termStart < otherEnd && termEnd > otherStart) {
                        termErrors.overlap = `Overlaps with ${other.name}`;
                    }
                });
            }

            if (term.result_open_date || term.result_close_date) {
                const rOpen = term.result_open_date ? new Date(term.result_open_date) : null;
                const rClose = term.result_close_date ? new Date(term.result_close_date) : null;
                if (rOpen && rClose && rOpen > rClose) termErrors.result_close_date = "After open.";
                if (rOpen && termStart && termEnd && (rOpen < termStart || rOpen > termEnd)) termErrors.result_open_date = "Outside term.";
                if (rClose && termStart && termEnd && (rClose < termStart || rClose > termEnd)) termErrors.result_close_date = "Outside term.";
            }

            return { ...term, errors: termErrors };
        });

        setTerms(updatedTerms);
        const hasTermErrors = updatedTerms.some(t => Object.keys(t.errors || {}).length > 0);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !hasTermErrors;
    };

    const handleSave = async (forceStatus?: YearStatus) => {
        const targetStatus = forceStatus || status;
        if (!validate()) {
            setApiError("Check: You can not set two or more active term/years or make sure term/years are not overlapping");
            return;
        }

        setIsSaving(true);
        setApiError(null);
        try {
            let savedYear: AcademicYear;
            if (year) {
                savedYear = await academicsService.updateAcademicYear(year.id, {
                    name, start_date: startDate || null, end_date: endDate || null, status: targetStatus
                });
            } else {
                savedYear = await academicsService.createAcademicYear({
                    name, start_date: startDate || null, end_date: endDate || null, status: targetStatus
                });
            }

            for (let i = 0; i < terms.length; i++) {
                const termData = terms[i];
                const payload = {
                    name: termData.name,
                    start_date: termData.start_date || null,
                    end_date: termData.end_date || null,
                    status: termData.status,
                    sequence: i + 1,
                    result_open_date: termData.result_open_date || null,
                    result_close_date: termData.result_close_date || null
                };
                if (termData.id) {
                    await academicsService.updateTerm(termData.id, payload);
                } else {
                    await academicsService.createTerm(savedYear.id, payload);
                }
            }
            await onSave(savedYear);
            onClose();
        } catch (err: any) {
            setApiError(err.message || 'Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const termStatusColor = (status: TermStatus) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Closed': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={year ? `Edit Year: ${year.name}` : "New Academic Year"}
            size="lg"
        >
            <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-3">
                        <AlertCircle size={20} className="shrink-0" />
                        <p className="font-medium">{apiError}</p>
                    </div>
                )}

                {/* Academic Year Info */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                            <Calendar size={18} />
                        </div>
                        <h3 className="font-bold text-slate-800">Academic Year Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Year Name</label>
                            <input
                                type="text" placeholder="2026/2027"
                                className={cn("w-full border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all", errors.name && "border-red-300 bg-red-50/50")}
                                value={name} onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start Date</label>
                            <input
                                type="date"
                                className={cn("w-full border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", errors.startDate && "border-red-300")}
                                value={startDate} onChange={(e) => setStartDate(e.target.value)}
                            />
                            {errors.startDate && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.startDate}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End Date</label>
                            <input
                                type="date"
                                className={cn("w-full border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500", errors.endDate && "border-red-300")}
                                value={endDate} onChange={(e) => setEndDate(e.target.value)}
                            />
                            {errors.endDate && <p className="text-red-500 text-[10px] mt-1 font-medium">{errors.endDate}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Year Status</label>
                        <div className="grid grid-cols-3 gap-2 p-1 bg-white border border-slate-200 rounded-xl max-w-sm">
                            {(['Draft', 'Active', 'Archived'] as YearStatus[]).map((s) => (
                                <button
                                    key={s} type="button" onClick={() => setStatus(s)}
                                    className={cn("py-1.5 text-xs font-bold rounded-lg transition-all", status === s ? "bg-primary-600 text-white shadow-md shadow-primary-100" : "text-slate-500 hover:bg-slate-50")}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Term Setup Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Term Setup</h3>
                            <p className="text-xs text-slate-500">Terms cannot overlap and must fall within the year range.</p>
                        </div>
                        <Button size="sm" onClick={handleAddTerm} className="bg-primary-50 text-primary-600 hover:bg-primary-100 border-primary-200">
                            <Plus size={16} className="mr-1" /> Add Term
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {terms.map((term, index) => (
                            <div key={index} className={cn("bg-white border rounded-2xl transition-all overflow-hidden shadow-sm hover:shadow-md", term.errors && Object.keys(term.errors).length > 0 ? "border-red-200" : "border-slate-200")}>
                                <div className="p-4 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <input
                                                type="text" value={term.name}
                                                onChange={(e) => handleUpdateTerm(index, { name: e.target.value })}
                                                placeholder="Term Name"
                                                className={cn("bg-transparent font-bold text-slate-800 border-none p-0 outline-none focus:ring-0 w-32", term.errors?.name && "text-red-500")}
                                            />
                                            {term.id && (
                                                <span className={cn("inline-block w-fit px-1.5 py-0.5 rounded text-[8px] font-bold uppercase", termStatusColor(term.status))}>
                                                    {term.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {term.errors?.overlap && (
                                            <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                                                {term.errors.overlap}
                                            </span>
                                        )}
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600" onClick={() => handleRemoveTerm(index)}>
                                            <Trash2 size={14} />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400" onClick={() => handleUpdateTerm(index, { isExpanded: !term.isExpanded })}>
                                            {term.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </Button>
                                    </div>
                                </div>

                                {term.isExpanded && (
                                    <div className="p-4 border-t border-slate-100 bg-white space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start Date</label>
                                                <input
                                                    type="date" className={cn("w-full border-slate-200 rounded-lg px-3 py-1.5 text-sm", term.errors?.start_date && "border-red-300 bg-red-50/10")}
                                                    value={term.start_date} onChange={(e) => handleUpdateTerm(index, { start_date: e.target.value })}
                                                />
                                                {term.errors?.start_date && <p className="text-red-500 text-[9px] mt-0.5">{term.errors.start_date}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End Date</label>
                                                <input
                                                    type="date" className={cn("w-full border-slate-200 rounded-lg px-3 py-1.5 text-sm", term.errors?.end_date && "border-red-300 bg-red-50/10")}
                                                    value={term.end_date} onChange={(e) => handleUpdateTerm(index, { end_date: e.target.value })}
                                                />
                                                {term.errors?.end_date && <p className="text-red-500 text-[9px] mt-0.5">{term.errors.end_date}</p>}
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-50 pt-3">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Exams & Results Setup (Advanced)</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Results Open</label>
                                                    <input
                                                        type="date" className={cn("w-full border-slate-200 rounded-lg px-3 py-1.5 text-sm", term.errors?.result_open_date && "border-red-300")}
                                                        value={term.result_open_date} onChange={(e) => handleUpdateTerm(index, { result_open_date: e.target.value })}
                                                    />
                                                    {term.errors?.result_open_date && <p className="text-red-500 text-[9px] mt-0.5">{term.errors.result_open_date}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Results Close</label>
                                                    <input
                                                        type="date" className={cn("w-full border-slate-200 rounded-lg px-3 py-1.5 text-sm", term.errors?.result_close_date && "border-red-300")}
                                                        value={term.result_close_date} onChange={(e) => handleUpdateTerm(index, { result_close_date: e.target.value })}
                                                    />
                                                    {term.errors?.result_close_date && <p className="text-red-500 text-[9px] mt-0.5">{term.errors.result_close_date}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {term.id && (
                                            <div className="flex gap-2 pt-2">
                                                {term.status !== 'Active' && (
                                                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-green-200 text-green-600 hover:bg-green-50" onClick={() => handleUpdateTerm(index, { status: 'Active' })}>
                                                        Set ACTIVE
                                                    </Button>
                                                )}
                                                {term.status === 'Active' && (
                                                    <Button size="sm" variant="outline" className="text-[10px] h-7 px-2 border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleUpdateTerm(index, { status: 'Closed' })}>
                                                        Close Term
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {apiError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex gap-3">
                            <AlertCircle size={20} className="shrink-0" />
                            <p className="font-medium">{apiError}</p>
                        </div>
                    )}

                </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200 sticky bottom-0 bg-white pb-2">
                <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button
                    className="flex-1 bg-slate-800 hover:bg-slate-900 border-none"
                    onClick={() => handleSave('Draft')}
                    disabled={isSaving}
                >
                    <Save size={18} className="mr-2" />
                    {isSaving ? 'Processing...' : 'Save as Draft'}
                </Button>
                <Button
                    className={cn("flex-1 shadow-lg shadow-green-100", status === 'Active' ? "bg-green-600 hover:bg-green-700" : "bg-primary-600 hover:bg-primary-700")}
                    onClick={() => handleSave(status === 'Draft' ? 'Active' : status)}
                    disabled={isSaving}
                >
                    <Check size={18} className="mr-2" />
                    {isSaving ? 'Processing...' : status === 'Active' ? 'Update & Activate' : 'Save & Activate'}
                </Button>
            </div>
        </Modal>
    );
};
