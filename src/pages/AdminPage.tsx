import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    isAuthenticated, logout, getPages, savePage, deletePage, togglePageActive, duplicatePage, changePassword,
    type PageData
} from '../lib/pageStore';
import {
    bairrosSP, getZonas, getBairrosByZona, generateSlug, type BairroData
} from '../lib/geoData';
import {
    Laptop, LogOut, Plus, Trash2, Eye, Copy, Power, Search, MapPin, Globe,
    FileText, Settings, ChevronDown, X, Map, Hash, CheckCircle2,
    BarChart3, Layers, Filter, Lock, Save, AlertCircle, Zap, List, Loader2,
    Download, Link2, Database, CheckCircle, HardDrive,
    Server, ArrowRight, XCircle, Wifi, WifiOff, ExternalLink, CloudUpload
} from 'lucide-react';

export default function AdminPage() {
    const navigate = useNavigate();
    const [pages, setPages] = useState<PageData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterZona, setFilterZona] = useState('');
    const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showBulkGenerateModal, setShowBulkGenerateModal] = useState(false);
    const [duplicateSourceId, setDuplicateSourceId] = useState<string>('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Bulk generate form
    const [bulkKeywords, setBulkKeywords] = useState('Conserto de Notebook\nAssistência Técnica Notebook\nReparo de Notebook');
    const [bulkBairros, setBulkBairros] = useState<string[]>([]);
    const [bulkZona, setBulkZona] = useState('');
    const [bulkWhatsapp, setBulkWhatsapp] = useState('5511999999999');
    const [bulkPhone, setBulkPhone] = useState('(11) 99999-9999');
    const [bulkGenerating, setBulkGenerating] = useState(false);
    const [bulkResult, setBulkResult] = useState<{ created: number; skipped: number } | null>(null);

    // Sitemap
    const [showSitemapModal, setShowSitemapModal] = useState(false);
    const [sitemapDomain, setSitemapDomain] = useState('https://notebookmastersp.com.br');
    const [sitemapFreq, setSitemapFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [sitemapGenerated, setSitemapGenerated] = useState(false);
    const [sitemapSaving, setSitemapSaving] = useState(false);
    const [sitemapError, setSitemapError] = useState('');

    // Backup & Deploy
    const [showBackupModal, setShowBackupModal] = useState(false);

    // Migration state
    const [migrateStep, setMigrateStep] = useState<'form' | 'testing' | 'migrating' | 'success' | 'error'>('form');
    const [migrateServerUrl, setMigrateServerUrl] = useState('');
    const [migrateDbHost, setMigrateDbHost] = useState('localhost');
    const [migrateDbName, setMigrateDbName] = useState('');
    const [migrateDbUser, setMigrateDbUser] = useState('');
    const [migrateDbPass, setMigrateDbPass] = useState('');
    const [migrateDbPrefix, setMigrateDbPrefix] = useState('cms_');
    const [migrateDomain, setMigrateDomain] = useState('');
    const [migrateSiteName, setMigrateSiteName] = useState('Notebook Master SP');
    const [migrateWhatsapp, setMigrateWhatsapp] = useState('');
    const [migratePhone, setMigratePhone] = useState('');
    const [migrateAdminUser, setMigrateAdminUser] = useState('admin');
    const [migrateAdminPass, setMigrateAdminPass] = useState('');
    const [migrateConnectionOk, setMigrateConnectionOk] = useState<boolean | null>(null);
    const [migrateError, setMigrateError] = useState('');
    const [migrateLog, setMigrateLog] = useState<string[]>([]);
    const [migrateResult, setMigrateResult] = useState<any>(null);

    // Create form
    const [formKeyword, setFormKeyword] = useState('Conserto de Notebook');
    const [formZona, setFormZona] = useState('');
    const [formBairro, setFormBairro] = useState('');
    const [formAddress, setFormAddress] = useState('');
    const [formWhatsapp, setFormWhatsapp] = useState('5511999999999');
    const [formPhone, setFormPhone] = useState('(11) 99999-9999');

    // Duplicate form
    const [dupBairros, setDupBairros] = useState<string[]>([]);
    const [dupZona, setDupZona] = useState('');

    // Settings
    const [settingsUser, setSettingsUser] = useState('');
    const [settingsPass, setSettingsPass] = useState('');
    const [settingsMsg, setSettingsMsg] = useState('');

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
            return;
        }
        refreshPages();
    }, [navigate]);

    const refreshPages = () => setPages(getPages());

    const selectedBairro = useMemo(() => {
        return bairrosSP.find(b => b.nome === formBairro);
    }, [formBairro]);

    const previewSlug = useMemo(() => {
        if (formKeyword && formBairro) {
            return generateSlug(formKeyword, formBairro);
        }
        return '';
    }, [formKeyword, formBairro]);

    const filteredPages = useMemo(() => {
        return pages.filter(p => {
            const matchSearch = !searchTerm ||
                p.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.slug.toLowerCase().includes(searchTerm.toLowerCase());
            const matchZona = !filterZona || p.zona === filterZona;
            const matchActive = filterActive === 'all' ||
                (filterActive === 'active' && p.active) ||
                (filterActive === 'inactive' && !p.active);
            return matchSearch && matchZona && matchActive;
        });
    }, [pages, searchTerm, filterZona, filterActive]);

    const stats = useMemo(() => ({
        total: pages.length,
        active: pages.filter(p => p.active).length,
        inactive: pages.filter(p => !p.active).length,
        zonas: new Set(pages.map(p => p.zona)).size,
    }), [pages]);

    const handleCreate = () => {
        if (!formKeyword || !formBairro || !selectedBairro) return;

        savePage({
            keyword: formKeyword,
            location: formBairro,
            slug: previewSlug,
            lat: selectedBairro.geo.lat,
            lng: selectedBairro.geo.lng,
            address: formAddress || `${selectedBairro.referencia}, ${formBairro}`,
            cep: selectedBairro.cep,
            zona: selectedBairro.zona,
            referencia: selectedBairro.referencia,
            whatsapp: formWhatsapp,
            phone: formPhone,
            active: true,
        });

        setShowCreateModal(false);
        resetForm();
        refreshPages();
    };

    const handleBulkDuplicate = () => {
        if (!duplicateSourceId || dupBairros.length === 0) return;

        dupBairros.forEach(bairroNome => {
            const bairro = bairrosSP.find(b => b.nome === bairroNome);
            if (!bairro) return;

            const source = pages.find(p => p.id === duplicateSourceId);
            if (!source) return;

            const slug = generateSlug(source.keyword, bairroNome);
            // Check if slug already exists
            if (pages.find(p => p.slug === slug)) return;

            duplicatePage(duplicateSourceId, bairroNome, slug, {
                lat: bairro.geo.lat,
                lng: bairro.geo.lng,
                cep: bairro.cep,
                zona: bairro.zona,
                referencia: bairro.referencia,
                address: `${bairro.referencia}, ${bairroNome}`,
            });
        });

        setShowDuplicateModal(false);
        setDupBairros([]);
        setDupZona('');
        refreshPages();
    };

    const handleBulkGenerate = async () => {
        const keywords = bulkKeywords
            .split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (keywords.length === 0 || bulkBairros.length === 0) return;

        setBulkGenerating(true);
        setBulkResult(null);

        let created = 0;
        let skipped = 0;
        const currentPages = getPages();
        const existingSlugs = new Set(currentPages.map(p => p.slug));

        for (const keyword of keywords) {
            for (const bairroNome of bulkBairros) {
                const bairro = bairrosSP.find(b => b.nome === bairroNome);
                if (!bairro) { skipped++; continue; }

                const slug = generateSlug(keyword, bairroNome);
                if (existingSlugs.has(slug)) { skipped++; continue; }

                savePage({
                    keyword,
                    location: bairroNome,
                    slug,
                    lat: bairro.geo.lat,
                    lng: bairro.geo.lng,
                    address: `${bairro.referencia}, ${bairroNome}`,
                    cep: bairro.cep,
                    zona: bairro.zona,
                    referencia: bairro.referencia,
                    whatsapp: bulkWhatsapp,
                    phone: bulkPhone,
                    active: true,
                });

                existingSlugs.add(slug);
                created++;
            }
        }

        // Small delay for UX
        await new Promise(r => setTimeout(r, 500));
        setBulkGenerating(false);
        setBulkResult({ created, skipped });
        refreshPages();
    };

    const bulkParsedKeywords = useMemo(() => {
        return bulkKeywords.split('\n').map(k => k.trim()).filter(k => k.length > 0);
    }, [bulkKeywords]);

    const bulkPreviewCount = useMemo(() => {
        if (bulkParsedKeywords.length === 0 || bulkBairros.length === 0) return { total: 0, new: 0, existing: 0 };
        const existingSlugs = new Set(pages.map(p => p.slug));
        let newCount = 0;
        let existingCount = 0;
        for (const kw of bulkParsedKeywords) {
            for (const b of bulkBairros) {
                const slug = generateSlug(kw, b);
                if (existingSlugs.has(slug)) existingCount++;
                else newCount++;
            }
        }
        return { total: bulkParsedKeywords.length * bulkBairros.length, new: newCount, existing: existingCount };
    }, [bulkParsedKeywords, bulkBairros, pages]);

    const toggleBulkBairro = (nome: string) => {
        setBulkBairros(prev =>
            prev.includes(nome) ? prev.filter(b => b !== nome) : [...prev, nome]
        );
    };

    const selectAllBulkBairrosFromZona = (zona: string) => {
        const bairros = getBairrosByZona(zona);
        setBulkBairros(prev => {
            const newNames = bairros.map(b => b.nome).filter(n => !prev.includes(n));
            return [...prev, ...newNames];
        });
    };

    const deselectAllBulkBairros = () => {
        setBulkBairros([]);
    };

    const selectAllBulkBairros = () => {
        setBulkBairros(bairrosSP.map(b => b.nome));
    };

    const generateSitemap = async () => {
        const activePages = pages.filter(p => p.active);
        const domain = sitemapDomain.replace(/\/$/, '');
        const now = new Date().toISOString().split('T')[0];

        const urls = [
            // Homepage
            `  <url>\n    <loc>${domain}/</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${sitemapFreq}</changefreq>\n    <priority>1.0</priority>\n  </url>`,
            // Generated pages
            ...activePages.map(page => {
                const updDate = page.updatedAt ? page.updatedAt.split('T')[0] : now;
                return `  <url>\n    <loc>${domain}/${page.slug}</loc>\n    <lastmod>${updDate}</lastmod>\n    <changefreq>${sitemapFreq}</changefreq>\n    <priority>0.8</priority>\n    <geo:geo>\n      <geo:format>georss</geo:format>\n    </geo:geo>\n  </url>`;
            })
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:geo="http://www.google.com/geo/schemas/sitemap/1.0"\n>\n${urls.join('\n')}\n</urlset>`;

        // Save to server via API
        setSitemapSaving(true);
        setSitemapError('');
        setSitemapGenerated(false);

        try {
            const response = await fetch('/api/sitemap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: xml, domain }),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSitemapGenerated(true);
            } else {
                setSitemapError(result.error || 'Erro ao salvar sitemap');
            }
        } catch (err) {
            setSitemapError('Erro ao conectar com o servidor. Verifique se o servidor está rodando.');
        } finally {
            setSitemapSaving(false);
        }
    };

    const resetForm = () => {
        setFormBairro('');
        setFormAddress('');
        setFormZona('');
    };

    const handleDelete = (id: string) => {
        deletePage(id);
        setDeleteConfirm(null);
        refreshPages();
    };

    const handleToggle = (id: string) => {
        togglePageActive(id);
        refreshPages();
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSaveSettings = () => {
        if (settingsUser && settingsPass) {
            changePassword(settingsUser, settingsPass);
            setSettingsMsg('Credenciais atualizadas com sucesso!');
            setTimeout(() => setSettingsMsg(''), 3000);
        }
    };

    // --- Migration handlers ---
    const resetMigration = () => {
        setMigrateStep('form');
        setMigrateError('');
        setMigrateLog([]);
        setMigrateResult(null);
        setMigrateConnectionOk(null);
    };

    const handleTestConnection = async () => {
        setMigrateStep('testing');
        setMigrateError('');
        setMigrateConnectionOk(null);
        try {
            const serverUrl = migrateServerUrl.replace(/\/$/, '');
            const res = await fetch(`${serverUrl}/migrate.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'test_connection',
                    db_host: migrateDbHost,
                    db_name: migrateDbName,
                    db_user: migrateDbUser,
                    db_pass: migrateDbPass,
                    db_prefix: migrateDbPrefix,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMigrateConnectionOk(true);
            } else {
                setMigrateConnectionOk(false);
                setMigrateError(data.error || 'Falha na conexão');
            }
        } catch (err) {
            setMigrateConnectionOk(false);
            setMigrateError('Não foi possível conectar ao servidor. Verifique a URL e se o migrate.php foi enviado.');
        } finally {
            setMigrateStep('form');
        }
    };

    const handleMigrate = async () => {
        setMigrateStep('migrating');
        setMigrateError('');
        setMigrateLog([]);
        setMigrateResult(null);

        const serverUrl = migrateServerUrl.replace(/\/$/, '');
        const allPages = getPages();

        const addLog = (msg: string) => setMigrateLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

        try {
            addLog(`Iniciando migração de ${allPages.length} páginas...`);

            const res = await fetch(`${serverUrl}/migrate.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'full_migrate',
                    db_host: migrateDbHost,
                    db_name: migrateDbName,
                    db_user: migrateDbUser,
                    db_pass: migrateDbPass,
                    db_prefix: migrateDbPrefix,
                    site_domain: migrateDomain,
                    site_name: migrateSiteName,
                    admin_user: migrateAdminUser,
                    admin_pass: migrateAdminPass,
                    whatsapp: migrateWhatsapp,
                    phone: migratePhone,
                    pages: allPages,
                }),
            });

            const data = await res.json();

            if (data.success) {
                addLog('Migração concluída com sucesso!');
                setMigrateResult(data);
                setMigrateStep('success');
            } else {
                addLog(`Erro: ${data.error}`);
                setMigrateError(data.error || 'Erro na migração');
                setMigrateStep('error');
            }
        } catch (err) {
            addLog('Erro de conexão com o servidor');
            setMigrateError('Não foi possível conectar ao servidor. Verifique a URL e tente novamente.');
            setMigrateStep('error');
        }
    };





    const openDuplicate = (id: string) => {
        setDuplicateSourceId(id);
        setDupBairros([]);
        setDupZona('');
        setShowDuplicateModal(true);
    };

    const toggleDupBairro = (nome: string) => {
        setDupBairros(prev =>
            prev.includes(nome) ? prev.filter(b => b !== nome) : [...prev, nome]
        );
    };

    const selectAllBairrosFromZona = (zona: string) => {
        const bairros = getBairrosByZona(zona);
        const existingSlugs = pages.map(p => p.slug);
        const source = pages.find(p => p.id === duplicateSourceId);
        if (!source) return;

        const available = bairros.filter(b => {
            const slug = generateSlug(source.keyword, b.nome);
            return !existingSlugs.includes(slug);
        });

        setDupBairros(available.map(b => b.nome));
    };

    return (
        <div className="min-h-screen bg-[hsl(var(--black))] text-white">
            {/* Top Bar */}
            <header className="sticky top-0 z-50 bg-[hsl(var(--black))]/95 backdrop-blur-md border-b border-[hsl(var(--gold))]/10">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center">
                                <Laptop className="w-5 h-5 text-[hsl(var(--black))]" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-gradient-gold">CMS SEO Manager</h1>
                                <p className="text-[10px] text-gray-500">Painel de Controle</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSettingsModal(true)}
                                className="p-2 rounded-lg text-gray-400 hover:text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/10 transition-all"
                                title="Configurações"
                            >
                                <Settings className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="card-glass p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-[hsl(var(--gold))]" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gradient-gold">{stats.total}</p>
                                <p className="text-xs text-gray-400">Total de Páginas</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-glass p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                                <p className="text-xs text-gray-400">Páginas Ativas</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-glass p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                <Power className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-red-400">{stats.inactive}</p>
                                <p className="text-xs text-gray-400">Inativas</p>
                            </div>
                        </div>
                    </div>
                    <div className="card-glass p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                <Map className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-400">{stats.zonas}</p>
                                <p className="text-xs text-gray-400">Zonas Cobertas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-lg bg-[hsl(var(--black-light))] border border-[hsl(var(--gold))]/15 text-white placeholder-gray-500 focus:border-[hsl(var(--gold))] focus:outline-none transition-all text-sm"
                            placeholder="Buscar por palavra-chave, localização ou slug..."
                        />
                    </div>

                    <div className="flex gap-3 flex-wrap">
                        <div className="relative">
                            <select
                                value={filterZona}
                                onChange={e => setFilterZona(e.target.value)}
                                className="appearance-none pl-9 pr-8 py-3 rounded-lg bg-[hsl(var(--black-light))] border border-[hsl(var(--gold))]/15 text-sm text-gray-300 focus:border-[hsl(var(--gold))] focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="">Todas as Zonas</option>
                                {getZonas().map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={filterActive}
                                onChange={e => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                                className="appearance-none pl-9 pr-8 py-3 rounded-lg bg-[hsl(var(--black-light))] border border-[hsl(var(--gold))]/15 text-sm text-gray-300 focus:border-[hsl(var(--gold))] focus:outline-none transition-all cursor-pointer"
                            >
                                <option value="all">Todas</option>
                                <option value="active">Ativas</option>
                                <option value="inactive">Inativas</option>
                            </select>
                            <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => navigate('/admin/template')}
                            className="flex items-center gap-2 text-sm py-3 px-5 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-500 hover:to-amber-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/25"
                        >
                            <FileText className="w-4 h-4" />
                            Template
                        </button>
                        <button
                            onClick={() => { resetMigration(); setShowBackupModal(true); }}
                            className="flex items-center gap-2 text-sm py-3 px-5 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
                        >
                            <HardDrive className="w-4 h-4" />
                            Backup & Deploy
                        </button>
                        <button
                            onClick={() => { setSitemapGenerated(false); setShowSitemapModal(true); }}
                            className="flex items-center gap-2 text-sm py-3 px-5 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25"
                        >
                            <Download className="w-4 h-4" />
                            Sitemap
                        </button>
                        <button
                            onClick={() => { setBulkResult(null); setShowBulkGenerateModal(true); }}
                            className="flex items-center gap-2 text-sm py-3 px-5 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            <Zap className="w-4 h-4" />
                            Gerar em Massa
                        </button>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary flex items-center gap-2 text-sm !py-3 !px-5"
                        >
                            <Plus className="w-4 h-4" />
                            Nova Página
                        </button>
                    </div>
                </div>

                {/* Pages Table */}
                {filteredPages.length === 0 ? (
                    <div className="card-glass p-16 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--gold))]/10 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-[hsl(var(--gold))]/40" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                            {pages.length === 0 ? 'Nenhuma página criada' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            {pages.length === 0
                                ? 'Crie sua primeira landing page clicando no botão acima'
                                : 'Tente ajustar os filtros de busca'}
                        </p>
                        {pages.length === 0 && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary inline-flex items-center gap-2 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Criar Primeira Página
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="card-glass overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[hsl(var(--gold))]/10">
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Página</th>
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Localização</th>
                                        <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Geo</th>
                                        <th className="text-center p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPages.map((page) => (
                                        <tr key={page.id} className="border-b border-[hsl(var(--gold))]/5 hover:bg-[hsl(var(--gold))]/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--gold))]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <Globe className="w-4 h-4 text-[hsl(var(--gold))]" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm text-white truncate">
                                                            {page.keyword} em {page.location}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
                                                            /{page.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-3.5 h-3.5 text-[hsl(var(--gold))] flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm text-gray-300">{page.location}</p>
                                                        <p className="text-xs text-gray-500">{page.zona} • CEP: {page.cep}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="text-xs text-gray-400 font-mono">
                                                    <p>{page.lat.toFixed(4)}, {page.lng.toFixed(4)}</p>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleToggle(page.id)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${page.active
                                                        ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                                                        : 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                                                        }`}
                                                >
                                                    <Power className="w-3 h-3" />
                                                    {page.active ? 'Ativa' : 'Inativa'}
                                                </button>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-1">
                                                    <a
                                                        href={`/${page.slug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg text-gray-400 hover:text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/10 transition-all"
                                                        title="Visualizar Página"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => openDuplicate(page.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                                                        title="Duplicar para Outros Bairros"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    {deleteConfirm === page.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleDelete(page.id)}
                                                                className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                                                            >
                                                                Confirmar
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(null)}
                                                                className="px-2 py-1 rounded text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 transition-all"
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setDeleteConfirm(page.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-[hsl(var(--gold))]/10 flex items-center justify-between text-sm text-gray-500">
                            <span>Mostrando {filteredPages.length} de {pages.length} páginas</span>
                            <span>{stats.active} ativas • {stats.inactive} inativas</span>
                        </div>
                    </div>
                )}
            </main>

            {/* CREATE MODAL */}
            {showCreateModal && (
                <Modal title="Criar Nova Página" onClose={() => { setShowCreateModal(false); resetForm(); }}>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Palavra-chave Principal</label>
                            <input
                                type="text"
                                value={formKeyword}
                                onChange={e => setFormKeyword(e.target.value)}
                                className="input-field"
                                placeholder="Ex: Conserto de Notebook"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Zona</label>
                                <select
                                    value={formZona}
                                    onChange={e => { setFormZona(e.target.value); setFormBairro(''); }}
                                    className="input-field"
                                >
                                    <option value="">Selecione a zona</option>
                                    {getZonas().map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Bairro / Localização</label>
                                <select
                                    value={formBairro}
                                    onChange={e => setFormBairro(e.target.value)}
                                    className="input-field"
                                    disabled={!formZona}
                                >
                                    <option value="">Selecione o bairro</option>
                                    {formZona && getBairrosByZona(formZona).map(b => (
                                        <option key={b.nome} value={b.nome}>{b.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {selectedBairro && (
                            <div className="card-glass p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Dados de Geolocalização (automático)
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Map className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                                        <span>Lat: {selectedBairro.geo.lat}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Map className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                                        <span>Lng: {selectedBairro.geo.lng}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Hash className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                                        <span>CEP: {selectedBairro.cep}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <MapPin className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                                        <span>{selectedBairro.zona}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">{selectedBairro.referencia}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Endereço (opcional)</label>
                            <input
                                type="text"
                                value={formAddress}
                                onChange={e => setFormAddress(e.target.value)}
                                className="input-field"
                                placeholder={selectedBairro ? `${selectedBairro.referencia}, ${formBairro}` : 'Endereço personalizado'}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                                <input
                                    type="text"
                                    value={formWhatsapp}
                                    onChange={e => setFormWhatsapp(e.target.value)}
                                    className="input-field"
                                    placeholder="5511999999999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                                <input
                                    type="text"
                                    value={formPhone}
                                    onChange={e => setFormPhone(e.target.value)}
                                    className="input-field"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        {previewSlug && (
                            <div className="p-3 rounded-lg bg-[hsl(var(--black))]/60 border border-[hsl(var(--gold))]/10">
                                <p className="text-xs text-gray-500 mb-1">URL da página:</p>
                                <p className="text-sm text-[hsl(var(--gold))] font-mono">/{previewSlug}</p>
                            </div>
                        )}

                        <button
                            onClick={handleCreate}
                            disabled={!formKeyword || !formBairro}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4" />
                            Criar Página
                        </button>
                    </div>
                </Modal>
            )}

            {/* DUPLICATE MODAL */}
            {showDuplicateModal && (
                <Modal title="Duplicar para Múltiplos Bairros" onClose={() => setShowDuplicateModal(false)} wide>
                    <div className="space-y-5">
                        <div className="card-glass p-4">
                            <p className="text-xs text-gray-400 mb-1">Duplicando a partir de:</p>
                            <p className="text-sm font-semibold text-white">
                                {pages.find(p => p.id === duplicateSourceId)?.keyword} em {pages.find(p => p.id === duplicateSourceId)?.location}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Filtrar por Zona</label>
                            <select
                                value={dupZona}
                                onChange={e => { setDupZona(e.target.value); setDupBairros([]); }}
                                className="input-field"
                            >
                                <option value="">Todas as zonas</option>
                                {getZonas().map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </select>
                        </div>

                        {dupZona && (
                            <button
                                onClick={() => selectAllBairrosFromZona(dupZona)}
                                className="text-sm text-[hsl(var(--gold))] hover:underline flex items-center gap-1"
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Selecionar todos de {dupZona} (disponíveis)
                            </button>
                        )}

                        <div className="max-h-60 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                            {(dupZona ? getBairrosByZona(dupZona) : bairrosSP).map((bairro: BairroData) => {
                                const source = pages.find(p => p.id === duplicateSourceId);
                                const slug = source ? generateSlug(source.keyword, bairro.nome) : '';
                                const exists = pages.find(p => p.slug === slug);

                                return (
                                    <label
                                        key={bairro.nome}
                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${exists
                                            ? 'opacity-40 cursor-not-allowed bg-gray-500/5'
                                            : dupBairros.includes(bairro.nome)
                                                ? 'bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30'
                                                : 'bg-[hsl(var(--black))]/40 hover:bg-[hsl(var(--gold))]/5 border border-transparent'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={dupBairros.includes(bairro.nome)}
                                            onChange={() => !exists && toggleDupBairro(bairro.nome)}
                                            disabled={!!exists}
                                            className="w-4 h-4 rounded accent-[hsl(var(--gold))]"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white">{bairro.nome}</p>
                                            <p className="text-xs text-gray-500">{bairro.zona} • {bairro.cep}</p>
                                        </div>
                                        {exists && (
                                            <span className="text-xs text-gray-500 bg-gray-500/10 px-2 py-0.5 rounded">Já existe</span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {dupBairros.length > 0 && (
                            <div className="p-3 rounded-lg bg-[hsl(var(--gold))]/5 border border-[hsl(var(--gold))]/20">
                                <p className="text-sm text-[hsl(var(--gold))]">
                                    <strong>{dupBairros.length}</strong> bairro{dupBairros.length > 1 ? 's' : ''} selecionado{dupBairros.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        )}

                        <button
                            onClick={handleBulkDuplicate}
                            disabled={dupBairros.length === 0}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Copy className="w-4 h-4" />
                            Duplicar para {dupBairros.length} Bairro{dupBairros.length !== 1 ? 's' : ''}
                        </button>
                    </div>
                </Modal>
            )}

            {/* BULK GENERATE MODAL */}
            {showBulkGenerateModal && (
                <Modal title="⚡ Geração em Massa de Páginas" onClose={() => setShowBulkGenerateModal(false)} wide>
                    <div className="space-y-5">
                        {/* Info banner */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                            <div className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-purple-300">Geração Automática</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Insira uma lista de palavras-chave (uma por linha) e selecione os bairros.
                                        O sistema criará automaticamente <strong className="text-purple-300">todas as combinações</strong> de keyword × bairro.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Keywords textarea */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <List className="w-4 h-4 text-[hsl(var(--gold))]" />
                                Lista de Palavras-chave <span className="text-xs text-gray-500">(uma por linha)</span>
                            </label>
                            <textarea
                                value={bulkKeywords}
                                onChange={e => setBulkKeywords(e.target.value)}
                                rows={5}
                                className="input-field resize-y min-h-[120px] font-mono text-xs leading-relaxed"
                                placeholder={"Conserto de Notebook\nAssistência Técnica Notebook\nReparo de Notebook\nManutenção de Notebook\nTroca de Tela Notebook"}
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                    {bulkParsedKeywords.length} palavra{bulkParsedKeywords.length !== 1 ? 's' : ''}-chave detectada{bulkParsedKeywords.length !== 1 ? 's' : ''}
                                </p>
                                {bulkParsedKeywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {bulkParsedKeywords.slice(0, 3).map((kw, i) => (
                                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300">{kw}</span>
                                        ))}
                                        {bulkParsedKeywords.length > 3 && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-500/15 text-gray-400">+{bulkParsedKeywords.length - 3}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* WhatsApp and Phone */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp</label>
                                <input
                                    type="text"
                                    value={bulkWhatsapp}
                                    onChange={e => setBulkWhatsapp(e.target.value)}
                                    className="input-field"
                                    placeholder="5511999999999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                                <input
                                    type="text"
                                    value={bulkPhone}
                                    onChange={e => setBulkPhone(e.target.value)}
                                    className="input-field"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                        </div>

                        {/* Bairro selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                                Selecionar Bairros
                            </label>

                            <div className="flex flex-wrap gap-2 mb-3">
                                <select
                                    value={bulkZona}
                                    onChange={e => setBulkZona(e.target.value)}
                                    className="input-field !w-auto !py-2 text-xs"
                                >
                                    <option value="">Todas as zonas</option>
                                    {getZonas().map(z => (
                                        <option key={z} value={z}>{z}</option>
                                    ))}
                                </select>

                                <button
                                    onClick={selectAllBulkBairros}
                                    className="text-xs px-3 py-2 rounded-lg bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/20 transition-all"
                                >
                                    Selecionar Todos
                                </button>
                                {bulkZona && (
                                    <button
                                        onClick={() => selectAllBulkBairrosFromZona(bulkZona)}
                                        className="text-xs px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                                    >
                                        + Todos de {bulkZona}
                                    </button>
                                )}
                                {bulkBairros.length > 0 && (
                                    <button
                                        onClick={deselectAllBulkBairros}
                                        className="text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                    >
                                        Limpar ({bulkBairros.length})
                                    </button>
                                )}
                            </div>

                            <div className="max-h-48 overflow-y-auto space-y-1 pr-2 scrollbar-thin">
                                {(bulkZona ? getBairrosByZona(bulkZona) : bairrosSP).map((bairro: BairroData) => (
                                    <label
                                        key={bairro.nome}
                                        className={`flex items-center gap-3 p-2.5 rounded-lg transition-all cursor-pointer text-sm ${bulkBairros.includes(bairro.nome)
                                            ? 'bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30'
                                            : 'bg-[hsl(var(--black))]/40 hover:bg-[hsl(var(--gold))]/5 border border-transparent'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={bulkBairros.includes(bairro.nome)}
                                            onChange={() => toggleBulkBairro(bairro.nome)}
                                            className="w-4 h-4 rounded accent-[hsl(var(--gold))]"
                                        />
                                        <span className="text-white">{bairro.nome}</span>
                                        <span className="text-xs text-gray-500 ml-auto">{bairro.zona}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Preview calculation */}
                        {(bulkParsedKeywords.length > 0 && bulkBairros.length > 0) && (
                            <div className="card-glass p-4 space-y-3">
                                <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4" />
                                    Preview da Geração
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                        <p className="text-xl font-bold text-purple-400">{bulkPreviewCount.total}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Combinações Totais</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                        <p className="text-xl font-bold text-green-400">{bulkPreviewCount.new}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Novas Páginas</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                        <p className="text-xl font-bold text-gray-500">{bulkPreviewCount.existing}</p>
                                        <p className="text-[10px] text-gray-500 mt-1">Já Existem</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {bulkParsedKeywords.length} keyword{bulkParsedKeywords.length !== 1 ? 's' : ''} × {bulkBairros.length} bairro{bulkBairros.length !== 1 ? 's' : ''} = {bulkPreviewCount.total} combinaç{bulkPreviewCount.total !== 1 ? 'ões' : 'ão'}
                                    {bulkPreviewCount.existing > 0 && ` (${bulkPreviewCount.existing} já existente${bulkPreviewCount.existing !== 1 ? 's' : ''}, será${bulkPreviewCount.existing !== 1 ? 'ão' : ''} ignorada${bulkPreviewCount.existing !== 1 ? 's' : ''})`}
                                </p>
                            </div>
                        )}

                        {/* Result feedback */}
                        {bulkResult && (
                            <div className={`flex items-center gap-3 p-4 rounded-lg border ${bulkResult.created > 0
                                ? 'bg-green-500/10 border-green-500/30'
                                : 'bg-yellow-500/10 border-yellow-500/30'
                                }`}>
                                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${bulkResult.created > 0 ? 'text-green-400' : 'text-yellow-400'}`} />
                                <div>
                                    <p className={`text-sm font-semibold ${bulkResult.created > 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {bulkResult.created > 0
                                            ? `✅ ${bulkResult.created} página${bulkResult.created !== 1 ? 's' : ''} criada${bulkResult.created !== 1 ? 's' : ''} com sucesso!`
                                            : 'Nenhuma página nova criada'}
                                    </p>
                                    {bulkResult.skipped > 0 && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {bulkResult.skipped} combinaç{bulkResult.skipped !== 1 ? 'ões' : 'ão'} ignorada{bulkResult.skipped !== 1 ? 's' : ''} (já existente{bulkResult.skipped !== 1 ? 's' : ''})
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Generate button */}
                        <button
                            onClick={handleBulkGenerate}
                            disabled={bulkParsedKeywords.length === 0 || bulkBairros.length === 0 || bulkGenerating || bulkPreviewCount.new === 0}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            {bulkGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Gerando {bulkPreviewCount.new} páginas...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Gerar {bulkPreviewCount.new} Página{bulkPreviewCount.new !== 1 ? 's' : ''} Automaticamente
                                </>
                            )}
                        </button>
                    </div>
                </Modal>
            )}

            {/* SITEMAP MODAL */}
            {showSitemapModal && (
                <Modal title="Gerar Sitemap XML" onClose={() => setShowSitemapModal(false)}>
                    <div className="space-y-5">
                        {/* Info */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
                            <div className="flex items-start gap-3">
                                <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-300">Sitemap para SEO</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Gera um arquivo <code className="text-emerald-300">sitemap.xml</code> com todas as páginas ativas.
                                        Faça upload na raiz do seu domínio e submeta no Google Search Console.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Domain */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                <Link2 className="w-4 h-4 text-[hsl(var(--gold))]" />
                                Domínio do Site
                            </label>
                            <input
                                type="text"
                                value={sitemapDomain}
                                onChange={e => setSitemapDomain(e.target.value)}
                                className="input-field"
                                placeholder="https://seusite.com.br"
                            />
                            <p className="text-xs text-gray-500 mt-1">URL completa com https://</p>
                        </div>

                        {/* Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Frequência de Atualização</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                                    <button
                                        key={freq}
                                        onClick={() => setSitemapFreq(freq)}
                                        className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-all border ${sitemapFreq === freq
                                            ? 'bg-[hsl(var(--gold))]/15 border-[hsl(var(--gold))]/40 text-[hsl(var(--gold))]'
                                            : 'bg-[hsl(var(--black))]/50 border-transparent text-gray-400 hover:border-[hsl(var(--gold))]/20'
                                            }`}
                                    >
                                        {freq === 'daily' ? 'Diária' : freq === 'weekly' ? 'Semanal' : 'Mensal'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="card-glass p-4 space-y-3">
                            <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                Conteúdo do Sitemap
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                    <p className="text-xl font-bold text-emerald-400">{pages.filter(p => p.active).length + 1}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">URLs Totais</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                    <p className="text-xl font-bold text-green-400">{pages.filter(p => p.active).length}</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Páginas Ativas</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                    <p className="text-xl font-bold text-blue-400">1</p>
                                    <p className="text-[10px] text-gray-500 mt-1">Homepage</p>
                                </div>
                            </div>
                            {pages.filter(p => p.active).length > 0 && (
                                <div className="max-h-32 overflow-y-auto scrollbar-thin space-y-1 pt-2 border-t border-[hsl(var(--gold))]/10">
                                    <p className="text-xs text-gray-500 font-mono">{sitemapDomain.replace(/\/$/, '')}/</p>
                                    {pages.filter(p => p.active).slice(0, 20).map(p => (
                                        <p key={p.id} className="text-xs text-gray-500 font-mono truncate">
                                            {sitemapDomain.replace(/\/$/, '')}/{p.slug}
                                        </p>
                                    ))}
                                    {pages.filter(p => p.active).length > 20 && (
                                        <p className="text-xs text-gray-400">... e mais {pages.filter(p => p.active).length - 20} URLs</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Success feedback */}
                        {sitemapGenerated && (
                            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-2">
                                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    <span>Sitemap gerado e salvo com sucesso!</span>
                                </div>
                                <div className="pl-6 space-y-1">
                                    <p className="text-xs text-gray-400">
                                        📁 Arquivo salvo em: <code className="text-emerald-300">public/sitemap.xml</code>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        🌐 Acessível em: <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">{sitemapDomain.replace(/\/$/, '')}/sitemap.xml</a>
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        🤖 <code className="text-emerald-300">robots.txt</code> também foi gerado automaticamente
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error feedback */}
                        {sitemapError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>{sitemapError}</span>
                            </div>
                        )}

                        {/* Generate button */}
                        <button
                            onClick={generateSitemap}
                            disabled={!sitemapDomain || pages.filter(p => p.active).length === 0 || sitemapSaving}
                            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/25"
                        >
                            {sitemapSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvando sitemap.xml...
                                </>
                            ) : sitemapGenerated ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Regerar sitemap.xml ({pages.filter(p => p.active).length + 1} URLs)
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Gerar e Salvar sitemap.xml ({pages.filter(p => p.active).length + 1} URLs)
                                </>
                            )}
                        </button>
                    </div>
                </Modal>
            )}

            {/* BACKUP & DEPLOY MODAL */}
            {showBackupModal && (
                <Modal title="💾 Backup & Deploy" onClose={() => setShowBackupModal(false)} wide>
                    <div className="space-y-5">
                        {/* Info banner */}
                        <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
                            <div className="flex items-start gap-3">
                                <Server className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-cyan-300">Migração Completa para Hospedagem</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Migre <strong className="text-cyan-300">todas as páginas, configurações e dados</strong> para seu servidor de hospedagem PHP.
                                        O sistema criará o banco de dados, tabelas, configurações e a API automaticamente.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Steps indicator */}
                        <div className="flex items-center justify-center gap-2">
                            {['Configurar', 'Testar', 'Migrar', 'Concluído'].map((label, i) => {
                                const currentIdx = migrateStep === 'form' ? 0 : migrateStep === 'testing' ? 1 : migrateStep === 'migrating' ? 2 : migrateStep === 'success' ? 3 : 0;
                                const isActive = i === currentIdx;
                                const isDone = i < currentIdx;
                                return (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isDone ? 'bg-green-500/20 text-green-400' :
                                            isActive ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40' :
                                                'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {isDone ? <CheckCircle className="w-3 h-3" /> : <span className="w-4 text-center">{i + 1}</span>}
                                            <span className="hidden sm:inline">{label}</span>
                                        </div>
                                        {i < 3 && <ArrowRight className="w-3 h-3 text-gray-600" />}
                                    </div>
                                );
                            })}
                        </div>

                        {migrateStep === 'success' ? (
                            /* SUCCESS VIEW */
                            <div className="space-y-5">
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-500/15 flex items-center justify-center">
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-green-400 mb-2">Migração Concluída!</h3>
                                    <p className="text-sm text-gray-400">Todos os dados foram migrados com sucesso para o servidor.</p>
                                </div>

                                {/* Stats */}
                                {migrateResult?.stats && (
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50 border border-green-500/20">
                                            <p className="text-xl font-bold text-green-400">{migrateResult.stats.pages_created}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Páginas Criadas</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50 border border-gray-500/20">
                                            <p className="text-xl font-bold text-gray-400">{migrateResult.stats.pages_skipped}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Ignoradas</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg bg-[hsl(var(--black))]/50 border border-cyan-500/20">
                                            <p className="text-xl font-bold text-cyan-400">{migrateResult.stats.files_generated?.length || 0}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Arquivos Gerados</p>
                                        </div>
                                    </div>
                                )}

                                {/* Links */}
                                {migrateResult?.urls && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <a
                                            href={migrateResult.urls.home}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all text-sm font-medium"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Abrir Site
                                        </a>
                                        <a
                                            href={migrateResult.urls.admin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all text-sm font-medium"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Acessar Admin
                                        </a>
                                    </div>
                                )}

                                {/* Warning */}
                                <div className="p-4 rounded-lg bg-yellow-500/8 border border-yellow-500/20">
                                    <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        Importante - Pós-migração:
                                    </h4>
                                    <ul className="space-y-1 text-xs text-gray-400">
                                        <li>• <strong>Delete o arquivo migrate.php</strong> do servidor por segurança</li>
                                        <li>• Faça login com: <strong className="text-yellow-300">{migrateAdminUser}</strong></li>
                                        <li>• Configure SSL (HTTPS) no seu domínio</li>
                                        <li>• Faça upload do <strong>index.html</strong> e da pasta <strong>assets/</strong> (build de produção)</li>
                                        <li>• Submeta o <strong>sitemap.xml</strong> no Google Search Console</li>
                                    </ul>
                                </div>
                            </div>
                        ) : migrateStep === 'error' ? (
                            /* ERROR VIEW */
                            <div className="space-y-5">
                                <div className="text-center py-6">
                                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-500/15 flex items-center justify-center">
                                        <XCircle className="w-10 h-10 text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-red-400 mb-2">Erro na Migração</h3>
                                    <p className="text-sm text-gray-400">{migrateError}</p>
                                </div>
                                <button
                                    onClick={resetMigration}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all bg-gray-500/20 text-gray-300 hover:bg-gray-500/30"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : (
                            /* FORM VIEW */
                            <div className="space-y-5">
                                {/* Server URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                                        <Server className="w-4 h-4 text-cyan-400" />
                                        URL do Servidor (onde está o migrate.php)
                                    </label>
                                    <input
                                        type="url"
                                        value={migrateServerUrl}
                                        onChange={e => setMigrateServerUrl(e.target.value)}
                                        className="input-field"
                                        placeholder="https://seusite.com.br"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Faça upload do arquivo <code className="text-cyan-300">migrate.php</code> para a raiz do seu servidor antes de iniciar.
                                    </p>
                                </div>

                                {/* Database section */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                        <Database className="w-4 h-4" />
                                        Banco de Dados MySQL
                                        <span className="flex-1 h-px bg-[hsl(var(--gold))]/15" />
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Host</label>
                                            <input
                                                type="text"
                                                value={migrateDbHost}
                                                onChange={e => setMigrateDbHost(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="localhost"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Nome do Banco</label>
                                            <input
                                                type="text"
                                                value={migrateDbName}
                                                onChange={e => setMigrateDbName(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="cms_seo"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Usuário</label>
                                            <input
                                                type="text"
                                                value={migrateDbUser}
                                                onChange={e => setMigrateDbUser(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="root"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Senha</label>
                                            <input
                                                type="password"
                                                value={migrateDbPass}
                                                onChange={e => setMigrateDbPass(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Prefixo das Tabelas</label>
                                        <input
                                            type="text"
                                            value={migrateDbPrefix}
                                            onChange={e => setMigrateDbPrefix(e.target.value)}
                                            className="input-field !py-2 text-sm !w-32"
                                            placeholder="cms_"
                                        />
                                    </div>

                                    {/* Test Connection Button */}
                                    <button
                                        onClick={handleTestConnection}
                                        disabled={!migrateServerUrl || !migrateDbName || !migrateDbUser || migrateStep === 'testing'}
                                        className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${migrateConnectionOk === true
                                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                            : migrateConnectionOk === false
                                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                                            }`}
                                    >
                                        {migrateStep === 'testing' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Testando conexão...
                                            </>
                                        ) : migrateConnectionOk === true ? (
                                            <>
                                                <Wifi className="w-4 h-4" />
                                                Conexão OK — Clique para testar novamente
                                            </>
                                        ) : migrateConnectionOk === false ? (
                                            <>
                                                <WifiOff className="w-4 h-4" />
                                                Falha — Clique para tentar novamente
                                            </>
                                        ) : (
                                            <>
                                                <Wifi className="w-4 h-4" />
                                                Testar Conexão
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Site Configuration */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Configuração do Site
                                        <span className="flex-1 h-px bg-[hsl(var(--gold))]/15" />
                                    </h4>

                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Domínio do Site (com https://)</label>
                                        <input
                                            type="url"
                                            value={migrateDomain}
                                            onChange={e => setMigrateDomain(e.target.value)}
                                            className="input-field !py-2 text-sm"
                                            placeholder="https://seusite.com.br"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Nome do Site</label>
                                        <input
                                            type="text"
                                            value={migrateSiteName}
                                            onChange={e => setMigrateSiteName(e.target.value)}
                                            className="input-field !py-2 text-sm"
                                            placeholder="Notebook Master SP"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">WhatsApp</label>
                                            <input
                                                type="text"
                                                value={migrateWhatsapp}
                                                onChange={e => setMigrateWhatsapp(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="5511999999999"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Telefone</label>
                                            <input
                                                type="text"
                                                value={migratePhone}
                                                onChange={e => setMigratePhone(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="(11) 99999-9999"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Admin Credentials */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-[hsl(var(--gold))] flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Conta Admin no Servidor
                                        <span className="flex-1 h-px bg-[hsl(var(--gold))]/15" />
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Usuário Admin</label>
                                            <input
                                                type="text"
                                                value={migrateAdminUser}
                                                onChange={e => setMigrateAdminUser(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="admin"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Senha Admin</label>
                                            <input
                                                type="password"
                                                value={migrateAdminPass}
                                                onChange={e => setMigrateAdminPass(e.target.value)}
                                                className="input-field !py-2 text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pages summary */}
                                <div className="card-glass p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                                                <Layers className="w-5 h-5 text-cyan-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-white">Dados a Migrar</p>
                                                <p className="text-xs text-gray-500">{pages.length} páginas • {pages.filter(p => p.active).length} ativas</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-cyan-400">{pages.length}</p>
                                            <p className="text-[10px] text-gray-500">Páginas totais</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Error display */}
                                {migrateError && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span>{migrateError}</span>
                                    </div>
                                )}

                                {/* Log display */}
                                {migrateLog.length > 0 && (
                                    <div className="p-3 rounded-lg bg-[hsl(var(--black))]/60 border border-[hsl(var(--gold))]/10 max-h-32 overflow-y-auto scrollbar-thin">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Log</p>
                                        {migrateLog.map((line, i) => (
                                            <p key={i} className="text-xs text-gray-400 font-mono leading-relaxed">{line}</p>
                                        ))}
                                    </div>
                                )}

                                {/* Migrate button */}
                                <button
                                    onClick={handleMigrate}
                                    disabled={
                                        !migrateServerUrl || !migrateDbName || !migrateDbUser ||
                                        !migrateDomain || !migrateAdminPass || !migrateAdminUser ||
                                        migrateStep === 'migrating' || migrateStep === 'testing'
                                    }
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25"
                                >
                                    {migrateStep === 'migrating' ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Migrando {pages.length} páginas...
                                        </>
                                    ) : (
                                        <>
                                            <CloudUpload className="w-5 h-5" />
                                            Iniciar Migração Completa
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* SETTINGS MODAL */}
            {showSettingsModal && (
                <Modal title="Configurações" onClose={() => setShowSettingsModal(false)}>
                    <div className="space-y-5">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-[hsl(var(--gold))]" />
                                Alterar Credenciais de Acesso
                            </h4>

                            {settingsMsg && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm mb-4">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {settingsMsg}
                                </div>
                            )}

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Novo Usuário</label>
                                    <input
                                        type="text"
                                        value={settingsUser}
                                        onChange={e => setSettingsUser(e.target.value)}
                                        className="input-field"
                                        placeholder="Novo nome de usuário"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        value={settingsPass}
                                        onChange={e => setSettingsPass(e.target.value)}
                                        className="input-field"
                                        placeholder="Nova senha"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={!settingsUser || !settingsPass}
                                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <Save className="w-4 h-4" />
                                    Salvar Credenciais
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-[hsl(var(--gold))]/10">
                            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-[hsl(var(--gold))]" />
                                Informações
                            </h4>
                            <div className="space-y-2 text-xs text-gray-500">
                                <p>• Os dados das páginas são salvos no localStorage do navegador</p>
                                <p>• Total de bairros disponíveis: {bairrosSP.length}</p>
                                <p>• Páginas criadas: {pages.length}</p>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

// --- Modal Component ---
function Modal({ title, children, onClose, wide }: { title: string; children: React.ReactNode; onClose: () => void; wide?: boolean }) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-[hsl(var(--black-light))] border border-[hsl(var(--gold))]/20 rounded-2xl shadow-2xl shadow-[hsl(var(--gold))]/5 w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
                <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-[hsl(var(--gold))]/10 bg-[hsl(var(--black-light))] rounded-t-2xl">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}
