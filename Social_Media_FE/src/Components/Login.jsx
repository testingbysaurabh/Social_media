import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUserData } from "../Utils/UserSlice";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate()
  const dispatch = useDispatch()


  const btnCLickHandler = () => {
    if(validator.isEmail(username))
    {

    }
    else if( username.length > 15 || username.length < 2 )
    {
        toast.error("Username should be atleast 2 characters and maximum 15 characters")
        return
    }
    if(password.length < 8)
    {
        toast.error("Password should be atleast 8 characters")
        return
    }
    const isMail = validator.isEmail(username)
    async function login()
    {
        try {
            const res = await axios.post(import.meta.env.VITE_DOMAIN + "/api/auth/signin", {[isMail ? "mail" : "username"] : username, password}, {withCredentials  : true})
            // console.log(res.data.data)
            dispatch(addUserData(res.data.data))
            nav("/home")
        } catch (error) {
            setUsername("")
            setPassword("")
            toast.error(error.response.data.error)
        }

    }
    login()
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Username / Email
          </label>
          <input
          value={username}
            onChange={(e) => setUsername(e.target.value)}
            id="username"
            type="text"
            className="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600 mb-1"
          >
            Password
          </label>
          <input
          value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
            className="w-full px-4 bg-gray-100 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
        onClick={btnCLickHandler}
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Log In
        </button>
        <p className="text-right mt-2">Not a user? <span className="text-blue-400 cursor-pointer" onClick={() => nav("/signup")}>Sign Up</span> instead</p>
      </div>
    </div>
  );
};

export default Login;
