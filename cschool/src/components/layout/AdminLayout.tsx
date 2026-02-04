import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../admin/AdminSidebar';

export const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};
