const multer=require('multer')
const cloudinary=require('cloudinary').v2
const dotenv=require('dotenv')
const fs=require('fs');
const { promises, resolve } = require('dns');
const { error } = require('console');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadFileToCloudinary=(file)=>{
    const options={
        resource_type:file.mimetype.startWith('video')?'video':'image',
    }
    return new Promise((resolve,reject)=>{
        const uploder=file.mimetype.startWith('video')?cloudinary.uploader.upload_large:cloudinary.uploader.upload;
        uploder(file.path, options, (error,result)=>{
            fs.unlink(file.path,()=>{})
            if(error){
                return reject(error)
            }
            resolve(result)
        })
    })
}

const multerMiddleware = multer({dest:'uploads/'}).single('media');

module.exports={
    uploadFileToCloudinary,
    multerMiddleware
}