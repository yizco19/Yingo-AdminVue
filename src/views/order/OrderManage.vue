<script setup  lang="ts">
import {
    Edit,
    Delete,
    View,
    Iphone,
    Location,
    OfficeBuilding,
    Tickets,
    User
} from '@element-plus/icons-vue'
import type { ComponentSize } from 'element-plus'

const size = ref < ComponentSize > ('default')
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref } from 'vue'
import { orderListService, orderItemList, orderDeleteService, orderUpdateServiceStatus } from '@/api/order.js';
import { userListService } from '@/api/user.js';
import { productListAllService } from '@/api/product.js';

const OrderConstants = {
    PENDING: 1,
    PROCESSING: 2,
    SHIPPED: 3,
    DELIVERED: 4,
    CANCELLED: 5
};

const orders = ref([
    {
        "id": 1,
        "userId": 1,
        "total": 1000,
        "status": 1,
        "createdAt": "2022-01-01T00:00:00.000Z"
    }, {
        "id": 2,
        "userId": 1,
        "total": 1000,
        "status": 3,
        "createdAt": "2024-01-01T00:00:00.000Z"
    }, {
        "id": 3,
        "userId": 3,
        "total": 1000,
        "status": 5,
        "createdAt": "2023-01-01T00:00:00.000Z"
    }
]);

const users = ref([]);
const items = ref([]);
const products = ref({});
const statusOptions = [
    { label: 'PENDING', value: OrderConstants.PENDING },
    { label: 'PROCESSING', value: OrderConstants.PROCESSING },
    { label: 'SHIPPED', value: OrderConstants.SHIPPED },
    { label: 'DELIVERED', value: OrderConstants.DELIVERED },
    { label: 'CANCELLED', value: OrderConstants.CANCELLED },
];

const getStatusText = (statusNumber) => {
    switch (statusNumber) {
        case OrderConstants.PENDING:
            return 'PENDING';
        case OrderConstants.PROCESSING:
            return 'PROCESSING';
        case OrderConstants.SHIPPED:
            return 'SHIPPED';
        case OrderConstants.DELIVERED:
            return 'DELIVERED';
        case OrderConstants.CANCELLED:
            return 'CANCELLED';
        default:
            return 'UNKNOWN';
    }
};
const getStatusId = (statusText) => {
    switch (statusText) {
        case 'PENDING':
            return OrderConstants.PENDING;
        case 'PROCESSING':
            return OrderConstants.PROCESSING;
        case 'SHIPPED':
            return OrderConstants.SHIPPED;
        case 'DELIVERED':
            return OrderConstants.DELIVERED;
        case 'CANCELLED':
            return OrderConstants.CANCELLED;
        default:
            return null;
    }
};
const productList = async () => {
    let result = await productListAllService();
    products.value = result.data;
};

const userList = async () => {
    let result = await userListService();
    users.value = result.data;
};

const orderList = async () => {
    let result = await orderListService();
    orders.value = result.data;

    // agregar al orders userName
    for (let i = 0; i < orders.value.length; i++) {
        let order = orders.value[i];
        // cambia el formato de la fecha a YYYY-MM-DD
        const originalDate = order.createdAt;
        const formattedDate = originalDate.slice(0, 10);
        order.createdAt = formattedDate;

        // cambia status a texto
        order.statusText = getStatusText(order.status);

        for (let j = 0; j < users.value.length; j++) {
            let user = users.value[j];
            if (order.userId === user.id) {
                order.userName = user.nickname;
            }
        }
    }
};

const itemList = async (id) => {
    let result = await orderItemList(id);
    items.value = result.data;
    for (let i = 0; i < items.value.length; i++) {
        for (let j = 0; j < products.value.length; j++) {
            if (items.value[i].productId === products.value[j].id) {
                items.value[i].productName = products.value[j].name;
                items.value[i].productPic = products.value[j].productPic;
            }
        }
    }
};

userList();
orderList();
productList();

