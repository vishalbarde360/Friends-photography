const Album = require("../models/album.model");
const Event = require("../models/event.model");

const createAlbum = async (req, res) => {
    try {
        const { eventId, name, description } = req.body;
        if (!eventId || !name) return res.status(400).json({ success: false, message: "eventId and name are required" });
        if (!await Event.findById(eventId)) return res.status(404).json({ success: false, message: "Event not found" });
        const album = await Album.create({ eventId, name, description });
        return res.status(201).json({ success: true, message: "Album created successfully", data: album });
    } catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
const getAllAlbums = async (req, res) => {
    try { const albums = await Album.find().populate("eventId", "title eventDate").sort({ createdAt: -1 }); return res.status(200).json({ success: true, count: albums.length, data: albums }); }
    catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
const getEventAlbums = async (req, res) => {
    try { const albums = await Album.find({ eventId: req.params.eventId }).sort({ createdAt: 1 }); return res.status(200).json({ success: true, count: albums.length, data: albums }); }
    catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
const getAlbumById = async (req, res) => {
    try { const album = await Album.findById(req.params.id); if (!album) return res.status(404).json({ success: false, message: "Album not found" }); return res.status(200).json({ success: true, data: album }); }
    catch (error) { return res.status(500).json({ success: false, message: error.message }); }
};
const updateAlbum = async (req, res) => {
    try { const updates = {}; ["name", "description"].forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; }); if (req.body.eventId) { if (!await Event.findById(req.body.eventId)) return res.status(404).json({ success:false,message:"Event not found" }); updates.eventId=req.body.eventId; } const album = await Album.findByIdAndUpdate(req.params.id, updates, {new:true,runValidators:true}); if(!album) return res.status(404).json({success:false,message:"Album not found"}); return res.status(200).json({success:true,message:"Album updated successfully",data:album}); }
    catch(error){return res.status(500).json({success:false,message:error.message});}
};
const deleteAlbum = async (req,res)=>{ try{const album=await Album.findByIdAndDelete(req.params.id);if(!album)return res.status(404).json({success:false,message:"Album not found"});return res.status(200).json({success:true,message:"Album deleted successfully",data:album});}catch(error){return res.status(500).json({success:false,message:error.message});}};
module.exports={createAlbum,getAllAlbums,getEventAlbums,getAlbumById,updateAlbum,deleteAlbum};
