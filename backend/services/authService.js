const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

class AuthService {
  static async register(userData) {
    const { name, email, password } = userData;
    
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      name,
      email,
      password: hashedPassword
    });

    await this.sendWelcomeEmail(email, name);
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static async login(email, password) {
    const user = User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  static async sendWelcomeEmail(email, name) {
    console.log(`Email de boas-vindas enviado para ${name} (${email})`);
  }
}

module.exports = AuthService;