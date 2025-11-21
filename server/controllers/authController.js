const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../modules/userModel');
const transporter = require('../utils/emailTransporter');

// User Registration Cotroller
const register = async (req, res) => {
    const { name, phoneNo, email, password } = req.body;
    //check if all fields are provided 
    if (!name || !phoneNo || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    //if all are provided
    try {
        //email must be unique
        const existingUser = await UserModel.findOne({ email });
        //if email already exists
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        //if user is new, hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //create new user
        const user = new UserModel({
            name,
            phoneNo,
            email,
            password: hashedPassword
        })
        await user.save();

        //generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        //send response with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days 
        });

        //send welcome email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to EcoMoney!',
            text:`Dear ${user.name},\n\nWelcome to EcoMoney! We're thrilled to have you on board. Start exploring our features and manage your finances effectively.\n\nBest regards,\nThe EcoMoney Team`
        }

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User registered successfully', userId: user._id });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// User Login Cotroller
const login = async (req, res) => {
    const { email, password } = req.body;
    //check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    //if all are provided
    try {
        const user = await UserModel.findOne({email});
        //if user not found
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        //generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        //send response with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(200).json({ message: 'Login successful', userId: user._id });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// User Logout Controller
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


//Send Verification OTP Controller
const sendVerificationOtp = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await UserModel.findById(userId);

        if(user.isAccountVerified){
            return res.status(400).json({message: 'Account already verified' });
        }

        //generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours 

        await user.save();
        
        //send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text:`Dear ${user.name},\n\nYour OTP for account verification is: ${otp}. It is valid for 24 hours.\n\nBest regards,\nThe EcoMoney Team`
        };


        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification OTP sent to your email' });

    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


//Verify Account using OTP Controller
const verifyAccount = async (req, res) => {
    const {userId, otp} = req.body;
    //validate input
    if(!userId || !otp){
        return res.status(400).json({message: 'User ID and OTP are required' });
    }

    try {
        const user = await userModel.findById(userId);
        //check if user exists
        if(!user){
            return res.status(404).json({message: 'User not found' });
        }

        //check if otp is not right and expired
        if(user.verifyOtp !== otp || user.verifyOtp === '' ){
            return res.status(400).json({message: 'Invalid OTP' });
        }

        //check if otp is expired
        if(Date.now() > user.verifyOtpExpireAt){
            return res.status(400).json({message: 'OTP has expired' });
        }

        //mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        res.status(200).json({message: 'Account verified successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// send reset password OTP controller
const sendResetPasswordOtp = async (req, res) => {
    const { email } = req.body;

    //check is email is provided
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        // if user not found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        //generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        await user.save();

        //send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Your Password Reset OTP',
            text:`Dear ${user.name},\n\nYour OTP for password reset is: ${otp}. It is valid for 1 hour.\n\nBest regards,\nThe EcoMoney Team`
        }

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset OTP sent to your email' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};


//reset password controller
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    //validate input
    if(!email || !otp || !newPassword){
        return res.status(400).json({message: 'Email, OTP and new password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });
        //check if user exists
        if(!user){
            return res.status(404).json({message: 'User not found' });
        }
        //check if otp is valid
        if(user.resetOtp !== otp || user.resetOtp === ''){
            return res.status(400).json({message: 'Invalid OTP' });
        }
        //check if otp is expired
        if(Date.now() > user.resetOtpExpiredAt){
            return res.status(400).json({message: 'OTP has expired' });
        }

        //hash new password
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


module.exports = {
    register,
    login,
    logout,
    sendVerificationOtp,
    verifyAccount,
    sendResetPasswordOtp,
    resetPassword
}