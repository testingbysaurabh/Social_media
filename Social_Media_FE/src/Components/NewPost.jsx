import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addPost } from "../Utils/UserSlice";
import toast from "react-hot-toast";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}




const NewPost = () => {
  const [temp, setTemp] = useState("");
  const [media, setMedia] = useState([]);
  const[enableBtn, setEnableBtn] = useState(true)
  // console.log(media)
  const nav = useNavigate()
  const dispatch = useDispatch()


  async function postBtnHandler()
  {
    try {
          setEnableBtn(false)
          const base64Media = await Promise.all(media.map((item) => {
            return fileToBase64(item.item)
          }))
          const res = await axios.post(import.meta.env.VITE_DOMAIN + "/api/posts/create", {caption : temp, location : "Delhi", media : base64Media}, {withCredentials : true})
          if(res.status == 201)
          {
            dispatch(addPost(res.data.data))
            nav("/profile")
    }
    } catch (error) {
      toast.error(error.response.data.error)
    }
    finally{
      setEnableBtn(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex justify-center p-6">
          <div className="flex w-full max-w-5xl gap-8">
            {/* Post Form */}
            <div className="w-1/2 bg-white h-[80%] shadow-lg rounded-2xl p-6 space-y-5">
              <h2 className="text-2xl font-semibold text-gray-800">
                Create New Post
              </h2>

              {/* Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload Images / Videos
                </label>
                <input
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const arr = files.map((item) => ({
                      item,
                      preview: URL.createObjectURL(item),
                    }));
                    setMedia([...media, ...arr]);
                  }}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer
                             file:mr-4 file:py-2 file:px-4 
                             file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                             file:bg-blue-50 file:text-blue-600 
                             hover:file:bg-blue-100"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Caption
                </label>
                <input
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  type="text"
                  placeholder="Write something..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none 
                             focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Post Button */}
{             enableBtn && <button

                onClick={postBtnHandler}
                className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-medium 
                          hover:bg-blue-700 active:scale-95 transition
                          disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Post
              </button>}

            </div>

            {/* Media Preview */}
            <div className="w-1/2 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto max-h-[70vh]">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Preview
              </h3>
              {media.length === 0 ? (
                <p className="text-gray-500 text-sm">No media selected yet</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {media.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-full h-28 rounded-lg overflow-hidden border border-gray-300 group"
                    >
                      <img
                        src={item.preview}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Delete button */}
                      <button
                        onClick={() => {
                          setMedia(media.filter((_, i) => i !== index));
                        }}
                        className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded 
                                  opacity-80 hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
