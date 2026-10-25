import React, { useCallback, useEffect } from 'react'
import useVideoCallStore from '../../store/videoCallStore'
import useUserStore from '../../store/useUserStore'
import VideoCallModel from './VideoCallModel'

const VideoCallManager = ({socket}) => {
    const {setIncomingCall,setCurrentCall,setCallType,setCallModelOpen,endCall,setCallStatus}=useVideoCallStore()
    const {user}=useUserStore()

    useEffect(()=>{
        if(!socket) return

        // Handle incoming call
        const handleIncomingCall=({callerId, callerName, callerAvatar, callType, callId})=>{
            setIncomingCall({
                callerId,
                callerName,
                callerAvatar,
                callId
            })
            setCallType(callType)
            setCallModelOpen(true)
            setCallStatus("ringing")
        }
        const handleCallEnded=({reason})=>{
            setCallStatus("failed")
            setTimeout(()=>{
                endCall()
            },2000)
        }
        socket.on("incoming_call", handleIncomingCall)
        socket.on("call_failed", handleCallEnded)
        return ()=>{
            socket.off("incomming_call", handleIncomingCall)
            socket.off("call_failed", handleCallEnded)
        }
    },[socket,setIncomingCall,setCallType,setCallModelOpen,setCallStatus,endCall])
    // Memozed function to initial call
    const initiateCall = useCallback((receiverId, receiverName, receiverAvatar, callType = "video") => {

        // 1. Check socket connection
        if (!socket?.connected) {
            setCallStatus("failed")
            console.error("Socket is not connected. Cannot initiate call.")
            return
        }

        // 2. Generate call ID
        const callId = `${user?._id}-${receiverId}-${Date.now()}`

        const callData = {
            callId,
            participantId: receiverId,
            participantName: receiverName,
            participantAvatar: receiverAvatar,
        }

        // 3. Set call state
        setCurrentCall(callData)
        setCallType(callType)
        setCallModelOpen(true)
        setCallStatus("calling")

        // 4. Emit call event
        socket.emit("initiate_call", {
            callId,
            callerId: user?._id,
            receiverId,
            callType,
            callerInfo: {
                username: user?.username,
                profilePicture: user?.profilePicture
            }
        })

    }, [
        user,
        socket,
        setCurrentCall,
        setCallType,
        setCallModelOpen,
        setCallStatus
    ])

    // expose the initiate call function to store
    useEffect(()=>{
        useVideoCallStore.getState().initiateCall=initiateCall
    },[initiateCall])
  return <VideoCallModel socket={socket}/>
}

export default VideoCallManager 