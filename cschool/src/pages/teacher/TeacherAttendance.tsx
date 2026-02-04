import { Hourglass, Info, CalendarClock, ShieldCheck, History } from 'lucide-react';

export const TeacherAttendance = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden text-center p-12">

                {/* Icon & Title */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-slate-50 border border-slate-100">
                        <Hourglass size={48} className="text-slate-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Attendance Module</h1>
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm font-semibold border border-slate-200">
                        Status: Not Active
                    </span>
                </div>

                {/* Main Message */}
                <div className="max-w-2xl mx-auto mb-12">
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Attendance tracking is currently not active for this school.
                        This feature will be enabled by the school administration when attendance recording is required.
                    </p>
                </div>

                {/* Feature Preview Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 text-left">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-4 border border-slate-100">
                            <CalendarClock size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Daily Recording</h3>
                        <p className="text-slate-500 text-sm">Mark daily student attendance by class quickly and easily.</p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-4 border border-slate-100">
                            <History size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Attendance History</h3>
                        <p className="text-slate-500 text-sm">View past attendance records for any student or class.</p>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-4 border border-slate-100">
                            <ShieldCheck size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Term Reports</h3>
                        <p className="text-slate-500 text-sm">Automated attendance reports for end-of-term assessment.</p>
                    </div>
                </div>

                {/* Info Box */}
                <div className="max-w-xl mx-auto bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 mb-8 text-left">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <Info size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-900 mb-1">Module Status Information</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                Enabled By: <span className="font-medium">School Administration</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                Availability: <span className="font-medium">Term-based / School Decision</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Tip */}
                <div className="text-slate-400 text-sm">
                    <p>If you believe attendance should be enabled, please contact the <span className="text-slate-600 font-medium">Head Teacher</span> or <span className="text-slate-600 font-medium">School Office</span>.</p>
                </div>
            </div>
        </div>
    );
};
