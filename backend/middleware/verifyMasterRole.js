const supabase = require('../lib/supabase');

const verifyMasterRole = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    // Busca o perfil do usuário na tabela pública
    const { data: profile, error } = await supabase
      .from('consultants')
      .select('role')
      .eq('auth_id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'Perfil de consultor não encontrado' });
    }

    if (profile.role !== 'admin') {
      console.warn(`Acesso negado: Usuário ${req.user.id} tentou acessar rota admin.`);
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    next();

  } catch (err) {
    console.error('Erro na verificação de role:', err);
    return res.status(500).json({ error: 'Erro interno na verificação de permissões' });
  }
};

module.exports = verifyMasterRole;