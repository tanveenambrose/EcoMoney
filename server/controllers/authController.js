const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../modules/userModel');
const transporter = require('../config/nodemailer');

// User Registration Controller
const signUp = async (req, res) => {
    const { name, phoneNo, email, password } = req.body;
    
    if (!name || !phoneNo || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        const existingPhone = await UserModel.findOne({ phoneNo });
        if (existingPhone) {
            return res.status(409).json({ message: 'Phone number already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new UserModel({
            name,
            email,
            password: hashedPassword,
            phoneNo
        })
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        // Send Welcome Email
        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to EcoMoney!',
                text:`Dear ${user.name},\n\nWelcome to EcoMoney!`
            }
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        res.status(201).json({ message: 'User registered successfully', userId: user._id });

    } catch (err) {
        console.error("SignUp Error:", err); 
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// User Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findOne({email});
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ message: 'Login successful', userId: user._id });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Send Verification OTP
const sendVerificationOtp = async (req, res) => {
    try {
        // userId comes from userMiddleware (req.body.userId) 
        const { userId } = req.body; 

        if(!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await UserModel.findById(userId); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if(user.isAccountVerified){
            return res.status(400).json({message: 'Account already verified' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; 

        await user.save();
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text:`Dear ${user.name},\n\nYour OTP is: ${otp}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification OTP sent to your email' });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Verify Account
const verifyAccount = async (req, res) => {
    const {userId, otp} = req.body;
    
    if(!userId || !otp){
        return res.status(400).json({message: 'User ID and OTP are required' });
    }

    try {
        const user = await UserModel.findById(userId); 
        
        if(!user){
            return res.status(404).json({message: 'User not found' });
        }

        if(user.verifyOtp !== otp || user.verifyOtp === '' ){
            return res.status(400).json({message: 'Invalid OTP' });
        }

        if(Date.now() > user.verifyOtpExpireAt){
            return res.status(400).json({message: 'OTP has expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        res.status(200).json({message: 'Account verified successfully' });

    } catch (err) { 
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Send Reset Password OTP
const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 1 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Password Reset OTP',
            text:`Dear ${user.name},\n\nYour OTP is: ${otp}`
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if(!email || !otp || !newPassword){
        return res.status(400).json({message: 'Email, OTP and new password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        if(!user){
            return res.status(404).json({message: 'User not found' });
        }
        if(user.resetOtp !== otp || user.resetOtp === ''){
            return res.status(400).json({message: 'Invalid OTP' });
        }
        if(Date.now() > user.resetOtpExpiredAt){
            return res.status(400).json({message: 'OTP has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        await user.save();
        res.status(200).json({message: 'Password reset successful' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// --- UPDATED: Manual Check (No 401 Errors) ---
const isAuthenticated = async (req, res) => {
    try {
        // Manually check token here instead of using userMiddleware
        // This prevents 401 errors showing up in the browser console for guests
        const { token } = req.cookies;

        if (!token) {
            return res.json({ success: false });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.userId) {
                return res.json({ success: true });
            }
        } catch (e) {
            return res.json({ success: false });
        }
        
        return res.json({ success: false });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

module.exports = {
    signUp,
    login,
    logout,
    sendVerificationOtp,
    verifyAccount,
    sendResetPasswordOtp,
    resetPassword,
    isAuthenticated
}