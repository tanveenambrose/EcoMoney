// 1. Load env vars FIRST before importing anything else
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// 2. Now import your local files (which depend on env vars)
const connectDB = require('./config/db.js');
const authRoute = require('./routes/authRoute.js');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;
connectDB();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});