// Store de páginas usando localStorage
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

const STORAGE_KEY = 'cms-seo-pages';

export function getPages(): PageData[] {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

export function savePage(page: Omit<PageData, 'id' | 'createdAt' | 'updatedAt'>): PageData {
    const pages = getPages();
    const newPage: PageData = {
        ...page,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    pages.push(newPage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    return newPage;
}

export function updatePage(id: string, updates: Partial<PageData>): PageData | null {
    const pages = getPages();
    const index = pages.findIndex(p => p.id === id);
    if (index === -1) return null;

    pages[index] = { ...pages[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
    return pages[index];
}

export function deletePage(id: string): boolean {
    const pages = getPages();
    const filtered = pages.filter(p => p.id !== id);
    if (filtered.length === pages.length) return false;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

export function getPageBySlug(slug: string): PageData | null {
    const pages = getPages();
    return pages.find(p => p.slug === slug && p.active) || null;
}

export function getPageById(id: string): PageData | null {
    const pages = getPages();
    return pages.find(p => p.id === id) || null;
}

export function togglePageActive(id: string): PageData | null {
    const pages = getPages();
    const page = pages.find(p => p.id === id);
    if (!page) return null;
    return updatePage(id, { active: !page.active });
}

export function duplicatePage(id: string, newLocation: string, newSlug: string, geo: { lat: number; lng: number; cep: string; zona: string; referencia: string; address: string }): PageData | null {
    const page = getPageById(id);
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
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'admin123';

export function login(username: string, password: string): boolean {
    // Check if custom credentials exist
    const stored = localStorage.getItem('cms-seo-credentials');
    if (stored) {
        const creds = JSON.parse(stored);
        if (username === creds.username && password === creds.password) {
            localStorage.setItem(AUTH_KEY, JSON.stringify({ username, loggedAt: Date.now() }));
            return true;
        }
        return false;
    }

    // Default credentials
    if (username === DEFAULT_USER && password === DEFAULT_PASS) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ username, loggedAt: Date.now() }));
        return true;
    }
    return false;
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

export function changePassword(newUsername: string, newPassword: string): void {
    localStorage.setItem('cms-seo-credentials', JSON.stringify({ username: newUsername, password: newPassword }));
}
