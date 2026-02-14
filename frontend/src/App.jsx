import { BrowserRouter, Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import VerifyReset from "./components/VerifyReset"
import { Toaster } from "react-hot-toast"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path='/*' element={<NotFound />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-reset-otp" element={<VerifyReset />} />
                </Routes>
            </BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: "0.8rem",
                        padding: "1rem",
                        fontSize: "0.9rem",
                    },
                }}
            />
        </div>
    )
}

export default App;
