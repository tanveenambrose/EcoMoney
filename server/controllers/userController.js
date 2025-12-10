const UserModel = require('../modules/userModel');
const cloudinary = require('cloudinary').v2;
// Import bcrypt for password hashing and comparison
const bcrypt = require('bcryptjs');
// Import transporter for sending emails (ensure ../config/nodemailer exists based on your authController context)
const transporter = require('../config/nodemailer');


// 1. Get Logged In User Data
const getUserData = async (req, res) => {
    try {
        const { userId } = req.body; 
        
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Calculate Balance on the fly
        const calculatedBalance = (user.totalEarnings || 0) - ((user.totalSpending || 0) + (user.totalSavings || 0));

        res.json({
            success: true,
            userData: {
                userId: user._id,
                name: user.name,
                phoneNo: user.phoneNo,
                email: user.email,
                image: user.image,
                isAccountVerified: user.isAccountVerified,
                // Financials
                totalEarnings: user.totalEarnings,
                totalSpending: user.totalSpending,
                totalSavings: user.totalSavings,
                totalBalance: calculatedBalance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// 2. Update Profile (Text + Image + Financials)
const updateUserProfile = async (req, res) => {
    try {
        const { userId, name, phoneNo, totalEarnings, totalSpending, totalSavings } = req.body;
        const imageFile = req.file;

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

        // Update Financials (if provided)
        if (totalEarnings !== undefined) user.totalEarnings = Number(totalEarnings);
        if (totalSpending !== undefined) user.totalSpending = Number(totalSpending);
        if (totalSavings !== undefined) user.totalSavings = Number(totalSavings);

        // Update Image
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                    resource_type: 'image'
                });
                user.image = imageUpload.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary Error:", uploadError);
                return res.status(500).json({ message: 'Image upload failed', error: uploadError.message });
            }
        }

        await user.save();

        // Calculate new balance for response
        const newBalance = (user.totalEarnings || 0) - ((user.totalSpending || 0) + (user.totalSavings || 0));

        res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            userData: {
                name: user.name,
                phoneNo: user.phoneNo,
                email: user.email,
                image: user.image,
                totalEarnings: user.totalEarnings,
                totalSpending: user.totalSpending,
                totalSavings: user.totalSavings,
                totalBalance: newBalance
            }
        });

    } catch (error) {
        console.error("Update Controller Error:", error);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// 3. Change Password Controller (NEW)
const changePassword = async (req, res) => {
    try {
        // userId is injected by userMiddleware
        const { userId, currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // 1. Verify that currentPassword matches the DB password hash
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'The current password you entered is incorrect.' });
        }

        // 2. Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Update user password in DB
        user.password = hashedPassword;
        await user.save();

        // 4. Send Email Notification with the new password
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: 'Security Alert: Your Password changed successfully',
                text: `Dear ${user.name},\n\nYour password has been successfully changed.\n\nThe new password is: ${newPassword}\n\nIf you did not perform this action, please secure your account immediately.`
            };
            // We don't await this so the response is faster, email sends in background
            transporter.sendMail(mailOptions).catch(err => console.error("Email send failed", err));
            
        } catch (emailError) {
            console.error("Password change email error:", emailError);
            // We still return success to frontend because the password WAS changed, just email failed.
        }

        res.json({ success: true, message: 'Password changed successfully' });

    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: error.message });
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
    getUserData,
    changePassword // <-- Export the new controller
};