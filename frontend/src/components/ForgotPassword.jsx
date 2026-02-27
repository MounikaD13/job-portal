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
        <div className="h-screen flex items-center justify-center bg-[#0f172a] px-[5%]">

            {/* Card */}
            <div className="w-full max-w-[24rem] bg-[#111827] p-[2.5rem] rounded-[1rem] shadow-lg  border border-white
">

                <h2 className="text-white text-[1.7rem] font-semibold text-center">
                    Forgot Password
                </h2>

                <p className="text-gray-400 text-[0.9rem] text-center mt-[0.5rem] mb-[2rem]">
                    Enter your email to receive reset OTP
                </p>

                <form onSubmit={sendOtp} className="flex flex-col gap-[1.2rem] ">

                    <input
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="
                            w-full
                            px-[1rem]
                            py-[0.8rem]
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
                        disabled={loading}
                        className="
                            w-full
                            py-[0.85rem]
                            rounded-[0.6rem]
                            bg-cyan-400
                            text-white
                            font-medium
                            hover:bg-blue-700
                            transition
                            disabled:opacity-50
                        "
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>

                </form>

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