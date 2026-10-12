import React, { useState } from 'react'

const ChatWindow = () => {
  const [message, setMessage] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  return (
    <div>ChatWindow</div>
  )
}

export default ChatWindow