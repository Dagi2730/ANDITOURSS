import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'anditours_secure_jwt_secret_key_2026';
  
  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;