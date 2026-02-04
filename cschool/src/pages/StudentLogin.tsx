import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, School, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const StudentLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [credentials, setCredentials] = useState({ studentId: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials.studentId, credentials.password);
            authService.setSession(response);

            if (response.must_change_password) {
                navigate('/student/account', { state: { forcePasswordChange: true } });
            } else {
                navigate('/student/dashboard');
            }
        } catch (err: any) {
            const message = err.message || "";
            if (message.includes("401")) {
                setError("Incorrect Student ID or password. Please check your credentials and try again.");
            } else {
                // Prune any technical prefixes like "API 401: " or "API 500: "
                setError(message.replace(/^API \d+: /, ''));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:block relative overflow-hidden bg-slate-900"
            >
                <div className="absolute inset-0 bg-primary-600/20 mix-blend-multiply z-10" />
                <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop"
                    alt="Student studying in library"
                    className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-20" />

                <div className="absolute bottom-0 left-0 p-16 z-30 text-white max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                                <School size={32} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">cschool</span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4 leading-tight">
                            Welcome to Your Digital Learning Gateway
                        </h1>
                        <p className="text-lg text-slate-300">
                            Access your courses, track your progress, and stay connected with your teachers and classmates.
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <Link to="/" className="inline-flex items-center gap-2 text-primary-600 font-medium mb-8 hover:underline">
                            <ArrowRight className="rotate-180" size={16} />
                            Back to Home
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900">Student Portal</h2>
                        <p className="mt-2 text-slate-600">Please enter your credentials to access your account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
                            <AlertCircle size={20} className="flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="studentId" className="text-sm font-medium text-slate-700">
                                    Student ID / Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        id="studentId"
                                        type="text"
                                        placeholder="Enter your Index Number"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                                        required
                                        value={credentials.studentId}
                                        onChange={(e) => setCredentials({ ...credentials, studentId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-slate-400"
                                        required
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                                <span className="text-slate-600">Remember me</span>
                            </label>
                            <Link to="/student/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            className="w-full h-12 text-base shadow-lg shadow-primary-500/25"
                            variant="default"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="animate-spin" size={20} />
                                    Authenticating...
                                </span>
                            ) : (
                                "Sign In to Portal"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        Having trouble logging in? <a href="#" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">Contact Support</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
