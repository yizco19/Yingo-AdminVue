import request from '@/utils/request'

export const statisticsListService = () => {
    return request.get('/admin/statistics')
}