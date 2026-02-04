import { fetchApi } from './api';

export interface AuthResponse {
    access_token: string;
    token_type: string;
    must_change_password: boolean;
    student_name: string;
    index_number: string;
}

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/students/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    changePassword: async (current_password: string, new_password: string): Promise<any> => {
        const token = localStorage.getItem('student_token');
        return fetchApi('/students/change-password', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ current_password, new_password }),
        });
    },

    setSession: (data: AuthResponse) => {
        localStorage.setItem('student_token', data.access_token);
        localStorage.setItem('student_name', data.student_name);
        localStorage.setItem('index_number', data.index_number);
        localStorage.setItem('must_change_password', String(data.must_change_password));
    },

    getSession: () => {
        return {
            token: localStorage.getItem('student_token'),
            name: localStorage.getItem('student_name'),
            indexNumber: localStorage.getItem('index_number'),
            mustChangePassword: localStorage.getItem('must_change_password') === 'true'
        };
    },

    logout: () => {
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_name');
        localStorage.removeItem('index_number');
        localStorage.removeItem('must_change_password');
    }
};
