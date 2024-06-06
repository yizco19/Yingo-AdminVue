// importar request.js para hacer peticiones
import request from '@/utils/request'
import  { useTokenStore } from '@/store/token'


export const categoryListService = () => {
    //const tokenStore = useTokenStore();
    //return request.get('/category',{headers: {'Authorization':tokenStore.token}})
    
    return request.get('/category')
}
export const categoryAddService = (categoryData) => {
    return request.post('/category', categoryData)
}

export const categoryUpdateService = (categoryData) => {
    return request.put('/category', categoryData)
    
}

export const categoryDeleteService = (id) => {
    return request.delete('/category?id='+ id)
}
export const checkProductsAssociatedService = (id) => {
    return request.get('/category/checkProductsAssociated?id='+ id)
}