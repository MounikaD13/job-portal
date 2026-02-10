import axios from 'axios'
axios.defaults.withCredentials=true
const API = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL}`,
    withCredentials:true
})

API.interceptors.request.use((req) => { //An interceptor is a function that runs before every request is sent to the backend.
    const token = localStorage.getItem("token")
    if (token) {
        //Attaching Token to the Header
        req.headers.Authorization = `Bearer ${token}`
        //bearer -When login happens, backend request carries the token securely using Bearer so token is not visible in URL.”
    }
    return req
})
export default API