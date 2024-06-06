<script setup>
import { ref } from 'vue'
import useUserInfoStore from '@/store/userInfo';
import {userUpdateService} from '@/api/user';
import { ElMessage } from 'element-plus';
const userInfoStore = useUserInfoStore()
const userInfo = ref({...userInfoStore.info})
const rules = {
    nickname: [
        { required: true, message: 'Por favor, ingrese el nombre de usuario', trigger: 'blur' },
        {
            pattern: /^\S{2,10}$/,
            message: 'El nombre de usuario debe tener entre 2 y 10 caracteres y no debe contener espacios en blanco',
            trigger: 'blur'
        }
    ],
    email: [
        { required: true, message: 'Por favor, ingrese el correo electrónico', trigger: 'blur' },
        { type: 'email', message: 'El formato de correo electrónico no es válido', trigger: 'blur' }
    ]
}
const updateUserInfo = async() => {
    let result = await userUpdateService(userInfo.value)
    ElMessage.success(result.msg ? result.msg : 'Actualizado con exito')
    const userInfoTemp = {...userInfo.value}
    userInfoStore.setInfo(userInfoTemp)
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Información basica</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="Username">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="Nickname" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="gmail" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">Confirm</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>