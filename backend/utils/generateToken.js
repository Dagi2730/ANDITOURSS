// backend/utils/generateToken.js

import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'anditours-local-secret', {
    expiresIn: '30d',
  });
};

export default generateToken;