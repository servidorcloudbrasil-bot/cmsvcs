// Template Store - Textos editáveis das landing pages usando API MySQL
export interface LandingTemplate {
    // Empresa
    companyName: string;
    companyTagline: string;
    yearsExperience: string;
    totalClients: string;
    avgRating: string;
    warranty: string;
    priceRange: string;
    successRate: string;

    // Hero
    heroSubtitle: string;
    heroBadges: string[];

    // Serviços
    services: {
        title: string;
        description: string;
        features: string[];
    }[];

    // Marcas
    brands: { name: string; category: string }[];

    // Sobre
    aboutParagraph1: string;
    aboutParagraph2: string;
    aboutParagraph3: string;
    aboutFeatures: { title: string; subtitle: string }[];
    whyChooseUs: string[];

    // Processo
    processSteps: { title: string; description: string }[];

    // Depoimentos
    testimonials: { name: string; role: string; text: string; rating: number }[];

    // FAQ
    faqs: { question: string; answer: string }[];

    // Contato
    contactTitle: string;
    contactSubtitle: string;
    schedule: string;

    // Horários
    weekdayHours: string;
    saturdayHours: string;

    // Links
    googleMapsLink: string;
    whatsappLink: string;
    whatsappMessage: string;
    contactAddress: string;

    // Dados padrão de contato
    defaultAddress: string;
    defaultPhone: string;
    defaultCep: string;

    // Footer
    footerText: string;

    // Schema SEO
    schemaSocialLinks: string[];
    schemaOpeningHours: string;
    schemaRatingValue: string;
    schemaReviewCount: string;
}

const API_BASE = '/api';