const orderModel = ref({
    id: '',
    userName: '',
    total: '',
    status: '',
    createdAt: ''
});
const visibleDrawer = ref(false);
const visibleDialog = ref(false);
const selectedStatus = ref('');

const showDialog = (row) => {
    orderModel.value.id = row.id;
    orderModel.value.userName = row.userName;
    orderModel.value.total = row.total;
    orderModel.value.status = row.statusText;
    orderModel.value.createdAt = row.createdAt;

    itemList(row.id);

    visibleDrawer.value = true;
};

const actionExit = () => {
    visibleDrawer.value = false;
};

const deleteOrder = (id) => {
    ElMessageBox.confirm(
        '¿Estas seguro de eliminar este pedido?',
        'Confirmar',
        {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancelar',
            type: 'warning',
        }
    ).then(async () => {
        let result = await orderDeleteService(id);
        ElMessage({
            type: 'success',
            message: 'Eliminado correctamente',
        });
        orderList();
    }).catch(() => {
        ElMessage({
            type: 'info',
            message: 'Cancelado',
        });
    });
};

const editStatus = (row) => {
    orderModel.value.id = row.id;
    selectedStatus.value = row.status;
    visibleDialog.value = true;
};

const updateStatus = async () => {
    let result = await orderUpdateServiceStatus(orderModel.value.id, selectedStatus.value);
    ElMessage.success(result.msg ? result.msg : 'Estado de pedido actualizada')
    visibleDialog.value = false
    orderList();
};

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <span>Gestión de pedidos</span>
        </template>
        <el-table :data="orders" style="width: 100%">
            <el-table-column prop="id" label="ID" width="100" />
            <el-table-column prop="userName" label="Usuario" />
            <el-table-column prop="total" label="Total" />
            <el-table-column prop="statusText" label="Estado" />
            <el-table-column prop="createdAt" label="Fecha" />
            <el-table-column label="Acciones" width="150">
                <template #default="{ row }">
                    <el-button :icon="View" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Edit" circle plain type="primary" @click="editStatus(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteOrder(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="No hay datos" />
            </template>
        </el-table>
        <el-drawer v-model="visibleDrawer" title="Detalles del pedido" direction="rtl" size="80%">
            <el-descriptions title="Información del pedido" :size="size" border>
                <el-descriptions-item label="ID">{{ orderModel.id }}</el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            <el-icon :style="iconStyle">
                                <user />
                            </el-icon>
                            Username
                        </div>
                    </template>
                    {{ orderModel.userName }}</el-descriptions-item>
                <el-descriptions-item label="Total">{{ orderModel.total }}</el-descriptions-item>
                <el-descriptions-item label="Estado">{{ orderModel.status }}</el-descriptions-item>
                <el-descriptions-item label="Fecha">{{ orderModel.createdAt }}</el-descriptions-item>
            </el-descriptions>
            <el-table :data="items" style="width: 70%">
                <el-table-column prop="productId" label="ID" width="70" />
                <el-table-column prop="productName" label="Nombre" width="100" />
                <el-table-column label="Image" align="center">
                    <template #default="{ row }">
                        <img v-if="row.productPic" :src="row.productPic" class="avatar"
                            style="max-width: 200px; max-height: 200px;" />
                    </template>
                </el-table-column>
                <el-table-column prop="quantity" label="Cantidad" width="100" />
            </el-table>
            <el-form-item>
                <el-button type="primary" @click="actionExit()">Salir</el-button>
            </el-form-item>
        </el-drawer>
        <el-dialog v-model="visibleDialog" title="Editar estado del pedido">
            <el-form>
                <el-form-item label="Estado">
                    <el-select v-model="selectedStatus" placeholder="Seleccione un estado">
                        <el-option v-for="option in statusOptions" :key="option.value" :label="option.label"
                            :value="option.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleDialog = false">Cancelar</el-button>
                <el-button type="primary" @click="updateStatus">Confirmar</el-button>
            </div>
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
