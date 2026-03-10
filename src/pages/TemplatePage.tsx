import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/pageStore';
import { getTemplate, saveTemplate, resetTemplate, defaultTemplate, type LandingTemplate } from '../lib/templateStore';
import {
    ArrowLeft, Save, RotateCcw, CheckCircle2, Type, Users, MessageSquare,
    HelpCircle, Briefcase, FileText, Wrench, Star, Plus, Trash2, GripVertical, Eye,
    MapPin, MessageCircle
} from 'lucide-react';

export default function TemplatePage() {
    const navigate = useNavigate();
    const [template, setTemplate] = useState<LandingTemplate>(getTemplate());
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<string>('empresa');
    const [previewVars] = useState({
        keyword: 'Conserto de Notebook',
        location: 'Vila Mariana',
        zona: 'Zona Sul',
        address: 'Rua Domingos de Morais, 2564',
        cep: '04036-100',
        referencia: 'Próximo ao Metrô Vila Mariana',
        phone: '(11) 99999-9999',
        whatsapp: '5511999999999',
        companyName: 'Notebook Master SP',
        yearsExperience: '25+',
        totalClients: '15.000+',
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSave = () => {
        saveTemplate(template);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleReset = () => {
        if (confirm('Tem certeza? Isso vai resetar todos os textos para o padrão original.')) {
            resetTemplate();
            setTemplate({ ...defaultTemplate });
        }
    };

    const updateField = (field: keyof LandingTemplate, value: unknown) => {
        setTemplate(prev => ({ ...prev, [field]: value }));
    };

    // Preview with resolved variables
    const resolvePreview = (text: string) => {
        let result = text;
        for (const [key, value] of Object.entries(previewVars)) {
            result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
        return result;
    };

    const tabs = [
        { id: 'empresa', label: 'Empresa', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'hero', label: 'Hero', icon: <Type className="w-4 h-4" /> },
        { id: 'servicos', label: 'Serviços', icon: <Wrench className="w-4 h-4" /> },
        { id: 'marcas', label: 'Marcas', icon: <Star className="w-4 h-4" /> },
        { id: 'sobre', label: 'Sobre', icon: <FileText className="w-4 h-4" /> },
        { id: 'depoimentos', label: 'Depoimentos', icon: <Users className="w-4 h-4" /> },
        { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
        { id: 'contato', label: 'Contato', icon: <MessageSquare className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[hsl(var(--black))]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[hsl(var(--black))]/95 backdrop-blur-md border-b border-[hsl(var(--gold))]/10">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/admin')} className="p-2 rounded-lg text-gray-400 hover:text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/10 transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gradient-gold">Editor de Template</h1>
                                <p className="text-xs text-gray-500">Edite os textos da landing page</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                <RotateCcw className="w-4 h-4" />
                                Resetar
                            </button>
                            <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-600 text-white' : 'bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] text-[hsl(var(--black))]'} hover:-translate-y-0.5 hover:shadow-lg`}>
                                {saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo!</> : <><Save className="w-4 h-4" /> Salvar Template</>}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Variable hint */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-300 font-medium mb-1">💡 Variáveis dinâmicas disponíveis:</p>
                    <div className="flex flex-wrap gap-2">
                        {['{{keyword}}', '{{location}}', '{{zona}}', '{{address}}', '{{cep}}', '{{referencia}}', '{{phone}}', '{{whatsapp}}', '{{companyName}}', '{{yearsExperience}}', '{{totalClients}}'].map(v => (
                            <code key={v} className="text-xs px-2 py-1 rounded bg-blue-500/15 text-blue-300 font-mono">{v}</code>
                        ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Estas variáveis serão substituídas automaticamente pelos dados reais de cada página</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-[hsl(var(--gold))]/15 border border-[hsl(var(--gold))]/40 text-[hsl(var(--gold))]'
                                : 'bg-[hsl(var(--navy))]/50 border border-transparent text-gray-400 hover:border-[hsl(var(--gold))]/20 hover:text-gray-300'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Editor */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-wider">✏️ Editar</h3>

                        {/* EMPRESA TAB */}
                        {activeTab === 'empresa' && (
                            <div className="space-y-4">
                                <FieldInput label="Nome da Empresa" value={template.companyName} onChange={v => updateField('companyName', v)} />
                                <FieldInput label="Slogan" value={template.companyTagline} onChange={v => updateField('companyTagline', v)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldInput label="Anos de Experiência" value={template.yearsExperience} onChange={v => updateField('yearsExperience', v)} />
                                    <FieldInput label="Total de Clientes" value={template.totalClients} onChange={v => updateField('totalClients', v)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FieldInput label="Avaliação Média" value={template.avgRating} onChange={v => updateField('avgRating', v)} />
                                    <FieldInput label="Garantia" value={template.warranty} onChange={v => updateField('warranty', v)} />
                                </div>
                                <FieldInput label="Taxa de Sucesso" value={template.successRate} onChange={v => updateField('successRate', v)} />
                            </div>
                        )}

                        {/* HERO TAB */}
                        {activeTab === 'hero' && (
                            <div className="space-y-4">
                                <FieldTextarea label="Subtítulo do Hero" value={template.heroSubtitle} onChange={v => updateField('heroSubtitle', v)} rows={4} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Badges do Hero</label>
                                    {template.heroBadges.map((badge, i) => (
                                        <div key={i} className="flex items-center gap-2 mb-2">
                                            <GripVertical className="w-4 h-4 text-gray-600" />
                                            <input className="input-field flex-1 !py-2 text-sm" value={badge}
                                                onChange={e => {
                                                    const newBadges = [...template.heroBadges];
                                                    newBadges[i] = e.target.value;
                                                    updateField('heroBadges', newBadges);
                                                }} />
                                            <button onClick={() => updateField('heroBadges', template.heroBadges.filter((_, j) => j !== i))}
                                                className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => updateField('heroBadges', [...template.heroBadges, 'Nova Badge'])}
                                        className="text-xs text-[hsl(var(--gold))] hover:underline flex items-center gap-1 mt-1">
                                        <Plus className="w-3 h-3" /> Adicionar Badge
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* SERVICOS TAB */}
                        {activeTab === 'servicos' && (
                            <div className="space-y-4">
                                {template.services.map((svc, i) => (
                                    <div key={i} className="card-glass p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[hsl(var(--gold))] font-mono">Serviço {i + 1}</span>
                                            <button onClick={() => updateField('services', template.services.filter((_, j) => j !== i))}
                                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <FieldInput label="Título" value={svc.title} onChange={v => {
                                            const s = [...template.services]; s[i] = { ...s[i], title: v }; updateField('services', s);
                                        }} />
                                        <FieldTextarea label="Descrição" value={svc.description} onChange={v => {
                                            const s = [...template.services]; s[i] = { ...s[i], description: v }; updateField('services', s);
                                        }} rows={2} />
                                        <div>
                                            <label className="text-xs text-gray-500">Features (uma por campo)</label>
                                            {svc.features.map((f, j) => (
                                                <div key={j} className="flex gap-2 mb-1">
                                                    <input className="input-field !py-1.5 text-xs flex-1" value={f}
                                                        onChange={e => {
                                                            const s = [...template.services];
                                                            const feats = [...s[i].features]; feats[j] = e.target.value;
                                                            s[i] = { ...s[i], features: feats }; updateField('services', s);
                                                        }} />
                                                    <button onClick={() => {
                                                        const s = [...template.services];
                                                        s[i] = { ...s[i], features: s[i].features.filter((_, k) => k !== j) };
                                                        updateField('services', s);
                                                    }} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => {
                                                const s = [...template.services];
                                                s[i] = { ...s[i], features: [...s[i].features, ''] };
                                                updateField('services', s);
                                            }} className="text-xs text-[hsl(var(--gold))] hover:underline flex items-center gap-1 mt-1">
                                                <Plus className="w-3 h-3" /> Feature
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => updateField('services', [...template.services, { title: 'Novo Serviço em {{location}}', description: 'Descrição do serviço em {{location}}.', features: ['Item 1', 'Item 2'] }])}
                                    className="w-full py-3 rounded-lg border border-dashed border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))] text-sm hover:bg-[hsl(var(--gold))]/5 transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Adicionar Serviço
                                </button>
                            </div>
                        )}

                        {/* MARCAS TAB */}
                        {activeTab === 'marcas' && (
                            <div className="space-y-3">
                                {template.brands.map((b, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input className="input-field !py-2 text-sm flex-1" placeholder="Marca" value={b.name}
                                            onChange={e => { const bs = [...template.brands]; bs[i] = { ...bs[i], name: e.target.value }; updateField('brands', bs); }} />
                                        <input className="input-field !py-2 text-sm w-36" placeholder="Categoria" value={b.category}
                                            onChange={e => { const bs = [...template.brands]; bs[i] = { ...bs[i], category: e.target.value }; updateField('brands', bs); }} />
                                        <button onClick={() => updateField('brands', template.brands.filter((_, j) => j !== i))}
                                            className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                ))}
                                <button onClick={() => updateField('brands', [...template.brands, { name: '', category: '' }])}
                                    className="text-xs text-[hsl(var(--gold))] hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Adicionar Marca</button>
                            </div>
                        )}

                        {/* SOBRE TAB */}
                        {activeTab === 'sobre' && (
                            <div className="space-y-4">
                                <FieldTextarea label="Parágrafo 1 (Principal)" value={template.aboutParagraph1} onChange={v => updateField('aboutParagraph1', v)} rows={3} />
                                <FieldTextarea label="Parágrafo 2 (Equipe)" value={template.aboutParagraph2} onChange={v => updateField('aboutParagraph2', v)} rows={3} />
                                <FieldTextarea label="Parágrafo 3 (Localização)" value={template.aboutParagraph3} onChange={v => updateField('aboutParagraph3', v)} rows={3} />
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Diferenciais</label>
                                    {template.aboutFeatures.map((f, i) => (
                                        <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                                            <input className="input-field !py-2 text-sm" placeholder="Título" value={f.title}
                                                onChange={e => { const fs = [...template.aboutFeatures]; fs[i] = { ...fs[i], title: e.target.value }; updateField('aboutFeatures', fs); }} />
                                            <input className="input-field !py-2 text-sm" placeholder="Subtítulo" value={f.subtitle}
                                                onChange={e => { const fs = [...template.aboutFeatures]; fs[i] = { ...fs[i], subtitle: e.target.value }; updateField('aboutFeatures', fs); }} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Por Que Nos Escolher</label>
                                    {template.whyChooseUs.map((item, i) => (
                                        <div key={i} className="flex gap-2 mb-1">
                                            <input className="input-field !py-2 text-sm flex-1" value={item}
                                                onChange={e => { const w = [...template.whyChooseUs]; w[i] = e.target.value; updateField('whyChooseUs', w); }} />
                                            <button onClick={() => updateField('whyChooseUs', template.whyChooseUs.filter((_, j) => j !== i))}
                                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => updateField('whyChooseUs', [...template.whyChooseUs, ''])}
                                        className="text-xs text-[hsl(var(--gold))] hover:underline flex items-center gap-1 mt-1"><Plus className="w-3 h-3" /> Adicionar</button>
                                </div>
                            </div>
                        )}

                        {/* DEPOIMENTOS TAB */}
                        {activeTab === 'depoimentos' && (
                            <div className="space-y-4">
                                {template.testimonials.map((t, i) => (
                                    <div key={i} className="card-glass p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[hsl(var(--gold))] font-mono">Depoimento {i + 1}</span>
                                            <button onClick={() => updateField('testimonials', template.testimonials.filter((_, j) => j !== i))}
                                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <FieldInput label="Nome" value={t.name} onChange={v => { const ts = [...template.testimonials]; ts[i] = { ...ts[i], name: v }; updateField('testimonials', ts); }} />
                                            <FieldInput label="Cargo/Função" value={t.role} onChange={v => { const ts = [...template.testimonials]; ts[i] = { ...ts[i], role: v }; updateField('testimonials', ts); }} />
                                        </div>
                                        <FieldTextarea label="Texto" value={t.text} onChange={v => { const ts = [...template.testimonials]; ts[i] = { ...ts[i], text: v }; updateField('testimonials', ts); }} rows={2} />
                                    </div>
                                ))}
                                <button onClick={() => updateField('testimonials', [...template.testimonials, { name: 'Nome', role: 'Morador de {{location}}', text: 'Depoimento aqui.', rating: 5 }])}
                                    className="w-full py-3 rounded-lg border border-dashed border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))] text-sm hover:bg-[hsl(var(--gold))]/5 transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Adicionar Depoimento
                                </button>
                            </div>
                        )}

                        {/* FAQ TAB */}
                        {activeTab === 'faq' && (
                            <div className="space-y-4">
                                {template.faqs.map((faq, i) => (
                                    <div key={i} className="card-glass p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[hsl(var(--gold))] font-mono">FAQ {i + 1}</span>
                                            <button onClick={() => updateField('faqs', template.faqs.filter((_, j) => j !== i))}
                                                className="p-1 text-red-400 hover:bg-red-500/10 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                        <FieldInput label="Pergunta" value={faq.question} onChange={v => { const fs = [...template.faqs]; fs[i] = { ...fs[i], question: v }; updateField('faqs', fs); }} />
                                        <FieldTextarea label="Resposta" value={faq.answer} onChange={v => { const fs = [...template.faqs]; fs[i] = { ...fs[i], answer: v }; updateField('faqs', fs); }} rows={3} />
                                    </div>
                                ))}
                                <button onClick={() => updateField('faqs', [...template.faqs, { question: 'Nova pergunta?', answer: 'Resposta aqui.' }])}
                                    className="w-full py-3 rounded-lg border border-dashed border-[hsl(var(--gold))]/30 text-[hsl(var(--gold))] text-sm hover:bg-[hsl(var(--gold))]/5 transition-all flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Adicionar FAQ
                                </button>
                            </div>
                        )}

                        {/* CONTATO TAB */}
                        {activeTab === 'contato' && (
                            <div className="space-y-4">
                                <div className="card-glass p-4 space-y-3 border border-[hsl(var(--gold))]/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                                        <span className="text-xs text-[hsl(var(--gold))] font-semibold uppercase">Dados de Contato</span>
                                    </div>
                                    <FieldInput label="Endereço (valor de {{address}})" value={template.defaultAddress} onChange={v => updateField('defaultAddress', v)} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <FieldInput label="Telefone (valor de {{phone}})" value={template.defaultPhone} onChange={v => updateField('defaultPhone', v)} />
                                        <FieldInput label="CEP (valor de {{cep}})" value={template.defaultCep} onChange={v => updateField('defaultCep', v)} />
                                    </div>
                                    <p className="text-[10px] text-gray-500">
                                        💡 Preencha aqui o endereço, telefone e CEP da empresa. Esses valores serão usados nas variáveis {'{{address}}'}, {'{{phone}}'} e {'{{cep}}'} de todas as páginas.
                                    </p>
                                </div>

                                <div className="card-glass p-4 space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MessageCircle className="w-4 h-4 text-green-400" />
                                        <span className="text-xs text-green-400 font-semibold uppercase">WhatsApp</span>
                                    </div>
                                    <FieldInput label="Link do WhatsApp (ex: https://wa.me/5511999999999)" value={template.whatsappLink} onChange={v => updateField('whatsappLink', v)} />
                                    <FieldInput label="Mensagem Padrão do WhatsApp" value={template.whatsappMessage} onChange={v => updateField('whatsappMessage', v)} />
                                    <p className="text-[10px] text-gray-500">
                                        💡 Se vazio, o link será gerado automaticamente com o número de cada página. Aceita variáveis como {'{{keyword}}'} e {'{{location}}'}.
                                    </p>
                                </div>

                                <div className="card-glass p-4 space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        <span className="text-xs text-red-400 font-semibold uppercase">Endereço & Google Maps</span>
                                    </div>
                                    <FieldInput label="Endereço (aceita variáveis)" value={template.contactAddress} onChange={v => updateField('contactAddress', v)} />
                                    <FieldInput label="Link do Google Maps (ex: https://maps.app.goo.gl/xxx)" value={template.googleMapsLink} onChange={v => updateField('googleMapsLink', v)} />
                                    <p className="text-[10px] text-gray-500">
                                        💡 Use {'{{address}}'}, {'{{location}}'}, {'{{cep}}'} no endereço. Se o link do Maps estiver vazio, usa coordenadas automáticas.
                                    </p>
                                </div>

                                <div className="card-glass p-4 space-y-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <FileText className="w-4 h-4 text-[hsl(var(--gold))]" />
                                        <span className="text-xs text-[hsl(var(--gold))] font-semibold uppercase">Textos da Seção Contato</span>
                                    </div>
                                    <FieldInput label="Título da Seção Contato" value={template.contactTitle} onChange={v => updateField('contactTitle', v)} />
                                    <FieldTextarea label="Subtítulo da Seção Contato" value={template.contactSubtitle} onChange={v => updateField('contactSubtitle', v)} rows={2} />
                                    <FieldInput label="Horário Dias Úteis" value={template.weekdayHours} onChange={v => updateField('weekdayHours', v)} />
                                    <FieldInput label="Horário Sábado" value={template.saturdayHours} onChange={v => updateField('saturdayHours', v)} />
                                    <FieldTextarea label="Texto de Agendamento/CTA" value={template.schedule} onChange={v => updateField('schedule', v)} rows={2} />
                                    <FieldTextarea label="Texto do Footer" value={template.footerText} onChange={v => updateField('footerText', v)} rows={2} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview */}
                    <div>
                        <h3 className="text-sm font-semibold text-[hsl(var(--gold))] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview (Vila Mariana)
                        </h3>
                        <div className="card-glass p-6 space-y-4 text-sm sticky top-20">
                            {activeTab === 'empresa' && (
                                <div className="space-y-3">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-gradient-gold">{template.companyName}</h2>
                                        <p className="text-gray-400">{template.companyTagline}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="font-bold text-xl text-gradient-gold">{template.yearsExperience}</p>
                                            <p className="text-xs text-gray-500">Experiência</p>
                                        </div>
                                        <div className="text-center p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="font-bold text-xl text-gradient-gold">{template.totalClients}</p>
                                            <p className="text-xs text-gray-500">Clientes</p>
                                        </div>
                                        <div className="text-center p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="font-bold text-xl text-gradient-gold">{template.avgRating}</p>
                                            <p className="text-xs text-gray-500">Avaliação</p>
                                        </div>
                                        <div className="text-center p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="font-bold text-xl text-gradient-gold">{template.warranty}</p>
                                            <p className="text-xs text-gray-500">Garantia</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'hero' && (
                                <div className="space-y-4">
                                    <div className="badge-gold inline-block text-xs">Conserto de Notebook em Vila Mariana - Zona Sul</div>
                                    <h2 className="text-xl font-bold">Conserto <span className="text-gradient-gold">de</span> Notebook em Vila Mariana - SP</h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">{resolvePreview(template.heroSubtitle)}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {template.heroBadges.map((b, i) => (
                                            <span key={i} className="flex items-center gap-1 text-xs text-gray-300">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--gold))]" /> {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'servicos' && (
                                <div className="space-y-3">
                                    {template.services.slice(0, 3).map((s, i) => (
                                        <div key={i} className="p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <h4 className="font-semibold text-white text-sm">{resolvePreview(s.title)}</h4>
                                            <p className="text-xs text-gray-400 mt-1">{resolvePreview(s.description)}</p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {s.features.map((f, j) => (
                                                    <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))]">{f}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    {template.services.length > 3 && <p className="text-xs text-gray-500 text-center">+ {template.services.length - 3} serviços</p>}
                                </div>
                            )}
                            {activeTab === 'marcas' && (
                                <div className="grid grid-cols-4 gap-2">
                                    {template.brands.map((b, i) => (
                                        <div key={i} className="text-center p-2 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="text-xs font-semibold text-white">{b.name}</p>
                                            <p className="text-[10px] text-[hsl(var(--gold))]">{b.category}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'sobre' && (
                                <div className="space-y-3">
                                    <p className="text-gray-300 text-xs leading-relaxed">{resolvePreview(template.aboutParagraph1)}</p>
                                    <p className="text-gray-300 text-xs leading-relaxed">{resolvePreview(template.aboutParagraph2)}</p>
                                    <p className="text-gray-300 text-xs leading-relaxed">{resolvePreview(template.aboutParagraph3)}</p>
                                </div>
                            )}
                            {activeTab === 'depoimentos' && (
                                <div className="space-y-3">
                                    {template.testimonials.map((t, i) => (
                                        <div key={i} className="p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <div className="flex gap-1 mb-1">{[...Array(t.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />)}</div>
                                            <p className="text-xs text-gray-300 italic">"{resolvePreview(t.text)}"</p>
                                            <p className="text-xs text-gray-500 mt-1">— {t.name}, {resolvePreview(t.role)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'faq' && (
                                <div className="space-y-3">
                                    {template.faqs.map((f, i) => (
                                        <div key={i} className="p-3 bg-[hsl(var(--black))]/50 rounded-lg">
                                            <p className="text-xs font-semibold text-white"><span className="text-[hsl(var(--gold))]">Q:</span> {resolvePreview(f.question)}</p>
                                            <p className="text-xs text-gray-400 mt-1">{resolvePreview(f.answer)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'contato' && (
                                <div className="space-y-3">
                                    <div className="p-3 bg-[hsl(var(--black))]/50 rounded-lg space-y-1 border border-[hsl(var(--gold))]/20">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-3.5 h-3.5 text-[hsl(var(--gold))]" />
                                            <span className="text-xs text-[hsl(var(--gold))] font-semibold">Dados de Contato</span>
                                        </div>
                                        <p className="text-xs text-gray-300">📍 {template.defaultAddress || <span className="text-gray-500 italic">não definido (usa dado da página)</span>}</p>
                                        <p className="text-xs text-gray-300">📞 {template.defaultPhone || <span className="text-gray-500 italic">não definido (usa dado da página)</span>}</p>
                                        <p className="text-xs text-gray-300">📮 {template.defaultCep || <span className="text-gray-500 italic">não definido (usa dado da página)</span>}</p>
                                    </div>
                                    <div className="p-3 bg-[hsl(var(--black))]/50 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                                            <span className="text-xs text-green-400 font-semibold">WhatsApp</span>
                                        </div>
                                        <p className="text-xs text-gray-300 break-all">
                                            {template.whatsappLink || 'https://wa.me/5511999999999'}
                                        </p>
                                        <p className="text-[10px] text-gray-500">
                                            Mensagem: "{resolvePreview(template.whatsappMessage)}"
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[hsl(var(--black))]/50 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-red-400" />
                                            <span className="text-xs text-red-400 font-semibold">Endereço & Maps</span>
                                        </div>
                                        <p className="text-xs text-gray-300">
                                            {resolvePreview(template.contactAddress)}
                                        </p>
                                        <p className="text-xs text-gray-500 break-all">
                                            🗺️ {template.googleMapsLink || 'Auto (coordenadas da página)'}
                                        </p>
                                    </div>
                                    <div className="p-3 bg-[hsl(var(--black))]/50 rounded-lg space-y-2">
                                        <h4 className="text-sm font-bold text-white">{resolvePreview(template.contactTitle)}</h4>
                                        <p className="text-xs text-gray-400">{resolvePreview(template.contactSubtitle)}</p>
                                    </div>
                                    <div className="p-3 bg-[hsl(var(--black))]/50 rounded-lg space-y-1">
                                        <p className="text-xs text-gray-300">{template.weekdayHours}</p>
                                        <p className="text-xs text-gray-300">{template.saturdayHours}</p>
                                    </div>
                                    <p className="text-xs text-gray-400">{resolvePreview(template.schedule)}</p>
                                    <p className="text-xs text-gray-500 border-t border-[hsl(var(--gold))]/10 pt-3">{resolvePreview(template.footerText)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Reusable components
function FieldInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            <input type="text" className="input-field !py-2.5 text-sm" value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
            <textarea className="input-field !py-2.5 text-sm resize-y" rows={rows} value={value} onChange={e => onChange(e.target.value)} />
        </div>
    );
}
