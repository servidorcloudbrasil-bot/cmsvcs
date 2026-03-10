<?php
/**
 * Script de Instalação Automática - Notebook Master SP
 * 
 * Este script cria automaticamente a página no WordPress com Elementor
 * e importa o template completo.
 * 
 * INSTRUÇÕES:
 * 1. Faça backup do seu WordPress
 * 2. Envie este arquivo E o elementor-template-full.json para a raiz do WordPress
 * 3. Acesse: https://seusite.com.br/install.php
 * 4. Siga as instruções na tela
 * 5. DELETE estes arquivos após a instalação
 */

// Verifica se está no WordPress
if (!file_exists('wp-load.php')) {
    die('Erro: Este arquivo deve estar na raiz do WordPress.');
}

require_once 'wp-load.php';

// Verifica se o usuário está logado como admin
if (!current_user_can('administrator')) {
    die('Erro: Você precisa estar logado como administrador.');
}

// Verifica se o Elementor está ativo
if (!did_action('elementor/loaded')) {
    die('Erro: Elementor não está ativo. Por favor, instale e ative o Elementor Pro primeiro.');
}

// Verifica se o arquivo JSON existe
$json_file = __DIR__ . '/elementor-template-full.json';
if (!file_exists($json_file)) {
    die('Erro: Arquivo elementor-template-full.json não encontrado. Certifique-se de enviar ambos os arquivos (install.php e elementor-template-full.json) para a raiz do WordPress.');
}

