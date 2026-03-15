// Store de páginas usando API MySQL
export interface PageData {
    id: string;
    keyword: string;
    location: string;
    slug: string;
    lat: number;
    lng: number;
    address: string;
    cep: string;
    zona: string;
    referencia: string;
    whatsapp: string;
    phone: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

const API_BASE = '/api';

export async function getPages(): Promise<PageData[]> {
    try {
        const response = await fetch(`${API_BASE}/pages`);
        if (!response.ok) throw new Error('Failed to fetch pages');
        return await response.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

export async function savePage(page: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): Promise<PageData | null> {
    try {
        const response = await fetch(`${API_BASE}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(page),
        });
        if (!response.ok) throw new Error('Failed to save page');
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function updatePage(id: string, updates: Partial<PageData>): Promise<PageData | null> {
    try {
        const response = await fetch(`${API_BASE}/pages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error('Failed to update page');
        return await response.json();
    } catch (err) {
        console.error(err);
        return null;
    }
}

export async function deletePage(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/pages/${id}`, {
            method: 'DELETE',
        });
        return response.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function getPageBySlug(slug: string): Promise<PageData | null> {
    const pages = await getPages();
    return pages.find(p => p.slug === slug && p.active) || null;
}

export async function getPageById(id: string): Promise<PageData | null> {
    const pages = await getPages();
    return pages.find(p => p.id === id) || null;
}

export async function togglePageActive(id: string): Promise<PageData | null> {
    const page = await getPageById(id);
    if (!page) return null;
    return updatePage(id, { active: !page.active });
}

export async function duplicatePage(id: string, newLocation: string, newSlug: string, geo: { lat: number; lng: number; cep: string; zona: string; referencia: string; address: string }): Promise<PageData | null> {
    const page = await getPageById(id);
    if (!page) return null;

    return savePage({
        keyword: page.keyword,
        location: newLocation,
        slug: newSlug,
        lat: geo.lat,
        lng: geo.lng,
        address: geo.address,
        cep: geo.cep,
        zona: geo.zona,
        referencia: geo.referencia,
        whatsapp: page.whatsapp,
        phone: page.phone,
        active: true,
    });
}

// Auth
const AUTH_KEY = 'cms-seo-auth';

export async function login(username: string, password: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(AUTH_KEY, JSON.stringify({ username: data.username, loggedAt: Date.now() }));
            return true;
        }
        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function logout(): void {
    localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
    const auth = localStorage.getItem(AUTH_KEY);
    if (!auth) return false;
    try {
        const data = JSON.parse(auth);
        // Expire after 24h
        return Date.now() - data.loggedAt < 24 * 60 * 60 * 1000;
    } catch {
        return false;
    }
}

export async function changePassword(newUsername: string, newPassword: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/auth/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: newUsername, password: newPassword }),
        });
        return response.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}
