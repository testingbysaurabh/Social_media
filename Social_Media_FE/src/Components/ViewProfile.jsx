import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import PrivateAccount from './PrivateAccount'
import Public from './Public'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const ViewProfile = () => {

  const{userId} = useParams()
  const[isPrivate, setIsPrivate] = useState(true)
  const[userData, setUserData] = useState({})

  useEffect(() => {
    async function getProfile()
    {
      const res = await axios.get(import.meta.env.VITE_DOMAIN + `/api/profile/${userId}`, {withCredentials : true})
      // console.log(res) 
      setIsPrivate(res.data.data.isPrivate)
      setUserData(res.data.data)
    }
    getProfile()
  }, [userId])



  return (
    <div>
      <Navbar />


      <div className='flex'>
        <Sidebar />

        {isPrivate ? <PrivateAccount data={userData} setData={setUserData} /> : <Public data={userData} />}


      </div>
    </div>
  )
}

export default ViewProfile