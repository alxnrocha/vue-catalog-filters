<template>
  <aside
    v-if="isVisible"
    aria-label="Project Information"
    class="author-project-badge"
  >
    <div class="badge-header">
      <h2 class="badge-title">Aurelia Atelier</h2>
      <div class="badge-tag-wrap">
        <a
          href="https://github.com/alxnrocha"
          target="_blank"
          rel="noopener noreferrer"
          class="badge-pill"
          title="View Alexandre Rocha's GitHub profile"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <span>@alxnrocha</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.8;">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
        <button class="badge-close" @click="closeBadge" title="Close (returns in 5s)" aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <div class="badge-url">
      <a href="https://alxnrocha.github.io/vue-catalog-filters/" target="_blank" rel="noopener noreferrer">https://alxnrocha.github.io/vue-catalog-filters/</a>
    </div>

    <p class="badge-desc">
        Luxury Fashion E-Commerce with Dynamic Multi-Filters in Vue 3.5 • Developed by <a href="https://github.com/alxnrocha" target="_blank" rel="noopener noreferrer">Alexandre Rocha</a>
    </p>

    <footer class="badge-footer">
      <div class="badge-status">
        <span class="badge-active"><span class="badge-dot"></span>ACTIVE</span>
        <span class="badge-divider">|</span>
        <span class="badge-branch">⑂ main</span>
      </div>
      <a href="https://github.com/alxnrocha" target="_blank" rel="noopener noreferrer" class="badge-gh">
        github.com/alxnrocha
      </a>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(true);

function closeBadge() {
  isVisible.value = false;
  setTimeout(() => {
    isVisible.value = true;
  }, 5000);
}
</script>

<style scoped>
.author-project-badge {
  position: fixed !important;
  bottom: 16px !important;
  left: 16px !important;
  z-index: 99999 !important;
  width: 360px !important;
  max-width: calc(100vw - 32px) !important;
  background-color: #0d1117 !important;
  border: 1px solid #30363d !important;
  border-radius: 14px !important;
  padding: 16px !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
  color: #f0f6fc !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif !important;
  font-size: 13px !important;
  letter-spacing: normal !important;
  line-height: 1.4 !important;
  user-select: none !important;
  box-sizing: border-box !important;
  text-align: left !important;
}
.badge-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  margin-bottom: 8px !important;
}
.badge-title {
  font-size: 14px !important;
  font-weight: 700 !important;
  color: #ffffff !important;
  margin: 0 !important;
  line-height: 1.2 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif !important;
}
.badge-tag-wrap {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
  flex-shrink: 0 !important;
}
.badge-pill {
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
  padding: 2px 8px !important;
  border-radius: 6px !important;
  background-color: #238636 !important;
  color: #ffffff !important;
  font-size: 10px !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  text-decoration: none !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif !important;
  transition: background-color 0.15s ease !important;
}
.badge-pill:hover {
  background-color: #2ea043 !important;
}
.badge-close {
  background: transparent !important;
  border: none !important;
  color: #8b949e !important;
  cursor: pointer !important;
  padding: 2px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-radius: 4px !important;
}
.badge-close:hover {
  color: #ffffff !important;
}
.badge-url {
  margin-bottom: 8px !important;
}
.badge-url a {
  color: #58a6ff !important;
  text-decoration: underline !important;
  font-size: 12px !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  display: block !important;
}
.badge-desc {
  color: #8b949e !important;
  font-size: 11px !important;
  line-height: 1.4 !important;
  margin: 0 0 12px 0 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif !important;
}
.badge-desc a {
  color: #e6edf3 !important;
  font-weight: 600 !important;
  text-decoration: none !important;
}
.badge-desc a:hover {
  color: #58a6ff !important;
  text-decoration: underline !important;
}
.badge-footer {
  padding-top: 8px !important;
  border-top: 1px solid #21262d !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-size: 10px !important;
  color: #8b949e !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif !important;
}
.badge-status {
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}
.badge-active {
  color: #3fb950 !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 4px !important;
}
.badge-dot {
  width: 7px !important;
  height: 7px !important;
  border-radius: 50% !important;
  background-color: #238636 !important;
  display: inline-block !important;
}
.badge-divider {
  color: #484f58 !important;
}
.badge-branch {
  color: #c9d1d9 !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
.badge-gh {
  color: #8b949e !important;
  text-decoration: none !important;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
.badge-gh:hover {
  color: #58a6ff !important;
  text-decoration: underline !important;
}
</style>
