#!/bin/bash

# =============================================================================
# CONFIGURAÇÕES DE DEPLOY - NOTEBOOK MASTER SP
# =============================================================================
# Edite este arquivo com seus dados antes de executar o deploy
# =============================================================================

# -----------------------------------------------------------------------------
# DADOS DO SERVIDOR FTP/SFTP
# -----------------------------------------------------------------------------

# Host do servidor (ex: ftp.seusite.com.br)
FTP_HOST="ftp.seusite.com.br"

# Usuário FTP
FTP_USER="seu_usuario_ftp"

# Senha FTP
FTP_PASS="sua_senha_ftp"

# Porta FTP (padrão: 21, SFTP: 22)
FTP_PORT="21"

# -----------------------------------------------------------------------------
# CAMINHOS
# -----------------------------------------------------------------------------

# Caminho remoto onde os arquivos serão enviados
# Deve terminar com /
REMOTE_PATH="/public_html/wp-content/uploads/notebook-master/"

# URL do seu site WordPress
WP_URL="https://seusite.com.br"

# -----------------------------------------------------------------------------
# DADOS DO WORDPRESS (para instalação automática)
# -----------------------------------------------------------------------------

# Usuário admin do WordPress
WP_ADMIN_USER="admin"

# Senha do admin
WP_ADMIN_PASS="sua_senha_admin"

# Email do admin
WP_ADMIN_EMAIL="contato@seusite.com.br"

# -----------------------------------------------------------------------------
# INFORMAÇÕES DA EMPRESA (serão usadas no site)
# -----------------------------------------------------------------------------

# Nome da empresa
EMPRESA_NOME="Notebook Master SP"

# WhatsApp com DDD (apenas números)
WHATSAPP="11999999999"

# Telefone fixo com DDD
TELEFONE="1133334444"

# Endereço completo
ENDERECO="Av. Paulista, 1000 - Bela Vista"

# Cidade
CIDADE="São Paulo"

# Estado
ESTADO="SP"

# CEP
CEP="01310-100"

# CNPJ
CNPJ="12.345.678/0001-90"

# Horário de funcionamento
HORARIO="Segunda a Sexta: 08h às 18h | Sábado: 09h às 13h"

# -----------------------------------------------------------------------------
# REDES SOCIAIS
# -----------------------------------------------------------------------------

FACEBOOK="https://facebook.com/notebookmastersp"
INSTAGRAM="https://instagram.com/notebookmastersp"
LINKEDIN=""

# =============================================================================
# NÃO EDITE ABAIXO DESTA LINHA
# =============================================================================

export FTP_HOST FTP_USER FTP_PASS FTP_PORT
export REMOTE_PATH WP_URL
export WP_ADMIN_USER WP_ADMIN_PASS WP_ADMIN_EMAIL
export EMPRESA_NOME WHATSAPP TELEFONE ENDERECO CIDADE ESTADO CEP CNPJ HORARIO
export FACEBOOK INSTAGRAM LINKEDIN
