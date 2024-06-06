<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const categorys = ref([
    {
        "id": 1,
        "categoryName": "Tarjetas Gráficas",
        "categoryAlias": "GPU"
    },
    {
        "id": 2,
        "categoryName": "Procesadores",
        "categoryAlias": "CPU"
    },
    {
        "id": 3,
        "categoryName": "Memorias RAM",
        "categoryAlias": "RAM"
    }
])

import { categoryListService,categoryAddService,categoryUpdateService,
     categoryDeleteService,checkProductsAssociatedService } from '@/api/category.js';
const categoryList = async () => {
    let result = await categoryListService();
    categorys.value = result.data;
}
categoryList();

const dialogVisible = ref(false)
const categoryModel = ref({
    categoryName: '',
    categoryAlias: ''
})
const rules = {
    categoryName: [
        { required: true, message: 'Por favor ingrese el nombre de la categoría', trigger: 'blur' }
    ],
    categoryAlias: [
        { required: true, message: 'Por favor ingrese el alias de la categoría', trigger: 'blur' }
    ]
}
// Agregar categoría a la base de datos y cerrar el dialogo
import { ElMessage,ElMessageBox } from 'element-plus';
const addCategory = async() => {
    let result = await categoryAddService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : 'Categoría agregada')
    dialogVisible.value = false
    categoryList();

}
// titulo del dialogo 
const title = ref('')

const showDialog = (row) => {
    dialogVisible.value = true;
    title.value = 'Editar categoría' ; 
    categoryModel.value.categoryName = row.categoryName
    categoryModel.value.categoryAlias = row.categoryAlias
    categoryModel.value.id = row.id
}
const actionDialog = () => {
    if(title.value === 'Editar categoría'){
        updateCategory();
    }else if(title.value === 'Agregar categoría'){
        addCategory();
    }
}

const updateCategory = async()=>{
    let result = await categoryUpdateService(categoryModel.value);
    ElMessage.success(result.msg ? result.msg : 'Categoría actualizada')
    dialogVisible.value = false
    categoryList();
    


}

// limpiar datos
const clearData = ()=>{
    categoryModel.value.categoryName = ''
    categoryModel.value.categoryAlias = ''
}

const deleteCategory = (id) => {
    ElMessageBox.confirm(
        '¿Estás seguro de eliminar esta categoría?',
        'Warning',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
        }
    )
    .then(async () => {
        // Comprueba si hay productos asociados a la categoría
        let productCheckResult = await checkProductsAssociatedService(id);
        if (productCheckResult.data && productCheckResult.data.success === false) {
            ElMessage({
                type: 'warning',
                message: productCheckResult.data.message,
            });
            return;
        }

        // Si no hay productos asociados, procede a eliminar la categoría
        let result = await categoryDeleteService(id);
        ElMessage({
            type: 'success',
            message: 'Eliminado!',
        });

        // Cargar categorías
        categoryList();
    })
    .catch(() => {
        ElMessage({
            type: 'info',
            message: 'Cancelado',
        });
    });
}

</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>Categorías de productos</span>
                <div class="extra">
                    <el-button type="primary" @click="dialogVisible = true; title = 'Agregar categoría' ; clearData()">Agregar categoría</el-button>
                </div>
            </div>
        </template>
        <el-table :data="categorys" style="width: 100%">
            <el-table-column label="ID" width="100" type="index"> </el-table-column>
            <el-table-column label="Nombre" prop="categoryName"></el-table-column>
            <el-table-column label="Alias" prop="categoryAlias"></el-table-column>
            <el-table-column label="Acciones" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="No hay datos" />
            </template>
        </el-table>

        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding: 0 20px;">
                <el-form-item label="Nombre" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="Alias" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancelar</el-button>
                <el-button type="primary" @click="actionDialog()">Aceptar</el-button>
            </span>
        </el-dialog>

    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>
