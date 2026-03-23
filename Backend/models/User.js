const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxlength: [50, "Name cannot be more than 50 characters"]
        },

        email: {
            type: String,
            required: [true, "Please provide your email"],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },

        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false,
        },

        role: {
            type: String,
            enum: ['donor', 'ngo', 'admin'],
            default: 'donor'
        },

        phone: {
            type: String,
            required:[ true, 'Please provide phone number'],
            match: [/^[0-9]{10}$/, 'Please provide valid 10-digit phone number']
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema)
module.exports = User;