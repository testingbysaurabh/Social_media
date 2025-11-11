import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ConvCard = ({ data }) => {
  const myData = useSelector(store => store.user)
  const [dataToBeDisplayed] = useState(
    myData._id === data.sender._id ? data.receiver : data.sender
  )

  const nav = useNavigate()

  return (
    <div
    onClick={() => {
        nav("/chat/" + dataToBeDisplayed._id)
    }}
      className="flex mt-3 items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border-b border-gray-200"
    >
      {/* Profile Image */}
      <img
        src={
          dataToBeDisplayed.profilePicture ||
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        }
        alt={dataToBeDisplayed.firstName}
        className="w-12 h-12 rounded-full object-cover border border-gray-300"
      />

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {dataToBeDisplayed.firstName} {dataToBeDisplayed.lastName}
          <span className="text-gray-400 ml-1 text-sm">
            @{dataToBeDisplayed.username}
          </span>
        </p>

        <p className="text-gray-600 text-sm truncate mt-0.5">
          {data.lastMsg || "No messages yet"}
        </p>
      </div>
    </div>
  )
}

export default ConvCard
