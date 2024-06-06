// importar request.js para hacer peticiones
import request from '@/utils/request'

export const offerListAllService = () => {
    return request.get('/offer/list')
}
export const offerAddService = (offerData) => {
    return request.post('/offer', offerData)
}
export const offerDeleteService = (id) => {
    return request.delete('/offer?id='+ id)
}
export const offerUpdateService = (offerData) => {
    return request.put('/offer/update', offerData)
}