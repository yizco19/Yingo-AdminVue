<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  Delete,
  Edit,
  View,
  Hide,
  Plus
} from '@element-plus/icons-vue'
import { categoryListService } from '@/api/category.js'
import { productListService, productAddService, productUpdateService, productDeleteService, productVisibleService } from '@/api/product.js'
import { offerListAllService } from '@/api/offer.js'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useTokenStore } from '@/store/token'

// Variables y referencias
const offers = ref([])
const categorys = ref([])
const products = ref([])
const categoryId = ref('')
const productName = ref('')
const visibleDrawer = ref(false)
const title = ref('Agregar producto')
const productModel = ref({
  categoryId: '',
  name: '',
  description: '',
  productImg: '',
  price: '',
  visible: ''
})

// Paginación
const pageNum = ref(1)
const total = ref(20)
const pageSize = ref(8)

const tokenStore = useTokenStore()

// Cargar ofertas
const offerList = async () => {
  let result = await offerListAllService()
  offers.value = result.data
}

offerList()

// Cargar categorías
const categoryList = async () => {
  let result = await categoryListService()
  categorys.value = result.data
}

// Cargar productos
const productList = async () => {
  let params = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    productName: productName.value ? productName.value : null,
    categoryId: categoryId.value ? categoryId.value : null
  }
  let result = await productListService(params)
  total.value = result.data.total
  products.value = result.data.items

  // Agregar al products categoryName
  for (let i = 0; i < products.value.length; i++) {
    let product = products.value[i]
    for (let j = 0; j < categorys.value.length; j++) {
      let category = categorys.value[j]
      if (product.categoryId === category.id) {
        product.categoryName = category.categoryName
      }
    }
    for (let k = 0; k < offers.value.length; k++) {
      let offer = offers.value[k]
      if (product.offerId === offer.id) {
        product.offerTitle = offer.title
      }
    }
  }
}

const onSizeChange = (size) => {
  pageSize.value = size
  productList()
}

const onCurrentChange = (num) => {
  pageNum.value = num
  productList()
}

// Función para reiniciar el formulario
const resetForm = () => {
  categoryId.value = ''
  productName.value = ''
  productList()
}

// Función para manejar la visibilidad del producto
const toggleProductVisibility = async (row) => {
  ElMessageBox.confirm(
    `¿Quieres cambiar la visibilidad de este producto a ${row.visible ? 'oculto' : 'visible'}?`,
    'Confirmar',
    {
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      type: 'warning'
    }
  ).then(async () => {
    row.visible = !row.visible
    await productVisibleService(row.id, row.visible)
    ElMessage.success(`Producto ${row.visible ? 'visible' : 'oculto'} correctamente`)
    productList()
  }).catch(() => {
    ElMessage.info('Cambio de visibilidad cancelado')
  })
}

// Funciones para agregar, actualizar y eliminar productos
const addProduct = async () => {
  let result = await productAddService(productModel.value)
  ElMessage.success(result.msg ? result.msg : 'Producto agregado')
  visibleDrawer.value = false
  productList()
}

const updateProduct = async () => {
  let result = await productUpdateService(productModel.value)
  ElMessage.success(result.msg ? result.msg : 'Producto actualizado')
  productList()
}

const deleteProduct = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de eliminar este producto?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    let result = await productDeleteService(id)
    ElMessage.success('Producto eliminado')
    productList()
  }).catch(() => {
    ElMessage.info('Eliminación cancelada')
  })
}

const showDialog = (row) => {
  title.value = 'Editar producto'
  visibleDrawer.value = true
  Object.assign(productModel.value, row)
}

const clearData = () => {
  Object.keys(productModel.value).forEach(key => {
    productModel.value[key] = ''
  })
}

const actionDialog = () => {
  if (title.value === 'Editar producto') {
    updateProduct()
  } else {
    addProduct()
  }
  visibleDrawer.value = false
}

const uploadSuccess = (result) => {
  productModel.value.productPic = result.data
}

