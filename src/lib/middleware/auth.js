import jwt from 'jsonwebtoken';
import { connectDB } from '../connectDB';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * Verify JWT token and return decoded user data
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Get token from request headers
 */
export function getTokenFromRequest(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Middleware to authenticate requests
 * Returns user object if authenticated, null otherwise
 */
export async function authenticateRequest(request) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Connect to database
    await connectDB();

    // Verify user exists and is active
    const user = await User.findById(decoded.userId).select('_id email first_name last_name role is_active');

    if (!user || !user.is_active) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Middleware to require authentication
 * Returns user object or throws error
 */
export async function requireAuth(request) {
  const user = await authenticateRequest(request);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

/**
 * Middleware to require specific role
 */
export async function requireRole(request, allowedRoles) {
  const user = await requireAuth(request);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  return user;
}

/**
 * Generate JWT token for user
 */
export function generateToken(userId, email, role) {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
