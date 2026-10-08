import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Sign JWT token with user payload
 */
export const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

/**
 * Cookie options for HttpOnly security
 */
export const getCookieOptions = () => {
  const isProduction = config.nodeEnv === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  };
};

/**
 * Send token via HttpOnly cookie and JSON response
 */
export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = signToken({
    id: user._id,
    email: user.email,
    name: user.name
  });

  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      streak: user.streak,
      createdAt: user.createdAt
    }
  });
};
