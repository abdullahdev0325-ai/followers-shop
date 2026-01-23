import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;
const DEBUG = process.env.NODE_ENV !== 'production';

/**
 * Verify JWT token and return decoded payload
 * Used by middleware for route protection
 * 
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded token payload or null if invalid/expired
 * 
 * Protected Route Information:
 * - /admin/* → requires role: 'admin'
 * - /order/* → requires role: 'user'
 * - /checkout/* → requires role: 'user'
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (DEBUG) {
      console.log('🔐 [VerifyToken] ✅ Token verified successfully');
      console.log(`   └─ User ID: ${decoded.userId}`);
      console.log(`   └─ Role: ${decoded.role}`);
      console.log(`   └─ Email: ${decoded.email}`);
    }
    return decoded;
  } catch (err) {
    if (DEBUG) {
      if (err.name === 'TokenExpiredError') {
        console.log('🔐 [VerifyToken] ❌ Token expired');
      } else if (err.name === 'JsonWebTokenError') {
        console.log('🔐 [VerifyToken] ❌ Invalid token');
      } else {
        console.log('🔐 [VerifyToken] ❌ Token verification failed:', err.message);
      }
    }
    return null;
  }
}
