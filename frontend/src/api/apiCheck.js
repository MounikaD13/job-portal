import axios from 'axios'
axios.defaults.withCredentials = true
const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    withCredentials: true
})
// Attach access token to every request
API.interceptors.request.use((config) => { //An interceptor is a function that runs before every request is sent to the backend.
    const token = localStorage.getItem("token")
    if (token) {
        //Attaching Token to the Header
        config.headers.Authorization = `Bearer ${token}`
        //bearer When login happens, backend request carries the token securely using Bearer so token is not visible in URL.”
    }
    return config
})
// API.interceptors.response.use(
//     res => res,
//     async error => {
//         const originalRequest = error.config
//         if ( error.response && error.response.status == 401 && !originalRequest._retry) {
//             originalRequest._retry = true
//             try{
//                 axios.post("http://localhost:5000/api/refresh-token")
//                 .then((res)=>{
//                     localStorage.setItem("token",res.data.accessToken)
//                     originalRequest.headers.Authorization=`Bearer ${res.data.accessToken}`
//                     return API(originalRequest)
//                 })
//             }
//             // Refresh failed — force logout
//             catch(err){
//                 localStorage.removeItem("token")
//                 window.location.href='/login'
//             }
//         }
//         return Promise.reject(error)
//     }
// )
API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const res = await API.post("/refresh-token")

        const newToken = res.data.accessToken

        localStorage.setItem("token", newToken)

        originalRequest.headers.Authorization =
          `Bearer ${newToken}`

        return API(originalRequest)   // ✅ MUST RETURN
      } 
      catch (err) {
        localStorage.removeItem("token")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)
export default API