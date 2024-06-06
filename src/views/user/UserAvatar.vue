<script setup>
import { Plus, Upload } from '@element-plus/icons-vue';
import defaultAvatar from '@/assets/default.png'; 
import  useUserInfoStore  from '@/store/userInfo';
import { userUpdateAvatarService } from '@/api/user';
import { useTokenStore } from '@/store/token';
import { ref } from 'vue';
import {ElMessage} from 'element-plus';
const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const uploadRef = ref();
const imgUrl = ref(userInfoStore.info.userPic); // Añade una referencia reactiva para la URL de la imagen

// Función para manejar la subida de la imagen del avatar
const handleAvatarUpload = async() => {
    let result = await userUpdateAvatarService(imgUrl.value);
        ElMessage.success(result.msg ? result.msg : 'Actualizado con exito');
        userInfoStore.info.userPic = imgUrl.value;


};
const uploadSuccess = (result) => {
    imgUrl.value = result.data
}

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Cambiar Avatar</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload 
                    ref="uploadRef"
                    class="avatar-uploader" 
                    :show-file-list="false"
                    action="/api/upload"
                    name="file"
                    :headers="{'Authorization': tokenStore.token}"
                    :on-success="uploadSuccess"
                    >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" /> <!-- Usar imgUrl en lugar de avatar -->
                    <img v-else :src="defaultAvatar" width="278" /> <!-- Mostrar imagen por defecto si no hay imgUrl -->
                    
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
                    Seleccionar imagen
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="handleAvatarUpload">
                    Subir imagen
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>
