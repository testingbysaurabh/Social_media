import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Loader from './Loader'
import axios from 'axios'
import { addUserData } from '../Utils/UserSlice'


const ProtectedRoutes = () => {

    const userSliceData = useSelector(store => store.user)
    const dispatch = useDispatch()

    useEffect(() => {
        async function getUserData()
        {
            try {
                const res = await axios.get(import.meta.env.VITE_DOMAIN + "/api/auth/get-user-data", {withCredentials : true})
                dispatch(addUserData(res.data.data))
            } catch (error) {
                window.location = "/login"
            }

        }
        getUserData()
    }, [])

    return !userSliceData?.username ? <Loader /> : <Outlet />
}

export default ProtectedRoutes