export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('student_token') || localStorage.getItem('token');

    const headers = new Headers(options.headers || {});
    if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    // Read body safely
    const body = isJson ? await response.json().catch(() => null) : await response.text();

    if (!response.ok) {
        let message = '';
        if (typeof body === "string") {
            message = body;
        } else if (body?.detail) {
            // FastAPI validation errors are usually in 'detail'
            message = typeof body.detail === 'string'
                ? body.detail
                : JSON.stringify(body.detail, null, 2);
        } else {
            message = body?.message || JSON.stringify(body);
        }

        throw new Error(`API ${response.status}: ${message}`);
    }

    return body as T;
}
