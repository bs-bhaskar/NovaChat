

// const handleVideoCallEvent = (socket,io,onlineUsers) => {
  
//     // initiate video call
//     socket.on("initiate_call",({callerId,receiverId,callType,callerInfo})=>{
//         const receiverSocketId=onlineUsers.get(receiverId)

//         if(receiverSocketId){
//             const callId=`${callerId}-${receiverId}-${Date.now()}`
//             io.to(receiverSocketId).emit("incomming_call",{
//                 callerId,
//                 callerName:callerInfo.username,
//                 callerAvatar:callerInfo.profilePicture,
//                 callId,
//                 callType
//             })
//         }else{
//             console.log(`server: Receiver ${receiverId} is offline`)
//             socket.emit("call_failed",{reason:"user is offline"})
//         }
//     })

//     // accept call
//     socket.on("accept_call",({callerId,callId,receiverInfo})=>{
//         const callerSocketId=onlineUsers.get(callerId)

//         if(callerSocketId){
//             io.to(callerSocketId).emit("call_accepted",{
//                 callerName:receiverInfo.username,
//                 callerAvatar:receiverInfo.profilePicture,
//                 callId,
//             })
//         }else{
//             console.log(`server: Caller ${callerId} not found`)
//         }
//     })

//     // Reject Call
//     socket.on("reject_call",({callerId,callId})=>{
//         const callerSocketId=onlineUsers.get(callerId)

//         if(callerSocketId){
//             io.to(callerSocketId).emit("call_rejected",{callId})
//         }
//     })

//     // End Call
//     socket.on("end_call",({callId,participantId})=>{
//         const participantSocketId=onlineUsers.get(participantId)
//         if(participantSocketId){
//             io.to(participantSocketId).emit("call_ended",{callId})
//         }
//     })

//     // web rtc signaling event with proper userId and socketId mapping
//     socket.on("webrtc_offer",({callId,offer,receiverId})=>{
//         const receiverSocketId=onlineUsers.get(receiverId)
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("webrtc_offer",{callId,offer,senderId:socket.userId})
//             console.log(`server offer forwarded to ${receiverId}`)
//         }else{
//             console.log(`server: Receiver ${receiverId} not found the offer`)
//         }
//     })

//     // web rtc signaling event with proper userId and socketId mapping
//     socket.on("webrtc_answer",({callId,answer,receiverId})=>{
//         const receiverSocketId=onlineUsers.get(receiverId)
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("webrtc_answer",{callId,answer,senderId:socket.userId})
//             console.log(`server answer forwarded to ${receiverId}`)
//         }else{
//             console.log(`server: Receiver ${receiverId} not found the answer`)
//         }
//     })

//     // web rtc signaling event with proper userId and socketId mapping
//     socket.on("webrtc_ice_candidate",({callId,candidate,receiverId})=>{
//         const receiverSocketId=onlineUsers.get(receiverId)
//         if(receiverSocketId){
//             io.to(receiverSocketId).emit("webrtc_ice_candidate",{callId,candidate,senderId:socket.userId})
//         }else{
//             console.log(`server: Receiver ${receiverId} not found the ice candidate`)
//         }
//     })
// };

// module.exports = { handleVideoCallEvent };


const handleVideoCallEvent = (socket, io, onlineUsers) => {

    // Initiate video call
    socket.on("initiate_call", ({ callerId, receiverId, callType, callerInfo } = {}) => {
        try {
            if (!callerId || !receiverId || !socket.userId) return;

            // Caller ID must match the connected socket user
            if (String(callerId) !== String(socket.userId)) return;

            const receiverSocketId = onlineUsers.get(String(receiverId));

            if (receiverSocketId) {
                const callId = `${callerId}-${receiverId}-${Date.now()}`;

                io.to(receiverSocketId).emit("incomming_call", {
                    callerId,
                    callerName: callerInfo?.username || "User",
                    callerAvatar: callerInfo?.profilePicture || "",
                    callId,
                    callType
                });
            } else {
                console.log(`server: Receiver ${receiverId} is offline`);
                socket.emit("call_failed", { reason: "user is offline" });
            }
        } catch (error) {
            console.error("Error initiating call:", error);
            socket.emit("call_failed", { reason: "Failed to initiate call" });
        }
    });

    // Accept call
    socket.on("accept_call", ({ callerId, callId, receiverInfo } = {}) => {
        try {
            if (!callerId || !callId) return;

            const callerSocketId = onlineUsers.get(String(callerId));

            if (callerSocketId) {
                io.to(callerSocketId).emit("call_accepted", {
                    callerName: receiverInfo?.username || "User",
                    callerAvatar: receiverInfo?.profilePicture || "",
                    callId
                });
            } else {
                console.log(`server: Caller ${callerId} not found`);
            }
        } catch (error) {
            console.error("Error accepting call:", error);
        }
    });

    // Reject call
    socket.on("reject_call", ({ callerId, callId } = {}) => {
        try {
            if (!callerId || !callId) return;

            const callerSocketId = onlineUsers.get(String(callerId));

            if (callerSocketId) {
                io.to(callerSocketId).emit("call_rejected", { callId });
            }
        } catch (error) {
            console.error("Error rejecting call:", error);
        }
    });

    // End call
    socket.on("end_call", ({ callId, participantId } = {}) => {
        try {
            if (!participantId || !callId) return;

            const participantSocketId = onlineUsers.get(String(participantId));

            if (participantSocketId) {
                io.to(participantSocketId).emit("call_ended", { callId });
            }
        } catch (error) {
            console.error("Error ending call:", error);
        }
    });

    // WebRTC offer
    socket.on("webrtc_offer", ({ callId, offer, receiverId } = {}) => {
        try {
            if (!callId || !offer || !receiverId || !socket.userId) return;

            const receiverSocketId = onlineUsers.get(String(receiverId));

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("webrtc_offer", {
                    callId,
                    offer,
                    senderId: socket.userId
                });
            } else {
                console.log(`server: Receiver ${receiverId} not found for offer`);
            }
        } catch (error) {
            console.error("Error forwarding WebRTC offer:", error);
        }
    });

    // WebRTC answer
    socket.on("webrtc_answer", ({ callId, answer, receiverId } = {}) => {
        try {
            if (!callId || !answer || !receiverId || !socket.userId) return;

            const receiverSocketId = onlineUsers.get(String(receiverId));

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("webrtc_answer", {
                    callId,
                    answer,
                    senderId: socket.userId
                });
            } else {
                console.log(`server: Receiver ${receiverId} not found for answer`);
            }
        } catch (error) {
            console.error("Error forwarding WebRTC answer:", error);
        }
    });

    // WebRTC ICE candidate
    socket.on("webrtc_ice_candidate", ({ callId, candidate, receiverId } = {}) => {
        try {
            if (!callId || !candidate || !receiverId || !socket.userId) return;

            const receiverSocketId = onlineUsers.get(String(receiverId));

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("webrtc_ice_candidate", {
                    callId,
                    candidate,
                    senderId: socket.userId
                });
            } else {
                console.log(`server: Receiver ${receiverId} not found for ICE candidate`);
            }
        } catch (error) {
            console.error("Error forwarding ICE candidate:", error);
        }
    });
};

module.exports = { handleVideoCallEvent };
