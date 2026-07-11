// =============================================
// Operaciones CRUD para la tabla 'users'
// =============================================

import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  // Crear un nuevo usuario
  // Recibe email y password (en texto plano)
  // Hashea la contraseña y la guarda en la base de datos
  static async create({ email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );
    return result.rows[0];
  }

  // Buscar usuario por email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, email, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Buscar usuario por ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Comparar contraseña con el hash almacenado
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;