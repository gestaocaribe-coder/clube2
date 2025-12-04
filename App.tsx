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
    AdminPanelView 
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
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role Logic
    // Admin access: 'admin'
    // Consultant access: 'consultant', 'leader' (and 'admin' typically can view consultant views, but we separate them here for cleaner UX)
    
    const isAllowed = allowedRoles.includes(user.role) || (allowedRoles.includes('leader') && user.role === 'admin');

    // Strict separation redirect logic
    // If an Admin tries to go to /consultor, send them to /admin
    if (user.role === 'admin' && location.pathname.startsWith('/consultor')) {
        return <Navigate to="/admin/dashboard" replace />;
    }
    
    // If a Consultant tries to go to /admin, send them to /consultor
    if (user.role !== 'admin' && location.pathname.startsWith('/admin')) {
         return <Navigate to="/consultor/dashboard" replace />;
    }

    // If roles don't match the route requirement (generic fallback)
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
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/cadastro" element={<ConsultantRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<OverviewView />} />
            <Route path="administracao" element={<AdminPanelView />} />
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