echo '<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instalação - Notebook Master SP</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #0D0D0D 0%, #0A1628 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            width: 100%;
            background: rgba(31, 31, 31, 0.9);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 16px;
            padding: 40px;
        }
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo h1 {
            color: #D4AF37;
            font-size: 28px;
        }
        .logo p {
            color: #A0A0A0;
            margin-top: 10px;
        }
        .step {
            background: rgba(13, 13, 13, 0.5);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 4px solid #D4AF37;
        }
        .step h3 {
            color: #D4AF37;
            margin-bottom: 10px;
            font-size: 18px;
        }
        .step p {
            color: #A0A0A0;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%);
            color: #0D0D0D;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 20px;
            margin-right: 10px;
            transition: transform 0.3s;
            border: none;
            cursor: pointer;
            font-size: 16px;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: transparent;
            border: 2px solid #D4AF37;
            color: #D4AF37;
        }
        .warning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #ffc107;
        }
        .success {
            background: rgba(40, 167, 69, 0.1);
            border: 1px solid rgba(40, 167, 69, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #28a745;
        }
        .error {
            background: rgba(220, 53, 69, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            color: #dc3545;
        }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            color: #D4AF37;
            margin-bottom: 8px;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 12px 16px;
            background: rgba(13, 13, 13, 0.5);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
        }
        .form-group input:focus {
            outline: none;
            border-color: #D4AF37;
        }
        .progress {
            background: rgba(13, 13, 13, 0.5);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
        }
        .progress-item {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            color: #A0A0A0;
        }
        .progress-item.success {
            color: #28a745;
            background: transparent;
            border: none;
            padding: 0;
            margin-bottom: 8px;
        }
        .progress-item.error {
            color: #dc3545;
            background: transparent;
            border: none;
            padding: 0;
            margin-bottom: 8px;
        }
        .icon {
            margin-right: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🖥️ Notebook Master SP</h1>
            <p>Instalação Automática no WordPress + Elementor</p>
        </div>';

// Processa o formulário
if (isset($_POST['install'])) {
    $whatsapp = sanitize_text_field($_POST['whatsapp']);
    $telefone = sanitize_text_field($_POST['telefone']);
    $endereco = sanitize_text_field($_POST['endereco']);
    $cidade = sanitize_text_field($_POST['cidade']);
    $cnpj = sanitize_text_field($_POST['cnpj']);
    $email = sanitize_email($_POST['email']);
    
    echo '<div class="progress">';
    
    // Passo 1: Ler o arquivo JSON
    echo '<div class="progress-item">📖 Lendo template Elementor...</div>';
    $json_content = file_get_contents($json_file);
    $template_data = json_decode($json_content, true);
    
    if (!$template_data) {
        echo '<div class="progress-item error">❌ Erro ao ler arquivo JSON</div>';
        echo '</div></div></body></html>';
        exit;
    }
    echo '<div class="progress-item success">✅ Template carregado</div>';
    
    // Passo 2: Substituir placeholders pelos dados do formulário
    echo '<div class="progress-item">📝 Personalizando conteúdo...</div>';
    $json_content = str_replace('5511999999999', $whatsapp, $json_content);
    $json_content = str_replace('(11) 99999-9999', format_phone($whatsapp), $json_content);
    $json_content = str_replace('(11) 3333-3333', format_phone($telefone), $json_content);
    $json_content = str_replace('contato@notebookmastersp.com.br', $email, $json_content);
    $json_content = str_replace('Av. Paulista, 1000 - São Paulo, SP', $endereco . ' - ' . $cidade, $json_content);
    
    $template_data = json_decode($json_content, true);
    echo '<div class="progress-item success">✅ Conteúdo personalizado</div>';
    
    // Passo 3: Criar a página
    echo '<div class="progress-item">📄 Criando página...</div>';
    $page_title = 'Conserto de Notebook em São Paulo - SP | Especialista Gamer | 25 Anos';
    
    // Verifica se a página já existe
    $existing_page = get_page_by_path('conserto-de-notebook-em-sao-paulo-sp');
    if ($existing_page) {
        $page_id = $existing_page->ID;
        echo '<div class="progress-item">⚠️ Página existente encontrada (ID: ' . $page_id . ')</div>';
    } else {
        $page_data = array(
            'post_title'   => $page_title,
            'post_content' => '',
            'post_status'  => 'publish',
            'post_type'    => 'page',
            'post_name'    => 'conserto-de-notebook-em-sao-paulo-sp',
        );
        $page_id = wp_insert_post($page_data);
    }
    
    if (!$page_id || is_wp_error($page_id)) {
        echo '<div class="progress-item error">❌ Erro ao criar página</div>';
        echo '</div></div></body></html>';
        exit;
    }
    echo '<div class="progress-item success">✅ Página criada (ID: ' . $page_id . ')</div>';
    
    // Passo 4: Importar o template do Elementor
    echo '<div class="progress-item">🎨 Importando template Elementor...</div>';
    
    try {
        // Usar o Elementor para importar
        if (class_exists('Elementor\TemplateLibrary\Source_Local')) {
            $source = new \Elementor\TemplateLibrary\Source_Local();
            
            // Preparar dados do template
            $template_content = $template_data['content'];
            
            // Atualizar meta dados do Elementor
            update_post_meta($page_id, '_elementor_edit_mode', 'builder');
            update_post_meta($page_id, '_elementor_template_type', 'wp-page');
            update_post_meta($page_id, '_elementor_version', '3.20.0');
            update_post_meta($page_id, '_elementor_pro_version', '3.20.0');
            
            // Importar o conteúdo
            if (!empty($template_content)) {
                update_post_meta($page_id, '_elementor_data', wp_slash(json_encode($template_content)));
                echo '<div class="progress-item success">✅ Template importado</div>';
            } else {
                echo '<div class="progress-item error">❌ Template vazio</div>';
            }
        } else {
            echo '<div class="progress-item error">❌ Elementor Local Source não disponível</div>';
        }
    } catch (Exception $e) {
        echo '<div class="progress-item error">❌ Erro: ' . $e->getMessage() . '</div>';
    }
    
    // Passo 5: Atualizar configurações da página
    echo '<div class="progress-item">⚙️ Configurando página...</div>';
    update_post_meta($page_id, '_wp_page_template', 'elementor_canvas');
    update_post_meta($page_id, '_elementor_page_settings', array(
        'hide_title' => 'yes',
        'background_background' => 'classic',
        'background_color' => '#0D0D0D'
    ));
    echo '<div class="progress-item success">✅ Configurações aplicadas</div>';
    
    echo '</div>';
    
    // Sucesso!
    echo '<div class="success">
        <strong>✅ Instalação Concluída!</strong><br><br>
        Sua landing page foi criada com sucesso!
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="' . get_permalink($page_id) . '" target="_blank" class="btn">👁️ Ver Página</a>
        <a href="' . admin_url('post.php?post=' . $page_id . '&action=elementor') . '" class="btn btn-secondary">✏️ Editar com Elementor</a>
    </div>
    
    <div class="step">
        <h3>📋 Próximos Passos</h3>
        <p>1. ✅ Página criada com ID: <code>' . $page_id . '</code></p>
        <p>2. ✅ Template Elementor importado</p>
        <p>3. ✅ WhatsApp configurado: <code>' . $whatsapp . '</code></p>
        <p>4. 📝 <a href="' . admin_url('post.php?post=' . $page_id . '&action=elementor') . '" style="color: #D4AF37;">Clique aqui para editar e personalizar</a></p>
        <p>5. 🔍 Configure o SEO com Yoast ou Rank Math</p>
        <p>6. ⚠️ <strong>DELETE os arquivos install.php e elementor-template-full.json por segurança!</strong></p>
    </div>';
    
} else {
    // Mostra o formulário
    echo '
        <div class="warning">
            <strong>⚠️ Importante:</strong> Faça backup do seu WordPress antes de continuar!<br>
            Certifique-se de que o arquivo <code>elementor-template-full.json</code> está na mesma pasta que este arquivo.
        </div>
        
        <form method="POST">
            <div class="step">
                <h3>1️⃣ Informações de Contato</h3>
                <p>Preencha os dados da sua empresa:</p>
                
                <div class="form-group">
                    <label>WhatsApp (somente números, com DDD)</label>
                    <input type="text" name="whatsapp" placeholder="11999999999" required>
                </div>
                
                <div class="form-group">
                    <label>Telefone Fixo (somente números, com DDD)</label>
                    <input type="text" name="telefone" placeholder="1133334444">
                </div>
                
                <div class="form-group">
                    <label>E-mail</label>
                    <input type="email" name="email" placeholder="contato@suaempresa.com.br" required>
                </div>
            </div>
            
            <div class="step">
                <h3>2️⃣ Endereço</h3>
                
                <div class="form-group">
                    <label>Endereço Completo</label>
                    <input type="text" name="endereco" placeholder="Av. Paulista, 1000 - Bela Vista">
                </div>
                
                <div class="form-group">
                    <label>Cidade - Estado</label>
                    <input type="text" name="cidade" placeholder="São Paulo - SP" value="São Paulo - SP">
                </div>
            </div>
            
            <div class="step">
                <h3>3️⃣ Dados da Empresa</h3>
                
                <div class="form-group">
                    <label>CNPJ (opcional)</label>
                    <input type="text" name="cnpj" placeholder="12.345.678/0001-90">
                </div>
            </div>
            
            <div style="text-align: center;">
                <button type="submit" name="install" class="btn">🚀 Criar Página e Importar Template</button>
            </div>
        </form>
        
        <div class="step" style="margin-top: 30px;">
            <h3>📖 Método Alternativo</h3>
            <p>Se preferir importar manualmente pelo Elementor:</p>
            <p>1. Baixe o arquivo <code>elementor-template-full.json</code></p>
            <p>2. No WordPress, vá em <strong>Páginas > Adicionar Nova</strong></p>
            <p>3. Clique em <strong>Editar com Elementor</strong></p>
            <p>4. Clique no ícone ≡ (Menu) > <strong>Ferramentas > Importar/Exportar</strong></p>
            <p>5. Importe o arquivo JSON</p>
        </div>';
}

// Função auxiliar para formatar telefone
function format_phone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($phone) === 11) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 5) . '-' . substr($phone, 7);
    } elseif (strlen($phone) === 10) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 4) . '-' . substr($phone, 6);
    }
    return $phone;
}

echo '
    </div>
</body>
</html>';
