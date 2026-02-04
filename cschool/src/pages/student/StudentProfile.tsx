import { useState, useEffect } from 'react';
import { studentsService, type StudentResponse } from '../../services/studentsService';
import {
    Loader2,
    AlertCircle,
    User,
    Calendar,
    MapPin,
    CreditCard,
    Shield,
    UserCheck,
    HeartPulse,
    Activity,
    School
} from 'lucide-react';

export const StudentProfile = () => {
    const [profile, setProfile] = useState<StudentResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await studentsService.getProfile();
                setProfile(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch profile:", err);
                setError("Failed to load profile data. Please log in again.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                <p className="text-slate-500 font-medium">Loading your profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
                <div className="p-4 bg-red-50 rounded-full text-red-500">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
                <p className="text-slate-500 max-w-md">{error || "We couldn't find your profile information."}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const mainGuardian = profile.guardians && profile.guardians.length > 0 ? profile.guardians[0] : null;

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">View your personal information and student records. Contact administration for corrections.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Photo */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Photo Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                        <div className="relative inline-block mb-4 group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-inner mx-auto bg-slate-50">
                                <img
                                    src={profile.photo || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=300&auto=format&fit=crop"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{profile.first_name} {profile.last_name}</h3>
                        <p className="text-sm text-slate-500 mb-6">{profile.account?.username || profile.index_number}</p>
                    </div>

                    {/* Info Card */}
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <Shield className="text-blue-600 mt-1" size={20} />
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Read Only Record</h4>
                                <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                                    This profile information is managed by the school administration. To request changes, please visit the administration office.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Forms */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Personal Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <User size={18} className="text-slate-400" />
                                Personal Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">First Name</label>
                                <input
                                    type="text"
                                    value={profile.first_name}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Middle Name</label>
                                <input
                                    type="text"
                                    value={profile.middle_name || ''}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Last Name</label>
                                <input
                                    type="text"
                                    value={profile.last_name}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Date of Birth</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="date"
                                        value={profile.date_of_birth}
                                        readOnly
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Index Number</label>
                                <div className="relative">
                                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={profile.index_number || 'N/A'}
                                        readOnly
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">System Username</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={profile.account?.username || 'N/A'}
                                        readOnly
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-2">
                                    Enrollment Class <span className="text-[10px] bg-slate-200 px-1.5 rounded text-slate-600 font-normal">Active</span>
                                </label>
                                <div className="relative">
                                    <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={`${profile.current_class} ${profile.current_stream !== 'N/A' ? '- ' + profile.current_stream : ''}`}
                                        readOnly
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 cursor-not-allowed font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demographic Details */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <MapPin size={18} className="text-slate-400" />
                                Demographic Details
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                                <input
                                    type="text"
                                    value={profile.gender}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Nationality</label>
                                <input
                                    type="text"
                                    value={profile.nationality}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">City / Location</label>
                                <input
                                    type="text"
                                    value={profile.city || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Ghana Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={profile.ghana_card || 'N/A'}
                                        readOnly
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed uppercase tracking-widest"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Disability Status</label>
                                <input
                                    type="text"
                                    value={profile.disability_status || 'None'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Residential Address</label>
                                <input
                                    type="text"
                                    value={profile.address || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Guardian Information */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <UserCheck size={18} className="text-slate-400" />
                                Guardian / Parent Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Guardian Name</label>
                                <input
                                    type="text"
                                    value={mainGuardian?.name || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Relationship</label>
                                <input
                                    type="text"
                                    value={mainGuardian?.relationship_type || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Contact Number</label>
                                <input
                                    type="tel"
                                    value={mainGuardian?.phone || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Contact Address</label>
                                <input
                                    type="text"
                                    value={mainGuardian?.address || 'N/A'}
                                    readOnly
                                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none text-slate-500 font-medium cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Information - Read Only */}
                    <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-red-100 bg-red-100/50 flex items-center justify-between">
                            <h2 className="font-bold text-red-900 flex items-center gap-2">
                                <HeartPulse size={18} className="text-red-500" />
                                Health / Medical Notes
                            </h2>
                            <span className="text-[10px] font-bold bg-white text-red-600 px-2 py-0.5 rounded-full border border-red-200">
                                PRIVATE & CONFIDENTIAL
                            </span>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-6">
                            {/* Notice */}
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100">
                                <Activity className="text-red-400 mt-0.5" size={16} />
                                <p className="text-xs text-red-600/80 leading-relaxed">
                                    This section contains vital health information for emergency purposes.
                                    It is <strong>read-only</strong>. To update these details, please submit a formal medical report to the school administration.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-red-800/70 uppercase">Allergies</label>
                                <div className="p-3 bg-white border border-red-100 rounded-lg text-slate-700 font-medium text-sm">
                                    {profile.medical?.allergies || 'None recorded'}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-red-800/70 uppercase">Medical Conditions</label>
                                <div className="p-3 bg-white border border-red-100 rounded-lg text-slate-700 font-medium text-sm">
                                    {profile.medical?.health_conditions || 'None recorded'}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-red-800/70 uppercase">Special Needs</label>
                                <div className="p-3 bg-white border border-red-100 rounded-lg text-slate-700 font-medium text-sm">
                                    {profile.medical?.special_needs || 'No specific instructions'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
