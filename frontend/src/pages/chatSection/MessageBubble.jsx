import {format} from "date-fns"
import React, {useState, useRef} from 'react'
import {FaCheck, FaCheckDouble, FaPlus, FaRegCopy, FaSmile} from "react-icons/fa"
import {HiDotsVertical} from "react-icons/hi"
import useOutsideclick from "../../hooks/useOutsideclick"
import EmojiPicker from "emoji-picker-react"
import {RxCross2} from "react-icons/rx"

const MessageBubble = ({ message, theme, onReact, currentUser, deleteMessage }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const messageRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

    const emojiPickerRef = useRef(null);
    const reactionsMenuRef = useRef(null);

    useOutsideclick(emojiPickerRef, ()=>{
      if(showEmojiPicker) setShowEmojiPicker(false)
      })
    useOutsideclick(reactionsMenuRef, ()=>{
      if(showReactions) setShowReactions(false)
      })
    useOutsideclick(optionsRef, ()=>{
      if(showOptions) setShowOptions(false)
      })
    
    if (!message) return null;
    
    const isUserMessage =
    String(message.sender?._id ?? message.sender ?? "") ===
    String(currentUser?._id ?? "");
    
    const bubbleClass = isUserMessage
      ? "justify-end"
      : "justify-start";

    const bubbleContentClass = `relative group inline-flex flex-col w-fit min-w-0 max-w-[75%] mb-2 rounded-2xl ${
      isUserMessage ? "px-3" : "pl-3 pr-8"
    } py-2 shadow-sm transition-shadow hover:shadow-md ${
      isUserMessage
        ? theme === "dark"
          ? "bg-[#144d38] text-white rounded-tr-sm"
          : "bg-[#d9fdd3] text-gray-900 rounded-tr-sm"
        : theme === "dark"
          ? "bg-[#202c33] text-white rounded-tl-sm border border-[#2a3942]"
          : "bg-white text-gray-900 rounded-tl-sm border border-gray-200"
    }`;

    const quickReactions = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

    const handleReact = (emoji) => {
      if (!message?._id || typeof onReact !== "function") return;

      onReact(message._id, emoji);
      setShowEmojiPicker(false);
      setShowReactions(false);
    };

    return (
    <div className={`flex w-full ${bubbleClass} mb-3 px-3`}>
      <div className={`${bubbleContentClass} relative group`} ref={messageRef}>
        <div className="flex flex-col gap-1 min-w-0">
          {message.content && (
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
              {message.content}
            </p>
          )}

          {message.contentType === "image" && message.imageOrVideoUrl && (
            <img src={message.imageOrVideoUrl} alt="Shared image" className="rounded-xl max-w-full w-auto max-h-80 object-contain"/>
          )}

          {message.contentType === "video" && message.imageOrVideoUrl && (
            <video
              src={message.imageOrVideoUrl}
              controls
              className="rounded-xl max-w-full w-auto max-h-80"
            />
          )}
        </div>
        <div className="flex items-center justify-end gap-1 text-[11px] opacity-65 mt-1">
            <span>
              {format(new Date(message.createdAt), "HH:mm")}
            </span>
            {isUserMessage && (
              <>
                {message.messageStatus==='send' && (<FaCheck size={12}/>)}    
                {message.messageStatus==='delivered' && (<FaCheckDouble size={12}/>)}    
                {message.messageStatus==='read' && (<FaCheckDouble size={12} className="text-blue-900"/>)}    
              </>
            )}
        </div>
        <div className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20'>
            <button onClick={()=>setShowOptions((prev)=>!prev)} className={`p-1 rounded-full ${theme==='dark'?"text-white":"text-gray-800"}`}>
              <HiDotsVertical size={18}/>
            </button>
        </div>
        <div className={`absolute ${isUserMessage?"-left-10":"-right-10"} top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2`}>
            <button onClick={()=>setShowReactions(!showReactions)} className={`p-2 rounded-full ${theme==='dark'?"bg-[#202c33] hover:bg-[#202c33]/80":"bg-white hover:bg-gray-100"} shadow-lg`}>
              <FaSmile className={`${theme==='dark'?"text-gray-300":"text-gray-600"}`}/>
            </button>
        </div>

        {showReactions &&(
          <div ref={reactionsMenuRef} className={`absolute -top-8 ${isUserMessage?"left-0":"left-36"} transform -translate-x-1/2 flex items-center bg-[#202c33]/90 rounded-full px-2 py-1.5 gap-1 shadow-lg z-50 `}>
            {quickReactions.map((emoji,index)=>(
              <button
                key={index}
                onClick={() => handleReact(emoji)}
                className="hover:scale-125 transition-transform p-1"
              >
                {emoji}
              </button>
            ))}
            <div className="w-[1px] h-5 bg-gray-600 mx-1"/>
            <button className="hover:bg-[#ffffff1a] rounded-full p-1" onClick={()=>setShowEmojiPicker(true)}>
              <FaPlus className="h-4 w-4 text-gray-300"/>
            </button>
          </div>    
        )}
        {showEmojiPicker &&(
          <div ref={emojiPickerRef} className='absolute left-0 mb-6 z-50'>
            <div className="relative">
              <EmojiPicker
                onEmojiClick={(emojiObject) => handleReact(emojiObject.emoji)}
                theme={theme}
              />
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <RxCross2 />
              </button>
            </div>
          </div>
        )}
        {message.reactions?.length > 0 && (
          <div
            className={`absolute -bottom-3 ${
              isUserMessage ? "right-3" : "left-3"
            } z-20 flex items-center gap-1 px-2 py-1 rounded-full
            shadow-md border backdrop-blur-sm transition-transform duration-150 hover:scale-105 ${
              theme === "dark"
                ? "bg-[#202c33] border-[#3b4a54]"
                : "bg-gray-200 border-gray-200"
            }`}
          >
            {message.reactions.map((reaction, index) => (
              <span
                key={reaction._id || `${reaction.emoji}-${index}`}
                className="text-sm leading-none"
              >
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}

        {showOptions && (
          <div
            ref={optionsRef}
            className={`absolute top-0 ${
              isUserMessage
                ? "right-full mr-2"
                : "left-full ml-2"
            } z-[100] w-36 rounded-xl border shadow-xl py-1.5 text-sm ${
              theme === "dark"
                ? "bg-[#1d1f1f] text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-200"
            }`}
          >
            {message.contentType === "text" && (
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(message.content || "");
                    setShowOptions(false);
                  } catch (error) {
                    console.error("Failed to copy message:", error);
                  }
                }}
                className={`flex items-center w-full px-3 py-2.5 gap-3 rounded-lg transition-colors duration-150 ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-gray-100"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                <FaRegCopy size={14} />
                <span>Copy</span>
              </button>
            )}

            {isUserMessage && (
              <button
                onClick={() => {
                  deleteMessage(message?._id);
                  setShowOptions(false);
                }}
                className={`flex items-center w-full px-3 py-2.5 gap-3 rounded-lg transition-colors duration-150 ${
                  theme === "dark"
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-600 hover:bg-red-50"
                }`}
              >
                <FaRegCopy size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble