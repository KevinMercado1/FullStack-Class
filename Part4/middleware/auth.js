const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'jwt must be provided' });
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ error: 'jwt must be provided' });
    }

    // Asignar el usuario al request
    req.user = await User.findById(decodedToken.id); // Usar await aquí
    if (!req.user) {
      return res.status(401).json({ error: 'user not found' });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = { tokenExtractor, userExtractor };
