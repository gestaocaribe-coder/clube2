
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Consultant } from './types';
import { 
    LoginScreen, 
    AdminLoginScreen,
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
    AdminOverviewView,
    AdminGoalsView,
    AdminWithdrawalsView,
    AdminReportsView,
    AdminSupportView,
    AdminSettingsView,
    AdminThemeProvider // Import Provider
} from './ConsultantSystem';
import { GodMode } from './GodMode'; // Import God Mode

// --- Auth Guard Component ---
// Checks if user is logged in and handles role-based redirection
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    setLoading(false);
                    return;
                }

                // Check consultant profile
                const { data: consultant, error } = await supabase
                    .from('consultants')
                    .select('*')
                    .eq('auth_id', session.user.id)
                    .single();

                if (consultant) {
                    setUser(consultant as Consultant);
                } else if (error) {
                    console.error("Error fetching consultant profile", error);
                }
            } catch (error) {
                console.error("Auth check failed", error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green-dark"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to appropriate login based on attempted route
        const target = location.pathname.startsWith('/admin') ? '/portal-master' : '/login';
        return <Navigate to={target} state={{ from: location }} replace />;
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

export default function App() {
  return (
    <AdminThemeProvider>
        <HashRouter>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/cadastro" element={<ConsultantRegister />} />
            
            {/* SECURE ADMIN LOGIN ROUTE */}
            <Route path="/portal-master" element={<AdminLoginScreen />} />

            {/* GOD MODE (Hidden & Restricted) */}
            <Route path="/god-mode" element={<GodMode />} />

            {/* Admin Routes (New Structure) */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                
                {/* GERENCIAMENTO CENTRAL */}
                <Route path="dashboard" element={<AdminOverviewView />} />
                <Route path="negocio" element={<BusinessView />} />
                <Route path="usuarios" element={<AdminPanelView />} />
                
                {/* RELATÓRIOS E FINANÇAS */}
                <Route path="financeiro" element={<FinancialView />} />
                <Route path="relatorios" element={<AdminReportsView />} />
                
                {/* SISTEMA E SUPORTE */}
                <Route path="suporte" element={<AdminSupportView />} />
                <Route path="config" element={<AdminSettingsView />} />

                {/* Legacy/Specific Routes */}
                <Route path="metas" element={<AdminGoalsView />} />
                <Route path="saques" element={<AdminWithdrawalsView />} />
                
                {/* Hidden Operational routes */}
                <Route path="materiais" element={<MaterialsView />} />
                <Route path="unibrotos" element={<UniBrotosView />} />
                <Route path="meus-pedidos" element={<MyOrdersView />} />
                <Route path="novo-pedido" element={<NewOrderView />} />
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
        </HashRouter>
    </AdminThemeProvider>
  );
}
