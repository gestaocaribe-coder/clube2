import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { UserCircleIcon, TargetIcon } from './components/Icons';

interface RankingItem {
    id: string;
    name: string;
    referrals: number;
}

export const SideRanking = () => {
    const [ranking, setRanking] = useState<RankingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                // Chama a função RPC criada no banco de dados
                const { data, error } = await supabase.rpc('get_top_5_consultants');

                if (error) throw error;
                setRanking(data || []);
            } catch (error) {
                console.error('Erro ao buscar ranking:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse h-full">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-100 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                    <TargetIcon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-gray-900 text-lg">Top Indicações</h3>
                    <p className="text-xs text-gray-400">Líderes que mais crescem</p>
                </div>
            </div>

            <div className="space-y-1 flex-1">
                {ranking.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        Nenhum dado de indicação.
                    </div>
                ) : (
                    ranking.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-default"
                        >
                            <div className="relative">
                                <div className={`
                                    h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border-2
                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 
                                      index === 1 ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                      index === 2 ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                      'bg-white text-gray-500 border-gray-100'}
                                `}>
                                    {index + 1}º
                                </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                <p className="text-xs text-gray-400">
                                    {item.referrals} {item.referrals === 1 ? 'indicação' : 'indicações'}
                                </p>
                            </div>

                            {index === 0 && (
                                <span className="text-lg">👑</span>
                            )}
                        </div>
                    ))
                )}
            </div>
            
            <button className="w-full mt-6 py-3 text-sm font-bold text-brand-green-mid border border-brand-green-mid/20 rounded-xl hover:bg-brand-green-light transition-colors">
                Ver Ranking Completo
            </button>
        </div>
    );
};