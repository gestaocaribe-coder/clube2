import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface ConsultantData {
    id: string;
    name: string;
    email: string;
    created_at: string;
    status: string;
}

export const NewConsultantsTable = () => {
    const [consultants, setConsultants] = useState<ConsultantData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewConsultants = async () => {
            try {
                const { data, error } = await supabase
                    .from('consultants')
                    .select('id, name, email, created_at, status')
                    .order('created_at', { ascending: false })
                    .limit(10); // Limitando para performance na home

                if (error) throw error;
                setConsultants(data || []);
            } catch (error) {
                console.error('Erro ao buscar novos consultores:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNewConsultants();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 w-48 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded-lg w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-serif font-bold text-gray-900 text-lg">Novos Consultores</h3>
                <span className="text-xs font-medium text-brand-green-mid bg-brand-green-light px-3 py-1 rounded-full">
                    Últimos Cadastros
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Consultor</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Data</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {consultants.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                                    Nenhum consultor encontrado.
                                </td>
                            </tr>
                        ) : (
                            consultants.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            user.status === 'Ativo' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {user.status || 'Pendente'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};