import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('jobseeker');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    name: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    address: '',
    gender: '',
    companyName: '',
    companyAddress: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // const API_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  /* ================= STEP 1 ================= */

  const handleSendOTP = async () => {
    if (!formData.email)
      return showMessage('Enter email', 'error');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/send-otp`, {
        email: formData.email,
        role
      });
      setOtpSent(true);
      showMessage(res.data.message, 'success');
    } catch (error) {

      if (error.response?.status === 409) {
        showMessage("You are already registered. Please login.", "error");
      } else {
        showMessage(
          error.response?.data?.message || "Failed to send OTP",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp)
      return showMessage('Enter OTP', 'error');
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
        role
      });
      setOtpVerified(true);
      showMessage(res.data.message, 'success');
    } catch (error) {
      showMessage(error.response?.data?.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ================= STEP 2 ================= */

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.password || !formData.confirmPassword || !formData.mobileNumber)
      return showMessage('Fill all required fields', 'error');
    if (formData.password !== formData.confirmPassword)
      return showMessage('Passwords do not match', 'error');

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        role,
        name: formData.name,
        password: formData.password,
        mobileNumber: formData.mobileNumber
      };

      if (role === 'jobseeker') {
        payload.address = formData.address;
        payload.gender = formData.gender;
      } else {
        payload.companyName = formData.companyName;
        payload.companyAddress = formData.companyAddress;
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, payload);
      showMessage(res.data.message, 'success');
      setTimeout(() => window.location.reload(), 2000);
      toast.success("Registered successfully!");
      navigate("/login")
    } catch (err) {
      console.log(err)
      showMessage('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // return (
  //   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dbdaf4] to-[#63b1e1]">
  //     <div className="bg-white w-[92%] sm:w-[85%] md:w-[70%] lg:w-[45%] rounded-xl shadow-2xl p-[2rem]">

  //       <h1 className="text-[1.6rem] font-bold text-center ">
  //         <span className='text-[#3fd1f2]'>Create</span>{" "}
  //         <span className='text-[#22e1a1]'>Account</span>
  //       </h1>
  //       <p className="text-gray-500 text-sm sm:text-base text-center mb-[0.5rem]">
  //         Start your career journey with us
  //       </p>

  //       {message.text && (
  //         <div className={`mb-[1.2rem] p-[0.8rem] rounded-lg text-[0.9rem] font-semibold ${message.type === 'success'
  //             ? 'bg-green-100 text-green-800'
  //             : 'bg-red-100 text-red-800'
  //           }`}>
  //           {message.text}
  //         </div>
  //       )}

  //       {/* ================= STEP 1 ================= */}
  //       {!otpVerified && (
  //         <div className="p-[1.5rem] rounded-xl bg-indigo-50 border border-indigo-200">
  //           <h2 className="text-[1.2rem] font-semibold text-indigo-700 mb-[1rem] ">
  //             Step 1: Verify Email
  //           </h2>

  //           {/* Role */}
  //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //             {["jobseeker", "recruiter"].map((r) => (
  //               <label
  //                 key={r}
  //                 className={`border rounded-xl p-4 cursor-pointer transition 
  //               ${role === r
  //                     ? "border-cyan-500 bg-cyan-50 shadow-md"
  //                     : "border-gray-200 hover:border-cyan-400"}`}
  //               >
  //                 <input
  //                   type="radio"
  //                   value={r}
  //                   checked={role === r}
  //                   onChange={(e) => setRole(e.target.value)}
  //                   className="hidden"
  //                 />
  //                 <p className="font-semibold text-gray-700 text-sm sm:text-base">
  //                   {r === "jobseeker" ? "Job Seeker" : "Recruiter"}
  //                 </p>
  //                 <p className="text-xs text-gray-500 mt-1">
  //                   {r === "jobseeker"
  //                     ? "Find and apply for jobs"
  //                     : "Post jobs and hire talent"}
  //                 </p>
  //               </label>
  //             ))}
  //           </div>
  //           {/* Email */}
  //           <div>
  //             <div className="flex flex-col sm:flex-row gap-3 mt-3">
  //               <input
  //                 type="email"
  //                 name="email"
  //                 value={formData.email}
  //                 onChange={handleChange}
  //                 className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-400"
  //                 placeholder="example@email.com"
  //               />
  //               <button
  //                 onClick={handleSendOTP}
  //                 disabled={loading}
  //                 className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium rounded-lg hover:opacity-90 transition"
  //               >
  //                 {otpSent ? "Resend OTP" : "Send OTP"}
  //               </button>
  //             </div>
  //           </div>
  //           {/* <span className='text-slate-500 '>Already  have an account?
  //             <Link to="/login" className='text-purple-700 hover:underline'> Login</Link>
  //           </span> */}
  //           <p className="text-[0.9rem] mt-[1.4rem] text-slate-600">
  //             Already  have an account?
  //             <Link to="/login" className="text-purple-700 font-semibold ml-[0.3rem] hover:underline">
  //               Login
  //             </Link>
  //           </p>

  //           {/* OTP */}
  //           {otpSent && (
  //             <div className="flex flex-col sm:flex-row gap-[0.8rem]">
  //               <input
  //                 name="otp"
  //                 value={formData.otp}
  //                 onChange={handleChange}
  //                 placeholder="Enter OTP"
  //                 className="flex-1 px-[1rem] py-[0.8rem] border rounded-lg"
  //               />
  //               <button
  //                 onClick={handleVerifyOTP}
  //                 className="px-[1.5rem] py-[0.8rem] bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)] text-white rounded-lg"
  //               >
  //                 Verify OTP
  //               </button>
  //             </div>
  //           )}
  //         </div>
  //       )}

  //       {/* ================= STEP 2 ================= */}
  //       {otpVerified && (
  //         <form onSubmit={handleRegister} className="space-y-[1rem]">
  //           <h2 className="text-[1.2rem] font-semibold text-indigo-700">
  //             Step 2: {role === 'jobseeker' ? 'Personal Details' : 'Company Details'}
  //           </h2>

  //           <input className="w-full px-[1rem] py-[0.8rem] border rounded-lg"
  //             placeholder="Name"
  //             name="name" onChange={handleChange} />

  //           <input className="w-full px-[1rem] py-[0.8rem] border rounded-lg"
  //             placeholder="Mobile Number"
  //             name="mobileNumber" onChange={handleChange} />

  //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
  //             <input type="password" placeholder="Password" name="password" onChange={handleChange} className="px-[1rem] py-[0.8rem] border rounded-lg" />
  //             <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} className="px-[1rem] py-[0.8rem] border rounded-lg" />
  //           </div>

  //           {role === 'jobseeker' ? (
  //             <>
  //               <textarea
  //                 name="address"
  //                 placeholder="Address"
  //                 onChange={handleChange}
  //                 className="w-full mb-4 px-4 py-3 border rounded-lg"
  //               />
  //               <select
  //                 name="gender"
  //                 onChange={handleChange}
  //                 className="w-full mb-4 px-4 py-3 border rounded-lg"
  //               >
  //                 <option value="">Select Gender</option>
  //                 <option>Male</option>
  //                 <option>Female</option>
  //                 <option>Other</option>
  //               </select>
  //             </>
  //           ) : (
  //             <>
  //               <input
  //                 name="companyName"
  //                 placeholder="Company Name"
  //                 onChange={handleChange}
  //                 className="w-full mb-4 px-4 py-3 border rounded-lg"
  //               />
  //               <textarea
  //                 name="companyAddress"
  //                 placeholder="Company Address"
  //                 onChange={handleChange}
  //                 className="w-full mb-4 px-4 py-3 border rounded-lg"
  //               />
  //             </>
  //           )}

  //           <button className="w-full py-[0.9rem] bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)] text-white font-bold rounded-lg">
  //             Register
  //           </button>
  //         </form>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">

      {/* LEFT SIDE - Branding */}
      {/* LEFT SIDE - Registration Progress */}
      <div className="lg:w-[50%] w-full 
                bg-[#0f172a] text-white 
                px-[6%] py-[2rem] lg:py-[0.8rem]">

        {/* MOBILE VIEW */}
        <div className="block lg:hidden text-center">

          <h1 className="text-[1.8rem] font-bold leading-tight">
            Registration <span className="text-cyan-400">Progress</span>
          </h1>

          <p className="mt-2 text-[0.9rem] text-gray-400">
            Complete the steps below to create your account.
          </p>

          {/* Compact Step Line */}
          <div className="flex items-center justify-center mt-6 gap-3">

            {/* Step 1 */}
            <div className={`w-8 h-8 flex items-center justify-center 
        rounded-full text-sm font-semibold
        ${otpSent ? "bg-cyan-500" : "bg-gray-600"}`}>
              1
            </div>

            <div className="w-8 h-[2px] bg-gray-600"></div>

            {/* Step 2 */}
            <div className={`w-8 h-8 flex items-center justify-center 
        rounded-full text-sm font-semibold
        ${otpVerified
                ? "bg-cyan-500"
                : otpSent
                  ? "bg-white text-[#0f172a]"
                  : "bg-gray-600"
              }`}>
              2
            </div>

            <div className="w-8 h-[2px] bg-gray-600"></div>

            {/* Step 3 */}
            <div className={`w-8 h-8 flex items-center justify-center 
        rounded-full text-sm font-semibold
        ${otpVerified
                ? "bg-white text-[#0f172a]"
                : "bg-gray-600"
              }`}>
              3
            </div>

          </div>
        </div>

        {/* DESKTOP VIEW (your original detailed version) */}
        <div className="hidden lg:flex flex-col justify-center h-full px-[8%]">

          <h1 className="text-[2.6rem] font-bold leading-[3rem]">
            Registration <br />
            <span className="text-cyan-400">Progress</span>
          </h1>

          <p className="mt-[1.2rem] text-[1.05rem] text-gray-400">
            Complete the steps below to create your account.
          </p>

          <div className="mt-[3rem] space-y-[2rem]">

            {/* STEP 1 */}
            <div className="flex items-start gap-[1rem]">
              <div className={`w-[2.2rem] h-[2.2rem] flex items-center justify-center 
          rounded-full text-[1rem] font-semibold
          ${otpSent ? "bg-cyan-500" : "bg-gray-700 text-gray-300"}`}>
                1
              </div>
              <div>
                <p className="text-[1.1rem] font-semibold">Send OTP</p>
                <p className="text-[0.95rem] text-gray-400">
                  Enter your email and receive a verification code.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="flex items-start gap-[1rem]">
              <div className={`w-[2.2rem] h-[2.2rem] flex items-center justify-center 
          rounded-full text-[1rem] font-semibold
          ${otpVerified
                  ? "bg-cyan-500"
                  : otpSent
                    ? "bg-white text-[#0f172a]"
                    : "bg-gray-700 text-gray-300"
                }`}>
                2
              </div>
              <div>
                <p className="text-[1.1rem] font-semibold">Verify OTP</p>
                <p className="text-[0.95rem] text-gray-400">
                  Confirm your email by entering the OTP.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="flex items-start gap-[1rem]">
              <div className={`w-[2.2rem] h-[2.2rem] flex items-center justify-center 
          rounded-full text-[1rem] font-semibold
          ${otpVerified
                  ? "bg-white text-[#0f172a]"
                  : "bg-gray-700 text-gray-300"
                }`}>
                3
              </div>
              <div>
                <p className="text-[1.1rem] font-semibold">Complete Registration</p>
                <p className="text-[0.95rem] text-gray-400">
                  Fill in your details and create your account.
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* RIGHT SIDE - Form */}
      <div className="lg:w-[50%] w-full flex items-center justify-center 
                    bg-[#f8fafc] py-[0.8rem]">

        <div className="w-[100%] sm:w-[95%] md:w-[75%] lg:w-[90%] 
                      bg-white rounded-[1.2rem] 
                      shadow-[0_1rem_2rem_rgba(0,0,0,0.08)] 
                      p-[3rem]">

          <h2 className="text-[1.8rem] font-bold text-[#0f172a]">
            Create Account
          </h2>

          <p className="text-[1rem] text-gray-500 mt-[0.5rem] mb-[2rem]">
            It only takes a minute to get started
          </p>

          {message.text && (
            <div
              className={`mb-[1.5rem] p-[1rem] rounded-[0.6rem] text-[0.95rem] font-medium ${message.type === "success"
                  ? "bg-green-50 text-green-600 border border-green-200"
                  : "bg-red-50 text-red-600 border border-red-200"
                }`}
            >
              {message.text}
            </div>
          )}

          {/* STEP 1 */}
          {!otpVerified && (
            <div className="space-y-[1.8rem]">

              {/* Role Toggle */}
              <div className="flex w-full bg-gray-100 rounded-[0.6rem] p-[0.3rem]">
                {["jobseeker", "recruiter"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`w-[50%] py-[0.8rem] rounded-[0.5rem] text-[0.95rem] font-medium transition ${role === r
                        ? "bg-white shadow text-[#0f172a]"
                        : "text-gray-500"
                      }`}
                  >
                    {r === "jobseeker" ? "Job Seeker" : "Recruiter"}
                  </button>
                ))}
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                         border border-gray-200
                         focus:outline-none focus:border-cyan-400"
              />

              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full py-[1rem] rounded-[0.6rem]
                         bg-[#0f172a] text-white font-medium
                         hover:bg-black transition"
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </button>

              {otpSent && (
                <>
                  <input
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter OTP"
                    className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                             border border-gray-200"
                  />
                  <button
                    onClick={handleVerifyOTP}
                    className="w-full py-[1rem] rounded-[0.6rem]
                             bg-cyan-500 text-white font-medium"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              <p className="text-[0.95rem] text-gray-500">
                Already have an account?
                <Link
                  to="/login"
                  className="ml-[0.4rem] font-medium text-cyan-600 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          )}

          {/* STEP 2 */}
          {otpVerified && (
            <form onSubmit={handleRegister} className="space-y-[1.5rem]">

              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                         border border-gray-200"
              />

              <input
                name="mobileNumber"
                placeholder="Mobile Number"
                onChange={handleChange}
                className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                         border border-gray-200"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1.2rem]">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  className="px-[1.2rem] py-[1rem] rounded-[0.6rem]
                           border border-gray-200"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="px-[1.2rem] py-[1rem] rounded-[0.6rem]
                           border border-gray-200"
                />
              </div>

              {role === "jobseeker" ? (
                <>
                  <textarea
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                             border border-gray-200"
                  />
                  <select
                    name="gender"
                    onChange={handleChange}
                    className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                             border border-gray-200"
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </>
              ) : (
                <>
                  <input
                    name="companyName"
                    placeholder="Company Name"
                    onChange={handleChange}
                    className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                             border border-gray-200"
                  />
                  <textarea
                    name="companyAddress"
                    placeholder="Company Address"
                    onChange={handleChange}
                    className="w-full px-[1.2rem] py-[1rem] rounded-[0.6rem]
                             border border-gray-200"
                  />
                </>
              )}

              <button
                type="submit"
                className="w-full py-[1rem] rounded-[0.6rem]
                         bg-[#0f172a] text-white font-semibold
                         hover:bg-black transition"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};



