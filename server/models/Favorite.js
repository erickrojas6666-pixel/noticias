// server/models/Favorite.js
import pool from '../config/database.js';

class Favorite {
  static async findByUser(userId) {
    const result = await pool.query(
      'SELECT noticia_data FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map(row => row.noticia_data);
  }

  static async create(userId, noticia) {
    const result = await pool.query(
      `INSERT INTO favorites (user_id, noticia_url, noticia_data) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [userId, noticia.url, noticia]
    );
    return result.rows[0];
  }

  static async delete(userId, url) {
    const result = await pool.query(
      'DELETE FROM favorites WHERE user_id = $1 AND noticia_url = $2 RETURNING *',
      [userId, url]
    );
    return result.rows[0];
  }

  static async exists(userId, url) {
    const result = await pool.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND noticia_url = $2',
      [userId, url]
    );
    return result.rows.length > 0;
  }
}

export default Favorite;