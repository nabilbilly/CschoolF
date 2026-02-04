import { fetchApi } from './api';

export interface StudentResponse {
    id: number;
    index_number: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    gender: 'Male' | 'Female';
    date_of_birth: string;
    nationality: string;
    address: string | null;
    city: string | null;
    photo: string | null;
    created_at: string;

    // Enrollment details added via backend properties
    current_class: string;
    current_stream: string;
    status: string;
    admission_year: string;
    class_id?: number;
    stream_id?: number;
    pending_admission_id?: number;
    ghana_card?: string;
    disability_status?: string;

    // Relationships
    guardians?: any[];
    medical?: any;
    account?: {
        username: string;
        is_active: boolean;
    };
}

export interface StudentFilters {
    search?: string;
    status?: string;
    academic_year_id?: number | string;
    class_id?: number | string;
}

export const studentsService = {
    listStudents: async (filters: StudentFilters = {}): Promise<StudentResponse[]> => {
        const query = new URLSearchParams();
        if (filters.search) query.append('search', filters.search);
        if (filters.status && filters.status !== 'All') query.append('status', filters.status);
        if (filters.academic_year_id) query.append('academic_year_id', filters.academic_year_id.toString());
        if (filters.class_id) query.append('class_id', filters.class_id.toString());

        const queryString = query.toString();
        return fetchApi<StudentResponse[]>(`/students/${queryString ? `?${queryString}` : ''}`);
    },

    getStudent: async (id: number): Promise<StudentResponse> => {
        return fetchApi<StudentResponse>(`/students/${id}`);
    },

    getProfile: async (): Promise<StudentResponse> => {
        return fetchApi<StudentResponse>(`/students/me/profile`);
    },

    updateStudent: async (id: number, data: any): Promise<StudentResponse> => {
        return fetchApi<StudentResponse>(`/students/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    resetPassword: async (id: number, newPassword: string): Promise<{ message: string, success: boolean }> => {
        return fetchApi<{ message: string, success: boolean }>(`/students/${id}/reset-password`, {
            method: 'POST',
            body: JSON.stringify({ current_password: 'ADMIN_RESET', new_password: newPassword }),
        });
    }
};