const checkPrice = (rule, value, callback) => {
  if (value && isNaN(Number(value))) {
    callback(new Error('El precio debe ser un número'))
  } else if (value && Number(value) <= 0) {
    callback(new Error('El precio debe ser mayor que cero'))
  } else {
    callback()
  }
}
const checkStock = (rule, value, callback) => {
  if (value && isNaN(Number(value))) {
    callback(new Error('El stock debe ser un número'))
  } else if (value && Number(value) <= 0) {
    callback(new Error('El stock debe ser mayor que cero'))
  } else {
    callback()
  }
}

const rules = {
  price: [
    { required: true, message: 'Por favor ingrese el precio', trigger: 'blur' },
    { validator: checkPrice, trigger: 'blur' }
  ],
  stock : [
    { required: true, message: 'Por favor ingrese el stock', trigger: 'blur' },
    { validator: checkStock, trigger: 'blur' }
  ]
}

onMounted(() => {
  categoryList()
  productList()
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>Gestión de Productos</span>
        <el-button type="primary" @click="visibleDrawer = true; clearData()">Agregar producto</el-button>
      </div>
    </template>

    <!-- Formulario de consulta -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="Nombre">
        <el-input v-model="productName" placeholder="Introduce el nombre" clearable />
      </el-form-item>
      <el-form-item label="Categoría">
        <el-select v-model="categoryId" placeholder="Selecciona Categoría" clearable style="width: 200px;">
          <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="productList">Buscar</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>

    <!-- Tabla de datos -->
    <el-table :data="products" style="width: 100%">
      <el-table-column prop="name" label="Nombre" width="300" />
              <!--
      <el-table-column label="Imagen" align="center">
        <template #default="{ row }">
          <img v-if="row.productPic" :src="row.productPic" class="avatar" style="max-width: 200px; max-height: 200px;" />
        </template>
      </el-table-column>-->
      <el-table-column prop="categoryName" label="Categoría" />
      <el-table-column prop="price" label="Precio" />
      <el-table-column label="Visible">
        <template #default="{ row }">
          <el-button v-if="row.visible" :icon="View" @click="toggleProductVisibility(row)" />
          <el-button v-else :icon="Hide" @click="toggleProductVisibility(row)" />
        </template>
      </el-table-column>
        <el-table-column prop="offerTitle" label="Ofertas" />

<el-table-column prop="stock" label="Cantidad" />
      <el-table-column label="Acciones" width="150">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteProduct(row.id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No hay datos" />
      </template>
    </el-table>

    <!-- Barra de paginación -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 10, 15]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <!-- Caja -->
    <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
      <!-- Formulario de producto -->
      <el-form :model="productModel" label-width="100px" :rules="rules">
        <el-form-item label="Nombre">
          <el-input v-model="productModel.name" placeholder="Ingrese el nombre"></el-input>
        </el-form-item>
        <el-form-item label="Categoría">
          <el-select placeholder="Selecciona Categoría" v-model="productModel.categoryId">
            <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="price" label="Precio">
          <el-input v-model="productModel.price" type="number" placeholder="Ingrese el precio"></el-input>
        </el-form-item>
        <el-form-item prop="stock" label="Cantidad">
            <el-input v-model="productModel.stock" type="number" placeholder="Ingrese el stock"></el-input>
          </el-form-item>
        <el-form-item label="Oferta">
          <el-select placeholder="Selecciona Oferta" v-model="productModel.offerId">
            <el-option v-for="o in offers" :key="o.id" :label="o.title" :value="o.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Imagen">
          <el-upload
            class="avatar-uploader"
            :auto-upload="true"
            :show-file-list="false"
            action="/api/upload"
            name="file"
            :headers="{'Authorization': tokenStore.token}"
            :on-success="uploadSuccess"
          >
            <img v-if="productModel.productPic" :src="productModel.productPic" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Descripción">
          <div class="editor">
            <quill-editor theme="snow" v-model:content="productModel.description" contentType="html"></quill-editor>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="actionDialog()">Guardar</el-button>
          <el-button type="info" @click="visibleDrawer = false">Cancelar</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
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

/* Estilos de avatar */
.avatar-uploader {
  :deep() {
    .avatar {
      width: 80vh;
      height: fit-content;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}

.editor {
  width: 100%;

  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>