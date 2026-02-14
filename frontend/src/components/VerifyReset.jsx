import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from "../api/apiCheck"
import toast from "react-hot-toast";

export default function VerifyReset() {
    const navigate = useNavigate()
    const location = useLocation()
    const email = location.state.email
    const [otp, setOtp] = useState("")
    const [otpVerified, setOtpVerified] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [passwordUpdated, setPasswordUpdated] = useState(false)

    async function handleVerifyOtp(e) {
        e.preventDefault()
        // console.log(email)
        // console.log("OTP:", otp)
        await API.post("/verify-reset-otp", { email, otp })
            .then(res => {
                if (res.status === 200) {
                    toast.success("OTP verified!");
                    setOtpVerified(true)
                }

            })
            .catch(err => {
                // console.log("Full error:", err)
                // console.log("Error response:", err.response?.data)
                // alert(err.response?.data?.message || "OTP verification failed")
                toast.error(err.response?.data?.message || "OTP verification failed")
            })
    }
    async function resetPassword(e) {
        e.preventDefault()
        try {
            await API.post("/reset-password", { email, password: newPassword })
            toast.success("Password Updated succesfully")
            setPasswordUpdated(true)
            navigate("/login")
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#3fd1f2] to-[#22e1a1] px-[5%] py-[4rem]">

            <div className="w-full max-w-[30rem] bg-white rounded-[1.5rem] shadow-xl p-[3rem]">
                <div className="text-center mb-[2.5rem]">
                    <h1 className="text-[1.8rem] font-semibold text-gray-800">
                        Verify OTP & Reset Password
                    </h1>
                    <p className="text-[0.9rem] text-gray-500 mt-[0.5rem]">
                        Enter the OTP sent to your email and create a new password.
                    </p>
                </div>
                {!otpVerified && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-[1.5rem]">

                        <div className="flex flex-col gap-[0.5rem]">
                            <label className="text-[0.9rem] font-medium text-gray-700">
                                Enter OTP
                            </label>

                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                placeholder="Enter 6-digit OTP"
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-[1rem] py-[0.9rem] text-[0.95rem] border border-gray-300 rounded-[0.8rem] focus:outline-none focus:ring-[0.15rem] focus:ring-[#3fd1f2] transition-all duration-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-[0.95rem] text-[1rem] font-medium rounded-[0.8rem] bg-gradient-to-r from-[#3fd1f2] to-[#22e1a1] text-white hover:opacity-90 transition-all duration-300"
                        >
                            Verify OTP
                        </button>

                    </form>
                )}

                {otpVerified && !passwordUpdated && (
                    <form onSubmit={resetPassword} className="flex flex-col gap-[1.5rem]">

                        <div className="flex flex-col gap-[0.5rem]">
                            <label className="text-[0.9rem] font-medium text-gray-700">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                placeholder="Enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-[1rem] py-[0.9rem] text-[0.95rem] border border-gray-300 rounded-[0.8rem] focus:outline-none focus:ring-[0.15rem] focus:ring-[#22e1a1] transition-all duration-300"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-[0.95rem] text-[1rem] font-medium rounded-[0.8rem] bg-gradient-to-r from-[#3fd1f2] to-[#22e1a1] text-white hover:opacity-90 transition-all duration-300"
                        >
                            Update Password
                        </button>

                    </form>
                )}

                {/* Footer */}
                <div className="mt-[2rem] text-center">
                    <p
                        onClick={() => navigate("/login")}
                        className="text-[0.85rem] text-[#3fd1f2] font-medium cursor-pointer hover:underline"
                    >
                        Back to Login
                    </p>
                </div>

            </div>
        </div>
    );

}
