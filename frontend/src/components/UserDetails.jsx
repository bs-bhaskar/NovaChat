import React, { useEffect, useState } from 'react'
import useUserStore from '../store/useUserStore'
import useThemeStore from '../store/themeStore'
import {updateUserProfile} from '../services/user.service'
import {toast} from 'react-toastify'
import Layout from "./Layout"
import { motion } from 'framer-motion'
import { FaCamera, FaCheck, FaPencilAlt, FaSmile } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import EmojiPicker from 'emoji-picker-react'
const UserDetails = () => {
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [showNameEmoji, setShowNameEmoji] = useState(false);
  const [showAboutEmoji, setShowAboutEmoji] = useState(false);
  const [loading, setLoading]=useState(false)

  const {user,setUser}=useUserStore()
  const {theme}=useThemeStore()

  useEffect(()=>{
    if(user){
      setName(user.username || "")
      setAbout(user.about || "")
    }
  },[user])

  
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);


  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      e.target.value = "";
      return;
    }

    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
    e.target.value = "";
  };


  
  const handleSave = async (field) => {
    if (loading) return;

    if (field === "name" && !name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      if (field === "name") {
        formData.append("username", name.trim());
      } else if (field === "about") {
        formData.append("about", about.trim());
      } else if (field === "profile" && profilePicture) {
        formData.append("media", profilePicture);
      } else {
        return;
      }

      const updated = await updateUserProfile(formData);

      if (updated?.data) {
        setUser(updated.data);
      }

      if (field === "name") {
        setIsEditingName(false);
        setShowNameEmoji(false);
      } else if (field === "about") {
        setIsEditingAbout(false);
        setShowAboutEmoji(false);
      } else if (field === "profile") {
        setProfilePicture(null);
        setPreview(null);
      }

      toast.success("Profile updated");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };


  const handleEmojiSelect=(emoji,field)=>{
    if(field==='name'){
      setName((prev)=>prev+emoji.emoji)
      setShowNameEmoji(false)
    }else{
      setAbout((prev)=>prev+emoji.emoji)
      setShowAboutEmoji(false)
    }
  }
  return (
    <Layout>
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}} className={`w-full min-h-screen flex border-r ${theme==="dark"?"bg-[rgb(17,27,33)] border-gray-600 text-white":"bg-gray-100 border-gray-200 text-black"}`}>
        <div className='w-full rounded-lg p-6'>
          <div className='flex items-center mb-6'>
            <h1 className='text-2xl font-bold'>
              Profile
            </h1>
          </div>
          <div className='space-y-6'>
            <div className='flex flex-col items-center'>
              <div className='relative group'>
                <img src={preview || user?.profilePicture} alt="profile picture" className='w-52 h-52 rounded-full mb-2 object-cover' />
                <label htmlFor="profileUpload" className='absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer'>
                  <div className='text-white text-center'>
                    <FaCamera className='h-8 w-8 mx-auto mb-2'/>
                    <span className='text-sm'>Change</span>
                  </div>
                  <input type="file" id='profileUpload' accept='image/*' onChange={handleImageChange} className='hidden' />
                </label>
              </div>
            </div>
            {preview &&(
              <div className='flex justify-center gap-4 mt-4'>
                <button
                  onClick={() => handleSave("profile")}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded"
                >
                  {loading?"Saving...":"Change"}
                </button>
                <button onClick={()=>{
                  setProfilePicture(null)
                  setPreview(null)
                }} className='bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded'>
                  Discard
                </button>
              </div>
            )}
            <div className={`relative p-4 ${theme==='dark'?"bg-gray-800":"bg-white"} shadow-sm rounded-lg`}>
              <label htmlFor="name" className='block text-sm font-medium mb-1 text-gray-500 text-start'>
                Your Name
              </label>
              <div className='flex items-center'>
                {isEditingName?(
                  <input id='name' type="text" value={name} onChange={(e)=>setName(e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${theme==='dark'?"bg-gray-700 text-white":"bg-white text-black"}`} />
                ):(
                  <span className='w-full px-3 py-2'>
                    {user?.username || name}
                  </span>
                )}

                {isEditingName?(
                  <>
                    <button
                      onClick={() => handleSave("name")}
                      disabled={loading}
                      className="ml-2 focus:outline-none disabled:opacity-50"
                    >
                      <FaCheck className='h-5 w-5 text-green-500'/>
                    </button>
                    <button onClick={()=>setShowNameEmoji(!showNameEmoji)} className='ml-2 focus:outline-none'>
                      <FaSmile className='h-5 w-5 text-yellow-500'/>
                    </button>
                    <button
                      onClick={() => {
                        setName(user?.username || "");
                        setIsEditingName(false);
                        setShowNameEmoji(false);
                      }}
                      className="ml-2 focus:outline-none"
                    >
                      <MdCancel className="h-5 w-5 text-gray-500" />
                    </button>
                  </>
                ):(
                  <button onClick={()=>setIsEditingName(!isEditingName)} className='ml-2 focus:outline-none'>
                    <FaPencilAlt className='h-5 w-5 text-gray-500'/>
                  </button>
                )}
              </div>
              {showNameEmoji &&(
                <div className='absolute z-10 -top-80'>
                  <EmojiPicker onEmojiClick={(emoji)=>handleEmojiSelect(emoji,"name")} theme={theme}/>
                </div>
              )}
            </div>

            <div className={`relative p-4 ${theme==='dark'?"bg-gray-800":"bg-white"} shadow-sm rounded-lg`}>
              <label htmlFor="about" className='block text-sm font-medium mb-1 text-gray-500 text-start'>
                About
              </label>
              <div className='flex items-center'>
                {isEditingAbout?(
                  <input id='about' type="text" value={about} onChange={(e)=>setAbout(e.target.value)} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${theme==='dark'?"bg-gray-700 text-white":"bg-white text-black"}`} />
                ):(
                  <span className='w-full px-3 py-2'>
                    {user?.about || about}
                  </span>
                )}

                {isEditingAbout?(
                  <>
                    <button
                      onClick={() => handleSave("about")}
                      disabled={loading}
                      className="ml-2 focus:outline-none disabled:opacity-50"
                    >
                      <FaCheck className='h-5 w-5 text-green-500'/>
                    </button>
                    <button onClick={()=>setShowAboutEmoji(!showAboutEmoji)} className='ml-2 focus:outline-none'>
                      <FaSmile className='h-5 w-5 text-yellow-500'/>
                    </button>
                    <button
                      onClick={() => {
                        setAbout(user?.about || "");
                        setIsEditingAbout(false);
                        setShowAboutEmoji(false);
                      }}
                      className="ml-2 focus:outline-none"
                    >
                      <MdCancel className="h-5 w-5 text-gray-500" />
                    </button>
                  </>
                ):(
                  <button onClick={()=>setIsEditingAbout(!isEditingAbout)} className='ml-2 focus:outline-none'>
                    <FaPencilAlt className='h-5 w-5 text-gray-500'/>
                  </button>
                )}
              </div>
              {showAboutEmoji &&(
                <div className='absolute z-10 -top-80'>
                  <EmojiPicker onEmojiClick={(emoji)=>handleEmojiSelect(emoji,"about")} theme={theme}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  )
}

export default UserDetails