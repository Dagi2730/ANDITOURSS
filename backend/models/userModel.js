// backend/models/userModel.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Email must be unique
        },
        password: {
            type: String,
            required: true,
        },
        // Role distinguishes between client (public user) and admin
        role: {
            type: String,
            required: true,
            default: 'client', // Default role for new users
        },
    },
    {
        timestamps: true,
    }
);

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Encrypt password using bcryptjs before saving to the database
userSchema.pre('save', async function (next) {
    // Only hash if the password field is actually being modified
    if (!this.isModified('password')) {
        next(); 
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;