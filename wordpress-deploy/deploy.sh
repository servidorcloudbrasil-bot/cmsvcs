#!/bin/bash

# =============================================================================
# SCRIPT DE DEPLOY AUTOMÁTICO - NOTEBOOK MASTER SP
# =============================================================================
# Este script faz deploy do site para um servidor WordPress
# 
# USO:
#   ./deploy.sh [ambiente]
# 
# AMBIENTES:
#   production  - Deploy para produção
#   staging     - Deploy para staging
#
# CONFIGURAÇÃO:
#   Edite as variáveis abaixo com seus dados
# =============================================================================

# =============================================================================
# CONFIGURAÇÕES - EDITE AQUI
# =============================================================================

# Dados do servidor FTP/SFTP
FTP_HOST="ftp.seusite.com.br"
FTP_USER="seu_usuario"
FTP_PASS="sua_senha"
FTP_PORT="21"

# Caminho remoto no servidor
REMOTE_PATH="/public_html/wp-content/uploads/notebook-master/"

# URL do WordPress
WP_URL="https://seusite.com.br"

# Dados do WordPress (para instalação automática)
WP_USER="admin"
WP_PASS="senha_admin"

# =============================================================================
# CORES PARA OUTPUT
# =============================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# =============================================================================
# FUNÇÕES
# =============================================================================

print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║          🚀 DEPLOY - NOTEBOOK MASTER SP                        ║"
    echo "║          Conserto de Notebook em São Paulo                     ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# =============================================================================
# VERIFICA DEPENDÊNCIAS
# =============================================================================

check_dependencies() {
    print_info "Verificando dependências..."
    
    # Verifica se o lftp está instalado
    if ! command -v lftp &> /dev/null; then
        print_error "lftp não está instalado. Instalando..."
        
        # Detecta o sistema operacional
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            if command -v apt-get &> /dev/null; then
                sudo apt-get update && sudo apt-get install -y lftp
            elif command -v yum &> /dev/null; then
                sudo yum install -y lftp
            else
                print_error "Não foi possível instalar lftp automaticamente."
                print_info "Instale manualmente: sudo apt-get install lftp"
                exit 1
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                brew install lftp
            else
                print_error "Homebrew não está instalado."
                print_info "Instale o Homebrew: https://brew.sh"
                exit 1
            fi
        fi
    fi
    
    print_success "Dependências OK"
}

# =============================================================================
# BUILD DO PROJETO
# =============================================================================

build_project() {
    print_info "Compilando o projeto..."
    
    cd "$(dirname "$0")/.."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json não encontrado. Verifique se está na pasta correta."
        exit 1
    fi
    
    # Instala dependências se necessário
    if [ ! -d "node_modules" ]; then
        print_info "Instalando dependências..."
        npm install
    fi
    
    # Faz o build
    npm run build
    
    if [ $? -eq 0 ]; then
        print_success "Build concluído com sucesso!"
    else
        print_error "Erro durante o build."
        exit 1
    fi
}

# =============================================================================
# DEPLOY VIA FTP
# =============================================================================

deploy_ftp() {
    print_info "Iniciando deploy via FTP..."
    print_info "Servidor: $FTP_HOST"
    print_info "Destino: $REMOTE_PATH"
    
    # Cria o script de comandos FTP
    LFTP_SCRIPT=$(cat <<EOF
set ssl:verify-certificate no
set ftp:ssl-allow no
set net:timeout 30
set net:max-retries 3
open -u $FTP_USER,$FTP_PASS $FTP_HOST:$FTP_PORT
mkdir -p $REMOTE_PATH
lcd dist
mirror --reverse --delete --verbose --parallel=3 . $REMOTE_PATH
bye
EOF
)
    
    # Executa o lftp
    echo "$LFTP_SCRIPT" | lftp
    
    if [ $? -eq 0 ]; then
        print_success "Deploy concluído com sucesso!"
        print_info "URL: $WP_URL"
    else
        print_error "Erro durante o deploy FTP."
        exit 1
    fi
}

# =============================================================================
# DEPLOY VIA RSYNC (SSH)
# =============================================================================

deploy_rsync() {
    print_info "Iniciando deploy via RSYNC..."
    
    RSYNC_HOST="$FTP_USER@$FTP_HOST"
    
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='src' \
        -e "ssh -p $FTP_PORT" \
        "$(dirname "$0")/../dist/" \
        "$RSYNC_HOST:$REMOTE_PATH"
    
    if [ $? -eq 0 ]; then
        print_success "Deploy concluído com sucesso!"
    else
        print_error "Erro durante o deploy RSYNC."
        exit 1
    fi
}

# =============================================================================
# INSTALA NO WORDPRESS
# =============================================================================

install_wordpress() {
    print_info "Instalando no WordPress..."
    
    # Faz upload do install.php
    LFTP_SCRIPT=$(cat <<EOF
set ssl:verify-certificate no
set ftp:ssl-allow no
open -u $FTP_USER,$FTP_PASS $FTP_HOST:$FTP_PORT
put wordpress-deploy/install.php /public_html/install.php
bye
EOF
)
    
    echo "$LFTP_SCRIPT" | lftp
    
    print_success "Arquivo de instalação enviado!"
    print_info "Acesse: $WP_URL/install.php"
    print_info "Siga as instruções na tela para completar a instalação."
}

# =============================================================================
# MENU INTERATIVO
# =============================================================================

show_menu() {
    echo ""
    echo "Selecione uma opção:"
    echo ""
    echo "  1) 🚀 Deploy completo (Build + FTP)"
    echo "  2) 📦 Apenas build"
    echo "  3) 📤 Apenas deploy (sem build)"
    echo "  4) 🔄 Instalar no WordPress"
    echo "  5) 📋 Ver configurações"
    echo "  6) ❌ Sair"
    echo ""
    read -p "Opção: " choice
    
    case $choice in
        1)
            build_project
            deploy_ftp
            ;;
        2)
            build_project
            ;;
        3)
            deploy_ftp
            ;;
        4)
            install_wordpress
            ;;
        5)
            show_config
            ;;
        6)
            print_info "Saindo..."
            exit 0
            ;;
        *)
            print_error "Opção inválida!"
            show_menu
            ;;
    esac
}

show_config() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                    CONFIGURAÇÕES ATUAIS                        ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "  FTP Host:    $FTP_HOST"
    echo "  FTP User:    $FTP_USER"
    echo "  FTP Port:    $FTP_PORT"
    echo "  Remote Path: $REMOTE_PATH"
    echo "  WP URL:      $WP_URL"
    echo ""
    echo "Para alterar, edite este arquivo (deploy.sh)"
    echo ""
    read -p "Pressione ENTER para voltar..."
    show_menu
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    print_header
    
    # Verifica argumentos
    if [ "$1" == "production" ] || [ "$1" == "staging" ]; then
        print_info "Ambiente: $1"
        check_dependencies
        build_project
        deploy_ftp
        exit 0
    fi
    
    # Menu interativo
    check_dependencies
    show_menu
}

# Executa o script
main "$@"
