import React, { useRef, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { addUserData } from '../Utils/UserSlice'


function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}


const Profile = () => {
  const userData = useSelector(store => store.user)
  const nav = useNavigate()
  const inputRef = useRef(null)
  // const[newProfilePic, setNewProfilePic] = useState("") 
  const[temp, setTemp] = useState("")
  const dispatch = useDispatch()


  function onChangeHandler(e)
  {
    // console.log(e.target.files)
    async function kuchBhi() {
        const base64pic = await fileToBase64(e.target.files[0])
        setTemp(URL.createObjectURL(e.target.files[0]))
        // console.log(base64pic)
        const res = await axios.patch(import.meta.env.VITE_DOMAIN + `/api/profile/${userData._id}/profile-picture`, {profilePicture : base64pic}, {withCredentials : true})
        // console.log(res)
        dispatch(addUserData(res.data.data))
        
    }
    kuchBhi()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <Navbar />

      <div className="flex h-full">
        <Sidebar />

        {/* Profile Section */}
        <div className="w-[60vw] mx-auto px-6">
          {/* Profile Header */}
          <div className="flex items-center gap-16 mt-12">
            {/* Profile Image */}
            <input onChange={(e) => onChangeHandler(e)} ref={inputRef} type="file" className='hidden' />
            <div className="flex justify-center w-1/4">
              <img
              onClick={() => {
                inputRef.current.click()
              }}
                className="h-[170px] w-[170px] rounded-full object-cover shadow-xl ring-4 ring-pink-300"
                src={
                  temp || userData.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="profile"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col gap-5 w-3/4">
              {/* Username + Edit Button */}
              <div className="flex items-center gap-6">
                <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                  {userData.firstName} {userData.lastName}
                </p>
               
              </div>

              {/* Followers / Following */}
              <div className="flex gap-10 text-base text-gray-700">
                <p>
                  <span className="font-bold text-gray-900">{userData.posts.length}</span> posts
                </p>
                <p>
                  <span className="font-bold text-gray-900">{userData.followers.length}</span> followers
                </p>
                <p>
                  <span className="font-bold text-gray-900">{userData.following.length}</span> following
                </p>
              </div>

              {/* Bio */}
              <p className="text-sm leading-6 text-gray-800 max-w-md italic">
                {userData.bio}
              </p>

              <div className='flex gap-2'>

               <button
                  onClick={() => nav("/profile/edit")}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 active:scale-95 transition"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => nav("/profile/edit/password")}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 active:scale-95 transition"
                >
                  Change Password
                </button>

              </div>

            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-3 gap-2 mt-14">
            {userData.posts.map((item, index) => (
              <div
                key={item._id}
                className="relative group rounded-xl overflow-hidden shadow-md"
              >
                <img
                  className="h-[300px] w-full object-cover transform group-hover:scale-110 transition duration-500"
                  src={item.media[0]}
                  alt={`post-${index}`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-semibold text-lg transition">
                  ❤ {item.likes?.length || 0} &nbsp; 💬 {item.comments?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
