import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, ArrowRight, AlertCircle, CheckCircle2, Ticket, Phone } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { motion } from 'framer-motion';
import { evoucherService } from '../../services/evoucherService';

export const AdmissionVerification = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        voucherNumber: '',
        pin: ''
    });

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {
            const response = await evoucherService.verifyVoucher({
                voucher_number: formData.voucherNumber.trim(),
                pin: formData.pin.trim()
            });

            if (response.valid && response.voucher_session_token) {
                setSuccess('Voucher verified successfully! Redirecting...');
                sessionStorage.setItem('admission_voucher_token', response.voucher_session_token);
                setTimeout(() => {
                    navigate('/admission/form');
                }, 1500);
            } else {
                const reasons: Record<string, string> = {
                    'InvalidPIN': 'The PIN you entered is incorrect.',
                    'NotFound': 'Voucher number not found. Please check and try again.',
                    'Expired': 'This voucher has expired.',
                    'Used': 'This voucher has already been used.',
                    'Reserved': 'This voucher is currently in use by another session.'
                };
                setError(reasons[response.reason || ''] || 'Verification failed. Please try again.');
                setIsLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Connection failed. Please check your network.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-3 bg-primary-600 rounded-xl text-white shadow-lg">
                        <School size={40} />
                    </div>
                </div>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
                    Admission e-Voucher
                </h2>
                <p className=" text-center text-sm text-slate-600">
                    cschool &bull; 2025/2026 Academic Year
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100 relative"
                >
                    <div className="mb-8 flex justify-center">
                        <Button
                            onClick={() => setShowBuyModal(true)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg transform transition-all hover:-translate-y-1"
                            size="lg"
                        >
                            <Ticket className="mr-2" />
                            Buy E-Voucher
                        </Button>
                    </div>
                    <div className="mb-6 bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <p className="text-sm text-blue-800 text-center">
                            Please enter your e-Voucher details below to access the admission form.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleVerify}>
                        <div>
                            <label htmlFor="voucher" className="block text-sm font-medium text-slate-700">
                                e-Voucher Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="voucher"
                                    name="voucher"
                                    type="text"
                                    required
                                    maxLength={12}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-lg"
                                    placeholder="Enter voucher number"
                                    value={formData.voucherNumber}
                                    onChange={(e) => setFormData({ ...formData, voucherNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="pin" className="block text-sm font-medium text-slate-700">
                                e-Voucher PIN
                            </label>
                            <div className="mt-1">
                                <input
                                    id="pin"
                                    name="pin"
                                    type="password"
                                    required
                                    maxLength={8}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-lg"
                                    placeholder="Enter PIN"
                                    value={formData.pin}
                                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                />
                            </div>
                        </div>

                        {(error || success) && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`rounded-md p-4 ${error ? 'bg-red-50' : 'bg-green-50'}`}
                            >
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {error ? (
                                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className={`text-sm font-medium ${error ? 'text-red-800' : 'text-green-800'}`}>
                                            {error || success}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-3 text-lg"
                                disabled={isLoading}
                                variant="default"
                            >
                                {isLoading ? 'Verifying...' : 'Verify Voucher'}
                                {!isLoading && <ArrowRight className="ml-2" size={20} />}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Need help?
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 text-center text-xs text-gray-500">
                            <p>One voucher per applicant. Ensure details are kept secure.</p>
                            <p className="mt-1">Helpline: +233 20 000 0000</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Modal
                isOpen={showBuyModal}
                onClose={() => setShowBuyModal(false)}
                title="Purchase E-Voucher"
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-primary-600" />
                    </div>
                    <p className="text-slate-600 mb-6">
                        To purchase an admission E-Voucher, please contact the school administration.
                    </p>

                    <div className="bg-slate-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-slate-500 mb-2">Call or chat admin for instant support</p>
                        <a href="tel:0596620263" className="flex items-center justify-center gap-2 text-xl font-bold text-slate-900 hover:text-primary-600 transition-colors">
                            <Phone size={20} />
                            059 662 0263
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowBuyModal(false)}
                        >
                            Close
                        </Button>
                        <a href="tel:0596620263" className="w-full">
                            <Button className="w-full gap-2">
                                <Phone size={16} />
                                Call Now
                            </Button>
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
