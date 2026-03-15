// Dados de geolocalização dos bairros de São Paulo
export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface BairroData {
  nome: string;
  zona: string;
  cep: string;
  geo: GeoLocation;
  referencia: string; // ponto de referência para SEO
}

export const bairrosSP: BairroData[] = [
  // Zona Sul
  { nome: 'Vila Mariana', zona: 'Zona Sul', cep: '04010-000', geo: { lat: -23.5892, lng: -46.6358 }, referencia: 'Próximo ao Metrô Vila Mariana' },
  { nome: 'Moema', zona: 'Zona Sul', cep: '04077-000', geo: { lat: -23.6005, lng: -46.6656 }, referencia: 'Próximo ao Shopping Ibirapuera' },
  { nome: 'Brooklin', zona: 'Zona Sul', cep: '04568-000', geo: { lat: -23.6143, lng: -46.6849 }, referencia: 'Próximo à Berrini' },
  { nome: 'Campo Belo', zona: 'Zona Sul', cep: '04601-000', geo: { lat: -23.6189, lng: -46.6653 }, referencia: 'Próximo ao Aeroporto de Congonhas' },
  { nome: 'Jabaquara', zona: 'Zona Sul', cep: '04307-000', geo: { lat: -23.6455, lng: -46.6429 }, referencia: 'Próximo ao Terminal Jabaquara' },
  { nome: 'Santo Amaro', zona: 'Zona Sul', cep: '04744-000', geo: { lat: -23.6534, lng: -46.7034 }, referencia: 'Próximo ao Largo 13 de Maio' },
  { nome: 'Saúde', zona: 'Zona Sul', cep: '04142-000', geo: { lat: -23.6210, lng: -46.6226 }, referencia: 'Próximo ao Metrô Saúde' },
  { nome: 'Ipiranga', zona: 'Zona Sul', cep: '04208-000', geo: { lat: -23.5882, lng: -46.6063 }, referencia: 'Próximo ao Museu do Ipiranga' },
  { nome: 'Interlagos', zona: 'Zona Sul', cep: '04789-000', geo: { lat: -23.7013, lng: -46.6949 }, referencia: 'Próximo ao Autódromo de Interlagos' },
  { nome: 'Grajaú', zona: 'Zona Sul', cep: '04844-000', geo: { lat: -23.7560, lng: -46.6870 }, referencia: 'Região Sul de São Paulo' },
  { nome: 'Cidade Dutra', zona: 'Zona Sul', cep: '04810-000', geo: { lat: -23.7142, lng: -46.6842 }, referencia: 'Próximo à Represa Billings' },
  { nome: 'Pedreira', zona: 'Zona Sul', cep: '04470-000', geo: { lat: -23.6863, lng: -46.6454 }, referencia: 'Região Zona Sul SP' },
  { nome: 'Parelheiros', zona: 'Zona Sul', cep: '04890-000', geo: { lat: -23.8286, lng: -46.7273 }, referencia: 'Extremo Sul de São Paulo' },

  // Zona Oeste
  { nome: 'Pinheiros', zona: 'Zona Oeste', cep: '05422-000', geo: { lat: -23.5614, lng: -46.6892 }, referencia: 'Próximo ao Metrô Pinheiros' },
  { nome: 'Perdizes', zona: 'Zona Oeste', cep: '05011-000', geo: { lat: -23.5335, lng: -46.6837 }, referencia: 'Próximo à PUC-SP' },
  { nome: 'Vila Madalena', zona: 'Zona Oeste', cep: '05443-000', geo: { lat: -23.5531, lng: -46.6911 }, referencia: 'Próximo ao Beco do Batman' },
  { nome: 'Butantã', zona: 'Zona Oeste', cep: '05508-000', geo: { lat: -23.5715, lng: -46.7099 }, referencia: 'Próximo à USP' },
  { nome: 'Lapa', zona: 'Zona Oeste', cep: '05065-000', geo: { lat: -23.5204, lng: -46.7174 }, referencia: 'Próximo à Estação Lapa' },
  { nome: 'Alto de Pinheiros', zona: 'Zona Oeste', cep: '05459-000', geo: { lat: -23.5523, lng: -46.7083 }, referencia: 'Próximo à Marginal Pinheiros' },
  { nome: 'Itaim Bibi', zona: 'Zona Oeste', cep: '04538-000', geo: { lat: -23.5854, lng: -46.6797 }, referencia: 'Próximo à Av. Faria Lima' },
  { nome: 'Jardim Europa', zona: 'Zona Oeste', cep: '01449-000', geo: { lat: -23.5754, lng: -46.6772 }, referencia: 'Próximo aos Jardins' },
  { nome: 'Vila Leopoldina', zona: 'Zona Oeste', cep: '05311-000', geo: { lat: -23.5247, lng: -46.7312 }, referencia: 'Próximo ao Ceagesp' },

  // Centro
  { nome: 'Bela Vista', zona: 'Centro', cep: '01310-000', geo: { lat: -23.5568, lng: -46.6475 }, referencia: 'Próximo à Av. Paulista' },
  { nome: 'República', zona: 'Centro', cep: '01045-000', geo: { lat: -23.5432, lng: -46.6422 }, referencia: 'Próximo ao Metrô República' },
  { nome: 'Consolação', zona: 'Centro', cep: '01301-000', geo: { lat: -23.5505, lng: -46.6560 }, referencia: 'Próximo à Rua Augusta' },
  { nome: 'Liberdade', zona: 'Centro', cep: '01502-000', geo: { lat: -23.5571, lng: -46.6342 }, referencia: 'Próximo ao Metrô Liberdade' },
  { nome: 'Sé', zona: 'Centro', cep: '01001-000', geo: { lat: -23.5503, lng: -46.6340 }, referencia: 'Próximo à Catedral da Sé' },
  { nome: 'Santa Cecília', zona: 'Centro', cep: '01221-000', geo: { lat: -23.5330, lng: -46.6500 }, referencia: 'Próximo ao Metrô Santa Cecília' },
  { nome: 'Higienópolis', zona: 'Centro', cep: '01223-000', geo: { lat: -23.5410, lng: -46.6563 }, referencia: 'Próximo ao Shopping Higienópolis' },
  { nome: 'Paraíso', zona: 'Centro', cep: '04106-000', geo: { lat: -23.5740, lng: -46.6440 }, referencia: 'Próximo ao Metrô Paraíso' },

  // Zona Norte
  { nome: 'Santana', zona: 'Zona Norte', cep: '02012-000', geo: { lat: -23.5049, lng: -46.6277 }, referencia: 'Próximo ao Metrô Santana' },
  { nome: 'Tucuruvi', zona: 'Zona Norte', cep: '02265-000', geo: { lat: -23.4796, lng: -46.6034 }, referencia: 'Próximo ao Metrô Tucuruvi' },
  { nome: 'Casa Verde', zona: 'Zona Norte', cep: '02515-000', geo: { lat: -23.5070, lng: -46.6633 }, referencia: 'Região Zona Norte SP' },
  { nome: 'Mandaqui', zona: 'Zona Norte', cep: '02434-000', geo: { lat: -23.4830, lng: -46.6305 }, referencia: 'Próximo ao Hospital Mandaqui' },
  { nome: 'Tremembé', zona: 'Zona Norte', cep: '02362-000', geo: { lat: -23.4620, lng: -46.6197 }, referencia: 'Região Zona Norte SP' },
  { nome: 'Jaçanã', zona: 'Zona Norte', cep: '02270-000', geo: { lat: -23.4614, lng: -46.5741 }, referencia: 'Próximo à Estação Jaçanã' },
  { nome: 'Pirituba', zona: 'Zona Norte', cep: '02944-000', geo: { lat: -23.4894, lng: -46.7292 }, referencia: 'Próximo à Estação Pirituba' },
  { nome: 'Freguesia do Ó', zona: 'Zona Norte', cep: '02960-000', geo: { lat: -23.4925, lng: -46.6924 }, referencia: 'Região Zona Norte SP' },
  { nome: 'Vila Guilherme', zona: 'Zona Norte', cep: '02053-000', geo: { lat: -23.5109, lng: -46.6075 }, referencia: 'Próximo à Marginal Tietê' },

  // Zona Leste
  { nome: 'Tatuapé', zona: 'Zona Leste', cep: '03060-000', geo: { lat: -23.5394, lng: -46.5764 }, referencia: 'Próximo ao Metrô Tatuapé' },
  { nome: 'Mooca', zona: 'Zona Leste', cep: '03104-000', geo: { lat: -23.5562, lng: -46.5942 }, referencia: 'Próximo ao Shopping Mooca' },
  { nome: 'Penha', zona: 'Zona Leste', cep: '03632-000', geo: { lat: -23.5241, lng: -46.5437 }, referencia: 'Próximo ao Metrô Penha' },
  { nome: 'São Mateus', zona: 'Zona Leste', cep: '03963-000', geo: { lat: -23.6068, lng: -46.4778 }, referencia: 'Região Zona Leste SP' },
  { nome: 'Itaquera', zona: 'Zona Leste', cep: '08220-000', geo: { lat: -23.5362, lng: -46.4537 }, referencia: 'Próximo ao Metrô Itaquera' },
  { nome: 'Vila Carrão', zona: 'Zona Leste', cep: '03420-000', geo: { lat: -23.5496, lng: -46.5406 }, referencia: 'Próximo ao Metrô Carrão' },
  { nome: 'Anália Franco', zona: 'Zona Leste', cep: '03337-000', geo: { lat: -23.5582, lng: -46.5603 }, referencia: 'Próximo ao Shopping Anália Franco' },
  { nome: 'Vila Matilde', zona: 'Zona Leste', cep: '03527-000', geo: { lat: -23.5451, lng: -46.5259 }, referencia: 'Próximo ao Metrô Vila Matilde' },
  { nome: 'São Miguel Paulista', zona: 'Zona Leste', cep: '08010-000', geo: { lat: -23.5000, lng: -46.4396 }, referencia: 'Região Extremo Leste SP' },
  { nome: 'Guaianases', zona: 'Zona Leste', cep: '08410-000', geo: { lat: -23.5402, lng: -46.4095 }, referencia: 'Região Extremo Leste SP' },
  { nome: 'Ermelino Matarazzo', zona: 'Zona Leste', cep: '03807-000', geo: { lat: -23.5073, lng: -46.4821 }, referencia: 'Região Zona Leste SP' },
  { nome: 'Vila Prudente', zona: 'Zona Leste', cep: '03126-000', geo: { lat: -23.5809, lng: -46.5809 }, referencia: 'Próximo ao Metrô Vila Prudente' },
  { nome: 'Sapopemba', zona: 'Zona Leste', cep: '03281-000', geo: { lat: -23.5964, lng: -46.5151 }, referencia: 'Região Zona Leste SP' },

  // Grande SP
  { nome: 'Guarulhos', zona: 'Grande SP', cep: '07000-000', geo: { lat: -23.4538, lng: -46.5333 }, referencia: 'Cidade de Guarulhos' },
  { nome: 'Osasco', zona: 'Grande SP', cep: '06010-000', geo: { lat: -23.5325, lng: -46.7917 }, referencia: 'Centro de Osasco' },
  { nome: 'Santo André', zona: 'Grande SP', cep: '09010-000', geo: { lat: -23.6737, lng: -46.5432 }, referencia: 'Centro de Santo André' },
  { nome: 'São Bernardo do Campo', zona: 'Grande SP', cep: '09700-000', geo: { lat: -23.6939, lng: -46.5650 }, referencia: 'Centro de São Bernardo' },
  { nome: 'São Caetano do Sul', zona: 'Grande SP', cep: '09520-000', geo: { lat: -23.6229, lng: -46.5548 }, referencia: 'Centro de São Caetano' },
  { nome: 'Diadema', zona: 'Grande SP', cep: '09910-000', geo: { lat: -23.6861, lng: -46.6228 }, referencia: 'Centro de Diadema' },
  { nome: 'Mauá', zona: 'Grande SP', cep: '09310-000', geo: { lat: -23.6677, lng: -46.4614 }, referencia: 'Centro de Mauá' },
  { nome: 'Barueri', zona: 'Grande SP', cep: '06401-000', geo: { lat: -23.5107, lng: -46.8764 }, referencia: 'Centro de Barueri' },
  { nome: 'Alphaville', zona: 'Grande SP', cep: '06454-000', geo: { lat: -23.4864, lng: -46.8520 }, referencia: 'Região de Alphaville' },
  { nome: 'Cotia', zona: 'Grande SP', cep: '06700-000', geo: { lat: -23.6041, lng: -46.9186 }, referencia: 'Centro de Cotia' },
  { nome: 'Taboão da Serra', zona: 'Grande SP', cep: '06750-000', geo: { lat: -23.6261, lng: -46.7581 }, referencia: 'Centro de Taboão' },
  { nome: 'Carapicuíba', zona: 'Grande SP', cep: '06310-000', geo: { lat: -23.5230, lng: -46.8357 }, referencia: 'Centro de Carapicuíba' },
];

export function getBairroByNome(nome: string): BairroData | undefined {
  return bairrosSP.find(b => b.nome.toLowerCase() === nome.toLowerCase());
}

export function getZonas(): string[] {
  return [...new Set(bairrosSP.map(b => b.zona))];
}

export function getBairrosByZona(zona: string): BairroData[] {
  return bairrosSP.filter(b => b.zona === zona);
}

export function generateSlug(keyword: string, location: string): string {
  const text = `${keyword} ${location}`;
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
