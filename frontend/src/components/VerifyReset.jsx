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
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-[5%]">

            {/* Card */}
            <div className="
                w-full max-w-[26rem]
                bg-[#111827]
                p-[2.5rem]
                rounded-[1rem]
                shadow-lg
                border border-white/20
            ">

                <h2 className="text-white text-[1.6rem] font-semibold text-center">
                    Verify & Reset Password
                </h2>

                <p className="text-gray-400 text-[0.9rem] text-center mt-[0.4rem] mb-[2rem]">
                    Enter OTP and create a new password
                </p>

                {/* OTP FORM */}
                {!otpVerified && (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-[1.2rem]">

                        <input
                            type="text"
                            value={otp}
                            placeholder="Enter OTP"
                            onChange={(e) => setOtp(e.target.value)}
                            className="
                                w-full px-[1rem] py-[0.8rem]
                                rounded-[0.6rem]
                                bg-[#1f2937]
                                text-white
                                border border-gray-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />

                        <button
                            type="submit"
                            className="
                                w-full py-[0.85rem]
                                rounded-[0.6rem]
                                bg-blue-600
                                text-white
                                font-medium
                                hover:bg-blue-700
                                transition
                            "
                        >
                            Verify OTP
                        </button>

                    </form>
                )}

                {/* RESET PASSWORD FORM */}
                {otpVerified && !passwordUpdated && (
                    <form onSubmit={resetPassword} className="flex flex-col gap-[1.2rem]">

                        <input
                            type="password"
                            value={newPassword}
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="
                                w-full px-[1rem] py-[0.8rem]
                                rounded-[0.6rem]
                                bg-[#1f2937]
                                text-white
                                border border-gray-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        />

                        <button
                            type="submit"
                            className="
                                w-full py-[0.85rem]
                                rounded-[0.6rem]
                                bg-cyan-400
                                text-white
                                font-medium
                                hover:bg-blue-700
                                transition
                            "
                        >
                            Update Password
                        </button>

                    </form>
                )}

                {/* Footer */}
                <p className="text-center text-gray-400 text-[0.85rem] mt-[1.8rem]">
                    Remember password?
                    <span
                        onClick={() => navigate("/login")}
                        className="ml-1 text-blue-400 cursor-pointer hover:underline"
                    >
                        Back to Login
                    </span>
                </p>
            </div>
        </div>
    )
}