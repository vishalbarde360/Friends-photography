const Photo = require("../models/photo.model");
const Event = require("../models/event.model");
const Album = require("../models/album.model");
const { uploadFile, deleteFile } = require("../services/cloudinary");

const uploadPhotos = async (req, res) => {
    try {
        const { eventId, albumId } = req.body;
        if (!eventId || !albumId) return res.status(400).json({ success:false,message:"eventId and albumId are required" });
        if (!req.files?.length) return res.status(400).json({ success:false,message:"At least one photo is required" });
        if (!await Event.findById(eventId)) return res.status(404).json({success:false,message:"Event not found"});
        const album=await Album.findById(albumId); if(!album)return res.status(404).json({success:false,message:"Album not found"});
        if(album.eventId.toString()!==eventId.toString())return res.status(400).json({success:false,message:"Album does not belong to this event"});
        const uploaded=await Promise.all(req.files.map(f=>uploadFile(f,"friends-photography/events")));
        const photos=await Photo.insertMany(uploaded.map((r,i)=>({eventId,albumId,cloudinaryPublicId:r.public_id,imageUrl:r.secure_url,thumbnailUrl:r.secure_url,originalFilename:req.files[i].originalname})));
        return res.status(201).json({success:true,message:"Photos uploaded successfully",count:photos.length,data:photos});
    }catch(error){return res.status(500).json({success:false,message:error.message});}
};
const getAllPhotos=async(req,res)=>{try{const photos=await Photo.find().sort({createdAt:-1});return res.status(200).json({success:true,count:photos.length,data:photos});}catch(error){return res.status(500).json({success:false,message:error.message});}};
const getPhotoById=async(req,res)=>{try{const photo=await Photo.findById(req.params.id);if(!photo)return res.status(404).json({success:false,message:"Photo not found"});return res.status(200).json({success:true,data:photo});}catch(error){return res.status(500).json({success:false,message:error.message});}};
const deletePhoto=async(req,res)=>{try{const photo=await Photo.findByIdAndDelete(req.params.id);if(!photo)return res.status(404).json({success:false,message:"Photo not found"});if(photo.cloudinaryPublicId)await deleteFile(photo.cloudinaryPublicId).catch(()=>{});return res.status(200).json({success:true,message:"Photo deleted successfully",data:photo});}catch(error){return res.status(500).json({success:false,message:error.message});}};
module.exports={uploadPhotos,getAllPhotos,getPhotoById,deletePhoto};
