import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Meta, useNavigate } from "react-router-dom";
import { addUserData } from "../Utils/UserSlice";
import toast from "react-hot-toast";


const EditProfile = () => {
    const userData = useSelector(store => store.user) 
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [bio, setBio] = useState(userData.bio);
  const dispatch = useDispatch()

  const nav = useNavigate()

  const handleSave = () => {

    if(!firstName || !lastName)
    {
        toast.error("Please Enter first and last name")
        return
    }
    async function saveData()
    {
        try {
            const res = await axios.patch(import.meta.env.VITE_DOMAIN + `/api/profile/${userData._id}`, {firstName, lastName, bio}, {withCredentials : true})
            // console.log(res)
            nav("/profile")
            dispatch(addUserData(res.data.data))
        } catch (error) {
            console.log(error)
        }


    }

    saveData()
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl w-[420px] space-y-6">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-600">
          Edit Profile
        </h2>

        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="fn" className="text-sm font-semibold text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="fn"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-pink-50 to-blue-50 focus:outline-none focus:ring-4 focus:ring-pink-300 placeholder-gray-400"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="ln" className="text-sm font-semibold text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="ln"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 focus:outline-none focus:ring-4 focus:ring-purple-300 placeholder-gray-400"
            placeholder="Enter last name"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label htmlFor="bio" className="text-sm font-semibold text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-pink-50 focus:outline-none focus:ring-4 focus:ring-blue-300 placeholder-gray-400 resize-none"
            placeholder="Write something about yourself..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
          >
            Save Changes
          </button>
          <button
          onClick={() => {
            nav("/profile")
          }}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 active:scale-95 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
