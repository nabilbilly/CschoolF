import {
    Users,
    BookOpen,
    ClipboardList,
    Clock,
    AlertCircle
} from 'lucide-react';

export const TeacherDashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Teacher Dashboard</h1>
                    <p className="text-slate-500">Welcome back, Mr. Osei. Here's your overview for today.</p>
                </div>
                <div className="text-sm text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                    {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Assigned Classes</p>
                        <p className="text-2xl font-bold text-slate-900">3</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Subjects</p>
                        <p className="text-2xl font-bold text-slate-900">4</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending Tasks</p>
                        <p className="text-2xl font-bold text-slate-900">5</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timetable Widget */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-slate-400" />
                            Today's Timetable
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { time: "08:30 - 09:30", subject: "Mathematics", class: "JHS 2 - A", room: "Room 12" },
                            { time: "10:00 - 11:00", subject: "Science", class: "JHS 3 - B", room: "Lab 2" },
                            { time: "13:00 - 14:00", subject: "ICT", class: "Primary 6 - A", room: "Computer Lab" }
                        ].map((lesson, index) => (
                            <div key={index} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 items-center">
                                <div className="text-center min-w-[80px]">
                                    <p className="text-sm font-bold text-slate-900">{lesson.time.split(' - ')[0]}</p>
                                    <p className="text-xs text-slate-500">{lesson.time.split(' - ')[1]}</p>
                                </div>
                                <div className="h-10 w-px bg-slate-200" />
                                <div>
                                    <p className="font-bold text-slate-900">{lesson.subject}</p>
                                    <p className="text-sm text-slate-500">{lesson.class} • {lesson.room}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Tasks */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <AlertCircle size={20} className="text-slate-400" />
                            Use Attention Needed
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { task: "Upload JHS 2 Math Results", due: "Today", type: "Urgent" },
                            { task: "Mark JHS 3 Science Quiz", due: "Tomorrow", type: "Normal" },
                            { task: "Submit Weekly Lesson Plan", due: "Friday", type: "Normal" }
                        ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${item.type === 'Urgent' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                    <span className="font-medium text-slate-700">{item.task}</span>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                                    {item.due}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
