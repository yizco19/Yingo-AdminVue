
<script setup>
import { ref } from 'vue'
import {userUpdatePasswordService} from '@/api/user';
import useUserInfoStore from '@/store/userInfo';
import { useTokenStore } from '@/store/token';
import { ElMessage } from 'element-plus';
const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore()
const checkPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Por favor, introduzca su contraseña'))
    } else if (value !== passwordData.value.password) {
        callback(new Error('Las contraseñas no newPwd'));
    } else {
        callback()
    }
}
const rules = {
    oldPwd : [
        { required: true, message: 'Por favor, ingrese la antigua password', trigger: 'blur' },
        {min: 5,max: 16,message: 'La antigua password debe tener entre 5 y 16 caracteres',trigger: 'blur'}
    ]
    ,
    newPwd : [
        { required: true, message: 'Por favor, ingrese la nueva password', trigger: 'blur' },
        {min: 5,max: 16,message: 'La nueva password debe tener entre 5 y 16 caracteres',trigger: 'blur'}
    ],
    rePwd : [
        {validator:checkPassword,trigger:'blur'}

    ]
}
const passwordData = ref(
    {
        oldPwd: '',
        newPwd: '',
        rePwd: ''
    }
)
const updateUserPassword = async () => {
    let result = await userUpdatePasswordService(passwordData.value)
    ElMessage.success(result.msg ? result.msg : 'Password actualizado')
    //limpiar
    passwordData.value.oldPwd = ''
    passwordData.value.newPwd = ''
    passwordData.value.rePwd = ''
    //redireccionar a la vista de inicio
    router.push('/')
    //borrar el token
    tokenStore.removeToken()
    //borrar el usuario
    userInfoStore.removeInfo()
    
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Cambiar Password</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form  v-model="passwordData" label-width="100px" size="large" :rules="rules">
                    <el-form-item label="Old Password">
                        <el-input  v-model="passwordData.oldPwd" ></el-input>
                    </el-form-item>
                    <el-form-item label="New Password" prop="newPassword">
                        <el-input  v-model="passwordData.newPwd"></el-input>
                    </el-form-item>
                    <el-form-item label="Re-Password" prop="rePassword">
                        <el-input  v-model="passwordData.rePwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPassword">Confirm</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>