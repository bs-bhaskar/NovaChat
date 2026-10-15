import React, {useRef, useState, useEffect } from 'react'
import useThemeStore from '../../store/themeStore'
import useUserStore from '../../store/useUserStore'
import { useChatStore } from '../../store/chatStore'
import { format, isToday, isValid, isYesterday } from 'date-fns';

const isVariable=(date)=>{
  return date instanceof Date && !isNaN(date)
}

const ChatWindow = ({ selectedContact, setSelectedContact, isMobile }) => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [filePreview, setFilePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const typingTimeoutRef = useRef(null)
  const messageEndRef = useRef(null)
  const emojiPickerRef = useRef(null)
  const fileInputRef = useRef(null)

  const {theme} = useThemeStore()
  const {user} = useUserStore()
  const {
    messages,
    loading,
    sendMessage,
    fetchMessages,
    fetchConversations,
    conversations,
    isUserTyping,
    startTyping,
    stopTyping,
    getUserLastSeen,
    isUserOnline,
    setCurrentUser,
    addReaction,
  } = useChatStore();

  useEffect(() => {
    setCurrentUser(user || null);
  }, [user, setCurrentUser]);

  // get online status and lastseen
  const online= isUserOnline(selectedContact?._id)
  const lastSeen=getUserLastSeen(selectedContact?._id)
  const isTyping=isUserTyping(selectedContact?._id)


  useEffect(() => {
    if (!selectedContact?._id || !Array.isArray(conversations?.data)) {
      return;
    }

    const conversation = conversations.data.find((conv) =>
      conv.participants?.some(
        (participant) =>
          String(participant?._id ?? participant) ===
          String(selectedContact._id)
      )
    );

    if (conversation?._id) {
      fetchMessages(conversation._id);
    }
  }, [selectedContact?._id, conversations?.data, fetchMessages]);


  useEffect(()=>{
    fetchConversations()
  }, [])

  const scrollToBottom=()=>{
    messageEndRef.current?.scrollIntoView({behavior:"auto"})
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  
useEffect(() => {
  const receiverId = selectedContact?._id;

  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  if (!receiverId || !message.trim()) {
    if (receiverId) {
      stopTyping(receiverId);
    }
    return;
  }

  startTyping(receiverId);

  typingTimeoutRef.current = setTimeout(() => {
    stopTyping(receiverId);
    typingTimeoutRef.current = null;
  }, 2000);

  return () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };
}, [message, selectedContact?._id, startTyping, stopTyping]);


  
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowFileMenu(false);

    setFilePreview((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }

      return file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
    });
  };


  const handleSendMessage=async()=>{
    if(!selectedContact) return
    try {
      const formData= new FormData()
      formData.append("senderId", user?._id)
      formData.append("receiverId", selectedContact?._id)

      const status=online?"delivered":"send"
      formData.append("messageStatus", status)
      if(message.trim()){
        formData.append("content", message.trim())
      }
      // if there is file include that too
      if(selectedFile){
        formData.append("media", selectedFile, selectedFile.name)
      }

      if(!message.trim() && !selectedFile) return
      await sendMessage(formData)

      // clear state
      setMessage("")
      setFilePreview(null)
      setSelectedFile(null)
      setShowFileMenu(false)

    } catch (error) {
        console.error("Failed to send message", error)
    }
  }

  const renderDateSeparator = (date) => {
    if (!isVariable(date)) return null;

    let dateString
    if(isToday(date)){
      dateString="Today"
    } else if(isYesterday(date)){
      dateString="Yesterday"
    }else{
      dateString=format(date, "EEEE MMMM d")
    }
    
    return(
      <div className='flex justify-center my-4'>
        <span className={`px-4 py-2 rounded-full text-sm ${theme==="dark"?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-600"}`}>
          {dateString}
        </span>
      </div>
    ) 
  }  

  // Group Messege
  const groupedMessages = Array.isArray(messages) ? messages.reduce((acc, message) => {
    if(!message.createdAt) return acc
    const date= new Date(message.createdAt)
    if(isValid(date)){
      const dateString= format(date, "yyyy-MM-dd")
      if(!acc[dateString]){
        acc[dateString]=[]
      }
      acc[dateString].push(message)
    }else{
      console.error("Invalid date for message ", message)
    }
    return acc
  },{}):{}

  const handleReaction=(messageId, emoji)=>{
    addReaction(messageId, emoji)
  }

  console.log('this is my contact',selectedContact)

  if(!selectedContact){
    return (
      <div className=''>
        
      </div>
    )
  }
  return <div>ChatWindow</div>
}

export default ChatWindow