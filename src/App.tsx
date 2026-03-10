import { 
  Cpu, 
  Monitor, 
  Wrench, 
  Zap, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle,
  Star,
  CheckCircle2,
  Award,
  Users,
  TrendingUp,
  Laptop,
  Gamepad2,
  Thermometer,
  Battery,
  HardDrive,
  Search,
  FileText
} from 'lucide-react';
import { useEffect, useState } from 'react';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: <Gamepad2 className="w-7 h-7" />,
      title: 'Notebook Gamer em São Paulo',
      description: 'Especialistas em notebooks gamer em São Paulo - SP. Razer, Alienware, Lenovo Legion, Acer Nitro, Gigabyte, ASUS ROG e MSI.',
      features: ['Overheating', 'Placa de Vídeo', 'Upgrade de RAM', 'SSD NVMe']
    },
    {
      icon: <Monitor className="w-7 h-7" />,
      title: 'Troca de Tela SP',
      description: 'Troca de tela de notebook em São Paulo. Telas quebradas, linhas, manchas ou flickering. Full HD, 4K, 144Hz e 240Hz.',
      features: ['Tela Original', 'Garantia 1 Ano', 'Instalação Rápida', 'Todas Marcas']
    },
    {
      icon: <Cpu className="w-7 h-7" />,
      title: 'Reparo Placa Mãe São Paulo',
      description: 'Reparo de placa mãe de notebook em São Paulo - SP. Diagnóstico avançado e reparo de nível componente BGA, GPU, CPU.',
      features: ['BGA Reballing', 'Troca GPU', 'Reparo Circuito', 'Diagnóstico Free']
    },
    {
      icon: <Thermometer className="w-7 h-7" />,
      title: 'Limpeza Térmica SP',
      description: 'Limpeza térmica de notebook em São Paulo. Troca de pasta térmica premium e otimização do sistema de refrigeração.',
      features: ['Pasta Térmica MX-4', 'Limpeza Fans', 'Troca Thermal Pads', 'Teste Estresse']
    },
    {
      icon: <Battery className="w-7 h-7" />,
      title: 'Troca de Bateria em SP',
      description: 'Troca de bateria de notebook em São Paulo - SP. Baterias originais e compatíveis para todas as marcas.',
      features: ['Bateria Original', 'Garantia 6 Meses', 'Calibração', 'Teste Carga']
    },
    {
      icon: <HardDrive className="w-7 h-7" />,
      title: 'Upgrade SSD/RAM SP',
      description: 'Upgrade de SSD e RAM de notebook em São Paulo. SSD NVMe e memória RAM de alta performance.',
      features: ['SSD NVMe Gen4', 'RAM DDR4/DDR5', 'Clone HD', 'Otimização SO']
    }
  ];

  const brands = [
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
  ];

  const testimonials = [
    {
      name: 'Carlos Mendes',
      role: 'Editor de Vídeo',
      text: 'Meu Razer Blade estava superaquecendo e desligando. Em 3 dias estava perfeito, com pasta térmica nova e limpo. Profissionais de verdade!',
      rating: 5
    },
    {
      name: 'Fernanda Lima',
      role: 'Arquiteta',
      text: 'Troquei a tela do meu Dell XPS que estava com linhas. Serviço impecável, tela original e preço justo. Recomendo demais!',
      rating: 5
    },
    {
      name: 'Ricardo Souza',
      role: 'Desenvolvedor',
      text: 'Upgrade de SSD e RAM no meu Lenovo Legion. Notebook voando agora! Atendimento excelente e orçamento na hora.',
      rating: 5
    },
    {
      name: 'Amanda Costa',
      role: 'Designer',
      text: 'Repararam a placa mãe do meu MacBook Pro que outras assistências disseram ser irreparável. Salvaram meu trabalho!',
      rating: 5
    }
  ];

  const stats = [
    { number: '25+', label: 'Anos de Experiência', icon: <Award className="w-6 h-6" /> },
    { number: '15.000+', label: 'Notebooks Consertados', icon: <Laptop className="w-6 h-6" /> },
    { number: '4.9', label: 'Avaliação Média', icon: <Star className="w-6 h-6" /> },
    { number: '6 Meses', label: 'Garantia em Todos Serviços', icon: <Shield className="w-6 h-6" /> }
  ];

  const faqs = [
    {
      question: 'Quanto tempo leva o conserto de um notebook?',
      answer: 'O tempo varia conforme o problema. Manutenções simples levam 2-24h. Reparos em placa mãe levam 3-7 dias úteis. Sempre informamos o prazo no orçamento.'
    },
    {
      question: 'Vocês consertam notebook gamer de todas as marcas?',
      answer: 'Sim! Somos especialistas em Razer, Alienware, Lenovo Legion, Acer Nitro, Gigabyte, ASUS ROG, MSI, HP Omen e mais. Temos peças originais e técnicos certificados.'
    },
    {
      question: 'O orçamento é realmente gratuito?',
      answer: 'Sim! Diagnóstico e orçamento são 100% gratuitos e sem compromisso. Você só paga se aprovar o serviço. Transparência total nos valores.'
    },
    {
      question: 'Vocês dão garantia nos serviços?',
      answer: 'Sim! Todos os nossos serviços têm garantia de 6 meses a 1 ano, dependendo do tipo de reparo. Usamos apenas peças de qualidade e procedimentos profissionais.'
    },
    {
      question: 'Atendem em toda São Paulo?',
      answer: 'Sim! Estamos na Av. Paulista, no coração de São Paulo. Atendemos clientes de toda a capital e Grande SP. Também oferecemos serviço de coleta e entrega.'
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--black))] text-white overflow-x-hidden">
      {/* Schema.org BreadcrumbList */}
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
            }
          ]
        })
      }} />

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--black))]/95 backdrop-blur-md border-b border-[hsl(var(--gold))]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center">
                <Laptop className="w-6 h-6 text-[hsl(var(--black))]" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gradient-gold">Notebook Master SP</h1>
                <p className="text-xs text-gray-400 hidden sm:block">25+ Anos de Excelência</p>
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
              href="https://wa.me/5511999999999" 
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
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[hsl(var(--gold))]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--navy-light))]/40 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 badge-gold">
                <Star className="w-3 h-3" />
                <span>Líder em Conserto de Notebook em São Paulo</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Conserto de{' '}
                <span className="text-gradient-gold">Notebook</span>{' '}
                em São Paulo - SP
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl">
                Mais de <strong className="text-[hsl(var(--gold))]">25 anos</strong> consertando notebooks em São Paulo - SP. 
                Especialistas em <strong className="text-[hsl(var(--gold))]">notebooks gamer</strong>: Razer, Alienware, 
                Lenovo Legion, Acer Nitro, Gigabyte e mais. Atendemos toda São Paulo: Zona Sul, Norte, Leste, Oeste, Centro e Grande SP.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="https://wa.me/5511999999999" 
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
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <span className="text-sm text-gray-300">Orçamento Grátis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <span className="text-sm text-gray-300">Garantia 6 Meses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(var(--gold))]" />
                  <span className="text-sm text-gray-300">Peças Originais</span>
                </div>
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
            <span className="badge-gold mb-4 inline-block">Nossos Serviços</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Especialistas em{' '}
              <span className="text-gradient-gold">Notebook Gamer</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Oferecemos soluções completas para todos os problemas do seu notebook. 
              Desde manutenção preventiva até reparos complexos em placa mãe.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="card-glass card-hover p-6 sm:p-8"
              >
                <div className="icon-container mb-6">
                  {service.icon}
                </div>
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
            <span className="badge-gold mb-4 inline-block">Todas as Marcas</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Consertamos{' '}
              <span className="text-gradient-gold">Todas as Marcas</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Especialistas em notebooks gamer e corporativos. Temos experiência com 
              todas as principais marcas do mercado.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map((brand, index) => (
              <div 
                key={index}
                className="card-glass p-4 text-center card-hover"
              >
                <div className="text-sm font-semibold text-white mb-1">{brand.name}</div>
                <div className="text-xs text-[hsl(var(--gold))]">{brand.category}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-6">
              Não encontrou sua marca? Entre em contato! Atendemos todas as marcas do mercado.
            </p>
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Consultar Sua Marca
            </a>
          </div>
        </div>
      </section>

      {/* Sobre Section */}
      <section id="sobre" className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-gold mb-4 inline-block">Sobre Nós</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gradient-gold">25 Anos</span> de Experiência 
                em São Paulo - SP
              </h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Desde 1999, a Notebook Master SP é referência em conserto de notebooks em São Paulo - SP. 
                  Localizados na <strong className="text-[hsl(var(--gold))]">Av. Paulista, 1000 - Bela Vista</strong>, 
                  começamos como uma pequena assistência técnica e hoje somos líderes no mercado 
                  de reparo de notebooks gamer de alta performance.
                </p>
                <p>
                  Nossa equipe de técnicos certificados é especializada em reparo de 
                  placas de vídeo, placas mãe e sistemas de refrigeração de notebooks gamer. 
                  Investimos constantemente em equipamentos de última geração para oferecer 
                  o melhor serviço de conserto de notebook em São Paulo.
                </p>
                <p>
                  Atendemos clientes de toda <strong className="text-[hsl(var(--gold))]">São Paulo e Grande SP</strong>: 
                  Zona Sul, Zona Norte, Zona Leste, Zona Oeste, Centro e toda a região metropolitana. 
                  Desde gamers profissionais até empresas e usuários corporativos. 
                  Nossa missão é devolver a vida útil do seu notebook com qualidade e garantia.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-3">
                  <div className="icon-container flex-shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Técnicos Certificados</h4>
                    <p className="text-sm text-gray-400">Equipe especializada e em constante atualização</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="icon-container flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Equipamentos Modernos</h4>
                    <p className="text-sm text-gray-400">Tecnologia de ponta para diagnóstico e reparo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="icon-container flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Garantia Real</h4>
                    <p className="text-sm text-gray-400">6 meses a 1 ano em todos os serviços</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="icon-container flex-shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">+15.000 Clientes</h4>
                    <p className="text-sm text-gray-400">Satisfação comprovada ao longo de 25 anos</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-[hsl(var(--navy-light))]/10 rounded-3xl blur-2xl" />
              <div className="relative card-glass p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Por Que Nos Escolher?</h3>
                <div className="space-y-4">
                  {[
                    'Orçamento gratuito em até 2 horas',
                    'Diagnóstico avançado com equipamentos de ponta',
                    'Peças originais e compatíveis de qualidade',
                    'Garantia de 6 meses a 1 ano',
                    'Atendimento personalizado',
                    'Localização central em São Paulo',
                    'Coleta e entrega disponível',
                    'Pagamento facilitado em até 12x'
                  ].map((item, index) => (
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
      <section id="como-funciona" className="section-padding relative bg-[hsl(var(--navy))]/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Nosso Processo</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Como Funciona o{' '}
              <span className="text-gradient-gold">Nosso Atendimento</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Processo simples, rápido e transparente para consertar seu notebook em São Paulo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Passo 01 */}
            <div className="relative">
              <div className="card-glass p-6 sm:p-8 h-full card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="icon-container">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-bold text-[hsl(var(--gold))]/20">01</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Você traz o equipamento ou chama no WhatsApp</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Entre em contato pelo WhatsApp ou traga seu equipamento na nossa Loja com fácil acesso a estacionamento e ou podemos retirar pra você.
                </p>
                <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                  <a 
                    href="https://wa.me/5511999999999" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(var(--gold))] text-sm font-medium hover:underline flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
              {/* Seta de conexão */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <div className="w-6 h-6 border-t-2 border-r-2 border-[hsl(var(--gold))]/40 rotate-45"></div>
              </div>
            </div>
            
            {/* Passo 02 */}
            <div className="relative">
              <div className="card-glass p-6 sm:p-8 h-full card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="icon-container">
                    <Search className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-bold text-[hsl(var(--gold))]/20">02</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Fazemos o diagnóstico detalhado</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Nossa equipe técnica especializada analisa o problema e identifica todas as soluções possíveis. Cobramos um valor pelo diagnóstico que é <strong className="text-[hsl(var(--gold))]">100% descontado</strong> se você aprovar o serviço.
                </p>
                <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4 text-[hsl(var(--gold))]" />
                    Diagnóstico em até 2 horas
                  </div>
                </div>
              </div>
              {/* Seta de conexão */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <div className="w-6 h-6 border-t-2 border-r-2 border-[hsl(var(--gold))]/40 rotate-45"></div>
              </div>
            </div>
            
            {/* Passo 03 */}
            <div className="relative">
              <div className="card-glass p-6 sm:p-8 h-full card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="icon-container">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-bold text-[hsl(var(--gold))]/20">03</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Enviamos orçamento no mesmo dia</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Você recebe o orçamento completo com tudo explicado de forma clara e transparente. Sem surpresas, sem taxas ocultas.
                </p>
                <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--gold))]" />
                    Orçamento sem compromisso
                  </div>
                </div>
              </div>
              {/* Seta de conexão */}
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <div className="w-6 h-6 border-t-2 border-r-2 border-[hsl(var(--gold))]/40 rotate-45"></div>
              </div>
            </div>
            
            {/* Passo 04 */}
            <div className="relative">
              <div className="card-glass p-6 sm:p-8 h-full card-hover">
                <div className="flex items-center justify-between mb-6">
                  <div className="icon-container">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-5xl font-bold text-[hsl(var(--gold))]/20">04</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Iniciamos o conserto com prioridade</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Com sua aprovação, iniciamos o conserto imediatamente, priorizando casos urgentes. Acompanhe todo o processo e receba seu notebook funcionando perfeitamente.
                </p>
                <div className="mt-6 pt-4 border-t border-[hsl(var(--gold))]/20">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4 text-[hsl(var(--gold))]" />
                    Garantia de 6 meses a 1 ano
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-12 text-center">
            <a 
              href="https://wa.me/5511999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-3"
            >
              <MessageCircle className="w-5 h-5" />
              Começar Agora - Orçamento Grátis
            </a>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section id="depoimentos" className="section-padding relative bg-[hsl(var(--black))]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Depoimentos</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              O Que Nossos{' '}
              <span className="text-gradient-gold">Clientes Dizem</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Mais de 15.000 notebooks consertados e clientes satisfeitos em São Paulo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-glass p-6 card-hover">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center text-[hsl(var(--black))] font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 flex flex-wrap justify-center gap-8 items-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[hsl(var(--gold))]" />
              <span className="text-sm text-gray-300">97% de Taxa de Sucesso</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[hsl(var(--gold))]" />
              <span className="text-sm text-gray-300">+15.000 Clientes Atendidos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[hsl(var(--gold))]" />
              <span className="text-sm text-gray-300">Atendimento em 24h</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-gold mb-4 inline-block">Dúvidas Frequentes</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Perguntas{' '}
              <span className="text-gradient-gold">Frequentes</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card-glass p-6">
                <h3 className="font-semibold text-white mb-3 flex items-start gap-3">
                  <span className="text-[hsl(var(--gold))]">Q:</span>
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contato Section */}
      <section id="contato" className="section-padding relative bg-[hsl(var(--navy))]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <span className="badge-gold mb-4 inline-block">Entre em Contato</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Orçamento{' '}
                <span className="text-gradient-gold">Grátis</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Entre em contato agora mesmo e receba seu orçamento em até 2 horas. 
                Atendemos toda São Paulo e Grande SP.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Endereço em São Paulo</h4>
                    <p className="text-gray-400 text-sm">
                      Av. Paulista, 1000 - Bela Vista<br />
                      São Paulo - SP, 01310-100<br />
                      <span className="text-[hsl(var(--gold))] text-xs">Próximo ao Metrô Trianon-Masp</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Telefone São Paulo</h4>
                    <p className="text-gray-400 text-sm">(11) 99999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">Horário de Atendimento SP</h4>
                    <p className="text-gray-400 text-sm">
                      Segunda a Sexta: 08h às 18h<br />
                      Sábado: 09h às 13h
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="icon-container flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">WhatsApp São Paulo</h4>
                    <a 
                      href="https://wa.me/5511999999999" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[hsl(var(--gold))] text-sm hover:underline"
                    >
                      (11) 99999-9999 - Clique para conversar
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[hsl(var(--gold))]/10 to-[hsl(var(--navy-light))]/10 rounded-3xl blur-2xl" />
              <div className="relative card-glass p-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Solicite Seu Orçamento</h3>
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/5511999999999?text=Olá!%20Gostaria%20de%20um%20orçamento%20para%20conserto%20de%20notebook." 
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
                    href="tel:+5511999999999"
                    className="btn-secondary w-full flex items-center justify-center gap-3 py-4"
                  >
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-sm opacity-80">Prefere ligar?</div>
                      <div className="font-bold">(11) 99999-9999</div>
                    </div>
                  </a>
                </div>
                
                <div className="mt-8 pt-6 border-t border-[hsl(var(--gold))]/20">
                  <p className="text-center text-sm text-gray-400 mb-4">
                    Atendemos todas as regiões de São Paulo - SP:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Zona Sul SP', 'Zona Norte SP', 'Zona Leste SP', 'Zona Oeste SP', 'Centro SP', 'Grande São Paulo'].map((region, index) => (
                      <span key={index} className="text-xs px-3 py-1 rounded-full bg-[hsl(var(--black))]/50 text-gray-400">
                        {region}
                      </span>
                    ))}
                  </div>
                  <p className="text-center text-xs text-gray-500 mt-4">
                    Bairros atendidos: Jardins, Pinheiros, Vila Mariana, Moema, Brooklin, Itaim Bibi, 
                    Perdizes, Higienópolis, Consolação, República, Liberdade, Paraíso e toda Grande SP
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
            Não espere mais para consertar seu notebook!
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Orçamento grátis em até 2 horas. Garantia de 6 meses a 1 ano em todos os serviços.
          </p>
          <a 
            href="https://wa.me/5511999999999" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-5 pulse-gold"
          >
            <MessageCircle className="w-6 h-6" />
            Quero Meu Orçamento Grátis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[hsl(var(--gold))]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--gold))] to-[hsl(var(--gold-dark))] flex items-center justify-center">
                  <Laptop className="w-6 h-6 text-[hsl(var(--black))]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gradient-gold">Notebook Master SP</h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                Há mais de 25 anos consertando notebooks em São Paulo. Especialistas em 
                notebooks gamer e corporativos. Orçamento grátis e garantia real.
              </p>
              <div className="flex gap-4">
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-[hsl(var(--gold))]/10 flex items-center justify-center text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="tel:+5511999999999" className="w-10 h-10 rounded-lg bg-[hsl(var(--gold))]/10 flex items-center justify-center text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#servicos" className="hover:text-[hsl(var(--gold))] transition-colors">Conserto Notebook Gamer</a></li>
                <li><a href="#servicos" className="hover:text-[hsl(var(--gold))] transition-colors">Troca de Tela</a></li>
                <li><a href="#servicos" className="hover:text-[hsl(var(--gold))] transition-colors">Reparo Placa Mãe</a></li>
                <li><a href="#servicos" className="hover:text-[hsl(var(--gold))] transition-colors">Limpeza Térmica</a></li>
                <li><a href="#servicos" className="hover:text-[hsl(var(--gold))] transition-colors">Upgrade SSD/RAM</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Contato São Paulo</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                  Av. Paulista, 1000 - Bela Vista
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[hsl(var(--gold))]" />
                  São Paulo - SP, 01310-100
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[hsl(var(--gold))]" />
                  (11) 99999-9999
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[hsl(var(--gold))]" />
                  Seg-Sex: 8h-18h | Sáb: 9h-13h
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[hsl(var(--gold))]/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              <p className="text-sm text-gray-500">
                © 2024 Notebook Master SP. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-500">
                CNPJ: 12.345.678/0001-90
              </p>
            </div>
            <p className="text-center text-xs text-gray-600">
              Conserto de Notebook em São Paulo - SP | Av. Paulista, 1000 - Bela Vista | 
              Atendimento: (11) 99999-9999 | Zona Sul, Norte, Leste, Oeste, Centro e Grande SP
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
