import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../Utils/UserSlice";

const ToggleSwitch = ({ label, checked, onChange }) => {
  const userData = useSelector(store => store.user)
  const[isPrivate, setIsPrivate] = useState(userData.isPrivate) 
  const dispatch = useDispatch()

  function apiCaller()
  {
   
    async function toggleAccount()
    {
      const res = await axios.patch(import.meta.env.VITE_DOMAIN + `/api/profile/${userData._id}/privacy`, {isPrivate : !isPrivate}, {withCredentials : true})
      // console.log(res)
      dispatch(addUserData(res.data.data))
      setIsPrivate(prev => !prev)

    }

    toggleAccount()

  }

  return (
    <label  className="inline-flex items-center cursor-pointer">
            {label && (
        <span className="ms-3 text-sm font-medium ">
          {label}
        </span>
      )}
      <input
      onClick={apiCaller}
        type="checkbox"
        checked={isPrivate}
        onChange={onChange}
        className="sr-only peer"

      />
      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 ml-3
                      peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full 
                      peer dark:bg-gray-700 peer-checked:after:translate-x-full 
                      rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:start-[2px] 
                      after:bg-white after:border-gray-300 after:border after:rounded-full 
                      after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                      peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
      </div>

    </label>
  );
};

export default ToggleSwitch;
