//  store
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore('token', () => {
    // 1. Definir el token
    const token = ref('')

    // 2. Definir el método para modificar el token
    const setToken = (newToken) => {
        token.value = newToken
    }

    // 3. Definir el método para eliminar el token
    const removeToken = () => {
        token.value = ''
    }
    
    return {
        token, setToken, removeToken
    }
},
// Persistencia de parámetros
{
    persist: true
})
