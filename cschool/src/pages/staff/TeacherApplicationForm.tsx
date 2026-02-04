import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { ArrowLeft, Save, Upload, Calendar, User, BookOpen, Briefcase, FileText, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const TeacherApplicationForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        // Personal Info
        title: '',
        fullName: '',
        dob: '',
        gender: '',
        nationality: 'Ghanaian',
        hometown: '',
        region: '',
        phone: '',
        email: '',

        // Professional Details
        qualification: '',
        teachingCert: '',
        specialization: '',
        experienceYears: '',
        preferredLevel: '',

        // Employment Info
        employmentType: 'Full-time',
        availability: '',
        previousSchool: '',
        reasonForLeaving: '',

        // Referee
        refereeName: '',
        refereeRelation: '',
        refereePhone: '',
        refereeAddress: '',

        // Declaration
        declaration: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: target.checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate submission
        setTimeout(() => {
            alert('Application Submitted Successfully!');
            setIsLoading(false);
        }, 1500);
    };

    const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 mt-10 first:mt-0">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
                {title}
            </h3>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Home
                </Link> */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white shadow-xl rounded-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-slate-900 px-6 py-8 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-primary-600/10 z-0"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold">Teacher Application Form</h1>
                            <p className="mt-2 text-slate-300 font-medium">cschool &bull; 2025/2026 Academic Year</p>
                            <p className="mt-4 text-sm bg-white/10 backdrop-blur-sm inline-block px-4 py-1.5 rounded-full border border-white/20">
                                Please complete all required fields accurately for review.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-10">

                        {/* Personal Information */}
                        <SectionHeader title="Personal Information" icon={User} />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                            {/* Photo Upload */}
                            <div className="md:col-span-4 md:order-last">
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center h-full min-h-[240px] bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="w-32 h-32 bg-slate-200 rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform overflow-hidden shadow-inner">
                                        <User className="text-slate-400 w-16 h-16" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600">Upload Passport Photo</p>
                                    <p className="text-xs text-slate-400 mt-1">Max 2MB (JPG/PNG)</p>
                                    <input type="file" className="hidden" accept="image/*" />
                                </div>
                            </div>

                            {/* Text Inputs */}
                            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                                    <select
                                        name="title" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                        value={formData.title} onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Mr">Mr.</option>
                                        <option value="Mrs">Mrs.</option>
                                        <option value="Miss">Miss</option>
                                        <option value="Dr">Dr.</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                    <select
                                        name="gender" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                        value={formData.gender} onChange={handleInputChange}
                                    >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                    <input
                                        type="text" name="fullName" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="Surname Firstname othernames"
                                        value={formData.fullName} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                                    <div className="relative">
                                        <input
                                            type="date" name="dob" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                            value={formData.dob} onChange={handleInputChange}
                                        />
                                        <Calendar className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nationality *</label>
                                    <input
                                        type="text" name="nationality" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={formData.nationality} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hometown</label>
                                    <input
                                        type="text" name="hometown" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        value={formData.hometown} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Region *</label>
                                    <select
                                        name="region" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                        value={formData.region} onChange={handleInputChange}
                                    >
                                        <option value="">Select Region</option>
                                        <option value="Greater Accra">Greater Accra</option>
                                        <option value="Ashanti">Ashanti</option>
                                        <option value="Central">Central</option>
                                        <option value="Eastern">Eastern</option>
                                        <option value="Western">Western</option>
                                        <option value="Volta">Volta</option>
                                        <option value="Northern">Northern</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel" name="phone" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="024 XXX XXXX"
                                        value={formData.phone} onChange={handleInputChange}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                                    <input
                                        type="email" name="email" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="you@example.com"
                                        value={formData.email} onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <SectionHeader title="Professional Details" icon={BookOpen} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Highest Qualification *</label>
                                <select
                                    name="qualification" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                    value={formData.qualification} onChange={handleInputChange}
                                >
                                    <option value="">Select Qualification</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Masters">Masters</option>
                                    <option value="Bachelors">Bachelor's Degree</option>
                                    <option value="HND">HND</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teaching Certificate</label>
                                <input
                                    type="text" name="teachingCert" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. B.Ed, PGDE"
                                    value={formData.teachingCert} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Specialization *</label>
                                <input
                                    type="text" name="specialization" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Mathematics, Science"
                                    value={formData.specialization} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Years of Experience *</label>
                                <input
                                    type="number" name="experienceYears" required min="0" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.experienceYears} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Class Level *</label>
                                <select
                                    name="preferredLevel" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                    value={formData.preferredLevel} onChange={handleInputChange}
                                >
                                    <option value="">Select Preferred Level</option>
                                    <option value="Preschool">Preschool (Creche/Nursery/KG)</option>
                                    <option value="PrimaryLower">Lower Primary (B1-B3)</option>
                                    <option value="PrimaryUpper">Upper Primary (B4-B6)</option>
                                    <option value="JHS">Junior High School</option>
                                </select>
                            </div>
                        </div>

                        {/* Employment Information */}
                        <SectionHeader title="Employment Information" icon={Briefcase} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type of Employment *</label>
                                <select
                                    name="employmentType" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                    value={formData.employmentType} onChange={handleInputChange}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship / National Service</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Availability to Start *</label>
                                <input
                                    type="date" name="availability" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.availability} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Previous School (Optional)</label>
                                <input
                                    type="text" name="previousSchool" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.previousSchool} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Leaving (Optional)</label>
                                <textarea
                                    name="reasonForLeaving" rows={2} className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.reasonForLeaving} onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <SectionHeader title="Document Uploads" icon={FileText} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: 'Curriculum Vitae (CV) *', required: true },
                                { label: 'Academic Certificates *', required: true },
                                { label: 'Appointment Letter', required: false },
                                { label: 'National ID Card *', required: true },
                            ].map((doc, idx) => (
                                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">{doc.label}</label>
                                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-white hover:border-primary-400 transition-all">
                                        <Upload size={20} className="text-slate-400 mb-1" />
                                        <span className="text-xs text-slate-500">Choose File</span>
                                        <input type="file" className="hidden" required={doc.required} />
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Referee / Emergency Contact */}
                        <SectionHeader title="Referee / Emergency Contact" icon={Phone} />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Referee Name *</label>
                                <input
                                    type="text" name="refereeName" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.refereeName} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship *</label>
                                <input
                                    type="text" name="refereeRelation" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.refereeRelation} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel" name="refereePhone" required className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.refereePhone} onChange={handleInputChange}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Address / Location</label>
                                <input
                                    type="text" name="refereeAddress" className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    value={formData.refereeAddress} onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox" name="declaration" required
                                    checked={formData.declaration} onChange={handleInputChange}
                                    className="mt-1 text-primary-600 focus:ring-primary-500 rounded"
                                />
                                <span className="text-sm text-amber-900">
                                    I certify that the information provided in this application is true and complete. I understand that false or misleading information may result in my application being rejected or my employment terminated.
                                </span>
                            </label>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end pt-4 border-t border-slate-200">
                            <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
                                <Save size={18} className="mr-2" />
                                Save Draft
                            </Button>
                            <Button type="submit" variant="default" className="w-full sm:w-auto" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Job Application'}
                            </Button>
                        </div>

                    </form>
                </motion.div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>&copy; 2025 cschool - Careers</p>
                </div>
            </div>
        </div>
    );
};
