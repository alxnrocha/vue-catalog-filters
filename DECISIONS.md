# DECISIONS.md — Registro de Decisões Arquiteturais (ADR)

## ADR 01: Escolha do Vue 3.5 com Composition API e `<script setup>`
- **Contexto:** Projeto 17 foca em demonstrar adaptabilidade no ecossistema Vue moderno após projetos densos em React e Next.js.
- **Decisão:** Utilizar Vue 3.5 com `<script setup lang="ts">`, aproveitando macros reativos (`defineProps`, `defineEmits`, `defineModel`), `useId` e reatividade fina via `ref` e `computed`.
- **Consequências:** Código enxuto, tipagem estrita com TypeScript sem boilerplate de Options API e máxima interoperabilidade com composables.

## ADR 02: Pinia com Setup Stores (`defineStore(() => {})`)
- **Contexto:** Gerenciamento de estado global para filtros facetados, catálogo de produtos, itens do carrinho e lista de desejos.
- **Decisão:** Adotar Pinia com sintaxe Setup Store ao invés de Options Store.
- **Consequências:** Permite usar `ref` como state, `computed` como getters e funções normais como actions, facilitando a reutilização de composables diretamente dentro das stores.

## ADR 03: Sincronização Bidirecional com Vue Router Query Params
- **Contexto:** Usuários de e-commerce esperam poder compartilhar links filtrados, usar botões de voltar/avançar do navegador e recarregar a página sem perder o estado de busca.
- **Decisão:** Implementar composable `useCatalogUrlSync` que escuta alterações na store e atualiza os query params da rota com `replaceState` suave (sem recarregar a página) e lê os parâmetros da URL na inicialização.
- **Consequências:** Experiência nativa de deep-linking sem poluir o histórico do navegador a cada tecla digitada (usando debounce).

## ADR 04: VeeValidate + Zod para Formulários e Checkout Simulado
- **Contexto:** Necessidade de validar formulários complexos (checkout com dados de entrega e pagamento, newsletter) com regras estritas.
- **Decisão:** Usar `vee-validate` com `@vee-validate/zod` para vincular schemas Zod diretamente aos campos reativos do Vue.
- **Consequências:** Validação declarativa, mensagens de erro acessíveis e tipagem estrita garantida de ponta a ponta.

## ADR 05: Tailwind CSS v4 com Tokens Customizados de E-Commerce de Luxo
- **Contexto:** O design gerado exige uma paleta escura de alto padrão (`Obsidian Slate`, `Sand Mist`, `Amber Gold`) com sombras suaves e glassmorphism.
- **Decisão:** Usar Tailwind CSS v4 com `@tailwindcss/vite` e `@theme` configurado para as cores do Aurelia Atelier.
- **Consequências:** Zero overhead de compilação CSS, design refinado e responsivo sem classes redundantes.
