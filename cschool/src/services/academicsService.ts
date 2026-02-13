import { fetchApi } from './api';

export type YearStatus = 'Active' | 'Draft' | 'Archived';
export type TermStatus = 'Active' | 'Draft' | 'Closed';

export interface Term {
    id: number;
    academic_year_id: number;
    name: string;
    status: TermStatus;
    sequence: number;
    start_date: string | null;
    end_date: string | null;
    result_open_date: string | null;
    result_close_date: string | null;
}

export interface AcademicYear {
    id: number;
    name: string;
    status: YearStatus;
    start_date: string | null;
    end_date: string | null;
    terms?: Term[];
}

export interface AcademicYearCreate {
    name: string;
    status?: YearStatus;
    start_date?: string | null;
    end_date?: string | null;
}

export interface AcademicYearUpdate {
    name?: string;
    status?: YearStatus;
    start_date?: string | null;
    end_date?: string | null;
}

export interface TermCreate {
    name: string;
    status?: TermStatus;
    sequence?: number;
    start_date?: string | null;
    end_date?: string | null;
    result_open_date?: string | null;
    result_close_date?: string | null;
}

export interface TermUpdate {
    name?: string;
    status?: TermStatus;
    sequence?: number;
    start_date?: string | null;
    end_date?: string | null;
    result_open_date?: string | null;
    result_close_date?: string | null;
}

export interface ClassRoom {
    id: number;
    name: string;
    level: string;
    streams?: Stream[];
}

export interface Stream {
    id: number;
    class_id: number;
    name: string;
}

export const academicsService = {
    // Academic Years
    getAcademicYears: async (): Promise<AcademicYear[]> => {
        return fetchApi<AcademicYear[]>('/academics/');
    },

    createAcademicYear: async (data: AcademicYearCreate): Promise<AcademicYear> => {
        return fetchApi<AcademicYear>('/academics/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateAcademicYear: async (id: number, data: AcademicYearUpdate): Promise<AcademicYear> => {
        return fetchApi<AcademicYear>(`/academics/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteAcademicYear: async (id: number): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>(`/academics/${id}`, {
            method: 'DELETE',
        });
    },

    // Terms
    getTerms: async (yearId: number): Promise<Term[]> => {
        return fetchApi<Term[]>(`/academics/${yearId}/terms`);
    },

    createTerm: async (yearId: number, data: TermCreate): Promise<Term> => {
        return fetchApi<Term>(`/academics/${yearId}/terms`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateTerm: async (termId: number, data: TermUpdate): Promise<Term> => {
        return fetchApi<Term>(`/academics/terms/${termId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteTerm: async (termId: number): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>(`/academics/terms/${termId}`, {
            method: 'DELETE',
        });
    },

    // Classes & Streams
    getClasses: async (): Promise<ClassRoom[]> => {
        return fetchApi<ClassRoom[]>('/academics/classes');
    },

    createClass: async (data: { name: string, level: string }): Promise<ClassRoom> => {
        return fetchApi<ClassRoom>('/academics/classes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    getStreams: async (classId: number): Promise<Stream[]> => {
        return fetchApi<Stream[]>(`/academics/classes/${classId}/streams`);
    },

    createStream: async (data: { class_id: number, name: string }): Promise<Stream> => {
        return fetchApi<Stream>('/academics/streams', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateClass: async (id: number, data: { name?: string, level?: string }): Promise<ClassRoom> => {
        return fetchApi<ClassRoom>(`/academics/classes/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteClass: async (id: number): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>(`/academics/classes/${id}`, {
            method: 'DELETE',
        });
    },

    updateStream: async (id: number, data: { name?: string }): Promise<Stream> => {
        return fetchApi<Stream>(`/academics/streams/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    deleteStream: async (id: number): Promise<{ message: string }> => {
        return fetchApi<{ message: string }>(`/academics/streams/${id}`, {
            method: 'DELETE',
        });
    }
};
