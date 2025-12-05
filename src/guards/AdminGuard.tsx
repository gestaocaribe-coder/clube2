import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';

interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const validateAccess = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setIsAuthorized(false);
                return;
            }

            try {
                // Invoca a função de backend para validar se é admin de forma segura
                const { data, error } = await supabase.functions.invoke('validate-admin');

                if (error) {
                    console.error('Erro na validação do admin:', error);
                    // Em caso de erro na função (ex: não deployada), bloqueia por segurança
                    setIsAuthorized(false);
                    return;
                }

                if (data && data.allowed === true) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                }
            } catch (err) {
                console.error('Erro sistêmico no Guard:', err);
                setIsAuthorized(false);
            }
        };

        validateAccess();
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-mid mb-4"></div>
                <p className="text-sm text-gray-400">Verificando credenciais de segurança...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        // Se logado mas não autorizado, manda para o painel de consultor
        return <Navigate to="/consultor" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};