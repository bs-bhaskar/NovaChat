const {uploadFileToCloudinary}= require("../config/cloudinaryConfig");
const Status = require("../models/Status");
const response = require('../utils/responseHandler')
const Message = require('../models/Message');

exports.createStatus=async (req,res)=>{
    try {
        const { content, contentType}=req.body;
        const userId=req.user.userId;
        const file=req.file

        let mediaUrl=null;
        let finalContentType=contentType||'text';

        // handle file upload if file is present
        if(file){
            const uploadFile= await uploadFileToCloudinary(file);

            if(!uploadFile?.secure_url){
                return response(res,400,"Failed to upload Media")
            };
            mediaUrl=uploadFile?.secure_url;

            if(file.mimetype.startWith('image')){
                finalContentType="image"
            }
            else if(file.mimetype.startWith('video')){
                finalContentType="video"
            }
            else{
                return response(res, 400, 'unsupported file type')
            }
        }
        else if(content?.trim()){
            finalContentType='text';
        }
        else{
            return response(res, 400, 'message content is required')
        }

        const expiresAt = new Date(); // Set expiration time to 24 hours from now
        expiresAt.setHours(expiresAt.getHours() + 24); // Set the time to 23:59:59.999

        const status= new Status({
            user:userId,
            content:mediaUrl || content,
            contentType:finalContentType,
            imageOrVideoUrl:mediaUrl,
            expiresAt
        });

        await status.save();

        const populatedStatus=await Status.findOne(status._id)
        .populate("user","username profilePicture")
        .populate("viewers","username profilePicture")

        return response(res, 201, "status created successfully", populatedStatus);
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}
exports.getStatuses=async(req,res)=>{
    try {
        const statuses=await Status.find({
            expiresAt: { $gt: new Date() } // Filter statuses that have not expired
        }).populate("user","username profilePicture")
        .populate("viewers","username profilePicture")
        .sort({createdAt:-1})
        return response(res, 200, "statuses retrieved successfully", statuses);
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}    

exports.viewStatus=async(req,res)=>{
    const {statusId}=req.params;
    const userId=req.user.userId;
    try {
        const status=await Status.findById(statusId)
        if(!status){
            return response(res,404,"status not found")
        }
        if(status.viewers.includes(userId)){
            status.viewers.push(userId)
            await status.save()

            const updatedStatus=await Status.findById(statusId)
            .populate("user","username profilePicture")
            .populate("viewers","username profilePicture")
        }
        else{
            console.log("user has already viewed this status")
        }
        return response(res, 200, "status viewed successfully");
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}    

exports.deleteStatus=async(req,res)=>{
    const {statusId}=req.params;
    const userId=req.user.userId;
    try {
        const status=await Status.findById(statusId)
        if(!status){
            return response(res,404,"status not found")
        }
        if(status.user.toString()!==userId){
            return response(res,403,"you are not the owner of this status")
        }
        await status.deleteOne()
        return response(res, 200, "status deleted successfully");
    } catch (error) {
        console.error(error);
        return response(res,500,'Internal server error')
    }
}     