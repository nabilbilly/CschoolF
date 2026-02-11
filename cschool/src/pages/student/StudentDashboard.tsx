import { useState, useEffect } from 'react';
import { studentsService, type StudentResponse } from '../../services/studentsService';
import { StudentAcademicArea } from '../../components/student/dashboard/StudentAcademicArea';
import { StudentProfileCard } from '../../components/student/dashboard/StudentProfileCard';
import { Loader2 } from 'lucide-react';

export const StudentDashboard = () => {
    const [profile, setProfile] = useState<StudentResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await studentsService.getProfile();
                setProfile(data);
            } catch (err) {
                console.error("Dashboard profile fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
        );
    }

    const studentProps = profile ? {
        name: `${profile.first_name} ${profile.last_name}`,
        id: profile.index_number || profile.account?.username || "N/A",
        class: `${profile.current_class} ${profile.current_stream !== 'N/A' ? profile.current_stream : ''}`,
        gender: profile.gender,
        dob: new Date(profile.date_of_birth).toLocaleDateString(),
        guardian: profile.guardians?.[0]?.phone || "N/A",
        admissionDate: new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        photo: profile.photo
    } : undefined;

    return (
        <div className="space-y-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500">Welcome back to your learning space.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                    <StudentAcademicArea />
                </div>
                <div className="lg:col-span-4">
                    <StudentProfileCard student={studentProps} />
                </div>
            </div>
        </div>
    );
};
