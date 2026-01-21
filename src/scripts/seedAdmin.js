import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Handle ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
const envPath = resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Import User model
import User from '../models/User.js';

const MONGO_URI = process.env.DATABASE_URL;

async function seedAdmin() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_USER });
    
    if (adminExists) {
      console.log('⚠️  Admin user already exists:', process.env.ADMIN_USER);
      if (adminExists.role !== 'admin') {
        adminExists.role = 'admin';
        await adminExists.save();
        console.log('✅ Updated role to admin');
      }
      await mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10);

    // Create admin user
    const admin = await User.create({
      email: process.env.ADMIN_USER,
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      is_active: true,
      is_verified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔐 Password:', process.env.ADMIN_PASS);
    console.log('\n🔗 Login at: http://localhost:3000/auth/login');

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
