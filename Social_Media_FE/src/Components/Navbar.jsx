import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const userData = useSelector(store => store.user)
  const[q, setQ] = useState("")
  const[suggestions, setSuggestions] = useState([])
  const dropdownRef = useRef(null)
  const nav = useNavigate()
// console.log(suggestions)


  useEffect(() => {
    setSuggestions([])
    if(!q)
    {
      return
    }

    const intervalId = setTimeout(() => {
      async function getData()
      {
        const res = await axios.get(import.meta.env.VITE_DOMAIN + `/api/follow-requests/search?q=${q}`, {withCredentials  : true})
        // console.log(res)
        setSuggestions(res.data.data)
      }
      getData()
    }, 1000)




    return () => {
      clearTimeout(intervalId)
    }
  }, [q])


useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setSuggestions([])
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [])


  return (
    
    <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 h-[80px]">
      {/* Logo */}
      <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 cursor-pointer">
        Noisy
      </h3>

      {/* Search Input */}
      <div ref={dropdownRef} className="w-[50%] flex-col flex justify-center relative">
        <input
        onChange={(e) => {
          setQ(e.target.value)
        }}
          type="text"
          placeholder="Search..."
          className="w-[100%] px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-blue-50 focus:outline-none focus:ring-4 focus:ring-pink-300 placeholder-gray-400 shadow-sm transition"
        />


        {suggestions.length > 0 && (
  <div className="w-full absolute top-10 mt-3 bg-white shadow-lg rounded-xl border border-gray-200 max-h-60 overflow-y-auto z-50">
    {suggestions.map((item, idx) => {
      return (
        <div
        onClick={() => {
          nav(`/profile/view/${item._id}`)
        }}
          key={idx}
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
        >
          <img
            src={
              item.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="h-10 w-10 rounded-full object-cover border border-gray-300"
          />

          <div className="flex flex-col">
            <p className="font-medium text-gray-800">
              {item.firstName + " " + item.lastName}
            </p>
            <span className="text-sm text-gray-500">@{item.username}</span>
          </div>
        </div>
      );
    })}
  </div>
)}

      </div>

      {/* User Section */}
      <div className="flex items-center space-x-4">
        <p className="text-gray-800 font-semibold hover:text-pink-600 transition">
          {userData.username}
        </p>
        <div onClick={() => {
          nav("/profile")
        }} className="relative group">
          <img
            src={
              userData.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="profile"
            className="w-11 h-11 rounded-full ring-2 ring-transparent group-hover:ring-pink-400 transition"
          />
          {/* Online indicator dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
        </div>
      </div>
    </div>
  )
}

export default Navbar
