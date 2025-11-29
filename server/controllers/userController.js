const UserModel = require('../modules/userModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs'); // Import FS to delete temp files

// 1. Get Logged In User Data
const getUserData = async (req, res) => {
    try {
        const { userId } = req.body; // Injected by userMiddleware
        
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                userId: user._id,
                name: user.name,
                phoneNo: user.phoneNo,
                email: user.email,
                image: user.image,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 2. Update Profile (Name, Phone, Image)
const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phoneNo } = req.body;
        const imageFile = req.file; // From Multer

        console.log("Update Request Received for User:", userId);
        console.log("Data:", { name, phoneNo });
        if(imageFile) console.log("Image File:", imageFile.path);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update Text Fields
        if (name) user.name = name;
        if (phoneNo) user.phoneNo = phoneNo;

        // Update Image if provided
        if (imageFile) {
            try {
                // Upload to Cloudinary
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                    resource_type: 'image'
                });
                
                console.log("Cloudinary Upload Success. URL:", imageUpload.secure_url);
                user.image = imageUpload.secure_url;

                // Optional: Delete the local temp file after upload
                // fs.unlinkSync(imageFile.path); 

            } catch (uploadError) {
                console.error("Cloudinary Error:", uploadError);
                return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
            }
        }

        await user.save();

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            userData: {
                name: user.name,
                phoneNo: user.phoneNo,
                email: user.email,
                image: user.image
            }
        });

    } catch (error) {
        console.error("Update Controller Error:", error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// ... Admin functions ...
const getUser = async (req, res) => { try { const users = await UserModel.find(); res.status(200).json(users); } catch (error) { res.status(500).json({ message: error.message }); } };
const createUser = async (req, res) => { try { const user = new UserModel(req.body); const savedUser = await user.save(); res.status(201).json(savedUser); } catch (error) { res.status(400).json({ message: error.message }); } };
const updateUser = async (req, res) => { try { const { id } = req.params; const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true }); if (!updatedUser) { return res.status(404).json({ message: 'User not found' }); } res.status(200).json(updatedUser); } catch (error) { res.status(400).json({ message: error.message }); } };
const deleteUser = async (req, res) => { try { const { id } = req.params; const deletedUser = await UserModel.findByIdAndDelete(id); if (!deletedUser) { return res.status(404).json({ message: 'User not found' }); } res.status(200).json({ message: 'User deleted successfully' }); } catch (error) { res.status(500).json({ message: error.message }); } };

module.exports = {
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile,
    getUserData 
};