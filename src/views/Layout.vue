<script setup>
import {
    HomeFilled,
    Goods,
    Tickets,
    UserFilled,
    User,
    Crop,
    Ticket,
    EditPen,
    Menu,
    SwitchButton,
    CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import router from '@/router';
import { userInfoService } from '@/api/user';
import useUserInfoStore from '@/store/userInfo';
import { useTokenStore } from '@/store/token';
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const getUserInfo = async () => {
    let result = await userInfoService();
        userInfoStore.setInfo(result.data);

}
getUserInfo();
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
// si ha click los botones de la barra lateral, se redirige a la vista correspondiente
const handleCommand = (command) => {
    // comprobar el comando y redirigir a la vista correspondiente
    if (command === 'logout') {
        ElMessageBox.confirm(
    '¿Estás seguro de cerrar sesión?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async() => {
        // limpiar el token y datos del usuario
        userInfoStore.removeInfo()
        tokenStore.removeToken()
        router.push('/login')
      ElMessage({
        type: 'success',
        message: 'Cerrando sesión correctamente!',
      })
})
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Usuario cancelado la operación',
      })
    })
    } else{
        router.push('/user/' + command)
    }
}
</script>


<template>
    <el-container class="layout-container">
        <!-- Elementos de la barra lateral -->
        <el-aside width="200px">
    <div class="el-aside__logo"></div>
    <el-menu active-text-color="#ffd04b" background-color="#3189cc" text-color="#fff" router>
        <el-menu-item index="/home">
            <el-icon>
                <HomeFilled />
            </el-icon>
            <span>Inicio</span>
        </el-menu-item>
        <el-menu-item index="/product/category">
            <el-icon><Menu /></el-icon>
            <span>Gestión de Categorías</span>
        </el-menu-item>
        <el-menu-item index="/product/manage">
            <el-icon><Goods /></el-icon>
            <span>Gestión de Productos</span>
        </el-menu-item>
        <el-menu-item index="/order/manage">
            <el-icon>
                <Tickets />
            </el-icon>
            <span>Gestión de Pedidos</span>
        </el-menu-item>
        <el-menu-item index="/offer/manage">
            <el-icon>
                <Ticket />
            </el-icon>
            <span>Gestión de Ofertas</span>
        </el-menu-item>
        <el-sub-menu>
            <template #title>
                <el-icon>
                    <UserFilled />
                </el-icon>
                <span>Centro personal</span>
            </template>
            <el-menu-item index="/user/info">
                <el-icon>
                    <User />
                </el-icon>
                <span>Información básica</span>
            </el-menu-item>
            <el-menu-item index="/user/avatar">
                <el-icon>
                    <Crop />
                </el-icon>
                <span>Cambiar avatar</span>
            </el-menu-item>
            <el-menu-item index="/user/resetPassword">
                <el-icon>
                    <EditPen />
                </el-icon>
                <span>Restablecer contraseña</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</el-aside>

        <!-- Derecho de contenido -->
        <el-container>
            <!-- Elementos de encabezado -->
            <el-header>
                <div>Admin：<strong>{{ userInfoStore.info.nickname }}</strong></div>
                        <!-- command: cuando un botón es pulsado, se ejecuta esta función  para el comando correspondiente respectivo-->
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <el-avatar :src="userInfoStore.info.userPic?userInfoStore.info.userPic:avatar" />
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">Perfil</el-dropdown-item>
                            <el-dropdown-item command="avatar" :icon="Crop">Cambiar avatar</el-dropdown-item>
                            <el-dropdown-item command="resetPassword"
                                :icon="EditPen">Restablecercontraseña</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">Cerrar sesión</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- Área central -->
            <el-main>
                <!--<div style="width: 1290px; height: 570px; border: 1px solid red;">
                    Área de visualización de contenido
                </div>-->
                <router-view></router-view>
            </el-main>
            <!-- Área inferior -->

            <el-footer>Yingo ©2024 Created by Zhi Yang</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #46a9eb;

        &__logo {
            height: 120px;
            background: url('../assets/login2.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>
