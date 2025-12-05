const supabase = require('../lib/supabase');

const verifyMasterRole = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { data: profile, error } = await supabase
      .from('consultants')
      .select('role')
      .eq('auth_id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    if (profile.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    next();

  } catch (err) {
    console.error('Role verification failed:', err);
    return res.status(500).json({ error: 'Internal permission error' });
  }
};

module.exports = verifyMasterRole;