export const defaultTemplate: LandingTemplate = {
    companyName: 'Notebook Master SP',
    companyTagline: 'Especialistas em Notebooks Gamer',
    yearsExperience: '25+',
    totalClients: '15.000+',
    avgRating: '4.9',
    warranty: '6 Meses',
    priceRange: '$$',
    successRate: '97%',
    heroSubtitle: 'Mais de {{yearsExperience}} anos de experiência em {{keyword}} em {{location}} - SP. Especialistas em notebooks gamer: Razer, Alienware, Lenovo Legion, Acer Nitro, Gigabyte e mais. Atendemos toda {{location}} e {{zona}}.',
    heroBadges: ['Orçamento Grátis', 'Garantia 6 Meses', 'Peças Originais'],
    services: [
        {
            title: 'Notebook Gamer em {{location}}',
            description: 'Especialistas em notebooks gamer em {{location}} - SP. Razer, Alienware, Lenovo Legion, Acer Nitro, Gigabyte, ASUS ROG e MSI.',
            features: ['Overheating', 'Placa de Vídeo', 'Upgrade de RAM', 'SSD NVMe']
        },
        {
            title: 'Troca de Tela em {{location}}',
            description: 'Troca de tela de notebook em {{location}}. Telas quebradas, linhas, manchas ou flickering. Full HD, 4K, 144Hz e 240Hz.',
            features: ['Tela Original', 'Garantia 1 Ano', 'Instalação Rápida', 'Todas Marcas']
        },
        {
            title: 'Reparo Placa Mãe {{location}}',
            description: 'Reparo de placa mãe de notebook em {{location}} - SP. Diagnóstico avançado e reparo de nível componente BGA, GPU, CPU.',
            features: ['BGA Reballing', 'Troca GPU', 'Reparo Circuito', 'Diagnóstico Free']
        },
        {
            title: 'Limpeza Térmica {{location}}',
            description: 'Limpeza térmica de notebook em {{location}}. Troca de pasta térmica premium e otimização do sistema de refrigeração.',
            features: ['Pasta Térmica MX-4', 'Limpeza Fans', 'Troca Thermal Pads', 'Teste Estresse']
        },
        {
            title: 'Troca de Bateria em {{location}}',
            description: 'Troca de bateria de notebook in {{location}} - SP. Baterias originais e compatíveis para todas as marcas.',
            features: ['Bateria Original', 'Garantia 6 Meses', 'Calibração', 'Teste Carga']
        },
        {
            title: 'Upgrade SSD/RAM {{location}}',
            description: 'Upgrade de SSD e RAM de notebook em {{location}}. SSD NVMe e memória RAM de alta performance.',
            features: ['SSD NVMe Gen4', 'RAM DDR4/DDR5', 'Clone HD', 'Otimização SO']
        }
    ],
    brands: [
        { name: 'Razer', category: 'Gamer Premium' },
        { name: 'Alienware', category: 'Gamer Premium' },
        { name: 'Lenovo Legion', category: 'Gamer' },
        { name: 'Acer Nitro', category: 'Gamer' },
        { name: 'Gigabyte', category: 'Gamer' },
        { name: 'ASUS ROG', category: 'Gamer' },
        { name: 'MSI', category: 'Gamer' },
        { name: 'HP Omen', category: 'Gamer' },
        { name: 'Dell', category: 'Corporativo' },
        { name: 'Lenovo', category: 'Corporativo' },
        { name: 'HP', category: 'Corporativo' },
        { name: 'Acer', category: 'Popular' },
        { name: 'Samsung', category: 'Popular' },
        { name: 'Apple', category: 'Premium' },
        { name: 'Microsoft', category: 'Premium' },
        { name: 'LG', category: 'Popular' }
    ],
    aboutParagraph1: 'Desde 1999, a {{companyName}} é referência em {{keyword}} em {{location}} - SP. Localizados em {{address}}, começamos como uma pequena assistência técnica e hoje somos líderes no mercado de reparo de notebooks gamer de alta performance.',
    aboutParagraph2: 'Nossa equipe de técnicos certificados é especializada em reparo de placas de vídeo, placas mãe e sistemas de refrigeração de notebooks gamer. Atendemos toda {{location}} e região com excelência e compromisso.',
    aboutParagraph3: 'Atendemos moradores de {{location}} e toda a {{zona}}. Desde gamers profissionais até empresas e usuários corporativos. {{referencia}}.',
    aboutFeatures: [
        { title: 'Técnicos Certificados', subtitle: 'Equipe especializada' },
        { title: 'Equipamentos Modernos', subtitle: 'Tecnologia de ponta' },
        { title: 'Garantia Real', subtitle: '6 meses a 1 ano' },
        { title: '+{{totalClients}} Clientes', subtitle: 'Satisfação comprovada' },
    ],
    whyChooseUs: [
        'Atendimento especializado em {{location}}',
        'Orçamento gratuito em até 2 horas',
        'Diagnóstico avançado com equipamentos de ponta',
        'Peças originais e compatíveis de qualidade',
        'Garantia de 6 meses a 1 ano',
        'Localização acessível em {{location}}',
        'Coleta e entrega disponível',
        'Pagamento facilitado em até 12x'
    ],
    processSteps: [
        { title: 'Contato pelo WhatsApp', description: 'Entre em contato pelo WhatsApp ou traga seu notebook na {{location}}. Coleta disponível.' },
        { title: 'Diagnóstico Detalhado', description: 'Nossa equipe analisa o problema. Diagnóstico 100% descontado se aprovar.' },
        { title: 'Orçamento Transparente', description: 'Orçamento completo, claro e sem surpresas ou taxas ocultas.' },
        { title: 'Conserto com Garantia', description: '{{keyword}} com garantia de 6 meses a 1 ano. Qualidade garantida em {{location}}.' }
    ],
    testimonials: [
        { name: 'Carlos Mendes', role: 'Morador de {{location}}', text: 'Meu Razer Blade estava superaquecendo e desligando. Trouxeram na {{location}} e em 3 dias estava perfeito. Profissionais de verdade!', rating: 5 },
        { name: 'Fernanda Lima', role: 'Arquiteta', text: 'Troquei a tela do meu Dell XPS na assistência em {{location}}. Serviço impecável, tela original e preço justo. Recomendo demais!', rating: 5 },
        { name: 'Ricardo Souza', role: 'Desenvolvedor', text: 'Upgrade de SSD e RAM no meu Lenovo Legion. Atendimento em {{location}} excelente e orçamento na hora.', rating: 5 },
        { name: 'Amanda Costa', role: 'Designer', text: 'Repararam a placa mãe do meu MacBook Pro que outras assistências de {{location}} disseram ser irreparável!', rating: 5 }
    ],
    faqs: [
        { question: 'Quanto tempo leva o {{keyword}} em {{location}}?', answer: 'O tempo de {{keyword}} varia conforme o problema. Manutenções simples levam 2-24h. Reparos em placa mãe levam 3-7 dias úteis. Sempre informamos o prazo no orçamento.' },
        { question: 'Vocês atendem {{location}} e região?', answer: 'Sim! Atendemos {{location}} e toda a {{zona}}. Nossa equipe está pronta para receber seu notebook com conveniência e rapidez.' },
        { question: 'O orçamento é realmente gratuito?', answer: 'Sim! Diagnóstico e orçamento são 100% gratuitos e sem compromisso. Você só paga se aprovar o serviço. Transparência total nos valores.' },
        { question: 'Como funciona a garantia do {{keyword}}?', answer: 'Todos os nossos serviços têm garantia de 6 meses a 1 ano, dependendo do tipo de reparo. Usamos apenas peças de qualidade e procedimentos profissionais.' },
        { question: 'Qual o endereço mais próximo de {{location}}?', answer: 'Estamos em {{address}}, {{location}} - SP (CEP: {{cep}}). {{referencia}}. Fácil acesso por transporte público e carro.' }
    ],
    contactTitle: '{{keyword}} {{location}} - Orçamento Grátis',
    contactSubtitle: 'Precisa de {{keyword}} em {{location}}? Entre em contato agora. Orçamento em até 2 horas.',
    schedule: 'Orçamento grátis em até 2 horas. Garantia de 6 meses a 1 ano.',
    weekdayHours: 'Segunda a Sexta: 08h às 18h',
    saturdayHours: 'Sábado: 09h às 13h',
    googleMapsLink: '',
    whatsappLink: '',
    whatsappMessage: 'Olá! Gostaria de um orçamento para {{keyword}} em {{location}}.',
    contactAddress: '{{address}}, {{location}} - SP, CEP: {{cep}}',
    defaultAddress: '',
    defaultPhone: '',
    defaultCep: '',
    footerText: '{{keyword}} em {{location}} - SP. Há mais de {{yearsExperience}} anos. Orçamento grátis e garantia real.',
    schemaSocialLinks: [
        'https://facebook.com/notebookmastersp',
        'https://instagram.com/notebookmastersp',
        'https://g.page/notebookmastersp'
    ],
    schemaOpeningHours: 'Mo-Fr 08:00-18:00, Sa 09:00-13:00',
    schemaRatingValue: '4.9',
    schemaReviewCount: '15000',
};

export async function getTemplate(): Promise<LandingTemplate> {
    try {
        const response = await fetch(`${API_BASE}/template`);
        if (!response.ok) throw new Error('Failed to fetch template');
        const data = await response.json();
        if (data) {
            return { ...defaultTemplate, ...data };
        }
        return { ...defaultTemplate };
    } catch {
        return { ...defaultTemplate };
    }
}

export async function saveTemplate(template: LandingTemplate): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/template`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(template),
        });
        return response.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export function resolveTemplate(text: string, vars: Record<string, string>): string {
    let result = text;
    for (const [key, value] of Object.entries(vars)) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return result;
}
