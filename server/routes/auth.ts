import { RequestHandler } from "express";
import { AuthResponse, LoginRequest, RegisterRequest, User, ErrorResponse } from "@shared/api";

// In-memory storage for demo (replace with MongoDB in production)
let users: User[] = [];
let nextUserId = 1;

const generateToken = (userId: string) => {
  // Simple token generation for demo (use proper JWT in production)
  return `token_${userId}_${Date.now()}`;
};

export const handleRegister: RequestHandler<{}, AuthResponse | ErrorResponse, RegisterRequest> = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({
        error: "USER_EXISTS",
        message: "User with this email already exists"
      });
    }

    // Create new user
    const newUser: User = {
      id: nextUserId.toString(),
      name,
      email,
      password, // In production: hash with bcrypt
      createdAt: new Date(),
      updatedAt: new Date()
    };

    users.push(newUser);
    nextUserId++;

    // Generate tokens
    const accessToken = generateToken(newUser.id);
    const refreshToken = generateToken(newUser.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleLogin: RequestHandler<{}, AuthResponse | ErrorResponse, LoginRequest> = (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) { // In production: compare with bcrypt
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: "Invalid email or password"
      });
    }

    // Generate tokens
    const accessToken = generateToken(user.id);
    const refreshToken = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};

export const handleMe: RequestHandler<{}, Omit<User, 'password'> | ErrorResponse> = (req, res) => {
  try {
    // Simple auth check for demo (use proper JWT verification in production)
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "No valid token provided"
      });
    }

    const token = authHeader.substring(7);
    const userId = token.split('_')[1];
    
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid token"
      });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Internal server error"
    });
  }
};
