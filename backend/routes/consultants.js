const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyMasterRole = require('../middleware/verifyMasterRole');
const supabase = require('../lib/supabase');

// Apply protection to all routes in this router
router.use(verifyToken);
router.use(verifyMasterRole);

// GET /consultants/all
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Error fetching consultants:', err);
    res.status(500).json({ error: 'Failed to fetch consultants' });
  }
});

// Helper for recursive tree building
async function buildTree(consultantId) {
  const { data: current, error } = await supabase
    .from('consultants')
    .select('id, name, role, status, email')
    .eq('id', consultantId)
    .single();

  if (error || !current) return null;

  const { data: children } = await supabase
    .from('consultants')
    .select('id')
    .eq('parent_id', consultantId);

  const childrenNodes = [];
  
  if (children && children.length > 0) {
    for (const child of children) {
      const childNode = await buildTree(child.id);
      if (childNode) {
        childrenNodes.push(childNode);
      }
    }
  }

  return {
    ...current,
    children: childrenNodes
  };
}

// GET /consultants/tree/:id
router.get('/tree/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tree = await buildTree(id);

    if (!tree) {
      return res.status(404).json({ error: 'Root consultant not found' });
    }

    res.json(tree);
  } catch (err) {
    console.error('Error building tree:', err);
    res.status(500).json({ error: 'Failed to build referral tree' });
  }
});

module.exports = router;