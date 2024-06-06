<script setup>
import { ref, onMounted } from 'vue'
import { Check, Delete, Edit, View, Hide } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { offerAddService, offerListAllService, offerDeleteService, offerUpdateService } from '@/api/offer'
import { productListAllService } from '@/api/product.js'

// Datos y referencias
const title = ref('Agregar oferta')
const offers = ref([])
const products = ref([])
const visibleDrawer = ref(false)
const offertModel = ref({
  id: '',
  title: '',
  description: '',
  discount: '',
  startDate: '',
  endDate: ''
})

// Función para truncar descripciones largas
const truncateDescription = (description, maxLength = 50) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...'
  }
  return description
}

// Reglas de validación
const validateEndDate = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('La fecha de fin no puede estar vacía'))
  }
  if (offertModel.value.startDate && new Date(value) <= new Date(offertModel.value.startDate)) {
    return callback(new Error('La fecha de fin debe ser posterior a la fecha de inicio'))
  }
  callback()
}

const rules = ref({
  title: [
    { required: true, message: 'El título no puede estar vacío', trigger: 'blur' }
  ],
  description: [
    { required: true, message: 'La descripción no puede estar vacía', trigger: 'blur' }
  ],
  discount: [
    { required: true, message: 'El descuento no puede estar vacío', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: 'El descuento debe estar entre 0 y 100', trigger: 'blur' }
  ],
  startDate: [
    { required: true, message: 'La fecha de inicio no puede estar vacía', trigger: 'change' }
  ],
  endDate: [
    { required: true, message: 'La fecha de fin no puede estar vacía', trigger: 'change' },
    { validator: validateEndDate, trigger: 'change' }
  ]
})

// Función para cargar las ofertas
const offerList = async () => {
  let result = await offerListAllService()
  // cambia el formato de la fecha a YYYY-MM-DD
  for (let i = 0; i < result.data.length; i++) {
    result.data[i].startDate = new Date(result.data[i].startDate).toISOString().split('T')[0]
    result.data[i].endDate = new Date(result.data[i].endDate).toISOString().split('T')[0]
  }
  offers.value = result.data
}

// Función para cargar los productos
const productList = async () => {
  let result = await productListAllService()
  products.value = result.data
}

// Llamar a las funciones de carga al montar el componente
onMounted(() => {
  offerList()
  productList()
})

// Función para actualizar una oferta
const updateOffer = async () => {
  let result = await offerUpdateService(offertModel.value)
  ElMessage.success(result.msg ? result.msg : 'Oferta actualizada')
  offerList()
}

// Función para mostrar el cuadro de diálogo de edición
const showDialog = (row) => {
  title.value = 'Editar oferta'
  visibleDrawer.value = true
  Object.assign(offertModel.value, row)
}

// Función para eliminar una oferta
const deleteOffer = async (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de eliminar esta oferta?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning'
    }
  ).then(async () => {
    let result = await offerDeleteService(id)
    ElMessage.success('Oferta eliminada')
    offerList()
  })
}

// Función para limpiar el formulario
const clearData = () => {
  title.value = 'Agregar oferta'
  Object.keys(offertModel.value).forEach(key => {
    offertModel.value[key] = ''
  })
  visibleDrawer.value = true
}

// Función para agregar una oferta
const addOffer = async () => {
  let result = await offerAddService(offertModel.value)
  ElMessage.success(result.msg ? result.msg : 'Oferta agregada')
  // Cerrar el dialogo
  visibleDrawer.value = false
  offerList()
}

// Función para manejar el diálogo de acciones (agregar/editar)
const actionDialog = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      if (title.value === 'Editar oferta') {
        updateOffer()
      } else if (title.value === 'Agregar oferta') {
        addOffer()
      }
      visibleDrawer.value = false
    } else {
      ElMessage.error('Por favor, corrija los errores en el formulario.')
    }
  })
}
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>Gestión de Ofertas</span>
        <el-button type="primary" @click="clearData">Agregar oferta</el-button>
      </div>
    </template>
    <!-- Tabla de datos -->
    <el-table :data="offers" style="width: 100%">
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="title" label="Title" />
      <el-table-column label="Description">
        <template #default="{ row }">
          <span>{{ truncateDescription(row.description) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="Discount" />
      <el-table-column prop="startDate" label="Start Date" />
      <el-table-column prop="endDate" label="End Date" />
      <el-table-column label="Acciones" width="150">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteOffer(row.id)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="No hay datos" />
      </template>
    </el-table>
  </el-card>

  <el-drawer v-model="visibleDrawer" :title="title" :with-header="false" direction="rtl" size="50%">
    <el-form :model="offertModel" :rules="rules" ref="form" label-width="120px">
      <el-form-item label="Title" prop="title">
        <el-input v-model="offertModel.title" />
      </el-form-item>

      <el-form-item label="Discount" prop="discount">
        <el-input v-model.number="offertModel.discount" />
      </el-form-item>
      <el-form-item label="Start Date" prop="startDate">
        <el-date-picker v-model="offertModel.startDate" type="date" placeholder="Pick a day" />
      </el-form-item>
      <el-form-item label="End Date" prop="endDate">
        <el-date-picker v-model="offertModel.endDate" type="date" placeholder="Pick a day" />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="offertModel.description" type="textarea" rows="8" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="actionDialog($refs.form)">Guardar</el-button>
        <el-button type="info" @click="visibleDrawer = false">Cancelar</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
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
