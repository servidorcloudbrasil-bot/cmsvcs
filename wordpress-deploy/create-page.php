<?php
/**
 * Criar Página Notebook Master SP - Método Alternativo
 * 
 * Este arquivo cria a página diretamente no WordPress com todo o conteúdo.
 * Não requer importação de JSON!
 * 
 * INSTRUÇÕES:
 * 1. Envie este arquivo para a raiz do WordPress
 * 2. Acesse: https://seusite.com.br/create-page.php
 * 3. Preencha seus dados
 * 4. A página será criada automaticamente
 */

if (!file_exists('wp-load.php')) {
    die('Erro: Este arquivo deve estar na raiz do WordPress.');
}

require_once 'wp-load.php';

if (!current_user_can('administrator')) {
    die('Erro: Você precisa estar logado como administrador.');
}

if (!did_action('elementor/loaded')) {
    die('Erro: Elementor não está ativo. Instale e ative o Elementor Pro primeiro.');
}

// Processar formulário
if (isset($_POST['create'])) {
    $whatsapp = sanitize_text_field($_POST['whatsapp']);
    $telefone = sanitize_text_field($_POST['telefone']);
    $email = sanitize_email($_POST['email']);
    $endereco = sanitize_text_field($_POST['endereco']);
    
    // Criar ou atualizar página
    $page_data = array(
        'post_title'   => 'Conserto de Notebook em São Paulo - SP | Especialista Gamer | 25 Anos',
        'post_name'    => 'conserto-de-notebook-em-sao-paulo-sp',
        'post_content' => '',
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'meta_input'   => array(
            '_elementor_edit_mode'     => 'builder',
            '_elementor_template_type' => 'wp-page',
            '_elementor_version'       => '3.20.0',
            '_wp_page_template'        => 'elementor_canvas',
        )
    );
    
    // Verificar se página já existe
    $existing = get_page_by_path('conserto-de-notebook-em-sao-paulo-sp');
    if ($existing) {
        $page_data['ID'] = $existing->ID;
        $page_id = wp_update_post($page_data);
    } else {
        $page_id = wp_insert_post($page_data);
    }
    
    if ($page_id && !is_wp_error($page_id)) {
        // Construir o conteúdo do Elementor
        $elementor_data = build_elementor_content($whatsapp, $telefone, $email, $endereco);
        
        // Salvar dados do Elementor
        update_post_meta($page_id, '_elementor_data', wp_slash(json_encode($elementor_data)));
        update_post_meta($page_id, '_elementor_page_settings', array(
            'hide_title' => 'yes',
            'background_background' => 'classic',
            'background_color' => '#0D0D0D'
        ));
        
        // Redirecionar para edição
        $edit_url = admin_url('post.php?post=' . $page_id . '&action=elementor');
        wp_redirect($edit_url);
        exit;
    } else {
        $error = 'Erro ao criar página';
    }
}

