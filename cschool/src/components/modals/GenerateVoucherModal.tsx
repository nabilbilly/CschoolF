import { useState, useEffect } from 'react';
import { X, Loader2, Download, Printer } from 'lucide-react';
import { evoucherService, type AcademicYear, type EVoucher } from '../../services/evoucherService';

interface GenerateVoucherModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const GenerateVoucherModal: React.FC<GenerateVoucherModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedVouchers, setGeneratedVouchers] = useState<EVoucher[]>([]);

    const [formData, setFormData] = useState({
        academic_year_id: '',
        count: 50,
        expires_at: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isOpen) {
            loadYears();
            setGeneratedVouchers([]); // Reset previous generation
        }
    }, [isOpen]);

    const loadYears = async () => {
        setLoading(true);
        try {
            const data = await evoucherService.getAcademicYears();
            setYears(data);
            if (data.length > 0) {
                setFormData(prev => ({ ...prev, academic_year_id: data[0].id.toString() }));
            }
        } catch (error) {
            console.error('Failed to load years ensure you have set up vouchers for that year. ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const result = await evoucherService.createVouchers({
                academic_year_id: parseInt(formData.academic_year_id),
                count: formData.count,
                expires_at: new Date(formData.expires_at).toISOString(),
            });
            setGeneratedVouchers(result);
            onSuccess(); // Trigger refresh on parent
        } catch (error) {
            alert('Failed to generate vouchers');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadCSV = () => {
        const headers = ['Voucher Number', 'PIN', 'Status', 'Expires At'];
        const rows = generatedVouchers.map(v =>
            [v.voucher_number, v.pin, v.status, new Date(v.expires_at).toLocaleDateString()]
        );

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `vouchers_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Generate Admission E-Vouchers</h2>

                {generatedVouchers.length > 0 ? (
                    <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="text-lg font-semibold text-green-800 mb-2">Success!</h3>
                            <p className="text-green-700">
                                Successfully generated {generatedVouchers.length} vouchers.
                            </p>
                            <div className="mt-2 text-sm text-green-600 font-medium">
                                IMPORTANT: PINs are strictly confidential. Download them now as they will not be shown again.
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDownloadCSV}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                <Download size={20} />
                                Download CSV
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                            >
                                <Printer size={20} />
                                Print List
                            </button>
                        </div>

                        <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700">
                                    <tr>
                                        <th className="px-4 py-2">Voucher #</th>
                                        <th className="px-4 py-2">PIN</th>
                                        <th className="px-4 py-2">Expiry</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {generatedVouchers.map((v) => (
                                        <tr key={v.id} className="border-t">
                                            <td className="px-4 py-2 font-mono">{v.voucher_number}</td>
                                            <td className="px-4 py-2 font-mono font-bold text-red-600">{v.pin}</td>
                                            <td className="px-4 py-2">{new Date(v.expires_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pt-4 border-t flex justify-end">
                            <button onClick={onClose} className="text-gray-600 hover:text-gray-900 px-4">
                                Close
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                            <select
                                required
                                className="w-full border rounded-lg p-2"
                                value={formData.academic_year_id}
                                onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
                                disabled={loading}
                            >
                                {years.map((y) => (
                                    <option key={y.id} value={y.id}>{y.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    required
                                    className="w-full border rounded-lg p-2"
                                    value={formData.count}
                                    onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full border rounded-lg p-2"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={generating || loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                {generating && <Loader2 className="animate-spin" size={18} />}
                                Generate Vouchers
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
