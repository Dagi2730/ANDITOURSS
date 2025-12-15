// backend/utils/generateToken.js

import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    // The id is the user's MongoDB ID
    // process.env.JWT_SECRET is the key we added to your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token is valid for 30 days
    });
};

export default generateToken;