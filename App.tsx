import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import { Consultant } from './types';
import { AdminGuard } from './src/guards/AdminGuard';
import { ChecklistView } from './Checklist';
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

// --- Auth Guard Component (Legacy/Consultant) ---
const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
    const [user, setUser] = useState<Consultant | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            // 1. Verificação de Credencial Mestra (Dev/Demo)
            if (localStorage.getItem('sb-admin-session') === 'true') {
                // Cria um usuário Admin Simulado
                setUser({
                    id: 'master-001',
                    auth_id: 'master-local-id',
                    name: 'Master Admin',
                    email: 'admin@master.com',
                    whatsapp: '00000000000',
                    role: 'admin', // Força papel de admin
                    created_at: new Date().toISOString(),
                    status: 'Ativo'
                });
                setLoading(false);
                return;
            }

            // 2. Verificação Padrão Supabase
            try {
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    setLoading(false);
                    return;
                }

                if (session) {
                    const { data: consultant, error } = await supabase
                        .from('consultants')
                        .select('*')
                        .eq('auth_id', session.user.id)
                        .single();

                    if (consultant) {
                        setUser(consultant as Consultant);
                    }
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
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRole = user.role;

    // Separação Estrita de Ambientes
    if (userRole === 'admin' && location.pathname.startsWith('/consultor')) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    if (userRole !== 'admin' && location.pathname.startsWith('/admin')) {
         return <Navigate to="/consultor/dashboard" replace />;
    }

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
        
        {/* Portal Master Login */}
        <Route path="/portal-master" element={<AdminLoginScreen />} />

        {/* Public Checklist Route */}
        <Route path="/checklist" element={
            <DashboardShell>
                <ChecklistView />
            </DashboardShell>
        } />

        {/* SECURE ADMIN ROUTES (Protected by Edge Function Guard) */}
        <Route path="/admin" element={
            <AdminGuard>
                <ProtectedRoute allowedRoles={['admin']} />
            </AdminGuard>
        }>
            <Route index element={<Navigate to="dashboard" replace />} />
            
            <Route path="dashboard" element={<AdminOverviewView />} />
            <Route path="negocio" element={<BusinessView />} />
            <Route path="usuarios" element={<AdminPanelView />} />
            <Route path="financeiro" element={<FinancialView />} />
            <Route path="relatorios" element={<AdminReportsView />} />
            <Route path="suporte" element={<AdminSupportView />} />
            <Route path="config" element={<AdminSettingsView />} />

            <Route path="metas" element={<AdminGoalsView />} />
            <Route path="saques" element={<AdminWithdrawalsView />} />
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