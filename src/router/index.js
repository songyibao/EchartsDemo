import { createRouter, createWebHistory } from 'vue-router';
import Home from '/src/pages/Home.vue';
import About from '/src/pages/About.vue';
import Upload from '/src/pages/Upload.vue'
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/upload',
        name: 'upload',
        component: Upload
    },
    {
        path: '/about',
        name: 'About',
        component: About
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
