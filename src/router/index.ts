import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
