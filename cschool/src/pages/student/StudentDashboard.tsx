import { StudentAcademicArea } from '../../components/student/dashboard/StudentAcademicArea';
export const StudentDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back to your learning space.</p>
            </div>
            <StudentAcademicArea />
        </div>
    );
};
