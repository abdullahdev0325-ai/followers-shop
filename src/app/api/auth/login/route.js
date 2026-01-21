import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {connectDB} from '@/lib/connectDB';
import User from '@/models/User';
import { generateToken } from '@/lib/middleware/auth';
import { logRequest, logResponse } from '@/lib/apiLogger';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    logRequest('/api/auth/login', 'POST', { url: request.url, body });
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }
   
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('_id email password_hash first_name last_name role is_active');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    const responsePayload = {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
        token,
      },
    };
    logResponse('/api/auth/login', 'POST', { status: 200, result: { id: user._id.toString(), email: user.email } });
    return NextResponse.json(responsePayload, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    logResponse('/api/auth/login', 'POST', { status: 500, error: error.message });
    if (!process.env.MONGODB_URI && !process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database connection failed. Please check your MONGODB_URI and ensure the database is running.',
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
