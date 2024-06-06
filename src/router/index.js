import {createRouter, createWebHistory} from 'vue-router'

// Importar todas las rutas
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
    {   path: '/login',component: LoginVue},
    {   path: '/',component: LayoutVue,redirect:'/home',children:[
        {path:'/home',component:HomeMainVue},
        {path:'/product/category',component:ProductCategoryVue},
        {path:'/product/manage',component:ProductManageVue},
        {path:'/user/info',component:UserInfoVue},
        {path:'/user/avatar',component:UserAvatarVue},
        {path:'/user/resetPassword',component:UserResetPasswordVue},
        {path:'/offer/manage',component:OfferManage},
        {path:'/order/manage',component:OrderManage},
    ]}
]

// Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes
})

// Exportar el router
export default router