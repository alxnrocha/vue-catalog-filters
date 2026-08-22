# GOAL PROMPT — Projeto 17: Aurelia Atelier (Vue Catálogo & Filtros Dinâmicos)

Este documento define o objetivo final inegociável para a conclusão autônoma com perfeição técnica do Projeto 17.

## Objetivo Principal
Construir um e-commerce de catálogo de moda e vestuário de luxo contemporâneo com **Vue 3.5**, **Pinia**, **Vue Router**, **TypeScript**, **Tailwind CSS v4**, **VeeValidate + Zod** e **Vitest**, seguindo rigorosamente o design gerado no mockup visual (`design/mockup.png`) e o fluxo de trabalho **FORGE-DEV** (`AI_WORKFLOW_PROTOCOL.md`).

## Requisitos Inegociáveis
1. **Fidelidade Visual Absoluta:** O produto final deve replicar com precisão o design escuro e refinado do mockup (cores âmbar/dourado, paleta obsidian slate, cards com fotos de estúdio, tipografia elegante, micro-animações).
2. **Busca Facetada e Sincronização de URL:**
   - Filtros por categoria, faixa de preço contínua (dual-handle), cores (swatches), tamanhos (XS a XXL), avaliação mínima (estrelas) e marcas.
   - Sincronização bidirecional entre o estado Pinia e a URL (`?category=chaquetas&minPrice=50&maxPrice=650&color=negro&sizes=M,L&sort=price-asc`).
   - Copiar a URL e abrir em outra aba deve restaurar exatamente os mesmos filtros e resultados.
3. **Alternância de Visualização:** Suporte fluido a Grid View (grade de 4/3/2 colunas) e List View (linhas detalhadas horizontais).
4. **Modal Quick View:** Visualização rápida do produto com galeria de fotos em alta resolução, seleção de variações e adição ao carrinho com feedback visual.
5. **Carrinho & Checkout Simulado:** Drawer de carrinho com cálculo de subtotais, frete grátis inteligente e formulário de checkout com validação rigorosa via VeeValidate + Zod.
6. **Responsividade Mobile-First:** No mobile (<768px), os filtros são exibidos através de um bottom sheet / slide-over drawer com botão de aplicar fixo.
7. **Qualidade & Testes:** Suíte de testes unitários com Vitest + Vue Test Utils cobrindo a lógica de filtragem, sincronização de URL e componentes essenciais. Zero erros de linter (Oxlint) e build de produção sem erros de TypeScript.
8. **CI/CD & Deploy:** GitHub Actions configurado para deploy automático no GitHub Pages.
