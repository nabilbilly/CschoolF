import { fetchApi } from './api';

export interface AcademicYear {
    id: number;
    name: string;
    status: 'Active' | 'Draft' | 'Archived';
}

export interface EVoucher {
    id: number;
    voucher_number: string;
    pin?: string; // Only present on creation
    academic_year_id: number;
    status: 'Unused' | 'Reserved' | 'Used' | 'Expired' | 'Revoked';
    expires_at: string;
    reserved_at?: string;
    used_at?: string;
    created_at: string;
}

export interface CreateVoucherParams {
    academic_year_id: number;
    count: number;
    expires_at: string;
}

export interface PaginatedResponse<T> {
    items: T;
    total: number;
    page: number;
    size: number;
}

export const evoucherService = {
    // Academic Years
    getAcademicYears: () => fetchApi<AcademicYear[]>('/academics/'),

    // Vouchers
    getVouchers: (academicYearId?: number, status?: string, page: number = 1, size: number = 50) => {
        const params = new URLSearchParams();
        if (academicYearId) params.append('academic_year_id', academicYearId.toString());
        if (status) params.append('status', status);
        params.append('page', page.toString());
        params.append('size', size.toString());
        return fetchApi<PaginatedResponse<EVoucher[]>>(`/evoucher/admin/vouchers?${params.toString()}`);
    },

    createVouchers: (data: CreateVoucherParams) =>
        fetchApi<EVoucher[]>('/evoucher/admin/vouchers', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    cleanupReservations: () =>
        fetchApi<{ success: boolean, message: string }>('/evoucher/admin/cleanup-reservations', {
            method: 'DELETE',
        }),

    verifyVoucher: (data: { voucher_number: string, pin: string }) =>
        fetchApi<{
            valid: boolean,
            voucher_session_token?: string,
            reason?: string,
            expires_at?: string,
            academic_year_id?: number
        }>('/evoucher/verify', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    checkSession: (sessionToken: string) =>
        fetchApi<{
            valid: boolean,
            reason?: string,
            expires_at?: string,
            academic_year_id?: number
        }>(`/evoucher/check-session/${sessionToken}`),
};
