import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import API from "../api/apiCheck"
import toast from "react-hot-toast";


export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    async function sendOtp(e) {
        e.preventDefault()
        setLoading(true);
        try {
            await API.post("/forgot-password", { email });
            toast.success("OTP sent successfully!");
            navigate("/verify-reset-otp", { state: { email } });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#3fd1f2] to-[#22e1a1] px-[5%] py-[4rem]">
            <div className="w-full max-w-[28rem] bg-white rounded-[1.5rem] shadow-xl p-[3rem]">
                <div className="text-center mb-[2.5rem]">
                    <h1 className="text-[2rem] font-semibold text-gray-800">
                        Forgot Password?
                    </h1>
                    <p className="text-[0.95rem] text-gray-500 mt-[0.5rem]">
                        Enter your registered email address and we’ll send you a reset OTP.
                    </p>
                </div>
                <form onSubmit={sendOtp} className="flex flex-col gap-[1.5rem]">
                    <div className="flex flex-col gap-[0.5rem]">
                        <label className="text-[0.9rem] font-medium text-gray-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="example@email.com"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-[1rem] py-[0.9rem] text-[0.95rem] border border-gray-300 rounded-[0.8rem] focus:outline-none focus:ring-[0.15rem] focus:ring-[#3fd1f2] focus:border-transparent transition-all duration-300"
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full py-[0.95rem] text-[1rem] font-medium rounded-[0.8rem] bg-gradient-to-r from-[#3fd1f2] to-[#22e1a1] text-white hover:opacity-90 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                </form>

                <div className="mt-[2rem] text-center">
                    <p className="text-[0.85rem] text-gray-500">
                        Remember your password?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-purple-700 text-[0.95rem] cursor-pointer hover:underline"
                        >
                            Back to Login
                        </span>
                    </p>
                </div>

            </div>
        </div>
    );

}