function build_elementor_content($whatsapp, $telefone, $email, $endereco) {
    $wa_link = 'https://wa.me/55' . preg_replace('/[^0-9]/', '', $whatsapp);
    $tel_formatted = format_phone_br($telefone);
    $cel_formatted = format_phone_br($whatsapp);
    
    return [
        // HEADER
        [
            'id' => 'section_header',
            'elType' => 'section',
            'settings' => [
                'stretch_section' => 'section-stretched',
                'background_background' => 'classic',
                'background_color' => '#0D0D0D',
                'border_border' => 'solid',
                'border_color' => 'rgba(212,175,55,0.1)',
                'border_width' => ['unit' => 'px', 'top' => 0, 'right' => 0, 'bottom' => 1, 'left' => 0],
                'padding' => ['unit' => 'px', 'top' => 15, 'right' => 20, 'bottom' => 15, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_header',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'heading_logo',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => '🖥️ Notebook Master SP',
                                'header_size' => 'h3',
                                'title_color' => '#D4AF37',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 22],
                                'typography_font_weight' => '700',
                                'align' => 'center',
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // HERO SECTION
        [
            'id' => 'section_hero',
            'elType' => 'section',
            'settings' => [
                'stretch_section' => 'section-stretched',
                'background_background' => 'gradient',
                'background_color' => '#0D0D0D',
                'background_color_b' => '#0A1628',
                'background_gradient_type' => 'linear',
                'background_gradient_angle' => ['unit' => 'deg', 'size' => 135],
                'padding' => ['unit' => 'px', 'top' => 100, 'right' => 20, 'bottom' => 80, 'left' => 20],
                'min_height' => ['unit' => 'vh', 'size' => 90],
            ],
            'elements' => [
                [
                    'id' => 'col_hero',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'heading_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 500;">⭐ Líder em Conserto de Notebook em São Paulo</span></p>',
                            ],
                        ],
                        [
                            'id' => 'heading_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Conserto de Notebook em São Paulo - SP',
                                'header_size' => 'h1',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 48],
                                'typography_font_weight' => '800',
                                'typography_line_height' => ['unit' => 'em', 'size' => 1.2],
                                '_margin' => ['unit' => 'px', 'top' => 20, 'bottom' => 20],
                            ],
                        ],
                        [
                            'id' => 'text_desc',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="color: #A0A0A0; font-size: 18px; line-height: 1.7; text-align: center; max-width: 700px; margin: 0 auto;">Mais de <strong style="color: #D4AF37;">25 anos</strong> consertando notebooks em São Paulo - SP. Especialistas em <strong style="color: #D4AF37;">notebooks gamer</strong>: Razer, Alienware, Lenovo Legion, Acer Nitro, Gigabyte e mais. Atendemos toda São Paulo: Zona Sul, Norte, Leste, Oeste, Centro e Grande SP.</p>',
                                '_margin' => ['unit' => 'px', 'bottom' => 30],
                            ],
                        ],
                        [
                            'id' => 'btn_whatsapp',
                            'elType' => 'widget',
                            'widgetType' => 'button',
                            'settings' => [
                                'text' => '💬 Falar no WhatsApp',
                                'link' => ['url' => $wa_link, 'is_external' => true, 'nofollow' => false],
                                'align' => 'center',
                                'button_text_color' => '#0D0D0D',
                                'background_color' => '#D4AF37',
                                'border_radius' => ['unit' => 'px', 'size' => 8],
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 16],
                                'typography_font_weight' => '600',
                                'text_padding' => ['unit' => 'px', 'top' => 16, 'right' => 32, 'bottom' => 16, 'left' => 32],
                                '_margin' => ['unit' => 'px', 'bottom' => 20],
                            ],
                        ],
                        [
                            'id' => 'text_features',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="text-align: center; color: #A0A0A0; font-size: 14px;">✓ Orçamento Grátis &nbsp;&nbsp; ✓ Garantia 6 Meses &nbsp;&nbsp; ✓ Peças Originais</p>',
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // STATS SECTION
        [
            'id' => 'section_stats',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'classic',
                'background_color' => '#0D0D0D',
                'padding' => ['unit' => 'px', 'top' => 40, 'right' => 20, 'bottom' => 40, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_stats',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'inner_stats',
                            'elType' => 'section',
                            'settings' => [
                                'background_background' => 'classic',
                                'background_color' => 'rgba(31,31,31,0.8)',
                                'border_border' => 'solid',
                                'border_color' => 'rgba(212,175,55,0.2)',
                                'border_width' => ['unit' => 'px', 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1],
                                'border_radius' => ['unit' => 'px', 'size' => 16],
                                'padding' => ['unit' => 'px', 'top' => 30, 'right' => 30, 'bottom' => 30, 'left' => 30],
                            ],
                            'elements' => [
                                [
                                    'id' => 'col_stat1',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'stat1_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '25+', 'header_size' => 'h3', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_typography' => 'custom', 'typography_font_size' => ['unit' => 'px', 'size' => 36], 'typography_font_weight' => '800']],
                                        ['id' => 'stat1_label', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 12px; text-align: center; margin: 0;">Anos de Experiência</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'col_stat2',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'stat2_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '15.000+', 'header_size' => 'h3', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_typography' => 'custom', 'typography_font_size' => ['unit' => 'px', 'size' => 36], 'typography_font_weight' => '800']],
                                        ['id' => 'stat2_label', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 12px; text-align: center; margin: 0;">Notebooks Consertados</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'col_stat3',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'stat3_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '4.9', 'header_size' => 'h3', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_typography' => 'custom', 'typography_font_size' => ['unit' => 'px', 'size' => 36], 'typography_font_weight' => '800']],
                                        ['id' => 'stat3_label', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 12px; text-align: center; margin: 0;">Avaliação Média</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'col_stat4',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'stat4_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '6 Meses', 'header_size' => 'h3', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_typography' => 'custom', 'typography_font_size' => ['unit' => 'px', 'size' => 36], 'typography_font_weight' => '800']],
                                        ['id' => 'stat4_label', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 12px; text-align: center; margin: 0;">Garantia Total</p>']],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // SERVICES SECTION
        [
            'id' => 'section_services',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'classic',
                'background_color' => '#0D0D0D',
                'padding' => ['unit' => 'px', 'top' => 80, 'right' => 20, 'bottom' => 80, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_services',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'svc_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => ['editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Nossos Serviços</span></p>'],
                        ],
                        [
                            'id' => 'svc_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Especialistas em Notebook Gamer',
                                'header_size' => 'h2',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 36],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'top' => 16, 'bottom' => 16],
                            ],
                        ],
                        [
                            'id' => 'svc_desc',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="color: #A0A0A0; font-size: 16px; text-align: center; max-width: 600px; margin: 0 auto 40px;">Oferecemos soluções completas para todos os problemas do seu notebook em São Paulo.</p>',
                            ],
                        ],
                        // Service 1
                        [
                            'id' => 'svc1',
                            'elType' => 'section',
                            'settings' => ['margin' => ['unit' => 'px', 'bottom' => 20]],
                            'elements' => [
                                [
                                    'id' => 'svc1_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc1_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '🎮 Notebook Gamer SP', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc1_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Especialistas em Razer, Alienware, Lenovo Legion, Acer Nitro, ASUS ROG, Gigabyte e MSI. Overheating, placa de vídeo, upgrade de RAM, SSD NVMe.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'svc2_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc2_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '🖥️ Troca de Tela', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc2_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Telas quebradas, linhas, manchas ou flickering. Full HD, 4K, 144Hz e 240Hz. Telas originais com garantia de 1 ano.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'svc3_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc3_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '🔧 Reparo Placa Mãe', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc3_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Diagnóstico avançado e reparo de nível componente. BGA reballing, troca GPU/CPU, reparo de circuitos.</p>']],
                                    ],
                                ],
                            ],
                        ],
                        // Service 2
                        [
                            'id' => 'svc2_row',
                            'elType' => 'section',
                            'settings' => ['margin' => ['unit' => 'px', 'top' => 20]],
                            'elements' => [
                                [
                                    'id' => 'svc4_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc4_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '⌨️ Troca de Teclado', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc4_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Teclas soltas, líquido derramado ou teclado não funciona. Original, ABNT2, backlit RGB e mecânico gamer.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'svc5_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc5_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '🔋 Troca de Bateria', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc5_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Bateria não segura carga, notebook desliga sozinho ou bateria inchada. Baterias originais com garantia.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'svc6_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        ['id' => 'svc6_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '🧹 Limpeza e Manutenção', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'typography_font_size' => ['unit' => 'px', 'size' => 18], 'typography_font_weight' => '600']],
                                        ['id' => 'svc6_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.6;">Limpeza interna completa, troca de pasta térmica, limpeza de cooler e otimização do sistema.</p>']],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // COMO FUNCIONA SECTION
        [
            'id' => 'section_como',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'gradient',
                'background_color' => '#0A1628',
                'background_color_b' => '#0D0D0D',
                'background_gradient_type' => 'linear',
                'background_gradient_angle' => ['unit' => 'deg', 'size' => 180],
                'padding' => ['unit' => 'px', 'top' => 80, 'right' => 20, 'bottom' => 80, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_como',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'como_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => ['editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Processo Simples</span></p>'],
                        ],
                        [
                            'id' => 'como_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Como Funciona o Nosso Atendimento',
                                'header_size' => 'h2',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 36],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'top' => 16, 'bottom' => 16],
                            ],
                        ],
                        [
                            'id' => 'steps_row',
                            'elType' => 'section',
                            'settings' => ['margin' => ['unit' => 'px', 'top' => 40]],
                            'elements' => [
                                [
                                    'id' => 'step1_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'step1_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '01', 'header_size' => 'h2', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 48], 'typography_font_weight' => '800']],
                                        ['id' => 'step1_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => 'Você traz ou chama no WhatsApp', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 16], 'typography_font_weight' => '600']],
                                        ['id' => 'step1_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 13px; text-align: center; line-height: 1.6;">Traga seu equipamento ou chame no WhatsApp para agendar uma visita técnica em São Paulo.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'step2_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'step2_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '02', 'header_size' => 'h2', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 48], 'typography_font_weight' => '800']],
                                        ['id' => 'step2_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => 'Fazemos o diagnóstico detalhado', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 16], 'typography_font_weight' => '600']],
                                        ['id' => 'step2_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 13px; text-align: center; line-height: 1.6;">Nossa equipe técnica realiza um diagnóstico completo para identificar todos os problemas.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'step3_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'step3_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '03', 'header_size' => 'h2', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 48], 'typography_font_weight' => '800']],
                                        ['id' => 'step3_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => 'Enviamos orçamento no mesmo dia', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 16], 'typography_font_weight' => '600']],
                                        ['id' => 'step3_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 13px; text-align: center; line-height: 1.6;">Você recebe um orçamento detalhado e transparente, sem surpresas ou custos ocultos.</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'step4_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 25],
                                    'elements' => [
                                        ['id' => 'step4_num', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => '04', 'header_size' => 'h2', 'title_color' => '#D4AF37', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 48], 'typography_font_weight' => '800']],
                                        ['id' => 'step4_title', 'elType' => 'widget', 'widgetType' => 'heading', 'settings' => ['title' => 'Iniciamos o conserto com prioridade', 'header_size' => 'h4', 'title_color' => '#FFFFFF', 'align' => 'center', 'typography_font_size' => ['unit' => 'px', 'size' => 16], 'typography_font_weight' => '600']],
                                        ['id' => 'step4_text', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 13px; text-align: center; line-height: 1.6;">Após aprovação, iniciamos o reparo imediatamente com prioridade máxima.</p>']],
                                    ],
                                ],
                            ],
                        ],
                        [
                            'id' => 'como_btn',
                            'elType' => 'widget',
                            'widgetType' => 'button',
                            'settings' => [
                                'text' => '💬 Iniciar Atendimento Agora',
                                'link' => ['url' => $wa_link, 'is_external' => true, 'nofollow' => false],
                                'align' => 'center',
                                'button_text_color' => '#0D0D0D',
                                'background_color' => '#D4AF37',
                                'border_radius' => ['unit' => 'px', 'size' => 8],
                                'typography_font_size' => ['unit' => 'px', 'size' => 16],
                                'typography_font_weight' => '600',
                                'text_padding' => ['unit' => 'px', 'top' => 16, 'right' => 32, 'bottom' => 16, 'left' => 32],
                                '_margin' => ['unit' => 'px', 'top' => 40],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // DEPOIMENTOS SECTION
        [
            'id' => 'section_depo',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'classic',
                'background_color' => '#0D0D0D',
                'padding' => ['unit' => 'px', 'top' => 80, 'right' => 20, 'bottom' => 80, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_depo',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'depo_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => ['editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Depoimentos</span></p>'],
                        ],
                        [
                            'id' => 'depo_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'O que Nossos Clientes Dizem',
                                'header_size' => 'h2',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 36],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'top' => 16, 'bottom' => 40],
                            ],
                        ],
                        [
                            'id' => 'depo_row',
                            'elType' => 'section',
                            'settings' => [],
                            'elements' => [
                                [
                                    'id' => 'depo1_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        [
                                            'id' => 'depo1_box',
                                            'elType' => 'section',
                                            'settings' => [
                                                'background_background' => 'classic',
                                                'background_color' => 'rgba(31,31,31,0.8)',
                                                'border_border' => 'solid',
                                                'border_color' => 'rgba(212,175,55,0.2)',
                                                'border_width' => ['unit' => 'px', 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1],
                                                'border_radius' => ['unit' => 'px', 'size' => 16],
                                                'padding' => ['unit' => 'px', 'top' => 24, 'right' => 24, 'bottom' => 24, 'left' => 24],
                                            ],
                                            'elements' => [
                                                [
                                                    'id' => 'depo1_text',
                                                    'elType' => 'widget',
                                                    'widgetType' => 'text-editor',
                                                    'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.7; margin-bottom: 16px;">"Meu notebook gamer Alienware estava superaquecendo. A equipe fez a limpeza completa e troca da pasta térmica. Agora está perfeito!"</p><p style="color: #FFFFFF; font-weight: 600; margin: 0;">Carlos Mendes</p><p style="color: #A0A0A0; font-size: 12px; margin: 0;">Zona Sul - São Paulo, SP</p>'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'id' => 'depo2_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        [
                                            'id' => 'depo2_box',
                                            'elType' => 'section',
                                            'settings' => [
                                                'background_background' => 'classic',
                                                'background_color' => 'rgba(31,31,31,0.8)',
                                                'border_border' => 'solid',
                                                'border_color' => 'rgba(212,175,55,0.2)',
                                                'border_width' => ['unit' => 'px', 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1],
                                                'border_radius' => ['unit' => 'px', 'size' => 16],
                                                'padding' => ['unit' => 'px', 'top' => 24, 'right' => 24, 'bottom' => 24, 'left' => 24],
                                            ],
                                            'elements' => [
                                                [
                                                    'id' => 'depo2_text',
                                                    'elType' => 'widget',
                                                    'widgetType' => 'text-editor',
                                                    'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.7; margin-bottom: 16px;">"Troquei a tela do meu Dell no mesmo dia! Preço justo e serviço de qualidade. Indico para todos que precisam de conserto de notebook em São Paulo."</p><p style="color: #FFFFFF; font-weight: 600; margin: 0;">Ana Paula Silva</p><p style="color: #A0A0A0; font-size: 12px; margin: 0;">Centro - São Paulo, SP</p>'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                                [
                                    'id' => 'depo3_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 33],
                                    'elements' => [
                                        [
                                            'id' => 'depo3_box',
                                            'elType' => 'section',
                                            'settings' => [
                                                'background_background' => 'classic',
                                                'background_color' => 'rgba(31,31,31,0.8)',
                                                'border_border' => 'solid',
                                                'border_color' => 'rgba(212,175,55,0.2)',
                                                'border_width' => ['unit' => 'px', 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1],
                                                'border_radius' => ['unit' => 'px', 'size' => 16],
                                                'padding' => ['unit' => 'px', 'top' => 24, 'right' => 24, 'bottom' => 24, 'left' => 24],
                                            ],
                                            'elements' => [
                                                [
                                                    'id' => 'depo3_text',
                                                    'elType' => 'widget',
                                                    'widgetType' => 'text-editor',
                                                    'settings' => ['editor' => '<p style="color: #A0A0A0; font-size: 14px; line-height: 1.7; margin-bottom: 16px;">"Repararam a placa mãe do meu Lenovo Legion que outras assistências disseram ser impossível. Profissionais competentes e honestos!"</p><p style="color: #FFFFFF; font-weight: 600; margin: 0;">Ricardo Oliveira</p><p style="color: #A0A0A0; font-size: 12px; margin: 0;">Zona Norte - São Paulo, SP</p>'],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // FAQ SECTION
        [
            'id' => 'section_faq',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'gradient',
                'background_color' => '#0A1628',
                'background_color_b' => '#0D0D0D',
                'background_gradient_type' => 'linear',
                'background_gradient_angle' => ['unit' => 'deg', 'size' => 180],
                'padding' => ['unit' => 'px', 'top' => 80, 'right' => 20, 'bottom' => 80, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_faq',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'faq_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => ['editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">FAQ</span></p>'],
                        ],
                        [
                            'id' => 'faq_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Perguntas Frequentes',
                                'header_size' => 'h2',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 36],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'top' => 16, 'bottom' => 40],
                            ],
                        ],
                        [
                            'id' => 'faq_accordion',
                            'elType' => 'widget',
                            'widgetType' => 'accordion',
                            'settings' => [
                                'tabs' => [
                                    ['tab_title' => 'Quanto tempo leva o conserto de notebook em São Paulo?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">O tempo varia conforme o problema. Trocas de tela e teclado geralmente são feitas no mesmo dia. Reparos em placa mãe podem levar de 3 a 7 dias úteis.</p>'],
                                    ['tab_title' => 'Vocês atendem em domicílio em São Paulo?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">Sim! Atendemos em domicílio em todas as regiões: Zona Sul, Norte, Leste, Oeste, Centro e Grande SP. Entre em contato pelo WhatsApp para agendar.</p>'],
                                    ['tab_title' => 'Qual o valor do orçamento?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">O orçamento é completamente gratuito! Você traz ou envia seu notebook, fazemos o diagnóstico completo e enviamos o orçamento detalhado sem nenhum custo.</p>'],
                                    ['tab_title' => 'Vocês consertam notebook gamer?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">Sim! Somos especialistas em notebooks gamer. Atendemos Razer, Alienware, Lenovo Legion, Acer Nitro, ASUS ROG, Gigabyte, MSI e outras marcas.</p>'],
                                    ['tab_title' => 'Qual a garantia dos serviços?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">Oferecemos garantia de 6 meses para todos os serviços. Para peças trocadas como telas, teclados e baterias, a garantia é de 1 ano.</p>'],
                                    ['tab_title' => 'Vocês fazem reparo de placa mãe?', 'tab_content' => '<p style="color: #A0A0A0; line-height: 1.7;">Sim! Fazemos reparo de placa mãe com técnicas avançadas como BGA reballing, troca de GPU/CPU, reparo de circuitos e diagnóstico de componentes.</p>'],
                                ],
                                'title_color' => '#FFFFFF',
                                'content_color' => '#A0A0A0',
                                'border_color' => 'rgba(212,175,55,0.2)',
                                'background_color' => 'rgba(31,31,31,0.8)',
                                'typography_font_size' => ['unit' => 'px', 'size' => 15],
                                'typography_font_weight' => '600',
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // CONTATO SECTION
        [
            'id' => 'section_contato',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'classic',
                'background_color' => '#0D0D0D',
                'padding' => ['unit' => 'px', 'top' => 80, 'right' => 20, 'bottom' => 80, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_contato',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'cont_badge',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => ['editor' => '<p style="text-align: center;"><span style="display: inline-block; background: rgba(212,175,55,0.15); color: #D4AF37; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">Contato</span></p>'],
                        ],
                        [
                            'id' => 'cont_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Entre em Contato',
                                'header_size' => 'h2',
                                'title_color' => '#FFFFFF',
                                'align' => 'center',
                                'typography_typography' => 'custom',
                                'typography_font_size' => ['unit' => 'px', 'size' => 36],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'top' => 16, 'bottom' => 40],
                            ],
                        ],
                        [
                            'id' => 'cont_row',
                            'elType' => 'section',
                            'settings' => [],
                            'elements' => [
                                [
                                    'id' => 'cont_info_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 50],
                                    'elements' => [
                                        ['id' => 'cont_wa', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 4px;">WhatsApp</p><p style="color: #FFFFFF; font-size: 18px; margin: 0;">' . $cel_formatted . '</p>']],
                                        ['id' => 'cont_tel', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 4px; margin-top: 20px;">Telefone</p><p style="color: #FFFFFF; font-size: 18px; margin: 0;">' . $tel_formatted . '</p>']],
                                        ['id' => 'cont_email', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 4px; margin-top: 20px;">E-mail</p><p style="color: #FFFFFF; font-size: 18px; margin: 0;">' . $email . '</p>']],
                                        ['id' => 'cont_addr', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 4px; margin-top: 20px;">Endereço</p><p style="color: #FFFFFF; font-size: 18px; margin: 0;">' . $endereco . '</p>']],
                                        ['id' => 'cont_hours', 'elType' => 'widget', 'widgetType' => 'text-editor', 'settings' => ['editor' => '<p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin-bottom: 4px; margin-top: 20px;">Horário</p><p style="color: #FFFFFF; font-size: 16px; margin: 0;">Segunda a Sexta: 8h às 18h<br>Sábado: 9h às 13h</p>']],
                                    ],
                                ],
                                [
                                    'id' => 'cont_form_col',
                                    'elType' => 'column',
                                    'settings' => ['_column_size' => 50],
                                    'elements' => [
                                        [
                                            'id' => 'form_box',
                                            'elType' => 'section',
                                            'settings' => [
                                                'background_background' => 'classic',
                                                'background_color' => 'rgba(31,31,31,0.8)',
                                                'border_border' => 'solid',
                                                'border_color' => 'rgba(212,175,55,0.2)',
                                                'border_width' => ['unit' => 'px', 'top' => 1, 'right' => 1, 'bottom' => 1, 'left' => 1],
                                                'border_radius' => ['unit' => 'px', 'size' => 16],
                                                'padding' => ['unit' => 'px', 'top' => 30, 'right' => 30, 'bottom' => 30, 'left' => 30],
                                            ],
                                            'elements' => [
                                                [
                                                    'id' => 'form_title',
                                                    'elType' => 'widget',
                                                    'widgetType' => 'heading',
                                                    'settings' => [
                                                        'title' => 'Solicite um Orçamento',
                                                        'header_size' => 'h3',
                                                        'title_color' => '#FFFFFF',
                                                        'align' => 'center',
                                                        'typography_font_size' => ['unit' => 'px', 'size' => 20],
                                                        'typography_font_weight' => '700',
                                                        '_margin' => ['unit' => 'px', 'bottom' => 20],
                                                    ],
                                                ],
                                                [
                                                    'id' => 'form_widget',
                                                    'elType' => 'widget',
                                                    'widgetType' => 'form',
                                                    'settings' => [
                                                        'form_name' => 'Orçamento Notebook Master SP',
                                                        'form_fields' => [
                                                            ['field_type' => 'text', 'field_label' => 'Nome', 'field_placeholder' => 'Seu nome completo', 'field_required' => 'yes', 'field_id' => 'nome'],
                                                            ['field_type' => 'email', 'field_label' => 'E-mail', 'field_placeholder' => 'seu@email.com', 'field_required' => 'yes', 'field_id' => 'email'],
                                                            ['field_type' => 'tel', 'field_label' => 'Telefone', 'field_placeholder' => '(11) 99999-9999', 'field_required' => 'yes', 'field_id' => 'telefone'],
                                                            ['field_type' => 'textarea', 'field_label' => 'Mensagem', 'field_placeholder' => 'Descreva o problema do seu notebook...', 'field_required' => 'yes', 'field_id' => 'mensagem'],
                                                        ],
                                                        'button_text' => 'Enviar Mensagem',
                                                        'button_text_color' => '#0D0D0D',
                                                        'button_background_color' => '#D4AF37',
                                                        'button_border_radius' => ['unit' => 'px', 'size' => 8],
                                                    ],
                                                ],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // CTA FINAL SECTION
        [
            'id' => 'section_cta',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'gradient',
                'background_color' => '#D4AF37',
                'background_color_b' => '#B8941F',
                'background_gradient_type' => 'linear',
                'background_gradient_angle' => ['unit' => 'deg', 'size' => 135],
                'padding' => ['unit' => 'px', 'top' => 60, 'right' => 20, 'bottom' => 60, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_cta',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'cta_title',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => 'Pronto para Consertar seu Notebook?',
                                'header_size' => 'h2',
                                'title_color' => '#0D0D0D',
                                'align' => 'center',
                                'typography_font_size' => ['unit' => 'px', 'size' => 32],
                                'typography_font_weight' => '800',
                                '_margin' => ['unit' => 'px', 'bottom' => 16],
                            ],
                        ],
                        [
                            'id' => 'cta_desc',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="color: #0D0D0D; font-size: 16px; text-align: center; margin-bottom: 24px;">Orçamento grátis em São Paulo. Atendemos toda a cidade com garantia de 6 meses.</p>',
                            ],
                        ],
                        [
                            'id' => 'cta_btn',
                            'elType' => 'widget',
                            'widgetType' => 'button',
                            'settings' => [
                                'text' => '💬 Falar no WhatsApp Agora',
                                'link' => ['url' => $wa_link, 'is_external' => true, 'nofollow' => false],
                                'align' => 'center',
                                'button_text_color' => '#FFFFFF',
                                'background_color' => '#0D0D0D',
                                'border_radius' => ['unit' => 'px', 'size' => 8],
                                'typography_font_size' => ['unit' => 'px', 'size' => 16],
                                'typography_font_weight' => '600',
                                'text_padding' => ['unit' => 'px', 'top' => 16, 'right' => 32, 'bottom' => 16, 'left' => 32],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        
        // FOOTER SECTION
        [
            'id' => 'section_footer',
            'elType' => 'section',
            'settings' => [
                'background_background' => 'classic',
                'background_color' => '#0A0A0A',
                'padding' => ['unit' => 'px', 'top' => 50, 'right' => 20, 'bottom' => 30, 'left' => 20],
            ],
            'elements' => [
                [
                    'id' => 'col_footer',
                    'elType' => 'column',
                    'settings' => ['_column_size' => 100],
                    'elements' => [
                        [
                            'id' => 'footer_logo',
                            'elType' => 'widget',
                            'widgetType' => 'heading',
                            'settings' => [
                                'title' => '🖥️ Notebook Master SP',
                                'header_size' => 'h3',
                                'title_color' => '#D4AF37',
                                'align' => 'center',
                                'typography_font_size' => ['unit' => 'px', 'size' => 20],
                                'typography_font_weight' => '700',
                                '_margin' => ['unit' => 'px', 'bottom' => 12],
                            ],
                        ],
                        [
                            'id' => 'footer_desc',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="color: #A0A0A0; font-size: 14px; text-align: center; line-height: 1.6; max-width: 500px; margin: 0 auto;">Especialistas em conserto de notebook em São Paulo - SP. 25 anos de experiência, garantia de 6 meses.</p>',
                                '_margin' => ['unit' => 'px', 'bottom' => 20],
                            ],
                        ],
                        [
                            'id' => 'footer_copy',
                            'elType' => 'widget',
                            'widgetType' => 'text-editor',
                            'settings' => [
                                'editor' => '<p style="color: #666; font-size: 12px; text-align: center; margin: 0;">© 2024 Notebook Master SP. Todos os direitos reservados. | Conserto de Notebook em São Paulo - SP</p>',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ];
}

function format_phone_br($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    if (strlen($phone) === 11) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 5) . '-' . substr($phone, 7);
    } elseif (strlen($phone) === 10) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 4) . '-' . substr($phone, 6);
    }
    return $phone;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar Página - Notebook Master SP</title>
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
            max-width: 500px;
            width: 100%;
            background: rgba(31, 31, 31, 0.95);
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
            font-size: 24px;
        }
        .logo p {
            color: #A0A0A0;
            margin-top: 8px;
            font-size: 14px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            color: #D4AF37;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
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
        .btn {
            width: 100%;
            background: linear-gradient(135deg, #D4AF37 0%, #B8960C 100%);
            color: #0D0D0D;
            padding: 16px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .info {
            background: rgba(212, 175, 55, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
            font-size: 13px;
            color: #A0A0A0;
        }
        .info strong {
            color: #D4AF37;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <h1>🖥️ Notebook Master SP</h1>
            <p>Criar Landing Page Automaticamente</p>
        </div>
        
        <div class="info">
            <strong>ℹ️ Informação:</strong> Esta ferramenta cria a página diretamente no WordPress com todo o conteúdo do Elementor. Não é necessário importar JSON!
        </div>
        
        <?php if (isset($error)): ?>
        <div style="background: rgba(220,53,69,0.2); border: 1px solid rgba(220,53,69,0.5); border-radius: 8px; padding: 15px; margin-bottom: 20px; color: #ff6b6b;">
            ❌ <?php echo $error; ?>
        </div>
        <?php endif; ?>
        
        <form method="POST">
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
            
            <div class="form-group">
                <label>Endereço Completo</label>
                <input type="text" name="endereco" placeholder="Av. Paulista, 1000 - Bela Vista, São Paulo - SP" required>
            </div>
            
            <button type="submit" name="create" class="btn">🚀 Criar Página Automaticamente</button>
        </form>
    </div>
</body>
</html>
