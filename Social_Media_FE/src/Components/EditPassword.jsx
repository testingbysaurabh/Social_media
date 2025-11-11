import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate()

  const handleChangePassword = () => {
    if(!oldPassword || !newPassword)
    {
        toast.error("Please enter all the fields")
        return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    async function change() {
        try {
        const res = await axios.patch(import.meta.env.VITE_DOMAIN + "/api/auth/change-password", {oldPassword, newPassword}, {withCredentials : true})
        toast.success("Password Changed Successfully")
        nav("/profile")
        } catch (error) {
            // console.log()
            toast.error(error.response.data.error)
        }
    }
    change()
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/40">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
          Change Password
        </h2>

        <div className="mt-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-pink-300 focus:border-pink-400 transition"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-300 focus:border-blue-400 transition"
          />
        </div>


        <div className="flex gap-2">

        <button
          onClick={handleChangePassword}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-lg 
                     bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                     hover:opacity-90 active:scale-95 transition"
        >
          Update Password
        </button>

        <button
          onClick={() => nav("/profile")}
          className="mt-6 w-full py-3 rounded-xl font-semibold text-white shadow-lg 
                     bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 
                     hover:opacity-90 active:scale-95 transition"
        >
          Cancel
        </button>

        </div>

      </div>
    </div>
  );
};

export default EditPassword;
