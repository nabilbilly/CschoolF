import { useState, useEffect } from 'react';
import {
    Lock,
    History,
    ShieldCheck,
    Key,
    Save,
    Clock,
    UserCircle,
    FileText,
    LogOut,
    AlertTriangle,
    AlertCircle,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export const StudentAccount = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isForcedChange, setIsForcedChange] = useState(location.state?.forcePasswordChange);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [studentInfo, setStudentInfo] = useState({ indexNumber: '' });

    useEffect(() => {
        const session = authService.getSession();
        setStudentInfo({
            indexNumber: session.indexNumber || 'N/A'
        });
    }, []);

    // Mock Data for Activity Log
    const activityLog = [
        { id: 1, action: 'Login Successful', device: 'Chrome on Windows', ip: '192.168.1.1', date: 'Just now', icon: Lock },
        { id: 2, action: 'Profile Updated', device: 'Chrome on Windows', ip: '192.168.1.1', date: '2 days ago', icon: UserCircle },
        { id: 3, action: 'Results Viewed', device: 'Mobile App', ip: '10.0.0.5', date: '5 days ago', icon: FileText },
        { id: 4, action: 'Password Changed', device: 'Firefox on MacOS', ip: '172.16.0.2', date: '1 month ago', icon: Key },
    ];

    const [passwordForm, setPasswordForm] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (passwordForm.new !== passwordForm.confirm) {
            setError("New passwords do not match.");
            return;
        }

        if (passwordForm.new.length < 6) {
            setError("New password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await authService.changePassword(passwordForm.current, passwordForm.new);
            setSuccess("Password updated successfully!");
            setPasswordForm({ current: '', new: '', confirm: '' });

            // Update local session flag
            localStorage.setItem('must_change_password', 'false');
            setIsForcedChange(false);

            // Optional: Redirect or show congrats
            if (isForcedChange) {
                setTimeout(() => navigate('/student/dashboard'), 2000);
            }
        } catch (err: any) {
            const msg = err.message || "";
            setError(msg.includes("400") ? "You have entered an incorrect current password." : msg.replace(/^API \d+: /, ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                {isForcedChange && !success && (
                    <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                            <AlertTriangle size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-amber-900 text-lg">Password Update Required</h3>
                            <p className="text-amber-700 font-medium">
                                This is your first login with a temporary password. For your security, please update it to a new one before proceeding to your dashboard.
                            </p>
                        </div>
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl flex items-start gap-4 animate-in zoom-in duration-500">
                        <div className="p-3 bg-green-100 rounded-xl text-green-600">
                            <CheckCircle2 size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-black text-green-900 text-lg">Success!</h3>
                            <p className="text-green-700 font-medium">{success} {isForcedChange && "Redirecting to dashboard..."}</p>
                        </div>
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your security preferences and view account activity.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Navigation / Summary */}
                <div className="space-y-6">
                    {/* Security Status Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Secure</h3>
                                <p className="text-xs text-slate-500">Your account is protected.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">Last Login</span>
                                <span className="font-medium text-slate-900">Just now</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500">2FA</span>
                                <span className="font-medium text-slate-400">Not Enabled</span>
                            </div>
                        </div>
                    </div>

                    {/* Clearance Link Short Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative group cursor-pointer">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors"></div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                <LogOut size={18} className="text-orange-400" />
                                Clearance Status
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">Check your exit status.</p>
                            <div className="flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg w-fit text-sm font-bold border border-orange-400/20">
                                <Clock size={14} />
                                Transfer Requested
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms & Logs */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Change Password */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <Key size={18} className="text-slate-400" />
                                Change Password
                            </h2>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3">
                                    <AlertCircle size={20} className="flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Student Index Number</label>
                                <input
                                    type="text"
                                    value={studentInfo.indexNumber}
                                    disabled
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono cursor-not-allowed"
                                />
                                <p className="text-[10px] text-slate-400 italic">This is your unique identifier and cannot be changed.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.current}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.new}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                                        placeholder="Enter new password"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirm}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Update Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <History size={18} className="text-slate-400" />
                                Recent Activity
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">Last 30 days</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {activityLog.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <log.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-700 text-sm">{log.action}</h4>
                                        <p className="text-xs text-slate-500">{log.device} • {log.ip}</p>
                                    </div>
                                    <span className="text-xs font-medium text-slate-400">{log.date}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <button className="text-primary-600 text-xs font-bold hover:underline">View All History</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
