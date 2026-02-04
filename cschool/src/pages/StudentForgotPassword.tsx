import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MessageSquare, ArrowRight, CheckCircle, School } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';

export const StudentForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setShowSuccessModal(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image (Reused from Login for consistency) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block relative overflow-hidden bg-slate-900"
            >
                <div className="absolute inset-0 bg-primary-600/20 mix-blend-multiply z-10" />
                <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Student studying"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-20" />

                <div className="absolute bottom-0 left-0 p-16 z-30 text-white max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                            <School size={32} />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">cschool</span>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 leading-tight">
                        Password Recovery
                    </h1>
                    <p className="text-lg text-slate-300">
                        Don't worry, it happens. Submit a request and we'll help you get back on track.
                    </p>
                </div>
            </motion.div>

            {/* Right Side - Form */}
            <div className="flex items-center justify-center p-8 bg-white relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <Link to="/student/login" className="inline-flex items-center gap-2 text-primary-600 font-medium mb-8 hover:underline">
                            <ArrowRight className="rotate-180" size={16} />
                            Back to Login
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
                        <p className="mt-2 text-slate-600">Enter your details to request a password reset from the administration.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="studentId" className="text-sm font-medium text-slate-700">
                                    Student ID
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        id="studentId"
                                        type="text"
                                        placeholder="e.g. STU-2024-001"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                                    Registered Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="e.g. 0244123456"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">
                                    Comment / Reason
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-3 text-slate-400" size={20} />
                                    <textarea
                                        id="message"
                                        placeholder="Briefly explain why you need a reset..."
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400 min-h-[100px] resize-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 text-base shadow-lg shadow-primary-500/25"
                            variant="default"
                            isLoading={isLoading}
                        >
                            Submit Request
                        </Button>
                    </form>
                </motion.div>

                {/* Success Modal */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                                onClick={() => setShowSuccessModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl"
                            >
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                                    <CheckCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Request Submitted</h3>
                                <p className="text-slate-600 mb-8">
                                    Please wait for up to 24 hours. Your password reset instructions will be sent via SMS to your registered number.
                                </p>
                                <Link to="/student/login">
                                    <Button className="w-full">
                                        Return to Login
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
