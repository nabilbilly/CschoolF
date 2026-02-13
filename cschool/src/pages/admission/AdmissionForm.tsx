import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Users, HeartPulse, GraduationCap, CheckCircle2,
    Printer, Ghost, AlertCircle, Trash2, Plus, Home,
    ChevronRight, ChevronLeft, Check, RotateCcw, Eye, Upload,
    MapPin, Briefcase, Phone, Mail, Calendar, Info
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { cn } from '../../lib/utils';
import { evoucherService } from '../../services/evoucherService';
import { academicsService } from '../../services/academicsService';
import type { ClassRoom, Term, AcademicYear } from '../../services/academicsService';
import { admissionsService } from '../../services/admissionsService';
import { mediaService } from '../../services/mediaService';
import { LimitedInput } from '../../components/common/LimitedInput';
import { StudentAvatar } from '../../components/common/StudentAvatar';

interface GuardianData {
    name: string;
    relationship_type: string;
    phone: string;
    secondary_phone?: string;
    email?: string;
    address: string;
    occupation?: string;
}

const steps = [
    { id: 1, name: 'Student Bio', icon: User, color: 'from-blue-500 to-indigo-600' },
    { id: 2, name: 'Guardians', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { id: 3, name: 'Medical', icon: HeartPulse, color: 'from-rose-500 to-pink-600' },
    { id: 4, name: 'Placement', icon: GraduationCap, color: 'from-amber-500 to-orange-600' },
    { id: 5, name: 'Review', icon: Check, color: 'from-violet-500 to-purple-600' }
];

export const AdmissionForm = () => {
    const navigate = useNavigate();

    // Flow State
    const [currentStep, setCurrentStep] = useState(1);
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [voucherToken, setVoucherToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [referenceId, setReferenceId] = useState<string | null>(null);
    const [voucherNumber, setVoucherNumber] = useState<string | null>(null);
    const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

    // Data State
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [terms, setTerms] = useState<Term[]>([]);
    const [activeYear, setActiveYear] = useState<AcademicYear | null>(null);

    // Form State
    const [student, setStudent] = useState({
        first_name: '',
        last_name: '',
        middle_name: '',
        gender: '' as 'Male' | 'Female' | '',
        date_of_birth: '',
        nationality: 'Ghanaian',
        address: '',
        city: '',
        photo: null as string | null
    });

    const [guardians, setGuardians] = useState<GuardianData[]>([
        { name: '', relationship_type: '', phone: '', secondary_phone: '', email: '', address: '', occupation: '' }
    ]);

    const [medical, setMedical] = useState({
        health_conditions: '',
        allergies: '',
        special_needs: ''
    });

    const [placement, setPlacement] = useState({
        academic_year_id: 0,
        term_id: 0,
        class_id: 0,
        stream_id: null as number | null
    });

    const [declaration, setDeclaration] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const ErrorText = ({ error }: { error?: string }) => {
        if (!error) return null;
        return (
            <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-1 ml-2"
            >
                <AlertCircle size={10} /> {error}
            </motion.p>
        );
    };

    // Initial Verification
    useEffect(() => {
        const token = sessionStorage.getItem('admission_voucher_token');
        if (!token) {
            navigate('/admission/verification');
            return;
        }

        const init = async () => {
            try {
                const vRes = await evoucherService.checkSession(token);
                if (!vRes.valid) {
                    sessionStorage.removeItem('admission_voucher_token');
                    sessionStorage.removeItem('admission_voucher_number');
                    navigate('/admission/verification');
                    return;
                }
                setVoucherToken(token);
                if (vRes.voucher_number) setVoucherNumber(vRes.voucher_number);

                const [classList, years] = await Promise.all([
                    academicsService.getClasses(),
                    academicsService.getAcademicYears()
                ]);

                setClasses(classList);
                const currentYear = years.find((y: AcademicYear) => y.id === vRes.academic_year_id) || years.find((y: AcademicYear) => y.status === 'Active');

                if (currentYear) {
                    setActiveYear(currentYear);
                    const termData = await academicsService.getTerms(currentYear.id);
                    setTerms(termData);
                    const filteredTerms = termData; // Use all terms for default selection logic

                    // Restore draft logic
                    const vNum = vRes.voucher_number || sessionStorage.getItem('admission_voucher_number');
                    if (vNum) {
                        const savedDraft = localStorage.getItem(`admission_draft_${vNum}`);
                        if (savedDraft) {
                            try {
                                const parsed = JSON.parse(savedDraft);
                                if (parsed.student) setStudent(prev => ({ ...prev, ...parsed.student }));
                                if (parsed.guardians) setGuardians(parsed.guardians);
                                if (parsed.medical) setMedical(prev => ({ ...prev, ...parsed.medical }));
                                if (parsed.placement) {
                                    setPlacement(prev => ({
                                        ...prev,
                                        ...parsed.placement,
                                        academic_year_id: currentYear.id // Force correct year
                                    }));
                                } else {
                                    const activeTerm = filteredTerms.find((t: any) => t.status === 'Active') || (filteredTerms.length > 0 ? filteredTerms[0] : null);
                                    setPlacement(prev => ({
                                        ...prev,
                                        academic_year_id: currentYear.id,
                                        term_id: activeTerm ? activeTerm.id : 0
                                    }));
                                }
                                if (parsed.currentStep) setCurrentStep(parsed.currentStep);
                            } catch (e) {
                                console.error('Failed to parse draft:', e);
                            }
                        } else {
                            // Default placement if no draft
                            const activeTerm = filteredTerms.find((t: any) => t.status === 'Active') || (filteredTerms.length > 0 ? filteredTerms[0] : null);
                            setPlacement(prev => ({
                                ...prev,
                                academic_year_id: currentYear.id,
                                term_id: activeTerm ? activeTerm.id : 0
                            }));
                        }
                    }
                }
                setIsVerifying(false);
            } catch (err: any) {
                console.error('Admission Form Init Error:', err);
                setError(`Failed to initialize form: ${err.message || 'Unknown error'}`);
                setIsVerifying(false);
            }
        };
        init();
    }, [navigate]);

    // Save Draft Effect
    useEffect(() => {
        if (!voucherNumber || isVerifying || isSubmitted) return;

        const saveDraft = () => {
            setDraftStatus('saving');
            const draftData = {
                student,
                guardians,
                medical,
                placement,
                currentStep,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`admission_draft_${voucherNumber}`, JSON.stringify(draftData));
            setTimeout(() => setDraftStatus('saved'), 500);
            setTimeout(() => setDraftStatus('idle'), 3000);
        };

        const timeoutId = setTimeout(saveDraft, 1000); // Debounce save
        return () => clearTimeout(timeoutId);
    }, [student, guardians, medical, placement, currentStep, voucherNumber, isVerifying, isSubmitted]);

    const handleGuardianChange = (index: number, field: keyof GuardianData, value: string) => {
        const newGuardians = [...guardians];
        newGuardians[index] = { ...newGuardians[index], [field]: value };
        setGuardians(newGuardians);

        // Clear error if exists
        const errorKey = `guardian_${index}_${field.replace('relationship_type', 'relationship')}`;
        if (formErrors[errorKey]) {
            const nextErrors = { ...formErrors };
            delete nextErrors[errorKey];
            setFormErrors(nextErrors);
        }
    };

    const addGuardian = () => {
        setGuardians([...guardians, { name: '', relationship_type: '', phone: '', secondary_phone: '', email: '', address: '', occupation: '' }]);
    };

    const removeGuardian = (index: number) => {
        if (guardians.length > 1) {
            setGuardians(guardians.filter((_, i) => i !== index));
        }
    };

    const validateStep = (step: number) => {
        const errors: Record<string, string> = {};

        if (step === 1) {
            if (!student.first_name.trim()) errors.first_name = 'First name is required';
            if (!student.last_name.trim()) errors.last_name = 'Last name is required';
            if (!student.gender) errors.gender = 'Gender is required';
            if (!student.date_of_birth) errors.date_of_birth = 'Date of birth is required';
            if (!student.city.trim()) errors.city = 'City/Town is required';
            if (!student.address.trim()) errors.address = 'Residential address is required';
        }

        if (step === 2) {
            guardians.forEach((g, idx) => {
                if (!g.name.trim()) errors[`guardian_${idx}_name`] = 'Guardian name is required';
                if (!g.relationship_type) errors[`guardian_${idx}_relationship`] = 'Relationship is required';
                if (!g.phone.trim()) errors[`guardian_${idx}_phone`] = 'Phone number is required';
                if (!g.address.trim()) errors[`guardian_${idx}_address`] = 'Address is required';
                if (g.email && !g.email.includes('@')) errors[`guardian_${idx}_email`] = 'Invalid email address';
            });
        }

        if (step === 4) {
            if (!placement.class_id) errors.class_id = 'Please select a target class';
            if (!placement.term_id) errors.term_id = 'Please select a term';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
            setError(null);
            window.scrollTo(0, 0);
        } else {
            setError('Please architectural details ensure all required fields are correctly populated.');
            setTimeout(() => setError(null), 5000);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        window.scrollTo(0, 0);
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation (1MB limit)
        if (file.size > 1 * 1024 * 1024) {
            setError('Image size must be 1MB or less');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const res = await mediaService.uploadImage(file);
            setStudent(prev => ({ ...prev, photo: res.url }));
        } catch (err: any) {
            setError(err.message || 'Photo upload failed');
        } finally {
            setIsUploading(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!declaration) {
            setError('Please confirm the accuracy of information.');
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            const payload = {
                voucher_session_token: voucherToken!,
                student: { ...student, middle_name: student.middle_name || null },
                guardians: guardians.map(g => ({
                    ...g,
                    secondary_phone: g.secondary_phone || null,
                    email: g.email || null,
                    occupation: g.occupation || null
                })),
                medical: Object.values(medical).some(v => v) ? medical : undefined,
                placement
            };

            const response = await admissionsService.submitAdmission(payload);
            setReferenceId(`ADM-${response.id}-${new Date().getFullYear()}`);
            setIsSubmitted(true);
            sessionStorage.removeItem('admission_voucher_token');
            sessionStorage.removeItem('admission_voucher_number');
            if (voucherNumber) {
                localStorage.removeItem(`admission_draft_${voucherNumber}`);
            }
        } catch (err: any) {
            setError(err.message || 'Submission failed. Please re-verify voucher.');
            if (err.status === 400) setTimeout(() => navigate('/admission/verification'), 2000);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isVerifying) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full mx-auto"
                />
                <p className="text-slate-500 font-bold italic animate-pulse">Initializing Portal metadata...</p>
            </div>
        </div>
    );

    if (isSubmitted) return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 selection:bg-primary-100">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
                >
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-700 p-12 text-white text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12 }}
                            className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md"
                        >
                            <CheckCircle2 size={48} className="text-white" />
                        </motion.div>
                        <h1 className="text-4xl font-black italic tracking-tight">Application Transmitted</h1>
                        <p className="mt-2 text-emerald-50/80 font-medium">Your application has been securely queued for review.</p>
                    </div>

                    <div className="p-12 space-y-10">
                        <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 text-center space-y-6">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Official Reference ID</p>
                            <h2 className="text-6xl font-black italic tracking-tighter text-slate-900">{referenceId}</h2>
                            <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">
                                Please quote this reference in all correspondence with the school. A confirmation has been logged.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2 p-6 bg-white border-2 border-slate-50 rounded-3xl">
                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Student</p>
                                <p className="font-black italic text-lg text-slate-900">{student.first_name} {student.last_name}</p>
                            </div>
                            <div className="space-y-2 p-6 bg-white border-2 border-slate-50 rounded-3xl">
                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Assigned Class</p>
                                <p className="font-black italic text-lg text-slate-900">{classes.find(c => c.id === placement.class_id)?.name}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t items-center justify-center">
                            <Button size="lg" className="rounded-full bg-slate-900 px-12 h-16 text-lg" onClick={() => window.print()}>
                                <Printer className="mr-3" size={24} /> Print Receipt
                            </Button>
                            <Link to="/">
                                <Button variant="outline" size="lg" className="rounded-full px-12 h-16 text-lg border-2">
                                    <Home className="mr-3" size={24} /> Back to Portal
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFCFE] flex flex-col pb-32">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
                :root { font-family: 'Outfit', sans-serif; }
                .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.3); }
                input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }
            `}</style>

            {/* Premium Header */}
            <header className="sticky top-0 z-50 glass-card bg-white/70">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <motion.div
                            whileHover={{ rotate: 10 }}
                            className="w-14 h-14 bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl"
                        >
                            <Ghost size={32} />
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">cschool Portal</h1>
                            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.4em] mt-2">Admission Wizard • {activeYear?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {draftStatus !== 'idle' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100"
                            >
                                <div className={cn("w-2 h-2 rounded-full", draftStatus === 'saving' ? "bg-amber-400 animate-pulse" : "bg-emerald-500")} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic">
                                    {draftStatus === 'saving' ? 'Syncing...' : 'Draft Secured'}
                                </span>
                            </motion.div>
                        )}

                        {/* Desktop Stepper */}
                        <div className="hidden lg:flex items-center gap-3">
                            {steps.map((s, idx) => (
                                <div key={s.id} className="flex items-center">
                                    <motion.div
                                        onClick={() => currentStep > s.id && setCurrentStep(s.id)}
                                        whileHover={currentStep > s.id ? { scale: 1.1 } : {}}
                                        className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm border-2",
                                            currentStep === s.id ? "bg-primary-600 border-primary-600 text-white shadow-lg ring-4 ring-primary-50" :
                                                currentStep > s.id ? "bg-emerald-500 border-emerald-500 text-white" :
                                                    "bg-white border-slate-100 text-slate-300"
                                        )}
                                    >
                                        {currentStep > s.id ? <Check size={20} strokeWidth={4} /> : <s.icon size={20} />}
                                    </motion.div>
                                    {idx < steps.length - 1 && (
                                        <div className={cn("w-6 h-0.5 mx-1 rounded-full", currentStep > s.id ? "bg-emerald-500" : "bg-slate-100")} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Form Canvas */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 mt-12">
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-10"
                        >
                            <div className="bg-rose-50 border-2 border-rose-100 p-6 rounded-[2rem] flex items-center gap-6 text-rose-900">
                                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shrink-0">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black uppercase tracking-widest text-rose-500 mb-1">Attention Required</p>
                                    <p className="font-bold italic">{error}</p>
                                </div>
                                <Button variant="ghost" onClick={() => setError(null)} className="rounded-full w-10 h-10 p-0 text-rose-300 hover:bg-rose-100">
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="space-y-10"
                    >
                        {/* Section Lead */}
                        <div className="flex items-center gap-6">
                            <div className={cn("w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white shadow-2xl shadow-indigo-100", steps[currentStep - 1].color)}>
                                {(() => { const Icon = steps[currentStep - 1].icon; return <Icon size={40} />; })()}
                            </div>
                            <div>
                                <p className="text-xs font-black text-primary-600 uppercase tracking-[0.4em] mb-1">Section 0{currentStep}</p>
                                <h2 className="text-4xl font-black italic tracking-tighter text-slate-900">{steps[currentStep - 1].name}</h2>
                            </div>
                        </div>

                        {/* Step content */}
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-8 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl space-y-10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <LimitedInput
                                            label="First Name *"
                                            value={student.first_name}
                                            onChange={val => { setStudent({ ...student, first_name: val }); if (formErrors.first_name) setFormErrors({ ...formErrors, first_name: '' }); }}
                                            maxLength={50}
                                            error={formErrors.first_name}
                                            placeholder="Enter first name"
                                        />
                                        <LimitedInput
                                            label="Last Name *"
                                            value={student.last_name}
                                            onChange={val => { setStudent({ ...student, last_name: val }); if (formErrors.last_name) setFormErrors({ ...formErrors, last_name: '' }); }}
                                            maxLength={50}
                                            error={formErrors.last_name}
                                            placeholder="Enter last name"
                                        />
                                        <div className="col-span-2">
                                            <LimitedInput
                                                label="Middle / Other Name"
                                                value={student.middle_name}
                                                onChange={val => setStudent({ ...student, middle_name: val })}
                                                maxLength={50}
                                                placeholder="Optional"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Gender *</label>
                                            <div className={cn("flex gap-3 h-16 rounded-[1.25rem] p-1", formErrors.gender && "bg-rose-50 ring-2 ring-rose-200")}>
                                                {['Male', 'Female'].map(g => (
                                                    <button key={g} type="button" onClick={() => { setStudent({ ...student, gender: g as any }); if (formErrors.gender) setFormErrors({ ...formErrors, gender: '' }); }} className={cn("flex-1 rounded-[1.25rem] border-2 font-black italic transition-all uppercase text-xs tracking-wider", student.gender === g ? "bg-slate-900 text-white border-slate-900 shadow-lg" : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100")}>{g}</button>
                                                ))}
                                            </div>
                                            <ErrorText error={formErrors.gender} />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date of Birth *</label>
                                            <input value={student.date_of_birth} onChange={e => { setStudent({ ...student, date_of_birth: e.target.value }); if (formErrors.date_of_birth) setFormErrors({ ...formErrors, date_of_birth: '' }); }} type="date" className={cn("w-full h-16 bg-slate-50 border-2 border-slate-200 rounded-[1.25rem] px-8 outline-none focus:border-primary-600 focus:bg-white transition-all font-bold italic", formErrors.date_of_birth && "border-rose-300 bg-rose-50/30")} />
                                            <ErrorText error={formErrors.date_of_birth} />
                                        </div>
                                        <LimitedInput
                                            label="City / Town *"
                                            value={student.city}
                                            onChange={val => { setStudent({ ...student, city: val }); if (formErrors.city) setFormErrors({ ...formErrors, city: '' }); }}
                                            maxLength={50}
                                            error={formErrors.city}
                                            placeholder="e.g Accra"
                                            icon={<MapPin size={18} />}
                                        />
                                        <LimitedInput
                                            label="Nationality"
                                            value={student.nationality}
                                            onChange={val => setStudent({ ...student, nationality: val })}
                                            maxLength={50}
                                        />
                                        <div className="col-span-2">
                                            <LimitedInput
                                                textarea
                                                label="Residential Address *"
                                                value={student.address}
                                                onChange={val => { setStudent({ ...student, address: val }); if (formErrors.address) setFormErrors({ ...formErrors, address: '' }); }}
                                                maxLength={255}
                                                rows={2}
                                                error={formErrors.address}
                                                placeholder="Provide current residential location..."
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-indigo-50 border-2 border-indigo-100 rounded-[2.5rem] p-8 space-y-4">
                                        <div className="flex items-center gap-3 text-indigo-600"><Info size={18} /> <p className="text-[10px] font-black uppercase tracking-widest">Important Info</p></div>
                                        <p className="text-sm text-indigo-900/60 font-medium italic leading-relaxed">Ensure all bio-data matches official identity documents. This data will be used for permanent academic records.</p>
                                    </div>
                                    <div
                                        onClick={() => document.getElementById('passport-upload')?.click()}
                                        className="aspect-[4/5] bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-8 group hover:border-primary-200 transition-all cursor-pointer relative overflow-hidden shadow-inner"
                                    >
                                        {isUploading ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
                                                <p className="text-[10px] font-black text-primary-600 uppercase tracking-widest">Processing...</p>
                                            </div>
                                        ) : student.photo ? (
                                            <div className="relative w-full h-full group/photo group">
                                                <StudentAvatar
                                                    firstName={student.first_name}
                                                    lastName={student.last_name}
                                                    photo={student.photo}
                                                    size="2xl"
                                                    className="w-full h-full rounded-[2.5rem]"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2.5rem]">
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={48} className="text-slate-200 group-hover:scale-110 group-hover:text-primary-600 transition-all mb-4" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Click to upload Passport Photo</p>
                                            </>
                                        )}
                                        <input
                                            id="passport-upload"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            disabled={isUploading}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-12 pb-10">
                                {guardians.map((g, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-8">
                                            {guardians.length > 1 && (
                                                <button onClick={() => removeGuardian(idx)} className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"><Trash2 size={20} /></button>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-5 mb-10 border-b border-slate-50 pb-8">
                                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl italic">0{idx + 1}</div>
                                            <h3 className="text-3xl font-black italic text-slate-800 uppercase tracking-tight">Guardian Information</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                            <div className="md:col-span-2">
                                                <LimitedInput
                                                    label="Guardian Full Name *"
                                                    value={g.name}
                                                    onChange={val => handleGuardianChange(idx, 'name', val)}
                                                    maxLength={100}
                                                    error={formErrors[`guardian_${idx}_name`]}
                                                    placeholder="Enter full legal name"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Relationship *</label>
                                                <select value={g.relationship_type} onChange={e => handleGuardianChange(idx, 'relationship_type', e.target.value)} className={cn("w-full h-16 bg-slate-50 border-2 border-slate-200 rounded-[1.25rem] px-8 outline-none focus:border-emerald-500 focus:bg-white transition-all font-bold italic appearance-none cursor-pointer", formErrors[`guardian_${idx}_relationship`] && "border-rose-300 bg-rose-50/30")}>
                                                    <option value="">Select Relationship...</option>
                                                    {['Father', 'Mother', 'Uncle', 'Aunt', 'Brother', 'Sister', 'Other'].map(r => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                                <ErrorText error={formErrors[`guardian_${idx}_relationship`]} />
                                            </div>
                                            <div>
                                                <LimitedInput
                                                    label="Occupation"
                                                    value={g.occupation || ''}
                                                    onChange={val => handleGuardianChange(idx, 'occupation', val)}
                                                    maxLength={100}
                                                    placeholder="Guardian's work/profession"
                                                    icon={<Briefcase size={18} />}
                                                />
                                            </div>
                                            <div>
                                                <LimitedInput
                                                    label="Primary Phone *"
                                                    value={g.phone}
                                                    onChange={val => handleGuardianChange(idx, 'phone', val)}
                                                    maxLength={11}
                                                    numericOnly
                                                    error={formErrors[`guardian_${idx}_phone`]}
                                                    placeholder="0XXXX XXXXXX"
                                                    icon={<Phone size={18} />}
                                                />
                                            </div>
                                            <div>
                                                <LimitedInput
                                                    label="Secondary / Alternative Phone"
                                                    value={g.secondary_phone || ''}
                                                    onChange={val => handleGuardianChange(idx, 'secondary_phone', val)}
                                                    maxLength={11}
                                                    numericOnly
                                                    placeholder="Optional"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <LimitedInput
                                                    label="Email Address"
                                                    value={g.email || ''}
                                                    onChange={val => handleGuardianChange(idx, 'email', val)}
                                                    maxLength={100}
                                                    error={formErrors[`guardian_${idx}_email`]}
                                                    placeholder="example@domain.com"
                                                    icon={<Mail size={18} />}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <LimitedInput
                                                    textarea
                                                    label="Residential Address *"
                                                    value={g.address}
                                                    onChange={val => handleGuardianChange(idx, 'address', val)}
                                                    maxLength={255}
                                                    rows={2}
                                                    error={formErrors[`guardian_${idx}_address`]}
                                                    placeholder="Provide full residential description..."
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                <button onClick={addGuardian} className="w-full py-10 rounded-[3rem] border-4 border-dashed border-slate-100 text-slate-300 font-black italic uppercase tracking-[0.2em] hover:bg-white hover:border-emerald-200 hover:text-emerald-500 transition-all flex items-center justify-center gap-4 group">
                                    <Plus size={32} className="group-hover:rotate-180 transition-transform duration-500" /> Add Additional Guardian
                                </button>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl space-y-12">
                                <div className="bg-rose-50 p-10 rounded-[2.5rem] flex gap-8 items-center border border-rose-100">
                                    <div className="w-20 h-20 bg-rose-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-100"><HeartPulse size={40} /></div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-black italic text-rose-950 uppercase tracking-tight">Optional Health Profile</h4>
                                        <p className="text-sm text-rose-800/60 font-medium italic mt-1 leading-relaxed">This information allows the school to provide immediate tailored support and maintain emergency safety protocols.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <LimitedInput
                                        textarea
                                        label="Allergies (e.g Peanuts, Dust)"
                                        value={medical.allergies}
                                        onChange={val => setMedical({ ...medical, allergies: val })}
                                        maxLength={500}
                                        rows={4}
                                        placeholder="Specify any known allergies..."
                                        className="!bg-slate-50 focus:!border-rose-500"
                                    />
                                    <LimitedInput
                                        textarea
                                        label="Ongoing Health Conditions"
                                        value={medical.health_conditions}
                                        onChange={val => setMedical({ ...medical, health_conditions: val })}
                                        maxLength={500}
                                        rows={4}
                                        placeholder="e.g Asthma, Diabetic..."
                                        className="!bg-slate-50 focus:!border-rose-500"
                                    />
                                    <div className="col-span-2">
                                        <LimitedInput
                                            textarea
                                            label="Special Requirements / Needs"
                                            value={medical.special_needs}
                                            onChange={val => setMedical({ ...medical, special_needs: val })}
                                            maxLength={500}
                                            rows={3}
                                            placeholder="Specify any physical or learning support needs..."
                                            className="!bg-slate-50 focus:!border-rose-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl space-y-12">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Academic Year (Automatic)</label>
                                        <div className="h-24 flex items-center px-10 bg-slate-900 rounded-[2rem] font-black text-3xl italic text-white tracking-tight shadow-2xl relative overflow-hidden group">
                                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-[-30deg] translate-x-12 transition-transform group-hover:translate-x-4 duration-1000" />
                                            {activeYear?.name || 'Loading Year...'}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-primary-600 uppercase ml-2 tracking-widest">Target Term *</label>
                                        <div className="relative">
                                            <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-300" />
                                            <select value={placement.term_id || 0} onChange={e => { setPlacement({ ...placement, term_id: parseInt(e.target.value) || 0 }); if (formErrors.term_id) setFormErrors({ ...formErrors, term_id: '' }); }} className={cn("w-full h-20 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] pl-16 pr-8 font-black text-2xl italic outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer shadow-sm appearance-none", formErrors.term_id && "border-rose-300 bg-rose-50/30")}>
                                                <option value={0}>Choose Term...</option>
                                                {terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                        <ErrorText error={formErrors.term_id} />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-primary-600 uppercase ml-2 tracking-widest">Applying for Class *</label>
                                        <select value={placement.class_id} onChange={e => { setPlacement({ ...placement, class_id: parseInt(e.target.value) }); if (formErrors.class_id) setFormErrors({ ...formErrors, class_id: '' }); }} className={cn("w-full h-20 bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] px-8 font-black text-2xl italic outline-none focus:border-amber-500 focus:bg-white transition-all cursor-pointer shadow-sm appearance-none", formErrors.class_id && "border-rose-300 bg-rose-50/30")}>
                                            <option value="">Choose Class...</option>
                                            {classes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.level})</option>)}
                                        </select>
                                        <ErrorText error={formErrors.class_id} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="space-y-12">
                                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl space-y-12 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Ghost size={240} /></div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-4xl font-black italic text-slate-900 tracking-tighter uppercase">Review & Dispatch</h3>
                                        <p className="text-slate-400 font-medium italic">Please verify all sections before final transmission.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-white shadow-lg space-y-5">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-[10px] font-black uppercase text-primary-600 tracking-[0.2em]">Student Identity</h5>
                                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-primary-600 font-black italic text-[10px]">EDIT</Button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-2xl font-black italic text-slate-900 leading-tight">{student.first_name} {student.last_name}</p>
                                                <p className="text-sm font-medium text-slate-500">{student.gender} • {student.date_of_birth}</p>
                                                <p className="text-xs font-bold text-slate-400 italic mt-2 flex items-center gap-2"><MapPin size={12} /> {student.city}, {student.address}</p>
                                            </div>
                                        </div>

                                        <div className="p-10 bg-slate-50 rounded-[2.5rem] border-2 border-white shadow-lg space-y-5">
                                            <div className="flex items-center justify-between">
                                                <h5 className="text-[10px] font-black uppercase text-amber-600 tracking-[0.2em]">Placement Details</h5>
                                                <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} className="text-amber-600 font-black italic text-[10px]">EDIT</Button>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-2xl font-black italic text-slate-900">{classes.find(c => c.id === placement.class_id)?.name}</p>
                                                <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">{terms.find(t => t.id === placement.term_id)?.name}</p>
                                                <p className="text-xs font-bold text-slate-400 italic mt-2">{activeYear?.name} Session</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-slate-100 px-4">
                                        <label className="flex items-start gap-8 p-10 rounded-[3rem] bg-indigo-50/50 border-2 border-indigo-50 group cursor-pointer hover:bg-indigo-50 transition-all">
                                            <div className="relative mt-1">
                                                <input type="checkbox" className="peer w-10 h-10 rounded-2xl border-indigo-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer appearance-none border-4 bg-white checked:bg-indigo-600 transition-all" checked={declaration} onChange={e => setDeclaration(e.target.checked)} />
                                                <Check className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" size={24} strokeWidth={4} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-black italic text-2xl uppercase tracking-tight text-slate-900 group-hover:text-indigo-950 transition-colors">Legal Confirmation</p>
                                                <p className="text-sm text-slate-500 leading-relaxed font-medium italic">I solemnly declare that the information provided is full, accurate, and complete. I understand that any discrepancy found may result in immediate disqualification without refund.</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </main >

            {/* Premium Action Dock */}
            < div className="fixed bottom-0 left-0 right-0 z-[100] p-10 pointer-events-none" >
                <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
                    <div className="flex-1 bg-slate-900/90 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] p-4 flex items-center justify-between gap-6 px-10">
                        <div className="flex items-center gap-4">
                            {currentStep > 1 && (
                                <Button variant="ghost" size="lg" className="rounded-2xl px-8 h-16 font-black italic tracking-widest text-slate-400 hover:text-white" onClick={prevStep}>
                                    <ChevronLeft size={24} className="mr-2" /> BACK
                                </Button>
                            )}
                            <Button variant="ghost" onClick={() => window.confirm("Reset all form data?") && window.location.reload()} className="hidden sm:flex rounded-2xl w-16 h-16 p-0 font-black text-slate-500 hover:text-rose-400">
                                <RotateCcw size={24} />
                            </Button>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* {currentStep === 5 && (
                                <Button variant="ghost" size="lg" className="hidden md:flex rounded-2xl px-10 h-16 font-black italic tracking-widest text-slate-400 hover:text-white border border-white/5" onClick={() => { setIsSubmitted(true); setReferenceId('PREVIEW-MODE'); }}>
                                    <Eye className="mr-3" size={24} /> PREVIEW
                                </Button>
                            )} */}
                            <Button
                                size="lg"
                                className={cn(
                                    "rounded-[1.5rem] px-16 h-16 font-black italic tracking-[0.2em] transform active:scale-95 transition-all shadow-2xl min-w-[240px]",
                                    currentStep === 5 ? "bg-primary-600 hover:bg-primary-500 text-white" : "bg-white text-slate-900 hover:bg-indigo-50"
                                )}
                                onClick={currentStep === 5 ? handleSubmit : nextStep}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-7 h-7 border-[3px] border-white border-t-transparent rounded-full" />
                                ) : currentStep === 5 ? (
                                    "DISPATCH APPLICATION"
                                ) : (
                                    <div className="flex items-center">CONTINUE <ChevronRight className="ml-4" size={28} strokeWidth={3} /></div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};
