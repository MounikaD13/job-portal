import { Routes, Route } from "react-router-dom"
import NotFound from "./components/NotFound"
import Home from "./components/Home"
import Register from "./components/Register"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import VerifyReset from "./components/VerifyReset"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./components/ProctedRoute"
import JobSeekerDashboard from "./pages/JobseekerDashboard"
import Navbar from './components/Navbar'

function App() {
    return (
        <div>
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
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/*' element={<NotFound />} />
                <Route path='/register' element={<Register />} />
                <Route path='/login' element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-reset-otp" element={<VerifyReset />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/jobseeker/profile" element={<JobSeekerDashboard />} />
                    {/* <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} /> */}
                </Route>
                {/* Admin only 
                <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>*/}
            </Routes>


        </div>
    )
}

export default App;
