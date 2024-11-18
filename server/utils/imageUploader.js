const cloudinary = require('cloudinary').v2

exports.uploadImageToCloudinary  = async (file, folder, height, quality) => {
    const options = {folder,resource_type : "auto"};
    if(height) {
        options.height = height;
    }
    if(quality) {
        options.quality = quality;
    }

    console.log("Image kaa Path" , file.tempFilePath,)
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}