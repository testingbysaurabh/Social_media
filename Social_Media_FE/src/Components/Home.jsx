import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import axios from 'axios'
import Feed from './PostCards'

const Home = () => {


  

  const[posts,setPosts] = useState([])
  // console.log(posts)
  useEffect(() => {
    async function getData()
    {
      const res = await axios.get(import.meta.env.VITE_DOMAIN +  `/api/posts/feed`, {withCredentials : true})
      // console.log(res)
      setPosts(res.data.data)
    }
    getData()
  }, [])
  





  return (
    <div>
      <Navbar />

      <div className='flex'>

        <Sidebar />
        <div className=' w-[100%]'>
          <Feed posts={posts} />
        </div>
      
      </div>


    </div>
  )
}

export default Home