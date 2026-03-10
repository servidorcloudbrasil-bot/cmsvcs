import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPageBySlug, type PageData } from '../lib/pageStore';
import { getTemplate, resolveTemplate } from '../lib/templateStore';
import {
    Cpu, Monitor, Wrench, Zap, Shield, Clock, MapPin, Phone, MessageCircle,
    Star, CheckCircle2, Award, Users, TrendingUp, Laptop, Gamepad2,
    Thermometer, Battery, HardDrive, Search, FileText, AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<PageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (slug) {
            const found = getPageBySlug(slug);
            setPage(found);
        }
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[hsl(var(--black))] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[hsl(var(--gold))] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!page) {
        return (
            <div className="min-h-screen bg-[hsl(var(--black))] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Página não encontrada</h1>
                    <p className="text-gray-400 mb-6">A página solicitada não existe ou está desativada.</p>
                    <Link to="/" className="btn-primary inline-flex items-center gap-2">
                        Voltar ao Início
                    </Link>
                </div>
            </div>
        );
    }

    // Load editable template
    const tpl = getTemplate();

    // Dynamic data based on page config
    const kw = page.keyword;
    const loc = page.location;
    const fullTitle = `${kw} em ${loc} - SP`;

    // WhatsApp link: use template link or auto-generate
    const whatsappMessage = resolveTemplate(tpl.whatsappMessage, { keyword: kw.toLowerCase(), location: loc });
    const whatsappLink = tpl.whatsappLink
        ? `${tpl.whatsappLink}${tpl.whatsappLink.includes('?') ? '&' : '?'}text=${encodeURIComponent(whatsappMessage)}`
        : `https://wa.me/${page.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

    // Google Maps link: use template link or auto-generate
    const googleMapsLink = tpl.googleMapsLink || `https://www.google.com/maps?q=${page.lat},${page.lng}`;

    // Template variable resolution — template defaults override per-page data
    const vars: Record<string, string> = {
        keyword: kw,
        location: loc,
        zona: page.zona,
        address: tpl.defaultAddress || page.address,
        cep: tpl.defaultCep || page.cep,
        referencia: page.referencia,
        phone: tpl.defaultPhone || page.phone,
        whatsapp: page.whatsapp,
        companyName: tpl.companyName,
        yearsExperience: tpl.yearsExperience,
        totalClients: tpl.totalClients,
    };
    const r = (text: string) => resolveTemplate(text, vars);

    const serviceIcons = [
        <Gamepad2 className="w-7 h-7" />, <Monitor className="w-7 h-7" />,
        <Cpu className="w-7 h-7" />, <Thermometer className="w-7 h-7" />,
        <Battery className="w-7 h-7" />, <HardDrive className="w-7 h-7" />
    ];

    const services = tpl.services.map((svc, i) => ({
        icon: serviceIcons[i % serviceIcons.length],
        title: r(svc.title),
        description: r(svc.description),
        features: svc.features
    }));

    const brands = tpl.brands;

    const testimonials = tpl.testimonials.map(t => ({
        name: t.name,
        role: r(t.role),
        text: r(t.text),
        rating: t.rating
    }));

    const stats = [
        { number: tpl.yearsExperience, label: 'Anos de Experiência', icon: <Award className="w-6 h-6" /> },
        { number: tpl.totalClients, label: 'Notebooks Consertados', icon: <Laptop className="w-6 h-6" /> },
        { number: tpl.avgRating, label: 'Avaliação Média', icon: <Star className="w-6 h-6" /> },
        { number: tpl.warranty, label: 'Garantia em Todos Serviços', icon: <Shield className="w-6 h-6" /> }
    ];

    const faqs = tpl.faqs.map(f => ({
        question: r(f.question),
        answer: r(f.answer)
    }));

    return (
        <div className="min-h-screen bg-[hsl(var(--black))] text-white overflow-x-hidden">
            {/* Schema.org - LocalBusiness + GeoCoordinates */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    "name": `Notebook Master SP - ${loc}`,
                    "description": `${kw} em ${loc} - SP. Especialistas em notebooks gamer. Mais de 25 anos de experiência.`,
                    "url": `https://notebookmastersp.com.br/${page.slug}`,
                    "telephone": page.phone,
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": page.address,
                        "addressLocality": loc,
                        "addressRegion": "SP",
                        "postalCode": page.cep,
                        "addressCountry": "BR"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": page.lat,
                        "longitude": page.lng
                    },
                    "openingHoursSpecification": [
                        {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                            "opens": "08:00",
                            "closes": "18:00"
                        },
                        {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": "Saturday",
                            "opens": "09:00",
                            "closes": "13:00"
                        }
                    ],
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": "4.9",
                        "reviewCount": "850"
                    },
                    "priceRange": "$$",
                    "areaServed": {
                        "@type": "City",
                        "name": "São Paulo"
                    }
                })
            }} />

            {/* Schema.org - BreadcrumbList */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://notebookmastersp.com.br"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": `${kw} em ${loc}`,
                            "item": `https://notebookmastersp.com.br/${page.slug}`
                        }
                    ]
                })
            }} />

            {/* Schema.org - FAQPage */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": faqs.map(faq => ({
                        "@type": "Question",
                        "name": faq.question,
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": faq.answer
                        }
                    }))
                })
            }} />

            {/* GeoPosition Meta Tags (rendered via useEffect in head) */}
            <GeoMeta lat={page.lat} lng={page.lng} location={loc} />

            {/* Header/Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--black))]/95 backdrop-blur-md border-b border-[hsl(var(--gold))]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center">
                                <Laptop className="w-6 h-6 text-[hsl(var(--black))]" />
                            </div>
                            <div>
                                <h1 className="text-lg md:text-xl font-bold text-gradient-gold">{tpl.companyName}</h1>
                                <p className="text-xs text-gray-400 hidden sm:block">{loc} - {page.zona}</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#servicos" className="text-sm text-gray-300 hover:text-[hsl(var(--gold))] transition-colors">Serviços</a>
                            <a href="#marcas" className="text-sm text-gray-300 hover:text-[hsl(var(--gold))] transition-colors">Marcas</a>
                            <a href="#sobre" className="text-sm text-gray-300 hover:text-[hsl(var(--gold))] transition-colors">Sobre</a>
                            <a href="#depoimentos" className="text-sm text-gray-300 hover:text-[hsl(var(--gold))] transition-colors">Depoimentos</a>
                            <a href="#contato" className="text-sm text-gray-300 hover:text-[hsl(var(--gold))] transition-colors">Contato</a>
                        </nav>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm py-2 px-4 md:py-3 md:px-6 flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline">Orçamento Grátis</span>
                            <span className="sm:hidden">Orçar</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
                <div className="absolute inset-0 gradient-hero" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--gold))]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--navy-light))]/40 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="inline-flex items-center gap-2 badge-gold">
                                <MapPin className="w-3 h-3" />
                                <span>{kw} em {loc} - {page.zona}</span>
                            </div>

                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                {kw.split(' ').map((word, i) => (
                                    i === Math.floor(kw.split(' ').length / 2)
                                        ? <span key={i}><span className="text-gradient-gold">{word}</span>{' '}</span>
                                        : <span key={i}>{word}{' '}</span>
                                ))}
                                em {loc} - SP
                            </h2>

                            <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
                                {r(tpl.heroSubtitle)}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary flex items-center justify-center gap-2 text-center"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Falar no WhatsApp
                                </a>
                                <a href="#servicos" className="btn-secondary flex items-center justify-center gap-2 text-center">
                                    <Wrench className="w-5 h-5" />
                                    Ver Serviços
                                </a>
                            </div>

                            <div className="flex items-center gap-6 pt-4">
                                {tpl.heroBadges.map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))]" />
                                        <span className="text-sm text-gray-300">{badge}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--gold))]/20 to-[hsl(var(--navy-light))]/20 rounded-3xl blur-2xl" />
                                <div className="relative card-glass p-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        {stats.map((stat, index) => (
                                            <div key={index} className="text-center p-4 rounded-xl bg-[hsl(var(--black))]/50 border border-[hsl(var(--gold))]/10">
                                                <div className="flex justify-center mb-2 text-[hsl(var(--gold))]">{stat.icon}</div>
                                                <div className="text-2xl sm:text-3xl font-bold text-gradient-gold">{stat.number}</div>
                                                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Serviços Section */}
            <section id="servicos" className="section-padding relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="badge-gold mb-4 inline-block">Serviços em {loc}</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            {kw}{' '}
                            <span className="text-gradient-gold">em {loc}</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Oferecemos soluções completas para {kw.toLowerCase()} em {loc} - SP.
                            Desde manutenção preventiva até reparos complexos em placa mãe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <div key={index} className="card-glass card-hover p-6 sm:p-8">
                                <div className="icon-container mb-6">{service.icon}</div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-300">
                                            <CheckCircle2 className="w-4 h-4 text-[hsl(var(--gold))] flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Marcas Section */}
            <section id="marcas" className="section-padding relative bg-[hsl(var(--navy))]/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="badge-gold mb-4 inline-block">Marcas Atendidas em {loc}</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Consertamos{' '}
                            <span className="text-gradient-gold">Todas as Marcas</span>
                            {' '}em {loc}
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                        {brands.map((brand, index) => (
                            <div key={index} className="card-glass p-4 text-center card-hover">
                                <div className="text-sm font-semibold text-white mb-1">{brand.name}</div>
                                <div className="text-xs text-[hsl(var(--gold))]">{brand.category}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center gap-2"
                        >
                            <Phone className="w-5 h-5" />
                            Consultar em {loc}
                        </a>
                    </div>
                </div>
            </section>

            {/* Sobre Section */}
            <section id="sobre" className="section-padding relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="badge-gold mb-4 inline-block">Sobre Nós em {loc}</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                <span className="text-gradient-gold">{tpl.yearsExperience} Anos</span> de Experiência
                                em {loc} - SP
                            </h2>
                            <div className="space-y-4 text-gray-300">
                                <p>{r(tpl.aboutParagraph1)}</p>
                                <p>{r(tpl.aboutParagraph2)}</p>
                                <p>{r(tpl.aboutParagraph3)}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-8">
                                {tpl.aboutFeatures.map((feat, i) => {
                                    const icons = [<Award className="w-5 h-5" />, <Zap className="w-5 h-5" />, <Shield className="w-5 h-5" />, <Users className="w-5 h-5" />];
                                    return (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="icon-container flex-shrink-0">{icons[i % icons.length]}</div>
                                            <div>
                                                <h4 className="font-semibold text-white">{r(feat.title)}</h4>
                                                <p className="text-sm text-gray-400">{r(feat.subtitle)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-[hsl(var(--navy-light))]/10 rounded-3xl blur-2xl" />
                            <div className="relative card-glass p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">Por Que Nos Escolher em {loc}?</h3>
                                <div className="space-y-4">
                                    {tpl.whyChooseUs.map(r).map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--black))]/50">
                                            <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))] flex-shrink-0" />
                                            <span className="text-sm text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Como Funciona Section */}
            <section className="section-padding relative bg-[hsl(var(--navy))]/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="badge-gold mb-4 inline-block">Nosso Processo em {loc}</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Como Funciona o{' '}
                            <span className="text-gradient-gold">Atendimento em {loc}</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            ...tpl.processSteps.map((step, idx) => {
                                const icons = [<MessageCircle className="w-6 h-6" />, <Search className="w-6 h-6" />, <FileText className="w-6 h-6" />, <Wrench className="w-6 h-6" />];
                                return { icon: icons[idx % icons.length], num: String(idx + 1).padStart(2, '0'), title: r(step.title), desc: r(step.description), link: idx === 0 ? whatsappLink : undefined };
                            }),
                        ].map((step, i) => (
                            <div key={i} className="relative">
                                <div className="card-glass p-6 sm:p-8 h-full card-hover">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="icon-container">{step.icon}</div>
                                        <span className="text-5xl font-bold text-[hsl(var(--gold))]/20">{step.num}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                                    {step.link && (
                                        <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                                            <a href={step.link} target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--gold))] text-sm font-medium hover:underline flex items-center gap-2">
                                                <MessageCircle className="w-4 h-4" />
                                                Chamar no WhatsApp
                                            </a>
                                        </div>
                                    )}
                                </div>
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <div className="w-6 h-6 border-t-2 border-r-2 border-[hsl(var(--gold))]/40 rotate-45" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Depoimentos */}
            <section id="depoimentos" className="section-padding relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="badge-gold mb-4 inline-block">Depoimentos</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Clientes de{' '}
                            <span className="text-gradient-gold">{loc}</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="card-glass p-6 card-hover">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center text-[hsl(var(--black))] font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-400">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-[hsl(var(--gold))]" />
                            <span className="text-sm text-gray-300">{tpl.successRate} de Taxa de Sucesso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-[hsl(var(--gold))]" />
                            <span className="text-sm text-gray-300">+{tpl.totalClients} Clientes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[hsl(var(--gold))]" />
                            <span className="text-sm text-gray-300">Atendimento em 24h</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding relative bg-[hsl(var(--navy))]/30">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="badge-gold mb-4 inline-block">Dúvidas sobre {loc}</span>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                            Perguntas sobre{' '}
                            <span className="text-gradient-gold">{kw} em {loc}</span>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="card-glass p-6">
                                <h3 className="font-semibold text-white mb-3 flex items-start gap-3">
                                    <span className="text-[hsl(var(--gold))]">Q:</span>
                                    {faq.question}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed pl-7">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contato */}
            <section id="contato" className="section-padding relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <span className="badge-gold mb-4 inline-block">Contato em {loc}</span>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                                {r(tpl.contactTitle)}
                            </h2>
                            <p className="text-gray-400 text-lg mb-8">
                                {r(tpl.contactSubtitle)}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="icon-container flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Endereço em {loc}</h4>
                                        <p className="text-gray-400 text-sm">
                                            {r(tpl.contactAddress)}<br />
                                            <span className="text-[hsl(var(--gold))] text-xs">{page.referencia}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="icon-container flex-shrink-0"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Telefone {loc}</h4>
                                        <p className="text-gray-400 text-sm">{page.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="icon-container flex-shrink-0"><Clock className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-semibold text-white mb-1">Horário de Atendimento</h4>
                                        <p className="text-gray-400 text-sm">
                                            {tpl.weekdayHours}<br />
                                            {tpl.saturdayHours}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-[hsl(var(--navy-light))]/10 rounded-3xl blur-2xl" />
                            <div className="relative card-glass p-8">
                                <h3 className="text-2xl font-bold mb-6 text-center">{kw} em {loc}</h3>
                                <div className="space-y-4">
                                    <a
                                        href={whatsappLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary w-full flex items-center justify-center gap-3 py-4"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                        <div className="text-left">
                                            <div className="text-sm opacity-80">Orçamento Rápido</div>
                                            <div className="font-bold">Chamar no WhatsApp</div>
                                        </div>
                                    </a>

                                    <a
                                        href={`tel:+${page.whatsapp}`}
                                        className="btn-secondary w-full flex items-center justify-center gap-3 py-4"
                                    >
                                        <Phone className="w-6 h-6" />
                                        <div className="text-left">
                                            <div className="text-sm opacity-80">Prefere ligar?</div>
                                            <div className="font-bold">{page.phone}</div>
                                        </div>
                                    </a>
                                </div>

                                {/* Google Maps Embed */}
                                <div className="mt-6 rounded-xl overflow-hidden border border-[hsl(var(--gold))]/20">
                                    <iframe
                                        title={`Mapa ${loc}`}
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        src={tpl.googleMapsLink
                                            ? `https://www.google.com/maps?q=${encodeURIComponent(tpl.googleMapsLink)}&output=embed`
                                            : `https://www.google.com/maps?q=${page.lat},${page.lng}&z=15&output=embed`
                                        }
                                    />
                                </div>

                                <a
                                    href={googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[hsl(var(--gold))]/20 text-sm text-gray-300 hover:bg-[hsl(var(--gold))]/5 hover:text-[hsl(var(--gold))] transition-all"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Ver no Google Maps
                                </a>

                                <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                                    <p className="text-xs text-gray-500 text-center">
                                        Coordenadas: {page.lat}, {page.lng} • CEP: {page.cep}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16 relative">
                <div className="absolute inset-0 gradient-gold opacity-10" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Precisa de {kw.toLowerCase()} em {loc}?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8">
                        {r(tpl.schedule)}
                    </p>
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-5 pulse-gold"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Orçamento Grátis em {loc}
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-[hsl(var(--gold))]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center">
                                    <Laptop className="w-6 h-6 text-[hsl(var(--black))]" />
                                </div>
                                <h3 className="text-lg font-bold text-gradient-gold">{tpl.companyName}</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-4">
                                {r(tpl.footerText)}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Serviços em {loc}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Conserto Notebook Gamer</li>
                                <li>Troca de Tela</li>
                                <li>Reparo Placa Mãe</li>
                                <li>Limpeza Térmica</li>
                                <li>Upgrade SSD/RAM</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Contato {loc}</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                                    {page.address}
                                </li>
                                <li className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                                    {loc} - SP, {page.cep}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-[hsl(var(--gold))]" />
                                    {page.phone}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[hsl(var(--gold))]/10 text-center">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} {tpl.companyName} - {fullTitle}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                            {kw} em {loc} - SP | {page.address} | {page.phone} | {page.zona}
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Component to inject geo meta tags into document head
function GeoMeta({ lat, lng, location }: { lat: number; lng: number; location: string }) {
    useEffect(() => {
        const setMeta = (name: string, content: string) => {
            let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        };

        // Standard geo meta tags
        setMeta('geo.position', `${lat};${lng}`);
        setMeta('geo.placename', `${location}, São Paulo - SP`);
        setMeta('geo.region', 'BR-SP');
        setMeta('ICBM', `${lat}, ${lng}`);

        // Update page title
        document.title = `Conserto de Notebook em ${location} - SP | Notebook Master SP`;

        // Update meta description
        setMeta('description', `Conserto de Notebook em ${location} - SP. Especialistas em notebooks gamer. Orçamento grátis. Garantia 6 meses. Mais de 25 anos de experiência. Atendemos toda ${location}.`);

        return () => {
            // Cleanup on unmount
            ['geo.position', 'geo.placename', 'geo.region', 'ICBM'].forEach(name => {
                const meta = document.querySelector(`meta[name="${name}"]`);
                meta?.remove();
            });
        };
    }, [lat, lng, location]);

    return null;
}
