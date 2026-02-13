import { fetchApi } from './api';

export interface AdmissionWizardSubmit {
    voucher_session_token: string;
    student: any;
    guardians: any[];
    medical?: any;
    placement: {
        academic_year_id: number;
        class_id: number;
        stream_id?: number | null;
        term_id: number;
    };
}

export interface AdmissionResponse {
    id: number;
    student_id: number;
    academic_year_id: number;
    class_id: number;
    stream_id: number | null;
    term_id: number;
    voucher_id: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    student_name: string;
    voucher_number: string;
    class_name: string;
    academic_year_name: string;
    term_name: string;
    approved_by_admin_id: number | null;
    approved_at: string | null;
    created_at: string;
    temp_password?: string;
    student_index_number?: string;
}

export interface AdmissionFilters {
    status?: string;
    class_id?: number | string;
    academic_year_id?: number | string;
    term_id?: number | string;
    search?: string;
}

export const admissionsService = {
    submitAdmission: async (data: AdmissionWizardSubmit): Promise<AdmissionResponse> => {
        return fetchApi<AdmissionResponse>('/admissions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    listAdmissions: async (filters: AdmissionFilters = {}): Promise<AdmissionResponse[]> => {
        const query = new URLSearchParams();
        if (filters.status) query.append('status', filters.status);
        if (filters.class_id) query.append('class_id', filters.class_id.toString());
        if (filters.academic_year_id) query.append('academic_year_id', filters.academic_year_id.toString());
        if (filters.term_id) query.append('term_id', filters.term_id.toString());
        if (filters.search) query.append('search', filters.search);

        const queryString = query.toString();
        return fetchApi<AdmissionResponse[]>(`/admissions/${queryString ? `?${queryString}` : ''}`);
    },

    getAdmission: async (id: number): Promise<AdmissionResponse> => {
        return fetchApi<AdmissionResponse>(`/admissions/${id}`);
    },

    approveAdmission: async (id: number): Promise<AdmissionResponse> => {
        return fetchApi<AdmissionResponse>(`/admissions/${id}/approve`, {
            method: 'POST',
        });
    },

    rejectAdmission: async (id: number): Promise<AdmissionResponse> => {
        return fetchApi<AdmissionResponse>(`/admissions/${id}/reject`, {
            method: 'POST',
        });
    }
};
