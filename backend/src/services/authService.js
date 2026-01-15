import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

class AuthService {
  /**
   * Register a new user
   */
  async signup({ username, email, password }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw ApiError.badRequest('Email already registered');
      }
      throw ApiError.badRequest('Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user,
      token,
    };
  }

  /**
   * Login user with email and password
   */
  async login({ email, password }) {
    // Find user and include password hash
    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user._id);

    // Remove password hash from response
    user.passwordHash = undefined;

    return {
      user,
      token,
    };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }
}

export default new AuthService();
