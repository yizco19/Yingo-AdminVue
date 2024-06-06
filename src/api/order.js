// importar request.js para hacer peticiones
import request from '@/utils/request'
// Ofrece API de Listado de Pedidos
export const orderListService = () => {
    //const tokenStore = useTokenStore();
    //return request.get('/category',{headers: {'Authorization':tokenStore.token}})
    
    return request.get('/order/admin/list')
}
export const orderItemList = (id) => {
    return request.get('/order/items?id='+id)
}
export const orderDeleteService = (id) => {
    return request.delete('/order?id='+ id)
}

export const orderUpdateServiceStatus = (id, status) => {
    return request.put('/order/status?orderId='+id+'&status='+status)

}