import { User, Calendar, MapPin, Phone } from 'lucide-react';
import { Button } from '../../common/Button';
import { MEDIA_BASE_URL } from '../../../services/api';

interface StudentProfileCardProps {
    student?: {
        name: string;
        id: string;
        class: string;
        gender: string;
        dob: string;
        guardian: string;
        admissionDate: string;
        photo: string | null;
    };
}

export const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
    const displayData = student || {
        name: "Kwame Mensah",
        id: "CS-2023-001",
        class: "JHS 2 - A",
        gender: "Male",
        dob: "12th May, 2010",
        guardian: "+233 24 555 0123",
        admissionDate: "Sept 2021",
        photo: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=300&auto=format&fit=crop"
    };

    const photoUrl = displayData.photo
        ? (displayData.photo.startsWith('http') ? displayData.photo : `${MEDIA_BASE_URL}${displayData.photo}`)
        : "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=300&auto=format&fit=crop";

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="bg-primary-600 h-24 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <img
                        src={photoUrl}
                        alt={displayData.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                </div>
            </div>

            <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-slate-900">{displayData.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {displayData.class}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">|</span>
                    <span className="text-slate-500 text-xs font-medium">ID: {displayData.id}</span>
                </div>

                <div className="space-y-4 text-left mt-6">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Gender</p>
                            <p className="text-sm font-semibold text-slate-700">{displayData.gender}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Date of Birth</p>
                            <p className="text-sm font-semibold text-slate-700">{displayData.dob}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Guardian Contact</p>
                            <p className="text-sm font-semibold text-slate-700">{displayData.guardian}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Admitted</p>
                            <p className="text-sm font-semibold text-slate-700">{displayData.admissionDate}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Button variant="outline" className="w-full text-sm">
                        View Full Profile
                    </Button>
                </div>
            </div>
        </div>
    );
};
