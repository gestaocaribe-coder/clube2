const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const supabase = require('../lib/supabase');

// GET /auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('consultants')
      .select('*')
      .eq('auth_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      user: req.user,
      profile: profile
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

module.exports = router;