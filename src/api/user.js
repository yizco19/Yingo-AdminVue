// importar request.js para hacer peticiones
import request from '@/utils/request'

// Ofrece API de registro
export const userRegisterService = (registerData) => {
    // urlSearchParams para construir la url con los datos
    const params = new URLSearchParams();
    for (const key in registerData) {
        params.append(key, registerData[key]);
    }
    const headers = {
        'rol': '21232f297a57a5a743894a0e4a801fc3'
    };

    return request.post('/register', params,{headers: headers});
}

// Ofrece API de login
export const userLoginService = (loginData) => {
    // urlSearchParams para construir la url con los datos
    const params = new URLSearchParams();
    for (const key in loginData) {
        params.append(key, loginData[key]);
    }
    const headers = {
        'rol': '21232f297a57a5a743894a0e4a801fc3'
    };

    return request.post('/login', params ,{headers: headers});
}

// Obtiene los datos del usuario
export const userInfoService = () => {
    return request.get('/admin/userInfo')
}

export const userListService = () => {
    return request.get('/user/list');
}

// Actualiza los datos del usuario
export const userUpdateService = (userData) => {
    return request.put('/admin/update', userData)
}
// Actualiza la avatar del usuario
export const userUpdateAvatarService = (avatarUrl) => {
    const params = new URLSearchParams();
    params.append('avatarUrl', avatarUrl);
    return request.patch('/admin/updateAvatar', params)
}
// Actualiza la contraseña del usuario
export const userUpdatePasswordService = (passwordData) => {
    return request.patch('/admin/updatePwd', passwordData)
}
