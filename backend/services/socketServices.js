const {Server} = require('socket.io')
const User = require("../models/User");
const Message = require('../models/Message');
const { useId } = require('react');

// map to store online users => userId: socketId
const onlineUsers = new Map();

// map to track typing status => userId => [conversation]: boolean
const typingUsers = new Map();

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        },
        pingTimeout: 60000, // 60 seconds //Disconnect if no ping received within 60 seconds
    });


    // when a new socket connection is established
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        let userId=null;

        // handle user connection and mark them as online in DB
        socket.on('user_connected', (id) => {
            userId = id;
            onlineUsers.set(userId, socket.id);
            console.log(`User marked as online: ${userId}`);
        });

        // handle user disconnection and mark them as offline in DB
        socket.on("user-connected", async(connectingUserId) => {
            try {
                userId = connectingUserId;
                onlineUsers.set(userId, socket.id);
                socket.join(userId); // Join a room with the user's ID

                // update user status in the database to online
                await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });

                // notify all users that this user is online
                io.emit("user_status", { userId, isOnline: true });
            } catch (error) {
                console.error('Error handling user connection', error);
            }
        });
        // Return online status of requested users
        socket.on("get_online_status", (requestedUserId, callback) => {
            const isOnline = onlineUsers.has(requestedUserId);
            callback({ userId: requestedUserId, isOnline, lastSeen: isOnline ? new Date() : null });
        });

        // forward message to receiver if they are online
        socket.on("send_message", async (message) => {
            try {
                const receiverSocketId = onlineUsers.get(message.receiver?._id);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                }          
            } catch (error) {
                console.error('Error sending message', error);
                socket.emit("message_error", { error: "Failed to send message" });
            }
        });

        // update message as read and notify sender if they are online
        socket.on("message_read", async ({messageIds, senderId}) => {
            try {
                // update message status in the database
                await Message.updateMany(
                    { _id: { $in: messageIds }},
                    { $set: { messageStatus: "read" } }
                );
                const senderSocketId = onlineUsers.get(senderId);
                if (senderSocketId) {
                    messageIds.forEach(messageId => {
                        io.to(senderSocketId).emit("message_status_update", { messageId, messageStatus: "read" });
                    });
                }
            } catch (error) {
                console.error('Error updating message read status', error);
            }
        });

        //handle typing start event and auto stop after 3s
        socket.on("typing_start", ({ conversationId, receiverId }) => {
            if(!userId || !conversationId || !receiverId) return; 
            if (!typingUsers.has(userId)) {
                typingUsers.set(userId, {});
            }

            const userTyping = typingUsers.get(userId);
            userTyping[conversationId] = true;

            //clear existing timeout if user is still typing
            if (userTyping[`${conversationId}_timeout`]) {
                clearTimeout(userTyping[`${conversationId}_timeout`]);
            } 

            // auto stop typing after 3 seconds of inactivity
            userTyping[`${conversationId}_timeout`] = setTimeout(() => {
                userTyping[conversationId] = false;
                socket.to(receiverId).emit("user_typing", { userId, conversationId, isTyping: false });
            }, 3000);

            // notify the receiver that the user is typing
            socket.to(receiverId).emit("user_typing", { userId, conversationId, isTyping: true });
        });
        // handle typing stop event
        socket.on("typing_stop", ({conversationId, receiverId}) => {
            if(!userId || !conversationId || !receiverId) return; 
            if (typingUsers.has(userId)) {
                const userTyping = typingUsers.get(userId);
                userTyping[conversationId] = false;

                if (userTyping[`${conversationId}_timeout`]) {
                    clearTimeout(userTyping[`${conversationId}_timeout`]);
                    delete userTyping[`${conversationId}_timeout`];
                }
            }
            socket.to(receiverId).emit("user_typing", { userId, conversationId, isTyping: false });
        });

        // add or update reaction to a message and notify the receiver if they are online 
        socket.on("add_reaction", async ({ messageId, emoji, userId, reactionUserId })=>{
            try {
                const message = await Message.findById(messageId);
                if(!message) return;

                const exitingIndex= message.reactions.findIndex(
                    (r)=> r.user.toString()=== reactionUserId
                )
                if(exitingIndex > -1){
                    const exiting=message.reactions(exitingIndex)
                    if(exiting.emoji===emoji){
                        // remove same reaction
                        message.reactions.splice(exitingIndex, 1)
                    }else{
                        message.reactions[exitingIndex].emoji=emoji
                    }
                }else{
                    // add new reactions 
                    message.reactions.push({user:reactionUserId, emoji})
                }
                await message.save();
                const populatedMessage=await Message.findOne(message?._id)
                    .populate("sender","username profilePicture")
                    .populate("receiver","username profilePicture")
                    .populate("reactions.user","username")

                    const reactionUpdated = {
                        messageId,
                        reactions:populatedMessage.reactions
                    }

                    const senderSocket=onlineUsers.get(populatedMessage._id.toString());
                    const receiverSocket= onlineUsers.get(populatedMessage.receiver?._id.toString())

                    if(senderSocket) io.to(senderSocket).emit("reaction_update", reactionUpdated)
                    if(receiverSocket) io.to(receiverSocket).emit("reaction_update", reactionUpdated)
                } catch (error){
                    console.log("Error handling reaction", error)
            }    
        })


    // handle disconnections and mark user offline 
    const handleDisconnected= async()=>{
        if(!userId) return;
        try {
            onlineUsers.delete(userId);
            // clear all typing timeouts
            if(typingUsers.has(userId)){
                const userTyping= typingUsers.get(userId)
                Object.keys(userTyping).forEach((key)=>{
                    if(key.endsWith('_timeout')) clearTimeout(userTyping[key])
                })
                typingUsers.delete(userId)
            }
            await User.findByIdAndUpdate(userId,{
                isOnline:false,
                lastSeen:new Date(),

            })
            io.emit("user_status",{
                userId,
                isOnline:false,
                lastSeen:new Date(),
            })

            socket.leave(useId),
            console.log(`user ${userId} disconnected`)
        } catch (error) {
            console.error("Error handling Disconnection",error)
        }
    }
    // disconnect event
    socket.on("disconnect",handleDisconnected)
    });
    // attach the online user map to the coket server for external user
    io.socketUserMap= onlineUsers

    return io;
};
module.exports=initializeSocket