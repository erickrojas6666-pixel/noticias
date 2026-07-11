// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN - JWT
// =====================================================
// Este middleware protege las rutas verificando que el usuario
// esté autenticado mediante un token JWT válido.
// =====================================================

// Importación de dependencias
import jwt from 'jsonwebtoken';      // Librería para verificar y decodificar tokens JWT
import User from '../models/User.js'; // Modelo de Usuario para consultar la base de datos

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y que el usuario exista en la base de datos
 * 
 * @param {Object} req - Objeto de solicitud HTTP
 * @param {Object} res - Objeto de respuesta HTTP
 * @param {Function} next - Función para pasar al siguiente middleware
 * 
 * @returns {Object} - Respuesta HTTP con error o pasa al siguiente middleware
 */
export const protect = async (req, res, next) => {
  // =============================================
  // 1. Extraer el token del header Authorization
  // =============================================
  // El token debe enviarse en el header de la siguiente forma:
  // Authorization: Bearer <token_jwt>
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Si el header existe y comienza con 'Bearer', extraemos el token
    // Ejemplo: "Bearer eyJhbGciOiJIUzI1NiIs..." -> "eyJhbGciOiJIUzI1NiIs..."
    token = req.headers.authorization.split(' ')[1];
  }

  // =============================================
  // 2. Verificar que el token existe
  // =============================================
  // Si no hay token, el usuario no está autenticado
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado - Token no proporcionado' 
    });
  }

  // =============================================
  // 3. Verificar y decodificar el token
  // =============================================
  try {
    // 3.1 Verificar la firma del token usando JWT_SECRET
    // Si el token es válido, devuelve los datos decodificados (payload)
    // Si es inválido o expirado, lanza un error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded contiene: { id: usuario_id, email: usuario_email, iat: timestamp, exp: timestamp }

    // 3.2 Buscar al usuario en la base de datos
    // Verificamos que el usuario exista en la base de datos
    const user = await User.findById(decoded.id);
    
    // Si el usuario no existe, el token no es válido
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // 3.3 Adjuntar el usuario al objeto de solicitud
    // Esto permite que los siguientes middlewares/rutas accedan al usuario
    // sin necesidad de consultar la base de datos nuevamente
    // Ejemplo: req.user.id, req.user.email
    req.user = user;

    // 3.4 Pasar al siguiente middleware o ruta
    next();
    
  } catch (error) {
    // =============================================
    // 4. Manejo de errores
    // =============================================
    // Capturamos cualquier error del proceso de verificación
    // Esto incluye:
    // - Token expirado (jwt expired)
    // - Firma inválida (invalid signature)
    // - Token malformado (jwt malformed)
    return res.status(401).json({ 
      success: false, 
      message: 'No autorizado - Token inválido' 
    });
  }
};