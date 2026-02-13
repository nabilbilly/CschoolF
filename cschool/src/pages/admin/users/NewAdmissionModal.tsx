import { useState, useEffect } from 'react';
import {
    CheckCircle2, XCircle, ChevronRight, User, Users,
    School, Activity, Key, Loader2, Printer, X
} from 'lucide-react';
import { Modal } from '../../../components/common/Modal';
import { Button } from '../../../components/common/Button';
import { cn } from '../../../lib/utils';
import { evoucherService } from '../../../services/evoucherService';
import type { ClassRoom, Term, AcademicYear } from '../../../services/academicsService';
import { academicsService } from '../../../services/academicsService';
import { admissionsService } from '../../../services/admissionsService';
import { LimitedInput } from '../../../components/common/LimitedInput';

interface NewAdmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (studentData: any) => void;
}

type Step = 'voucher' | 'form' | 'review' | 'success';
type FormSection = 'bio' | 'guardian' | 'academic' | 'medical';

export const NewAdmissionModal = ({ isOpen, onClose, onSave }: NewAdmissionModalProps) => {
    const [currentStep, setCurrentStep] = useState<Step>('voucher');
    const [activeSection, setActiveSection] = useState<FormSection>('bio');
    const [isLoading, setIsLoading] = useState(false);

    // Voucher State
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherPin, setVoucherPin] = useState('');
    const [voucherError, setVoucherError] = useState('');
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [voucherSessionToken, setVoucherSessionToken] = useState<string | null>(null);
    const [showDraftPrompt, setShowDraftPrompt] = useState(false);
    const [pendingDraftData, setPendingDraftData] = useState<any>(null);

    // Meta Data State
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [classes, setClasses] = useState<ClassRoom[]>([]);
    const [terms, setTerms] = useState<Term[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        // Bio
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '' as 'Male' | 'Female' | '',
        dob: '',
        nationality: 'Ghanaian',
        address: '',
        city: '',

        // Guardian
        guardianName: '',
        guardianRelation: '',
        guardianPhone: '',
        guardianSecondaryPhone: '',
        guardianAddress: '',
        guardianEmail: '',
        guardianOccupation: '',

        // Academic
        academicYearId: 0,
        admissionClassId: 0,
        streamId: null as number | null,
        termId: 0,
        academicYearName: '', // For display
        termName: '', // For display

        // Medical
        medicalNotes: '',
        allergies: '',
        healthConditions: ''
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Generated Account State
    const [generatedAccount, setGeneratedAccount] = useState<{
        indexNumber: string;
        username: string;
        password: string; // temp
    } | null>(null);

    useEffect(() => {
        if (isOpen) {
            const initMeta = async () => {
                try {
                    const [years, classList] = await Promise.all([
                        academicsService.getAcademicYears(),
                        academicsService.getClasses()
                    ]);

                    setAcademicYears(years);
                    setClasses(classList);
                    const active = years.find(y => y.status === 'Active');
                    if (active) {
                        setFormData(prev => ({
                            ...prev,
                            academicYearId: active.id,
                            academicYearName: active.name
                        }));

                        const termList = await academicsService.getTerms(active.id);
                        const filteredTerms = termList.filter(t => t.status !== 'Draft');
                        setTerms(filteredTerms);

                        if (filteredTerms.length > 0) {
                            const activeTerm = filteredTerms.find(t => t.status === 'Active') || filteredTerms[0];
                            setFormData(prev => ({
                                ...prev,
                                termId: activeTerm.id,
                                termName: activeTerm.name
                            }));
                        }
                    }

                    // Reset voucher states when modal opens
                    setVoucherCode('');
                    setVoucherPin('');
                    setVoucherError('');
                    setVoucherSessionToken(null);
                    setShowDraftPrompt(false);
                    setPendingDraftData(null);
                    setCurrentStep('voucher');

                } catch (err) {
                    console.error('Failed to fetch metadata:', err);
                }
            };
            initMeta();
        }
    }, [isOpen]);

    // Save Draft Effect
    useEffect(() => {
        if (!isOpen || !voucherCode || currentStep === 'success') return;

        const saveDraft = () => {
            const draftData = {
                formData,
                currentStep,
                activeSection,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem(`admin_admission_draft_${voucherCode}`, JSON.stringify(draftData));
        };

        const timeoutId = setTimeout(saveDraft, 500);
        return () => clearTimeout(timeoutId);
    }, [formData, currentStep, activeSection, isOpen, voucherCode]);

    // --- Logic ---

    const handleVerifyVoucher = async () => {
        setVoucherError('');
        setIsLoading(true);

        try {
            const response = await evoucherService.verifyVoucher({
                voucher_number: voucherCode.trim(),
                pin: voucherPin.trim()
            });
            if (response.valid) {
                // If valid, move to the next step
                const token = response.voucher_session_token || null;
                setVoucherSessionToken(token);
                if (token) {
                    sessionStorage.setItem(`admin_session_${voucherCode}`, token);
                    sessionStorage.setItem('last_admin_admission_voucher', voucherCode);
                }

                // Sync Academic Year from voucher
                if (response.academic_year_id) {
                    const voucherYear = academicYears.find(y => y.id === response.academic_year_id);
                    if (voucherYear) {
                        setFormData(prev => ({
                            ...prev,
                            academicYearId: voucherYear.id,
                            academicYearName: voucherYear.name
                        }));
                        // Fetch terms for this specific year
                        const yearTerms = await academicsService.getTerms(voucherYear.id);
                        setTerms(yearTerms);

                        // Default to active term if available
                        const activeTerm = yearTerms.find(t => t.status === 'Active');
                        if (activeTerm) {
                            setFormData(prev => ({ ...prev, termId: activeTerm.id, termName: activeTerm.name }));
                        }
                    }
                }

                // Check for draft
                const savedDraft = localStorage.getItem(`admin_admission_draft_${voucherCode}`);
                if (savedDraft) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        if (parsed.formData) {
                            setPendingDraftData(parsed);
                            setShowDraftPrompt(true);
                            return; // Stop here and show prompt
                        }
                    } catch (e) { }
                }

                setCurrentStep('form');
            } else {
                const reasons: Record<string, string> = {
                    'NOT_FOUND': 'Voucher not found. Please check the serial number.',
                    'EXPIRED': 'This voucher has expired.',
                    'USED': 'This voucher has already been used.',
                    'RESERVED': 'This voucher is currently in use in another session. Please try re-verifying to resume.',
                    'INVALID_PIN': 'The PIN you entered is incorrect.'
                };
                setVoucherError(reasons[response.reason || ''] || 'Verification failed. Please try again.');
            }
        } catch (err: any) {
            setVoucherError(err.message || 'Connection failed. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestoreDraft = () => {
        if (pendingDraftData) {
            setFormData(prev => ({ ...prev, ...pendingDraftData.formData }));
            if (pendingDraftData.activeSection) setActiveSection(pendingDraftData.activeSection);

            // Ensure we move to 'form' step even if draft was saved at 'voucher' step
            const targetStep = pendingDraftData.currentStep === 'voucher' ? 'form' : (pendingDraftData.currentStep || 'form');
            setCurrentStep(targetStep);
        }
        setShowDraftPrompt(false);
        setPendingDraftData(null);
    };

    const handleStartFresh = () => {
        localStorage.removeItem(`admin_admission_draft_${voucherCode}`);
        setShowDraftPrompt(false);
        setPendingDraftData(null);
        setCurrentStep('form');
    };

    const validateSection = (section: FormSection | 'all'): boolean => {
        const errors: Record<string, string> = {};

        if (section === 'bio' || section === 'all') {
            if (!formData.firstName.trim()) errors.firstName = 'First name is required';
            if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
            if (!formData.gender) errors.gender = 'Gender is required';
            if (!formData.dob) errors.dob = 'Date of birth is required';
            if (!formData.nationality.trim()) errors.nationality = 'Nationality is required';
        }

        if (section === 'guardian' || section === 'all') {
            if (!formData.guardianName.trim()) errors.guardianName = 'Guardian name is required';
            if (!formData.guardianRelation.trim()) errors.guardianRelation = 'Relationship is required';
            if (!formData.guardianPhone.trim()) errors.guardianPhone = 'Phone number is required';
            if (formData.guardianEmail && !formData.guardianEmail.includes('@')) errors.guardianEmail = 'Invalid email address';
            if (!formData.guardianAddress.trim()) errors.guardianAddress = 'Address is required';
        }

        if (section === 'academic' || section === 'all') {
            if (!formData.admissionClassId) errors.admissionClassId = 'Class is required';
            if (!formData.termId) errors.termId = 'Term is required';
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            setGeneralError('Please correct the highlighted fields before proceeding.');
        } else {
            setGeneralError(null);
        }
        return Object.keys(errors).length === 0;
    };

    const handleNextSection = (next: FormSection) => {
        if (validateSection(activeSection)) {
            setActiveSection(next);
            setGeneralError(null);
        }
    };

    const handleGenerateAccount = async () => {
        if (!validateSection('all')) {
            setGeneralError('Required information is missing in one or more sections. Please review and complete the form.');
            // Jump to first section with errors
            if (!formData.firstName || !formData.lastName || !formData.gender || !formData.dob || !formData.nationality) setActiveSection('bio');
            else if (!formData.guardianName || !formData.guardianRelation || !formData.guardianPhone || !formData.guardianAddress) setActiveSection('guardian');
            else if (!formData.admissionClassId || !formData.termId) setActiveSection('academic');
            return;
        }
        if (!voucherSessionToken) {
            setVoucherError('Voucher session expired. Please verify again.');
            setCurrentStep('voucher');
            return;
        }
        setIsLoading(true);
        setVoucherError('');

        try {
            const payload = {
                voucher_session_token: voucherSessionToken,
                student: {
                    first_name: formData.firstName,
                    middle_name: formData.middleName || null,
                    last_name: formData.lastName,
                    gender: formData.gender as any,
                    date_of_birth: formData.dob,
                    nationality: formData.nationality,
                    address: formData.address || null,
                    city: formData.city || null
                },
                guardians: [{
                    name: formData.guardianName,
                    relationship_type: formData.guardianRelation,
                    phone: formData.guardianPhone,
                    secondary_phone: formData.guardianSecondaryPhone || null,
                    email: formData.guardianEmail || null,
                    address: formData.guardianAddress,
                    occupation: formData.guardianOccupation || null
                }],
                medical: (formData.medicalNotes || formData.allergies || formData.healthConditions) ? {
                    health_conditions: formData.healthConditions || null,
                    allergies: formData.allergies || null,
                    special_needs: formData.medicalNotes || null
                } : null, // Backend expects Optional[StudentMedicalCreate] = None, but JSON null is safer
                placement: {
                    academic_year_id: Number(formData.academicYearId),
                    class_id: Number(formData.admissionClassId),
                    stream_id: formData.streamId ? Number(formData.streamId) : null,
                    term_id: Number(formData.termId)
                }
            };

            const response = await admissionsService.submitAdmission(payload);
            console.log('Admission success:', response);

            // We need to fetch the student account/admission details to get the temp password
            // Since the API returns AdmissionResponse which doesn't have password, 
            // In a real scenario, the backend might return it in create_pending_admission or we'd fetch it.
            // For now, we'll set the ID and use "Sent to Email/Phone" as placeholder if not returned.

            setGeneratedAccount({
                indexNumber: 'Pending',
                username: `std_${response.student_id}`,
                password: response.temp_password || 'Sent via SMS'
            });

            // Store the admission ID for approval step
            (window as any)._lastAdmissionId = response.id;

            setCurrentStep('review');
        } catch (err: any) {
            console.error('Submission failed:', err);
            const errorMsg = err.message || (typeof err.detail === 'string' ? err.detail : 'Submission failed. Please check form data.');
            setVoucherError(errorMsg);

            // Stay on current section to see the error message in the footer
            // Use setFormErrors if we can parse field-specific errors from backend
            if (err.detail && Array.isArray(err.detail)) {
                const newErrors: Record<string, string> = {};
                err.detail.forEach((e: any) => {
                    if (e.loc && e.loc.length > 1) {
                        newErrors[e.loc[e.loc.length - 1]] = e.msg;
                    }
                });
                setFormErrors(newErrors);
                // If we have field errors, jump to the first one's section
                if (Object.keys(newErrors).length > 0) {
                    if (newErrors.first_name || newErrors.last_name || newErrors.date_of_birth) setActiveSection('bio');
                    else if (newErrors.phone || newErrors.address) setActiveSection('guardian');
                    else if (newErrors.class_id) setActiveSection('academic');
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async (status: 'Active' | 'Pending Approval') => {
        const admissionId = (window as any)._lastAdmissionId;
        if (!admissionId) return;

        setIsLoading(true);
        try {
            if (status === 'Active') {
                const response = await admissionsService.approveAdmission(admissionId);
                // On approval, we get the index number
                setGeneratedAccount(prev => prev ? {
                    ...prev,
                    indexNumber: (response as any).student?.index_number || 'GENERATED'
                } : null);
            }

            onSave({
                ...formData,
                status: status === 'Active' ? 'Active' : 'Pending Approval',
                id: admissionId
            });

            if (status === 'Active') {
                setCurrentStep('success');
                // Clear draft on success
                localStorage.removeItem(`admin_admission_draft_${voucherCode}`);
                sessionStorage.removeItem(`admin_session_${voucherCode}`);
                sessionStorage.removeItem('last_admin_admission_voucher');
            } else {
                onClose();
                // If it was just saved as pending, maybe clear but let's keep it until finalized?
                // Actually, for admin flow, if they move to 'Pending Approval', it's registered.
                localStorage.removeItem(`admin_admission_draft_${voucherCode}`);
                sessionStorage.removeItem(`admin_session_${voucherCode}`);
                sessionStorage.removeItem('last_admin_admission_voucher');
            }
        } catch (err: any) {
            alert(`Action failed: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Helpers ---

    const renderVoucherStep = () => (
        <div className="space-y-6 text-center py-8">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <Key size={32} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800">E-Voucher Verification</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                    Enter the E-Voucher details purchased by the student to unlock the admission form.
                </p>
            </div>

            <div className="max-w-sm mx-auto space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                {showDraftPrompt ? (
                    <div className="text-center space-y-4 py-2">
                        <div className="bg-primary-50 p-4 rounded-lg text-primary-700 text-sm font-medium border border-primary-100 italic">
                            An unfinished draft was found for this voucher. How would you like to proceed?
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="w-full bg-white border-slate-200"
                                onClick={handleStartFresh}
                            >
                                Start Fresh
                            </Button>
                            <Button
                                className="w-full"
                                onClick={handleRestoreDraft}
                            >
                                Restore Draft
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        {voucherError && (
                            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 mb-4 text-left">
                                <XCircle size={16} className="shrink-0" />
                                {voucherError}
                            </div>
                        )}

                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-700 uppercase">Voucher Serial Number</label>
                            <input
                                type="text"
                                placeholder="e.g. 12345678"
                                className="w-full text-center tracking-widest font-mono text-lg border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 uppercase"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-700 uppercase">PIN Code</label>
                            <input
                                type="password"
                                placeholder="•••••••"
                                className="w-full text-center tracking-widest font-mono text-lg border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                maxLength={7}
                                value={voucherPin}
                                onChange={(e) => setVoucherPin(e.target.value)}
                            />
                        </div>
                        <Button
                            className="w-full mt-4"
                            size="lg"
                            onClick={handleVerifyVoucher}
                            disabled={!voucherCode || !voucherPin || isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" size={18} />}
                            Verify & Continue
                        </Button>
                    </>
                )}
            </div>
        </div>
    );

    const renderFormStep = () => (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex gap-2 overflow-x-auto pb-4 border-b border-slate-100 mb-6">
                {[
                    { id: 'bio', label: 'Bio Data', icon: User },
                    { id: 'guardian', label: 'Guardian', icon: Users },
                    { id: 'academic', label: 'Academic', icon: School },
                    { id: 'medical', label: 'Medical', icon: Activity }
                ].map((section) => (
                    <button
                        key={section.id}
                        onClick={() => {
                            if (validateSection(activeSection)) {
                                setActiveSection(section.id as FormSection);
                            }
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                            activeSection === section.id
                                ? "bg-primary-600 text-white"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        )}
                    >
                        <section.icon size={16} />
                        {section.label}
                    </button>
                ))}
            </div>

            {generalError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-red-800">Form Validation Error</p>
                        <p className="text-xs text-red-600 mt-1">{generalError}</p>
                    </div>
                    <button onClick={() => setGeneralError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2">
                {activeSection === 'bio' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">Student Bio Data</h4>
                        </div>
                        <div>
                            <LimitedInput
                                label="First Name *"
                                value={formData.firstName}
                                onChange={val => {
                                    setFormData({ ...formData, firstName: val });
                                    if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                                }}
                                maxLength={50}
                                error={formErrors.firstName}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div>
                            <LimitedInput
                                label="Middle Name"
                                value={formData.middleName}
                                onChange={val => setFormData({ ...formData, middleName: val })}
                                maxLength={50}
                                placeholder="Optional"
                            />
                        </div>
                        <div>
                            <LimitedInput
                                label="Last Name *"
                                value={formData.lastName}
                                onChange={val => {
                                    setFormData({ ...formData, lastName: val });
                                    if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: '' });
                                }}
                                maxLength={50}
                                error={formErrors.lastName}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender <span className="text-red-500">*</span></label>
                            <select
                                className={cn(
                                    "w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50",
                                    formErrors.gender && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                value={formData.gender} onChange={e => {
                                    setFormData({ ...formData, gender: e.target.value as any });
                                    if (formErrors.gender) setFormErrors({ ...formErrors, gender: '' });
                                }}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {formErrors.gender && <p className="mt-1 text-xs text-red-500">{formErrors.gender}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                className={cn(
                                    "w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50",
                                    formErrors.dob && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                value={formData.dob} onChange={e => {
                                    setFormData({ ...formData, dob: e.target.value });
                                    if (formErrors.dob) setFormErrors({ ...formErrors, dob: '' });
                                }}
                            />
                            {formErrors.dob && <p className="mt-1 text-xs text-red-500">{formErrors.dob}</p>}
                        </div>
                        <div>
                            <LimitedInput
                                label="Nationality *"
                                value={formData.nationality}
                                onChange={val => {
                                    setFormData({ ...formData, nationality: val });
                                    if (formErrors.nationality) setFormErrors({ ...formErrors, nationality: '' });
                                }}
                                maxLength={50}
                                error={formErrors.nationality}
                            />
                        </div>
                        <div>
                            <LimitedInput
                                label="City / Town"
                                value={formData.city}
                                onChange={val => setFormData({ ...formData, city: val })}
                                maxLength={50}
                                placeholder="e.g Accra"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <LimitedInput
                                textarea
                                label="Residential Address"
                                value={formData.address}
                                onChange={val => setFormData({ ...formData, address: val })}
                                maxLength={255}
                                rows={2}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                            <Button onClick={() => handleNextSection('guardian')}>Next: Guardian Info <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                )}

                {activeSection === 'guardian' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center justify-between mb-3 border-b pb-2">
                                <h4 className="font-bold text-slate-800">Parent / Guardian Information</h4>
                                <Button variant="ghost" size="sm" onClick={() => { setActiveSection('bio'); setGeneralError(null); }}>Back to Bio</Button>
                            </div>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <LimitedInput
                                label="Guardian Full Name *"
                                value={formData.guardianName}
                                onChange={val => {
                                    setFormData({ ...formData, guardianName: val });
                                    if (formErrors.guardianName) setFormErrors({ ...formErrors, guardianName: '' });
                                }}
                                maxLength={100}
                                error={formErrors.guardianName}
                                placeholder="Enter full legal name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Relationship <span className="text-red-500">*</span></label>
                            <select
                                className={cn(
                                    "w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50",
                                    formErrors.guardianRelation && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                value={formData.guardianRelation} onChange={e => {
                                    setFormData({ ...formData, guardianRelation: e.target.value });
                                    if (formErrors.guardianRelation) setFormErrors({ ...formErrors, guardianRelation: '' });
                                }}
                            >
                                <option value="">Select relationship</option>
                                <option value="Father">Father</option>
                                <option value="Mother">Mother</option>
                                <option value="Guardian">Guardian</option>
                                <option value="Other">Other</option>
                            </select>
                            {formErrors.guardianRelation && <p className="mt-1 text-xs text-red-500">{formErrors.guardianRelation}</p>}
                        </div>
                        <div>
                            <LimitedInput
                                label="Phone Number *"
                                value={formData.guardianPhone}
                                onChange={val => {
                                    setFormData({ ...formData, guardianPhone: val });
                                    if (formErrors.guardianPhone) setFormErrors({ ...formErrors, guardianPhone: '' });
                                }}
                                maxLength={11}
                                numericOnly
                                error={formErrors.guardianPhone}
                                placeholder="0XXXX XXXXXX"
                            />
                        </div>
                        <div>
                            <LimitedInput
                                label="Secondary Phone (Optional)"
                                value={formData.guardianSecondaryPhone}
                                onChange={val => setFormData({ ...formData, guardianSecondaryPhone: val })}
                                maxLength={11}
                                numericOnly
                                placeholder="Optional"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <LimitedInput
                                label="Email Address"
                                value={formData.guardianEmail}
                                onChange={val => setFormData({ ...formData, guardianEmail: val })}
                                maxLength={100}
                                error={formErrors.guardianEmail}
                                placeholder="example@domain.com"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <LimitedInput
                                label="Occupation"
                                value={formData.guardianOccupation}
                                onChange={val => setFormData({ ...formData, guardianOccupation: val })}
                                maxLength={100}
                                placeholder="Guardian's work/profession"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <LimitedInput
                                textarea
                                label="Residential Address *"
                                value={formData.guardianAddress}
                                onChange={val => {
                                    setFormData({ ...formData, guardianAddress: val });
                                    if (formErrors.guardianAddress) setFormErrors({ ...formErrors, guardianAddress: '' });
                                }}
                                maxLength={255}
                                rows={2}
                                error={formErrors.guardianAddress}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
                            <Button variant="ghost" onClick={() => setActiveSection('bio')}>Back</Button>
                            <Button onClick={() => handleNextSection('academic')}>Next: Academic <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                )}

                {activeSection === 'academic' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-1 md:col-span-2">
                            <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">Academic Placement</h4>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Admission Class <span className="text-red-500">*</span></label>
                            <select
                                className={cn(
                                    "w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50",
                                    formErrors.admissionClassId && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                value={formData.admissionClassId} onChange={e => {
                                    setFormData({ ...formData, admissionClassId: parseInt(e.target.value) });
                                    if (formErrors.admissionClassId) setFormErrors({ ...formErrors, admissionClassId: '' });
                                }}
                            >
                                <option value={0}>Select Class</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.level})</option>
                                ))}
                            </select>
                            {formErrors.admissionClassId && <p className="mt-1 text-xs text-red-500">{formErrors.admissionClassId}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Stream (Optional)</label>
                            <select
                                className="w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50"
                                value={formData.streamId || 0} onChange={e => setFormData({ ...formData, streamId: parseInt(e.target.value) || null })}
                            >
                                <option value={0}>Select Stream</option>
                                {classes.find(c => c.id === formData.admissionClassId)?.streams?.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                            <input
                                type="text" className="w-full border-2 border-slate-200 rounded-lg shadow-sm bg-slate-50 text-slate-500 focus:ring-primary-500 focus:border-primary-500"
                                value={formData.academicYearName} readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Entry Term <span className="text-red-500">*</span></label>
                            <select
                                className={cn(
                                    "w-full border-2 border-slate-200 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-slate-50",
                                    formErrors.termId && "border-red-500 focus:ring-red-500 focus:border-red-500"
                                )}
                                value={formData.termId} onChange={e => {
                                    setFormData({ ...formData, termId: parseInt(e.target.value) });
                                    if (formErrors.termId) setFormErrors({ ...formErrors, termId: '' });
                                }}
                            >
                                <option value={0}>Select Term</option>
                                {terms.map(t => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                            {formErrors.termId && <p className="mt-1 text-xs text-red-500">{formErrors.termId}</p>}
                        </div>
                        <div className="col-span-1 md:col-span-2 flex justify-between mt-4">
                            <Button variant="ghost" onClick={() => { setActiveSection('guardian'); setGeneralError(null); }}>Back</Button>
                            <Button onClick={() => handleNextSection('medical')}>Next: Medical <ChevronRight size={16} /></Button>
                        </div>
                    </div>
                )}

                {activeSection === 'medical' && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-800 mb-3 border-b pb-2">Medical & Special Notes</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <LimitedInput
                                label="Health Conditions"
                                value={formData.healthConditions}
                                onChange={val => setFormData({ ...formData, healthConditions: val })}
                                maxLength={500}
                                placeholder="e.g Asthma, Diabetic..."
                            />
                            <LimitedInput
                                label="Allergies"
                                value={formData.allergies}
                                onChange={val => setFormData({ ...formData, allergies: val })}
                                maxLength={500}
                                placeholder="Specify any known allergies..."
                            />
                        </div>
                        <div>
                            <LimitedInput
                                textarea
                                label="Special Needs / Notes"
                                value={formData.medicalNotes}
                                onChange={val => setFormData({ ...formData, medicalNotes: val })}
                                maxLength={500}
                                rows={3}
                                placeholder="Enter any important health info or special learning needs..."
                            />
                        </div>

                        <div className="col-span-1 flex justify-between mt-8 border-t pt-4">
                            <Button variant="ghost" onClick={() => { setActiveSection('academic'); setGeneralError(null); }}>Back</Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={handleGenerateAccount}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" size={18} />}
                                Submit & Generate Account
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSuccessStep = () => (
        <div className="text-center space-y-8 py-8 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2 shadow-inner">
                <CheckCircle2 size={56} className="animate-bounce" />
            </div>

            <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Enrollment Complete!</h3>
                <p className="text-slate-500 font-medium">Student has been successfully registered and enrolled.</p>
            </div>

            <div className="max-w-md mx-auto bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 text-left relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Official Credentials</h4>
                        <p className="text-sm text-slate-600 font-bold mt-1">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                    >
                        <Printer size={20} />
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Student Index Number</label>
                        <p className="text-2xl font-mono font-black text-emerald-600 tracking-wider">
                            {generatedAccount?.indexNumber}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Username</label>
                            <p className="font-mono font-bold text-slate-700">{generatedAccount?.username}</p>
                        </div>
                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Temporary Password</label>
                            <p className="font-mono font-bold text-slate-700">{generatedAccount?.password}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                        <div className="text-center p-2 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Academic Year</label>
                            <p className="text-[10px] font-bold text-slate-600">{formData.academicYearName}</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Intake Term</label>
                            <p className="text-[10px] font-bold text-slate-600">{formData.termName}</p>
                        </div>
                        <div className="text-center p-2 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                            <label className="text-[8px] font-black text-slate-400 uppercase block mb-1">Class / KG</label>
                            <p className="text-[10px] font-bold text-emerald-700">{classes.find(c => c.id === formData.admissionClassId)?.name || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-slate-400">
                    <Activity size={16} />
                    <p className="text-[11px] font-bold italic">Account is now active. Please provide these to the parent/guardian.</p>
                </div>
            </div>

            <div className="pt-4">
                <Button
                    className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold shadow-xl shadow-slate-200 transition-all hover:-translate-y-1"
                    onClick={onClose}
                >
                    Close & Finish
                </Button>
            </div>
        </div>
    );

    const renderReviewStep = () => (
        <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-in zoom-in duration-300">
                <CheckCircle2 size={48} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-800">Admission Successful!</h3>
                <p className="text-slate-500 max-w-md mx-auto mt-2">
                    Student account has been auto-generated. Please print these details for the student.
                </p>
            </div>

            {generatedAccount && (
                <div className="max-w-md mx-auto bg-slate-50 border-2 border-slate-200 border-dashed rounded-xl p-6 text-left relative">
                    <div className="absolute top-4 right-4 text-slate-300">
                        <span title="Print Credentials">
                            <Printer size={24} className="cursor-pointer hover:text-slate-500" />
                        </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Student Credentials</h4>

                    <div className="space-y-4">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                            <p className="text-xs text-slate-400 font-bold uppercase">Index Number</p>
                            <p className="text-lg font-mono font-bold text-slate-800">{generatedAccount.indexNumber}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-400 font-bold uppercase">Username</p>
                                <p className="font-mono text-slate-800">{generatedAccount.username}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200">
                                <p className="text-xs text-slate-400 font-bold uppercase">Temp Password</p>
                                <p className="font-mono text-slate-800">{generatedAccount.password}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
                <Button variant="outline" onClick={() => handleFinalSubmit('Pending Approval')}>
                    Save as Pending
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 min-w-[150px]" onClick={() => handleFinalSubmit('Active')}>
                    Approve & Enrol
                </Button>
            </div>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            title={currentStep === 'voucher' ? "New Admission - Step 1/3" : currentStep === 'form' ? "New Admission - Step 2/3" : "Admission Complete - Step 3/3"}
        >
            <div className="min-h-[400px] max-h-[calc(100vh-250px)] overflow-y-auto overflow-x-hidden flex flex-col">
                {currentStep === 'voucher' && renderVoucherStep()}
                {currentStep === 'form' && (
                    <div className="flex-1 overflow-y-auto pr-2">
                        {renderFormStep()}
                    </div>
                )}
                {currentStep === 'review' && renderReviewStep()}
                {currentStep === 'success' && renderSuccessStep()}
            </div>
        </Modal>
    );
};
