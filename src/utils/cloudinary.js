// Here we foloow, local server p file aa chuki hai, mai use local server ki path dunga and wo cloudinary p upload kr dunga

// If cloudinary p upload ho chuki hai to use remove v to krna pdega

import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"


// configuration for cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


// ak method bna lete hai, us method ke parameter me local file ka path doge, upload kr dunga and successfully upload ho gya to file ko unlink kr dunga
const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath){
            return null;
        }

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        // Now if file has been successfully get uploaded then
        // console.log("File is Uploaded on cloudinary", response.url)
        // after uploading unlink the file
        fs.unlinkSync(localFilePath);
        return response;

    } catch(error){
        // now itna to pta hai ki file local server p aa chuka hai, but upload nii hua
        // For safe cleaning purpose remove that file
        fs.unlinkSync(localFilePath); // remove the locally saved temprary file as the upload operation got failed
        return null;

    }
}


// export
export {uploadOnCloudinary}

