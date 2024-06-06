import request from '@/utils/request'

// Ofrece Listado de Productos
export const productListService = (params) => {
    for (const key in params) {
        if (params[key] === '') {
            delete params[key]
        }
    }
    return request.get('/product', { params: params })
    
}

// Agrega un nuevo producto
export const productAddService = (productData) => {
    return request.post('/product', productData)
}
// Actualiza un producto
export const productUpdateService = (productData) => {
    return request.put('/product/update', productData)
    
}
// Elimina un producto
export const productDeleteService = (id) => {
    return request.delete('/product?id='+ id)
}
export const productListAllService = () => {
    return request.get('/product/list')
}
export const productVisibleService = (id, visible) => {
    return request.put('/product/visibility?id='+ id + '&visible=' + visible)
}