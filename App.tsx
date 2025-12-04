
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Consultant } from './types';
import { 
    LoginScreen, 
    ConsultantRegister, 
    DashboardShell, 
    OverviewView, 
    MaterialsView, 
    UniBrotosView, 
    MyOrdersView, 
    NewOrderView, 
    InviteView, 
    BusinessView, 
    FinancialView, 
    AdminPanelView,
    AdminGoalsView,
    AdminWithdrawalsView
} from './ConsultantSystem';

// --- Auth Guard Component ---
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        let mounted = true;

        const checkAuth = async () => {
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError) throw sessionError;

                if (!session) {
                    if (mounted) setLoading(false);
                    return;
                }

                // Check consultant profile
                const { data: consultant, error } = await supabase
                    .from('consultants')
                    .select('*')
                    .eq('auth_id', session.user.id)
                    .single();

                if (consultant) {
                    if (mounted) setUser(consultant as Consultant);
                } else if (error) {
                    console.error("Error fetching consultant profile", error);
                }
            } catch (error) {
                console.error("Auth check failed", error);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkAuth();

        return () => { mounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-dark"></div>
                    <p className="text-gray-500 text-sm">Carregando sistema...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role Logic
    const isAllowed = allowedRoles.includes(user.role) || (allowedRoles.includes('leader') && user.role === 'admin');

    // Strict separation redirect logic
    if (user.role === 'admin' && location.pathname.startsWith('/consultor')) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    if (user.role !== 'admin' && location.pathname.startsWith('/admin')) {
         return <Navigate to="/consultor/dashboard" replace />;
    }

    // Generic Fallback if roles don't match specifically
    if (!allowedRoles.includes(user.role) && !(user.role === 'admin' && allowedRoles.includes('leader'))) {
         const target = user.role === 'admin' ? '/admin/dashboard' : '/consultor/dashboard';
         return <Navigate to={target} replace />;
    }

    return (
        <DashboardShell consultant={user}>
            <Outlet context={{ consultant: user }} />
        </DashboardShell>
    );
};

// --- Root Redirect Component ---
// Handles the "/" path: sends to login if guest, or correct dashboard if auth
const RootRedirect = () => {
    const [destination, setDestination] = useState<string | null>(null);

    useEffect(() => {
        const decide = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setDestination('/login');
                return;
            }

            const { data: consultant } = await supabase
                .from('consultants')
                .select('role')
                .eq('auth_id', session.user.id)
                .single();

            if (consultant) {
                setDestination(consultant.role === 'admin' ? '/admin/dashboard' : '/consultor/dashboard');
            } else {
                setDestination('/login');
            }
        };
        decide();
    }, []);

    if (!destination) return null; // Or a spinner
    return <Navigate to={destination} replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cadastro" element={<ConsultantRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OverviewView />} />
            <Route path="administracao" element={<AdminPanelView />} />
            <Route path="painel-metas" element={<AdminGoalsView />} />
            <Route path="solicitacoes-saque" element={<AdminWithdrawalsView />} />
            <Route path="materiais" element={<MaterialsView />} />
            <Route path="unibrotos" element={<UniBrotosView />} />
            <Route path="meus-pedidos" element={<MyOrdersView />} />
            <Route path="novo-pedido" element={<NewOrderView />} />
            <Route path="meu-negocio" element={<BusinessView />} />
            <Route path="financeiro" element={<FinancialView />} />
            <Route path="convidar" element={<InviteView />} />
        </Route>

        {/* Consultant Routes */}
        <Route path="/consultor" element={<ProtectedRoute allowedRoles={['consultant', 'leader']} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OverviewView />} />
            <Route path="materiais" element={<MaterialsView />} />
            <Route path="unibrotos" element={<UniBrotosView />} />
            <Route path="meus-pedidos" element={<MyOrdersView />} />
            <Route path="novo-pedido" element={<NewOrderView />} />
            <Route path="convidar" element={<InviteView />} />
            <Route path="meu-negocio" element={<BusinessView />} />
            <Route path="financeiro" element={<FinancialView />} />
        </Route>

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
