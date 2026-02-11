import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { StudentSidebar } from '../../components/student/StudentSidebar';
import { authService } from '../../services/authService';

export const StudentLayout = () => {
    const session = authService.getSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!session.token) {
        return <Navigate to="/student/login" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <StudentSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Header */}
                <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center gap-4 md:hidden">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-slate-800 text-lg">CSchool Student</span>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
