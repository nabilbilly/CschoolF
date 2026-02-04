import { User, Calendar, MapPin, Phone } from 'lucide-react';
import { Button } from '../../common/Button';

// Mock data
const studentDetails = {
    name: "Kwame Mensah",
    id: "CS-2023-001",
    class: "JHS 2 - A",
    gender: "Male",
    dob: "12th May, 2010",
    guardian: "+233 24 555 0123",
    admissionDate: "Sept 2021",
    photo: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=300&auto=format&fit=crop"
};

export const StudentProfileCard = () => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="bg-primary-600 h-24 relative">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                    <img
                        src={studentDetails.photo}
                        alt={studentDetails.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
                    />
                </div>
            </div>

            <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-slate-900">{studentDetails.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-1 mb-4">
                    <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {studentDetails.class}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">|</span>
                    <span className="text-slate-500 text-xs font-medium">ID: {studentDetails.id}</span>
                </div>

                <div className="space-y-4 text-left mt-6">
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Gender</p>
                            <p className="text-sm font-semibold text-slate-700">{studentDetails.gender}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Date of Birth</p>
                            <p className="text-sm font-semibold text-slate-700">{studentDetails.dob}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Guardian Contact</p>
                            <p className="text-sm font-semibold text-slate-700">{studentDetails.guardian}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-medium uppercase">Admitted</p>
                            <p className="text-sm font-semibold text-slate-700">{studentDetails.admissionDate}</p>
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
