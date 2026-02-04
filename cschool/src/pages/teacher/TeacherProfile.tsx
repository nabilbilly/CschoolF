import {
    Mail,
    Phone,
    MapPin,
    Award,
    Briefcase,
    BookOpen,
    Shield,
    CheckCircle,
    XCircle,
    FileText,
    Pencil,
    Key,
    Bell,
    Camera
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

// Mock Data
const profile = {
    name: "Mr. David Osei",
    staffId: "STF-2021-042",
    role: "Senior Instructor & Class Teacher",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=300&auto=format&fit=crop",
    email: "d.osei@cschool.edu.gh",
    phone: "+233 24 987 6543",
    address: "Box 456, Accra",
    joined: "Sept 2021",
    tenure: "3 Years, 2 Months",
    status: "Active Full-time",
    qualifications: [
        { title: "B.Ed. Mathematics", institution: "University of Cape Coast", year: "2018" },
        { title: "Teacher's Certificate A", institution: "Accra College of Education", year: "2015" }
    ],
    assignments: {
        classTeacher: "JHS 2 - A",
        subjects: [
            { name: "Mathematics", classes: ["JHS 2 - A", "JHS 2 - B"] },
            { name: "Science", classes: ["JHS 3 - A"] }
        ]
    },
    performance: {
        attendance: 98,
        syllabus: 85,
        assessments: 100
    },
    adminFiles: [
        { name: "Appointment Letter", status: "uploaded" },
        { name: "Curriculum Vitae", status: "uploaded" },
        { name: "Medical Report", status: "not_uploaded" },
        { name: "Guarantor Form", status: "pending" },
        { name: "National ID", status: "uploaded" }
    ]
};

export const TeacherProfile = () => {
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        console.log("Password change requested", passwordForm);
        setIsChangePasswordOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        alert("Password changed successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-32 bg-slate-900 relative">
                    <div className="absolute -bottom-16 left-8 group cursor-pointer">
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover transition-opacity group-hover:opacity-90"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>
                            <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-sm border border-slate-100 text-slate-600">
                                <Pencil size={14} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-20 pb-8 px-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                                <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                    <Pencil size={18} />
                                </button>
                            </div>
                            <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
                                {profile.role}
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                                <span className="text-slate-400">ID: {profile.staffId}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {profile.status}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">Tenure: {profile.tenure}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Assignments & Stats */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Assignments */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Briefcase size={20} className="text-primary-600" />
                            Teaching Responsibilities
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Class Teacher</p>
                                <p className="text-xl font-bold text-slate-900">{profile.assignments.classTeacher}</p>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                <p className="text-xs font-bold text-purple-600 uppercase mb-1">Academic Year</p>
                                <p className="text-xl font-bold text-slate-900">2024/2025</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold text-slate-700 mb-3 text-sm uppercase">Subject Allocations</h3>
                            <div className="space-y-3">
                                {profile.assignments.subjects.map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm border border-slate-100">
                                                <BookOpen size={16} />
                                            </div>
                                            <span className="font-semibold text-slate-800">{sub.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            {sub.classes.map((cls) => (
                                                <span key={cls} className="px-2 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-600 rounded">
                                                    {cls}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Award size={20} className="text-primary-600" />
                            Qualifications & Experience
                        </h2>
                        <div className="space-y-6">
                            {profile.qualifications.map((qual, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{qual.title}</h4>
                                        <p className="text-slate-500">{qual.institution} • {qual.year}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 border-t border-slate-100 mt-4 flex gap-8">
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Date Joined</p>
                                    <p className="font-semibold text-slate-800">{profile.joined}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Experience</p>
                                    <p className="font-semibold text-slate-800">4 Years</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Administrative Files */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-primary-600" />
                            Administrative Files
                        </h2>
                        <div className="space-y-3">
                            {profile.adminFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <span className="font-medium text-slate-700">{file.name}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            {file.status === 'uploaded' && (
                                                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-medium border border-green-100">
                                                    <CheckCircle size={14} />
                                                    Uploaded
                                                </div>
                                            )}
                                            {file.status === 'not_uploaded' && (
                                                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-medium border border-red-100">
                                                    <XCircle size={14} />
                                                    Missing
                                                </div>
                                            )}
                                            {file.status === 'pending' && (
                                                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-medium border border-amber-100">
                                                    <Pencil size={14} />
                                                    Pending
                                                </div>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
                                            <Pencil size={14} />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Shield size={20} className="text-primary-600" />
                                Performance Summary
                            </h2>
                            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Private</span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Attendance Consistency</span>
                                    <span className="text-green-600 font-bold">{profile.performance.attendance}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 rounded-full" style={{ width: profile.performance.attendance + '%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Syllabus Coverage</span>
                                    <span className="text-blue-600 font-bold">{profile.performance.syllabus}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: profile.performance.syllabus + '%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-slate-700">Assessment Submissions</span>
                                    <span className="text-purple-600 font-bold">{profile.performance.assessments}%</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 rounded-full" style={{ width: profile.performance.assessments + '%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Contact & Settings */}
                <div className="space-y-8">
                    {/* Contact Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-primary-600">
                                <Pencil size={16} />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <Mail size={18} className="text-slate-400" />
                                <span className="text-sm">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <Phone size={18} className="text-slate-400" />
                                <span className="text-sm">{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <MapPin size={18} className="text-slate-400" />
                                <span className="text-sm">{profile.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Account Settings</h2>
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                                    <Key size={16} />
                                    Security
                                </h3>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-sm"
                                    onClick={() => setIsChangePasswordOpen(true)}
                                >
                                    Change Password
                                </Button>
                                <Modal
                                    isOpen={isChangePasswordOpen}
                                    onClose={() => setIsChangePasswordOpen(false)}
                                    title="Change Password"
                                >
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Index Number</label>
                                            <input
                                                type="text"
                                                value={profile.staffId}
                                                readOnly
                                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Old Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Enter password you would like to change"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">New Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Create your new password"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                                            <input
                                                type="password"
                                                required
                                                placeholder="Confirm your new password"
                                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <Button className="w-full">
                                                Submit
                                            </Button>
                                        </div>
                                    </form>
                                </Modal>
                            </div>

                            <div>
                                <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                                    <Bell size={16} />
                                    Notifications
                                </h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                                        <span className="text-sm text-slate-600">Email Alerts</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                                        <span className="text-sm text-slate-600">SMS Notifications</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
