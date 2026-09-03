const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
});

const portfolioUpload = upload.fields([
    {
        name: "coverImage",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 20,
    },
]);

const photosUpload = upload.array("photos", 100);

module.exports = { portfolioUpload, photosUpload };