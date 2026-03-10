# Notebook Master SP - WordPress + Elementor Pro Deployment

Landing page 100% otimizada para SEO Local de conserto de notebook em São Paulo - SP.

## 📋 Conteúdo do Pacote

```
wordpress-deploy/
├── elementor-template-full.json    # Template completo para importação no Elementor Pro
├── install.php                     # Script de instalação automática do WordPress
├── deploy.sh                       # Script de deploy automatizado
├── config.sh                       # Arquivo de configuração
└── README.md                       # Este arquivo
```

## 🎨 Paleta de Cores

- **Preto Principal:** `#0D0D0D`
- **Dourado:** `#D4AF37`
- **Azul Escuro:** `#0A1628`
- **Cinza:** `#A0A0A0`
- **Branco:** `#FFFFFF`

## 📱 Seções Incluídas

1. **Header** - Navegação fixa com logo e CTA
2. **Hero** - Título principal, descrição, estatísticas
3. **Services** - 6 serviços (Gamer, Tela, Placa Mãe, Teclado, Bateria, Limpeza)
4. **Como Funciona** - 4 passos do atendimento
5. **Depoimentos** - 3 depoimentos de clientes
6. **FAQ** - 6 perguntas frequentes
7. **Contato** - Informações e formulário
8. **CTA Final** - Call-to-action destacado
9. **Footer** - Links e informações

## 🚀 Método 1: Importação via Elementor Pro (Recomendado)

### Passo 1: Instalar WordPress e Elementor Pro

1. Instale o WordPress em seu servidor
2. Instale e ative o plugin **Elementor Pro**
3. Crie uma nova página: **Páginas > Adicionar Nova**
4. Defina o título: "Conserto de Notebook em São Paulo - SP"

### Passo 2: Importar o Template

1. No editor Elementor, clique no ícone **≡** (Menu) no canto superior esquerdo
2. Vá em **Ferramentas > Importar e Exportar**
3. Clique em **Importar**
4. Selecione o arquivo `elementor-template-full.json`
5. Clique em **Importar**
6. Aguarde a importação completa

### Passo 3: Personalizar

1. Edite o texto conforme suas necessidades
2. Atualize os links do WhatsApp (substitua `5511999999999` pelo seu número)
3. Adicione suas informações de contato
4. Publique a página

## 🚀 Método 2: Deploy Automatizado (Avançado)

### Configuração

1. Edite o arquivo `config.sh` com suas informações:

```bash
# Dados da Empresa
COMPANY_NAME="Sua Empresa"
WHATSAPP="5511999999999"
PHONE="1133333333"
EMAIL="contato@suaempresa.com.br"
ADDRESS="Seu Endereço, São Paulo, SP"

# Dados do Servidor
FTP_HOST="ftp.seuservidor.com"
FTP_USER="seu_usuario"
FTP_PASS="sua_senha"
FTP_PATH="/public_html/"

# Dados do WordPress
DB_NAME="seu_banco"
DB_USER="usuario_banco"
DB_PASS="senha_banco"
DB_HOST="localhost"
WP_URL="https://seusite.com.br"
WP_TITLE="Conserto de Notebook SP"
WP_ADMIN_USER="admin"
WP_ADMIN_PASS="senha_segura"
WP_ADMIN_EMAIL="admin@seusite.com.br"
```

### Executar Deploy

```bash
# Dar permissão de execução
chmod +x deploy.sh config.sh

# Executar o deploy
./deploy.sh
```

O script irá:
1. Verificar dependências
2. Fazer backup (se solicitado)
3. Fazer upload dos arquivos
4. Instalar/configurar WordPress
5. Instalar Elementor Pro
6. Criar a página automaticamente

## 🚀 Método 3: Instalação Manual via PHP

1. Faça upload do arquivo `install.php` para a raiz do seu servidor
2. Acesse: `https://seusite.com.br/install.php`
3. Preencha o formulário com:
   - Número do WhatsApp
   - Telefone fixo
   - Endereço completo
   - CNPJ (opcional)
4. Clique em **Instalar**
5. O script criará a página automaticamente

## 🔧 Personalização do Template

### Alterar Cores

No Elementor, vá em **≡ > Configurações do Site > Cores Globais**

### Alterar Tipografia

No Elementor, vá em **≡ > Configurações do Site > Tipografia Global**

Fontes recomendadas:
- **Títulos:** Inter, Montserrat ou Poppins (700)
- **Corpo:** Inter ou Open Sans (400)

### Atualizar Informações de Contato

Edite a seção **Contato** e atualize:
- Número do WhatsApp
- Telefone
- E-mail
- Endereço
- Horário de funcionamento

### Atualizar Links do WhatsApp

Busque e substitua em todo o template:
- De: `https://wa.me/5511999999999`
- Para: `https://wa.me/55SEUNUMERO`

## 📊 SEO Local Implementado

O template inclui:

- ✅ Título otimizado para "conserto de notebook em são paulo - sp"
- ✅ Meta descrição com palavras-chave locais
- ✅ Schema.org: ComputerStore, Service, LocalBusiness
- ✅ Schema.org: FAQPage, HowTo, BreadcrumbList
- ✅ Open Graph tags para redes sociais
- ✅ Twitter Cards
- ✅ Geolocalização (São Paulo - SP)
- ✅ Keywords: notebook gamer, assistência técnica SP

## 🎯 Keywords Principais

- conserto de notebook em são paulo - sp
- assistência técnica notebook são paulo
- reparo de notebook sp
- notebook gamer são paulo
- troca de tela notebook sp
- conserto placa mãe notebook são paulo

## 📝 Estrutura do Template Elementor

```json
{
  "version": "3.20.0",
  "title": "Notebook Master SP - Conserto de Notebook São Paulo",
  "type": "page",
  "content": [
    {"id": "header", ...},
    {"id": "hero", ...},
    {"id": "services", ...},
    {"id": "como_funciona", ...},
    {"id": "depoimentos", ...},
    {"id": "faq", ...},
    {"id": "contato", ...},
    {"id": "cta_final", ...},
    {"id": "footer", ...}
  ]
}
```

## ⚠️ Requisitos

- WordPress 5.8+
- Elementor Pro 3.0+
- PHP 7.4+
- Tema compatível com Elementor (Hello Elementor, Astra, etc.)

## 🔗 Links Úteis

- [Documentação Elementor](https://elementor.com/help/)
- [Importar/Exportar Templates](https://elementor.com/help/template-library/)
- [SEO Local WordPress](https://yoast.com/wordpress/plugins/seo/)

## 📞 Suporte

Para dúvidas sobre o template ou instalação, consulte a documentação do Elementor ou entre em contato com um desenvolvedor WordPress.

---

**Notebook Master SP** - Conserto de Notebook em São Paulo  
© 2024 - Todos os direitos reservados
