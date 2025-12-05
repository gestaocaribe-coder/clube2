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
    AdminSettingsView
} from './ConsultantSystem';

// --- Auth Guard Component ---
// Checks if user is logged in and handles role-based redirection
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // 1. Check for Real Supabase Session
                const { data: { session } } = await supabase.auth.getSession();
                
                // 2. Check for Simulated Admin Session (Dev/Demo Mode)
                const isSimulatedAdmin = localStorage.getItem('sb-admin-session') === 'true';

                // If no session at all, stop loading and let it redirect
                if (!session && !isSimulatedAdmin) {
                    setLoading(false);
                    return;
                }

                // If Real Session exists, fetch profile from DB
                if (session) {
                    const { data: consultant, error } = await supabase
                        .from('consultants')
                        .select('*')
                        .eq('auth_id', session.user.id)
                        .single();

                    if (consultant) {
                        setUser(consultant as Consultant);
                    } else {
                        console.error("Profile not found for user", error);
                    }
                } 
                // Fallback to Simulated Admin if no real session but local flag is set
                else if (isSimulatedAdmin) {
                    setUser({
                        id: 'admin-root',
                        auth_id: 'admin-root-auth',
                        name: 'Administrador Master',
                        email: 'root@brotosdaterra.com.br',
                        whatsapp: '00000000000',
                        role: 'admin',
                        created_at: new Date().toISOString()
                    });
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
        const target = location.pathname.startsWith('/admin') || location.pathname.startsWith('/portal-master') 
            ? '/portal-master' 
            : '/login';
        return <Navigate to={target} state={{ from: location }} replace />;
    }

    // Role Logic
    const userRole = user.role;

    // Strict separation: If Admin tries to access Consultor area -> redirect to Admin
    if (userRole === 'admin' && location.pathname.startsWith('/consultor')) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    // Strict separation: If Consultant tries to access Admin area -> redirect to Consultor
    if (userRole !== 'admin' && location.pathname.startsWith('/admin')) {
         return <Navigate to="/consultor/dashboard" replace />;
    }

    // Check if user has permission for this specific route
    // Admin has access to everything in 'admin' routes.
    // Consultant/Leader has access to 'consultant' routes.
    const isAllowed = allowedRoles.includes(userRole) || (userRole === 'admin' && allowedRoles.includes('admin'));

    if (!isAllowed) {
         const target = userRole === 'admin' ? '/admin/dashboard' : '/consultor/dashboard';
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
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cadastro" element={<ConsultantRegister />} />
        
        {/* SECURE ADMIN LOGIN ROUTE */}
        <Route path="/portal-master" element={<AdminLoginScreen />} />

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

            {/* Legacy/Specific Routes kept for specific logic if needed, but removed from sidebar */}
            <Route path="metas" element={<AdminGoalsView />} />
            <Route path="saques" element={<AdminWithdrawalsView />} />
            
            {/* Operational routes accessible by URL but hidden from menu */}
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
  );
}