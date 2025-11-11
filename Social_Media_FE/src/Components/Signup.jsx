import React, { useContext, useRef, useState } from 'react'
import { uiContext } from '../App'
import axios from 'axios'
import toast from 'react-hot-toast'
import "../otp.css"
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const { ui, setUi } = useContext(uiContext)
  return (
    <div>
      {ui == 0 ? <Email /> : (ui == 1 ? <VerifyOtp /> : <SignupForm />)}
    </div>
  )
}

export default Signup

const Email = () => {
  const { ui, setUi, email, setEmail } = useContext(uiContext)
  const navigate = useNavigate()

  function btnCLickhandler() {
    async function sendOtp() {
      try {
        const res = await axios.post(import.meta.env.VITE_DOMAIN + "/api/otp/send-otp", { email })
        // console.log(res)
        setUi(1)
      } catch (error) {
        toast.error(error.response.data.error)
      }
    }
    sendOtp()
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-96">
        <label
          htmlFor="email"
          className="block text-gray-700 font-medium mb-2 text-center"
        >
          Please Enter your email for OTP verification
        </label>
        <input
          onChange={(e) => {
            setEmail(e.target.value)
          }}
          id="email"
          type="text"
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <button
          onClick={btnCLickhandler}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          Send
        </button>

        <p className='text-right mt-2'>Already a user? <span onClick={() => {
          navigate("/login")
        }} className='text-blue-400 cursor-pointer'>Sign in</span> instead</p>
      </div>
    </div>
  )
}

const VerifyOtp = () => {
  const inputRef = useRef([]);
  const { email, setUi } = useContext(uiContext)

  const [otp, setOtp] = useState(Array(6).fill("")); // store OTP digits

  const focusInput = (index) => {
    if (inputRef.current[index]) {
      inputRef.current[index].focus();
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d$/.test(value)) {
      e.target.value = "";
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index]) {
        // clear current value
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // move focus back if current is empty
        focusInput(index - 1);
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join("");

    async function verify() {
      try {
        const res = await axios.post(import.meta.env.VITE_DOMAIN + "/api/otp/verify-otp", { otp: enteredOtp, email })
        // console.log(res)
        setUi(2)
      } catch (error) {
        toast.error(error.response.data.error)
      }
    }
    verify()
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-6">
      <div className="flex space-x-3">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center border border-gray-300 rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      <button
        onClick={handleVerify}
        className="px-6 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
      >
        Verify OTP
      </button>
    </div>
  );
};







const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mail: "",
    password: "",
    username: "",
    dateOfBirth: "",
    gender: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔥 Replace with your backend endpoint
      const res = await axios.post(
        import.meta.env.VITE_DOMAIN + "/api/auth/signup",
        formData
      );
      console.log(res.data);
      toast.success("Signup successful 🎉");
      navigate("/login")

    } catch (error) {
      toast.error(error.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-[28rem] space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Signup</h2>

        {/* First & Last Name */}
        <div className="flex space-x-2">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <input
          type="email"
          name="mail"
          placeholder="Email"
          value={formData.mail}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* DOB */}
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          Signup
        </button>
      </form>
    </div>
  );
};