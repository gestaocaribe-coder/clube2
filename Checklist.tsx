import React from 'react';
import { ClipboardListIcon, CheckCircleIcon } from './components/Icons';

export const ChecklistView = () => {
    const checklistItems = [
        {
            category: "Estrutura Backend",
            items: [
                "Criar pasta /backend",
                "Criar backend/package.json",
                "Criar backend/server.js",
                "Criar backend/lib/supabase.js",
                "Criar backend/middleware/verifyToken.js",
                "Criar backend/middleware/verifyMasterRole.js",
                "Criar backend/routes/auth.js",
                "Criar backend/routes/consultants.js"
            ]
        },
        {
            category: "Configurações",
            items: [
                "Usar Node.js + Express",
                "Conectar ao Supabase (SUPABASE_URL, SUPABASE_SERVICE_ROLE)",
                "Middleware verifyToken (Validar JWT)",
                "Middleware verifyMasterRole (Validar Admin)",
                "Servidor rodando na porta 3001",
                "Rotas protegidas exigem token",
                "Retorno de dados reais do Supabase"
            ]
        },
        {
            category: "Funcionalidades Backend",
            items: [
                "GET /auth/me (Dados do usuário)",
                "GET /consultants/all (Listar todos - Admin)",
                "GET /consultants/tree/:id (Árvore recursiva)"
            ]
        },
        {
            category: "Ajustes Frontend",
            items: [
                "Nova aba pública 'Checklist do Projeto'",
                "Adicionar ao menu lateral",
                "Não exigir login",
                "Exibir checklist em texto",
                "Layout padrão do projeto"
            ]
        }
    ];

    return (
        <div className="animate-slide-up space-y-8">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-brand-green-mid rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-green-mid/20">
                    <ClipboardListIcon className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Checklist do Projeto</h2>
                    <p className="text-gray-500">Status de implementação e requisitos do sistema.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {checklistItems.map((section, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h3 className="font-bold text-brand-green-dark text-lg">{section.category}</h3>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                {section.items.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircleIcon className="h-5 w-5 text-brand-green-mid flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-brand-dark-card text-white p-6 rounded-xl text-center mt-8">
                <p className="text-sm opacity-70">
                    Este checklist reflete a estrutura oficial solicitada para a entrega da versão 1.0 do Backend e Frontend integrado.
                </p>
            </div>
        </div>
    );
};