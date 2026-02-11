import { API_BASE_URL } from './api';

export interface UploadResponse {
    url: string;
    filename: string;
}

export const mediaService = {
    uploadImage: async (file: File): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token') || localStorage.getItem('student_token');

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/media/upload`, {
            method: 'POST',
            body: formData,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
            throw new Error(error.detail || 'Upload failed');
        }

        return response.json();
    }
};
