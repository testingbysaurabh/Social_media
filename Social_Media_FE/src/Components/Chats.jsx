import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import axios from 'axios'
import ConvCard from './ConvCard'

const Chats = () => {
  const [conv, setConv] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getConversations() {
      try {
        const res = await axios.get(
          import.meta.env.VITE_DOMAIN + `/api/chats`,
          { withCredentials: true }
        )
        setConv(res.data.data)
      } catch (err) {
        console.error("Error fetching conversations:", err)
      } finally {
        setLoading(false)
      }
    }
    getConversations()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className=" border-r border-gray-200 bg-white shadow-sm">
          <Sidebar />
        </div>

        {/* Main Chat Container */}
        <div className="w-[80%] mx-auto px-8 py-6">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Recent Chats
          </h1>

          {/* Chat List */}
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100 overflow-hidden">
            {loading ? (
              // Shimmer Loader
              <div className="space-y-4 p-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 animate-pulse"
                  >
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : conv.length > 0 ? (
              conv.map((item, index) => (
                <ConvCard key={index} data={item} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                No conversations yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chats
