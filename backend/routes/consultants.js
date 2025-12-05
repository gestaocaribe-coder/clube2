const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const verifyMasterRole = require('../middleware/verifyMasterRole');
const supabase = require('../lib/supabase');

// Middleware Global da Rota: Apenas Admin pode acessar qualquer rota aqui
router.use(verifyToken);
router.use(verifyMasterRole);

// GET /consultants/all - Lista todos os consultores (sem paginação para MVP)
router.get('/all', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('consultants')
      .select('id, name, email, role, status, created_at, parent_id')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('Erro ao listar consultores:', err);
    res.status(500).json({ error: 'Erro ao buscar consultores' });
  }
});

// Função auxiliar para busca recursiva
async function buildTree(consultantId) {
  // Busca o nó atual
  const { data: current, error } = await supabase
    .from('consultants')
    .select('id, name, role, status, email')
    .eq('id', consultantId)
    .single();

  if (error || !current) return null;

  // Busca filhos diretos (Indicações diretas)
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

// GET /consultants/tree/:id - Monta árvore de indicações
router.get('/tree/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Inicia a busca recursiva
    const tree = await buildTree(id);

    if (!tree) {
      return res.status(404).json({ error: 'Consultor raiz não encontrado' });
    }

    res.json(tree);
  } catch (err) {
    console.error('Erro ao montar árvore:', err);
    res.status(500).json({ error: 'Erro ao processar árvore de indicações' });
  }
});

module.exports = router;