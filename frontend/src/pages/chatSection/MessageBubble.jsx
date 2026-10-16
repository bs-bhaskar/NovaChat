import React from 'react'

const MessageBubble = ({ message, theme, onReact, deleteMessage }) => {
    console.log('MessageBubble props:', { message, theme, onReact, deleteMessage });
  return (
    <div className={`message-bubble ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white text-gray-800'}`}>
      <p>{message.content}</p>
    </div>
  )
}

export default MessageBubble