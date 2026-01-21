import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { connectDB } from '@/lib/connectDB';
import User from '@/models/User';
import { generateToken } from '@/lib/middleware/auth';
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email';

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, password, firstName, lastName, role = 'user' } = body;
  console.log("body in register",email,firstName,lastName,role);
  
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate verification token
    // const verificationToken = crypto.randomBytes(32).toString('hex');
    // const verificationTokenExpiry = new Date();
    // verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName || null,
      last_name: lastName || null,
      role: role,
      // verification_token: verificationToken,
      // verification_token_expiry: verificationTokenExpiry,
      is_verified: false,
    });

    // Send verification email (non-blocking)
    // sendVerificationEmail({
    //   email: user.email,
    //   firstName: user.first_name,
    //   verificationToken,
    // }).catch((error) => {
    //   console.error('Failed to send verification email:', error);
    // });

    // // Send welcome email (non-blocking)
    // sendWelcomeEmail({
    //   email: user.email,
    //   firstName: user.first_name,
    // }).catch((error) => {
    //   console.error('Failed to send welcome email:', error);
    // });

    // Generate token
    const token = generateToken(user._id.toString(), user.email, user.role);

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    if (!process.env.MONGODB_URL && !process.env.DATABASE_URL) {
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
