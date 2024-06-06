import { createRouter, createWebHistory } from 'vue-router'

// Importar todas las vistas
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import HomeMainVue from '@/views/home/HomeMain.vue'
import ProductCategoryVue from '@/views/product/ProductCategory.vue'
import ProductManageVue from '@/views/product/ProductManage.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import OfferManage from '@/views/offer/OfferManage.vue'
import OrderManage from '@/views/order/OrderManage.vue'

// Definir las rutas
const routes = [
    { path: '/login', component: LoginVue, meta: { title: 'Iniciar sesión' } },
    {
        path: '/',
        component: LayoutVue,
        children: [
            { path: '/home', component: HomeMainVue, meta: { title: 'Página principal' } },
            { path: '/product/category', component: ProductCategoryVue, meta: { title: 'Categoría de productos' } },
            { path: '/product/manage', component: ProductManageVue, meta: { title: 'Gestión de productos' } },
            { path: '/user/info', component: UserInfoVue, meta: { title: 'Información de usuario' } },
            { path: '/user/avatar', component: UserAvatarVue, meta: { title: 'Avatar de usuario' } },
            { path: '/user/resetPassword', component: UserResetPasswordVue, meta: { title: 'Restablecer contraseña' } },
            { path: '/offer/manage', component: OfferManage, meta: { title: 'Gestión de ofertas' } },
            { path: '/order/manage', component: OrderManage, meta: { title: 'Gestión de pedidos' } },
        ]
    }
]

// Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Establecer el título de la página en cada cambio de ruta
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Título predeterminado';
    next();
});

// Exportar el router
export default router
