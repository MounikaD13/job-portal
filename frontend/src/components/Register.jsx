import { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from "react-router-dom";

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
    } catch {
      showMessage(error.response?.data?.message ||'Failed to send OTP', 'error');
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
      navigate("/login")
    } catch(err) {
      console.log(err)
      showMessage('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)]">
      <div className="bg-white w-[92%] sm:w-[85%] md:w-[70%] lg:w-[45%] rounded-xl shadow-2xl p-[2rem]">

        <h1 className="text-[1.6rem] font-bold text-center mb-[1.5rem]">
          <span className='text-[#3fd1f2]'>User</span><span className='text-[#22e1a1]'>Registration</span>
        </h1>

        {message.text && (
          <div className={`mb-[1.2rem] p-[0.8rem] rounded-lg text-[0.9rem] font-semibold ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* ================= STEP 1 ================= */}
        {!otpVerified && (
          <div className="p-[1.5rem] rounded-xl bg-indigo-50 border border-indigo-200">
            <h2 className="text-[1.2rem] font-semibold text-indigo-700 mb-[1rem] ">
              Step 1: Verify Email
            </h2>

            {/* Role */}
            <div className="flex gap-[1rem] mb-[1.2rem] flex-wrap">
              {['jobseeker', 'recruiter'].map(r => (
                <label
                  key={r}
                  className={`px-[1.2rem] py-[0.6rem] rounded-lg cursor-pointer border text-[1rem] ${
                    role === r ? 'bg-[#3fd1f2] text-white' : 'bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    value={r}
                    checked={role === r}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden"
                  />
                  {r === 'jobseeker' ? 'Job Seeker' : 'Recruiter'}
                </label>
              ))}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row gap-[0.8rem] mb-[1rem]">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="flex-1 px-[1rem] py-[0.8rem] border rounded-lg"
              />
              <button
                onClick={handleSendOTP} 
                disabled={loading}
                className="px-[1.5rem] py-[0.8rem] bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)]  rounded-lg"
              >
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
            </div>
            <span className='text-slate-500'>Already  have an account?<Link to="/login" className='text-purple-700'> Login</Link></span>

            {/* OTP */}
            {otpSent && (
              <div className="flex flex-col sm:flex-row gap-[0.8rem]">
                <input
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter OTP"
                  className="flex-1 px-[1rem] py-[0.8rem] border rounded-lg"
                />
                <button
                  onClick={handleVerifyOTP}
                  className="px-[1.5rem] py-[0.8rem] bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)] text-white rounded-lg"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2 ================= */}
        {otpVerified && (
          <form onSubmit={handleRegister} className="mt-[2rem] space-y-[1rem]">
            <h2 className="text-[1.2rem] font-semibold text-indigo-700">
              Step 2: {role === 'jobseeker' ? 'Personal Details' : 'Company Details'}
            </h2>

            <input className="w-full px-[1rem] py-[0.8rem] border rounded-lg" 
            placeholder="Name" 
            name="name" onChange={handleChange} />

            <input className="w-full px-[1rem] py-[0.8rem] border rounded-lg" 
            placeholder="Mobile Number" 
            name="mobileNumber" onChange={handleChange} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
              <input type="password" placeholder="Password" name="password" onChange={handleChange} className="px-[1rem] py-[0.8rem] border rounded-lg" />
              <input type="password" placeholder="Confirm Password" name="confirmPassword" onChange={handleChange} className="px-[1rem] py-[0.8rem] border rounded-lg" />
            </div>
            
            {role === 'jobseeker' ? (
              <>
                <textarea
                  name="address"
                  placeholder="Address"
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border rounded-lg"
                />
                <select
                  name="gender"
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border rounded-lg"
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
                  className="w-full mb-4 px-4 py-3 border rounded-lg"
                />
                <textarea
                  name="companyAddress"
                  placeholder="Company Address"
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border rounded-lg"
                />
              </>
            )}

            <button className="w-full py-[0.9rem] bg-[linear-gradient(135deg,#3fd1f2_0%,#22e1a1_100%)] text-white font-bold rounded-lg">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};



