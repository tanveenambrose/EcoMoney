// 1. Load env vars FIRST
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db.js');
const connectCloudinary = require('./config/cloudinary');

// Import Routes
const authRoute = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js'); // <--- Import this

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute); // <--- Add this line

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});