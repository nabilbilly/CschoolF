import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { TeacherSidebar } from '../teacher/TeacherSidebar';

export const TeacherLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            <TeacherSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Main Content */}
            <main className="md:ml-64 min-h-screen flex flex-col transition-all duration-300">
                {/* Mobile Header */}
                <div className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center gap-4 md:hidden text-white">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-lg">CSchool Teacher</span>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};
