import axios from "axios"
import { ref } from 'vue'
import {UserModule} from '@/modules/userModule'


export function useApi(
    request,
    options,
    handleResponse = async (data) => data.data
){
    const baseURL = "http://localhost:5000/api/v1"
    const $axios = axios.create({
        baseURL,
        withCredentials: true,
        maxRedirects: 0,
        headers: {
            // "Access-Control-Allow-Origin": "*",
            // "Access-Control-Allow-Methods": "*",
            // "Access-Control-Allow-Headers": "*",
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    $axios.interceptors.request.use((config) => {
        const token = UserModule.token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    })


    const result = ref(null);
    const isLoading = ref(false);
    const error = ref(null);
    const exec = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            const response = await $axios(request);
            const valueResponse = await handleResponse(response)
            result.value = valueResponse;
            return valueResponse;
        } catch (e) {
            if (e.isAxiosError) {
                error.value = e
                console.log("error", e)
            } else {
                console.log('strange error ', e)
                error.value = e
            }
            result.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    return {exec, result, error}
}