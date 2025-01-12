import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/map',
    name: 'map',
    component: () => import('../views/MapView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
