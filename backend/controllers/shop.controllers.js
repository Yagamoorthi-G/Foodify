import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
    try {
       const {name, city, state, address} = req.body
       let image;
       
       if(req.file){
        const uploadResult = await uploadOnCloudinary(req.file.path)
        // BUG FIX: Safely extract the URL string from the Cloudinary response object
        image = uploadResult?.secure_url || uploadResult?.url || uploadResult;
       } 
       
       let shop = await Shop.findOne({owner: req.userId})
       
       if(!shop){
        // Create new shop
        shop = await Shop.create({
            name, city, state, address, image, owner: req.userId
        })
       } else {
         // Update existing shop
         const updateData = { name, city, state, address, owner: req.userId };
         
         // BUG FIX: Only update the image field if a NEW image was actually uploaded!
         if (image) {
             updateData.image = image;
         }

         shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true })
       }
      
       await shop.populate("owner items")
       return res.status(201).json(shop)
       
    } catch (error) {
        console.log("Database Save Error:", error); // This will log the exact issue if it ever fails again
        return res.status(500).json({message: `create shop error ${error}`})
    }
}

export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({owner: req.userId}).populate("owner").populate({
            path: "items",
            options: {sort: {updatedAt: -1}}
        })
        if(!shop){
            return null
        }
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message: `get my shop error ${error}`})
    }
}

export const getShopByCity = async (req, res) => {
    try {
        const {city} = req.params

        const shops = await Shop.find({
            city: {$regex: new RegExp(`^${city}$`, "i")}
        }).populate('items')
        if(!shops){
            return res.status(400).json({message: "shops not found"})
        }
        return res.status(200).json(shops)
    } catch (error) {
        return res.status(500).json({message: `get shop by city error ${error}`})
    }
}