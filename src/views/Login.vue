<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
// Controla la visualización del formulario de registro y de inicio de sesión, por defecto muestra el de registro
const isRegistro = ref(false)
// Controla los datos del formulario de registro
const registerData = ref({
    username: '',
    email: '',
    password: '',
    rePassword: ''
})

// Controla los datos del formulario de inicio de sesión
const loginData = ref({
    usernameOrEmail: '',
    password: ''
})
// Controla la confirmación de la contraseña
const checkPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Por favor, introduzca su contraseña'))
    } else if (value !== registerData.value.password) {
        callback(new Error('Las contraseñas no coinciden'));
    } else {
        callback()
    }
}

const checkEmail = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Por favor, ingrese su correo electrónico'));
    }
    else if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
        callback(new Error('Por favor, ingrese un correo electrónico valido'));
    }else {
        callback();
    }
}

const rules={
    usernameOrEmail:[
        { required: true, message: 'Por favor, ingrese su nombre de usuario o correo electrónico', trigger: 'blur' },
        {min: 5,max: 16,message: 'Por favor, ingrese su nombre de usuario o correo electrónico',trigger: 'blur'}
    ],
    password:[
        { required: true, message: 'Por favor, ingrese su contraseña', trigger: 'blur' },
        {min: 5,max: 16,message: 'La contraseña debe tener entre 5 y 16 caracteres',trigger: 'blur'}
    ],
    rePassword:[
        {validator:checkPassword,trigger:'blur'}
    ],
    email:[
        { required: true, message: 'Por favor, ingrese su correo electrónico', trigger: 'blur' },
        {validator:checkEmail,trigger:'blur'}
    ],
    username:[
        { required: true, message: 'Por favor, ingrese su nombre de usuario', trigger: 'blur' },
        {min: 5,max: 16,message: 'Por favor, ingrese su nombre de usuario',trigger: 'blur'}
    ]
}

// utiliza Api de registro de usuario
import {userRegisterService} from '@/api/user'
const register = async()=>{
    let result = await userRegisterService(registerData.value)

    /*if(result.code === 0){
        alert(result.msg ? result.msg : 'Registro exitoso')
    }else{
        alert('Error al registrar')
    }*/
    ElMessage.success(result.msg ? result.msg : 'Registro exitoso')
}

// Login de usuario
import {userLoginService} from '@/api/user'
import {useRouter} from 'vue-router'
import {useTokenStore} from '@/store/token.js'
const tokenStore = useTokenStore();
const router = useRouter()
const login = async()=>{
    let result = await userLoginService(loginData.value)
    /*if(result.code === 0){
        alert(result.msg ? result.msg : 'Login exitoso')
    }else{
        alert('Error al iniciar sesión')
    }*/
    // Guardar el token del usuario
    tokenStore.setToken(result.data)
    ElMessage.success(result.msg ? result.msg : 'Login exitoso')
    // Si el login es exitoso, redirigir a la vista de inicio
    router.push('/')
}

// clear loginData y Registro
const clear = ()=>{
    loginData.value = {
        usernameOrEmail: '',
        password: ''
    }
    registerData.value = {
        username: '',
        email: '',
        password: '',
        rePassword: ''
    }
}
</script>

<template>
    <el-row class="pagina-login">
        <el-col :span="12" class="fondo"></el-col>
        <el-col :span="6" :offset="3" class="formulario">
            <!-- Formulario de registro -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegistro" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>Registro</h1>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input :prefix-icon="User" placeholder="Ingrese su nombre de usuario" v-model="registerData.username"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input  placeholder="Ingrese su correo electrónico" v-model="registerData.email"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Ingrese su contraseña" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="Ingrese nuevamente su contraseña" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- Botón de registro -->
                <el-form-item>
                    <el-button class="boton" type="primary" auto-insert-space @click="register">
                        Registrarse
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegistro = false; clear()">
                        ← Volver
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- Formulario de inicio de sesión -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="loginData" :rules="rules">
                <el-form-item>
                    <h1>Iniciar Sesión</h1>
                </el-form-item>
                <el-form-item prop="usernameOrEmail">
                    <el-input :prefix-icon="User" placeholder="Ingrese su nombre de usuario o correo electrónico" v-model="loginData.usernameOrEmail"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="Ingrese su contraseña" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>Recordarme</el-checkbox>
                        <el-link type="primary" :underline="false">¿Olvidó su contraseña?</el-link>
                    </div>
                </el-form-item>
                <!-- Botón de inicio de sesión -->
                <el-form-item>
                    <el-button class="boton" type="primary" auto-insert-space @click="login">Iniciar Sesión</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegistro = true ; clear()">
                        Registrarse →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* Estilos */
.pagina-login {
    height: 100vh;
    background-color: #fff;

    .fondo {
        background: url('../assets/logo2.png') no-repeat 60% center / 240px auto,
            url('../assets/login_bg.jpeg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .formulario {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .titulo {
            margin: 0 auto;
        }

        .boton {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>