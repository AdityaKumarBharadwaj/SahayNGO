const express = require('express');
const dotenv = require('dotenv');
const app = express();
const connectDB = require('./config/db');
const { connect } = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const ngoRoutes = require('./routes/ngoRoutes');

dotenv.config();
connectDB();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('api/ngoRoutes', ngoRoutes);

app.get('/', (req, res) => {
    console.log("Sahaya app is running");
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});