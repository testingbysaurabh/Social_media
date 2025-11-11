import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const PrivateAccount = ({data, setData}) => {

  const{userId} = useParams()
  const userSliceData = useSelector(store => store.user)
  const[isFollowing, setIsFollowing] = useState(userSliceData.following.some(item => item == userId))
  const[isReqSent, setIsReqSent] = useState(false)
  const nav = useNavigate()

  useEffect(() => {

    async function check()
    {
      const res = await axios.get(import.meta.env.VITE_DOMAIN + `/api/follow-requests/check/${userId}`, {withCredentials : true})
      // console.log(res)
      setIsReqSent(res.data.flag)
    }

    if(!isFollowing)
    {
      check()
    }

  }, [])

    const {
    profilePicture,
    firstName,
    lastName,
    username,
    bio,
    posts,
    followers,
    following,
  } = data


  function followBtnHandler()
  {
    async function unfollow() {
      const res = await axios.patch(import.meta.env.VITE_DOMAIN + `/api/follow-requests/unfollow/${userId}`, {}, {withCredentials : true})   
      // console.log(res)
      setData(res.data.toUserData)
      setIsFollowing(false)
    }

    async function cancelReq() {
      const res = await axios.delete(import.meta.env.VITE_DOMAIN + `/api/follow-requests/${userId}`,{withCredentials : true})   
      // console.log(res)
      setIsReqSent(false)
    }

    async function follow() {
      const res = await axios.post(import.meta.env.VITE_DOMAIN + `/api/follow-requests/${userId}`,{},{withCredentials : true})   
      // console.log(res)
      setIsReqSent(true)
    }

    
    if(isFollowing)
    {
      unfollow()
    }
    else
    {
      if(isReqSent)
      {
        cancelReq()
      }
      else
      {
        follow()
      }
    }
  }


  return (
    <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <img
          src={
            profilePicture ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt={`${firstName} ${lastName}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-pink-200 shadow-md"
        />

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-gray-800">
              {firstName + " " + lastName}{" "}
              <span className="text-gray-500 text-lg font-normal">
                @{username}
              </span>
            </p>

            <button
              onClick={followBtnHandler}
              className={`px-4 py-1 rounded-lg text-sm font-medium transition ${
                isFollowing
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-pink-500 text-white hover:bg-pink-600"
              }`}
            >
              {isFollowing ? "Unfollow" : (isReqSent ? "Pending" : "Follow")}
            </button>


            <button className='px-4 py-1 rounded-lg text-sm font-medium transition bg-gray-200 text-gray-700 hover:bg-gray-300' onClick={() => {
              nav("/chat/" + userId)
            }}>Message</button>

       
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-3 text-gray-700">
            <p>
              <span className="font-semibold">{posts?.length }</span> Posts
            </p>
            <p>
              <span className="font-semibold">{followers?.length }</span>{" "}
              Followers
            </p>
            <p>
              <span className="font-semibold">{following?.length}</span>{" "}
              Following
            </p>
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-700 leading-relaxed">{bio}</p>
        </div>
      </div>

    </div>
  )


}

export default PrivateAccount