const supabase = require('../lib/supabase');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Formato de token inválido' });
    }

    // Valida o token diretamente com o Supabase Auth
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }

    // Anexa o usuário validado à requisição
    req.user = user;
    next();

  } catch (err) {
    console.error('Erro na verificação de token:', err);
    return res.status(500).json({ error: 'Erro interno de autenticação' });
  }
};

module.exports = verifyToken;