import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client"
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ChatBox = () => {
    const socket = useRef()
    const { id } = useParams()
    const [userData, setUserData] = useState(null)
    const [text, setText] = useState("")
    const[chats, setChats] = useState([])
    const myUserData = useSelector(store => store.user)
    const nav = useNavigate()
    // console.log(chats)

    useEffect(() => {
        async function getChats()
        {
            const res = await axios.get(import.meta.env.VITE_DOMAIN + `/api/chats/${id}`, {withCredentials : true})
            console.log(res)
            setChats(res.data.chats)
        }
        getChats()
    }, [])

    useEffect(() => {

        const fn = (e) => {
            if(e.key == "Enter")
            {
                btnClickHandler()
            }
        }
        window.addEventListener("keydown", fn)

        return () => {
            window.removeEventListener("keydown", fn)
        }
    })

    useEffect(() => {
        async function getProfile() {
            const res = await axios.get(import.meta.env.VITE_DOMAIN + `/api/profile/${id}`, { withCredentials: true })
            setUserData(res.data.data)
        }
        getProfile()
    }, [])
    useEffect(() => {
        socket.current = io(import.meta.env.VITE_DOMAIN)
        socket.current.emit("join-room", { sender: myUserData._id, receiver: id })

        const handleReceiveMsg = ({ sender, receiver, text }) => {
            setChats(prev => [...prev, { sender, receiver, text }])
        }

        socket.current.on("receive-msg", handleReceiveMsg)

        return () => {
            socket.current.off("receive-msg", handleReceiveMsg)
            socket.current.disconnect()
        }
    }, [])



    function btnClickHandler()
    {

        if(text.trim().length == 0)
        {
            toast.error("Message cannot be empty")
            return
        }
        socket.current.emit("send-msg", {sender : myUserData._id, receiver : id, text})
        setText("")
        setChats(prev => [...prev, {sender : myUserData._id, receiver : id, text}])
    }


    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div onClick={() => {
                        nav("/profile/view/" + id)
                    }} className="flex items-center p-4 bg-white border-b border-gray-200 shadow-sm">
                        {userData ? (
                            <>
                                <img
                                    className="w-12 h-12 rounded-full object-cover mr-4"
                                    src={userData.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                    alt="Profile"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{userData.firstName + " " + userData.lastName}</p>
                                    <p className="text-gray-500 text-sm">@{userData.username}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4 w-full">
                                {/* Shimmer for profile picture */}
                                <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                                {/* Shimmer for name and username */}
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-2 flex flex-col" id="chatContainer">
                        {chats && chats.map((item, index) => {
                            const isSender = item.sender === myUserData._id
                            return (
                                <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                                    <div className={`px-4 py-2 rounded-lg max-w-xs break-words 
                                        ${isSender 
                                            ? "bg-blue-500 text-white rounded-br-none" 
                                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}>
                                        {item.text}
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button onClick={btnClickHandler} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox
